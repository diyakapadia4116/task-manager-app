/**
 * notificationListener.js
 * ──────────────────────────────────────────────────────────────
 * Registers an asynchronous listener on the 'task-created' event.
 *
 * HOW ASYNC WORKS HERE:
 *   EventEmitter.emit() is synchronous — it calls all registered
 *   listeners inline.  To make the handler truly non-blocking we
 *   wrap the heavy work inside setImmediate(), which defers
 *   execution until AFTER the current call-stack (and the HTTP
 *   response) has been flushed.
 *
 * Log format (printed to server console):
 *   [NOTIFICATION] Task Created
 *     Title     : "Buy milk"
 *     Assigned  : diya@example.com
 *     Timestamp : 2026-10-05T09:00:05.123Z
 *     Handler ran at : 09:00:05.127  (after API response at 09:00:05.120)
 */

const taskEmitter = require("./taskEmitter");

taskEmitter.on("task-created", (taskData) => {
  // ── Defer to next iteration of the event loop so the HTTP
  //    response is sent FIRST (demonstrates async behaviour).
  setImmediate(() => {
    const handlerTime = new Date().toISOString();

    console.log("\n─────────────────────────────────────────────");
    console.log("📬  [NOTIFICATION] Task Created");
    console.log(`    Title     : "${taskData.title}"`);
    console.log(`    Assigned  : ${taskData.assignedUser || "unassigned"}`);
    console.log(`    Saved at  : ${taskData.timestamp}`);
    console.log(`    Handler ran at : ${handlerTime}`);
    console.log("─────────────────────────────────────────────\n");
  });
});

console.log("✅  Notification listener registered for 'task-created' event.");
