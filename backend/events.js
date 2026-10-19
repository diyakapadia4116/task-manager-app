// Step 1 — Lab: Dedicated EventEmitter module
// ─────────────────────────────────────────────
// Extend Node's built-in EventEmitter into a named class so that
// the event bus is clearly typed and identifiable in stack traces.

const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
