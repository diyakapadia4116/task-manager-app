/**
 * taskEmitter.js
 * ──────────────────────────────────────────────────────────────
 * Singleton EventEmitter used across the backend.
 * Any module can import this to emit or listen to task events.
 *
 * Events emitted:
 *   'task-created'  — payload: { title, assignedUser, timestamp }
 */

const { EventEmitter } = require("events");

const taskEmitter = new EventEmitter();

// Prevent Node.js "MaxListenersExceededWarning" during development
taskEmitter.setMaxListeners(20);

module.exports = taskEmitter;
