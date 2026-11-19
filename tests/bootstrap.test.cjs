const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('rejects an unrelated event without injecting instructions', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'hooks/bootstrap.cjs')], {
    input: JSON.stringify({ hook_event_name: 'UserPromptSubmit' }), encoding: 'utf8'
  });
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Expected a Mongbo startup event/);
});

for (const event of ['SessionStart', 'SubagentStart']) {
  test(event + ' supplies the installed core from an unrelated workspace', t => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'mongbo test '));
    t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
    const config = require('../hooks/hooks.json');
    assert.deepEqual(Object.keys(config.hooks).sort(), ['SessionStart', 'SubagentStart']);
    const plugin = path.join(temp, 'installed plugin');
    for (const dir of ['hooks', 'skills']) {
      fs.cpSync(path.join(root, dir), path.join(plugin, dir), { recursive: true });
    }
    const group = config.hooks[event][0];
    if (event === 'SessionStart') {
      for (const source of ['startup', 'resume', 'clear', 'compact', 'fork']) {
        assert.match(source, new RegExp(group.matcher));
      }
    }
    const result = spawnSync(group.hooks[0].command, {
      shell: true, cwd: temp, encoding: 'utf8',
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: plugin },
      input: JSON.stringify({ hook_event_name: event })
    });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout).hookSpecificOutput;
    assert.equal(output.hookEventName, event);
    const dir = path.join(plugin, 'skills', 'mongbo');
    assert.ok(output.additionalContext.includes(dir));
    assert.ok(output.additionalContext.includes(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8')));
    for (const policy of ['coding', 'review', 'noncoding']) {
      assert.ok(output.additionalContext.includes('references/' + policy + '.md'));
      assert.ok(!output.additionalContext.includes(fs.readFileSync(path.join(dir, 'references', policy + '.md'), 'utf8')));
    }
  });
}
