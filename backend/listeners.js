// Step 2 — Lab: Register listener for 'task-created' event
// ─────────────────────────────────────────────────────────
// This file is required once at server startup (in server.js).
// It registers an async listener that:
//   • logs the notification (task title + timestamp)
//   • includes an artificial delay (Step 5) to make the
//     asynchronous behaviour clearly visible in the console.
//
// ASYNC PROOF:
//   The listener uses setTimeout() so its completion log always
//   appears AFTER the "[API] Response sent" log — even though
//   taskEvents.emit() is called synchronously inside the route.
//   This is because setTimeout() schedules the callback on the
//   next iteration of the event loop, i.e. after the current
//   call-stack (which includes res.json()) has finished.

const taskEvents = require('./events');

taskEvents.on('task-created', (task) => {
  // ── Immediate log — fires synchronously inside emit() ──────
  console.log('\n────────────────────────────────────────────────────');
  console.log(`[Notification] Received 'task-created' event`);
  console.log(`               Title     : "${task.title}"`);
  console.log(`               Assigned  : ${task.assignedUser || task.createdBy || 'unassigned'}`);

  // ── Step 5: Artificial delay — simulates async work ────────
  // setTimeout pushes the completion log to the NEXT event-loop
  // tick, demonstrating that long listener work never blocks the
  // HTTP response that was already sent above.
  const SIMULATED_DELAY_MS = 2000; // 2 seconds — clearly visible gap

  setTimeout(() => {
    console.log(`[Notification] ✅ Handler completed at ${new Date().toISOString()}`);
    console.log(`               (${SIMULATED_DELAY_MS}ms simulated processing delay)`);
    console.log('────────────────────────────────────────────────────\n');
  }, SIMULATED_DELAY_MS);
});

console.log("✅  listeners.js loaded — 'task-created' listener registered.");
