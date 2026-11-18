const fs = require('node:fs');
const path = require('node:path');

const { hook_event_name: event } = JSON.parse(fs.readFileSync(0, 'utf8').replace(/^\uFEFF/, ''));
if (!['SessionStart', 'SubagentStart'].includes(event)) {
  throw new Error('Expected a Mongbo startup event');
}
const dir = path.resolve(__dirname, '../skills/mongbo');
const core = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: event,
    additionalContext: `Resolve the following skill's reference paths relative to this directory: ${dir}\n\n${core}`
  }
}));
