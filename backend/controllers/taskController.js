const Task = require("../models/Task");
const cache = require("../config/cache");
const taskEvents = require("../events"); // Lab Step 1 — class-based TaskEvents singleton

const VALID_STATUSES = ["pending", "in-progress", "done"];
const CACHE_KEY = "all_tasks"; // single key for the full task list

// ─────────────────────────────────────────────────────────────
// Helper – invalidate the all-tasks cache after any write op
// ─────────────────────────────────────────────────────────────
const invalidateCache = () => {
  cache.del(CACHE_KEY);
};

// ─────────────────────────────────────────────────────────────
// GET /api/tasks  — with in-memory cache (TTL: 60 s)
// ─────────────────────────────────────────────────────────────
exports.getAllTasks = async (req, res, next) => {
  try {
    const start = Date.now();

    // // ── Cache HIT ──────────────────────────────────────────────
    // const cached = cache.get(CACHE_KEY);
    // if (cached) {
    //   const elapsed = Date.now() - start;
    //   res.set("X-Cache", "HIT");
    //   res.set("X-Response-Time", `${elapsed}ms`);
    //   return res
    //     .status(200)
    //     .json({ success: true, count: cached.length, data: cached });
    // }

    // ── Cache MISS – query MongoDB ─────────────────────────────
    const tasks = await Task.find();
    // cache.set(CACHE_KEY, tasks); // store with default TTL (60 s)

    const elapsed = Date.now() - start;
    res.set("X-Cache", "MISS");
    res.set("X-Response-Time", `${elapsed}ms`);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/tasks/:id
// ─────────────────────────────────────────────────────────────
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      const err = new Error(`Task with id ${id} not found`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/tasks  — Lab Steps 3, 4, 6
//   1. Save task to MongoDB
//   2. Log the API response timestamp  (Step 6 — first timestamp)
//   3. Send 201 immediately            (non-blocking response)
//   4. Emit 'task-created'             (listener runs asynchronously)
// ─────────────────────────────────────────────────────────────
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      const err = new Error("Title is required and must be a non-empty string");
      err.status = 400;
      return next(err);
    }

    if (status && !VALID_STATUSES.includes(status)) {
      const err = new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
      err.status = 400;
      return next(err);
    }

    // ── Save task to MongoDB (Lab Step 3) ──────────────────
    const task = await Task.create({
      title: title.trim(),
      description: description ? String(description).trim() : "",
      status: status || "pending",
      assignedUser: req.user ? (req.user.email || req.user.name) : "unassigned"
    });

    invalidateCache(); // ← stale list is gone

    // ── Step 6: Log API response timestamp FIRST ─────────────
    // This log appears in the console BEFORE the listener's
    // completion log, proving the response is non-blocking.
    console.log(`[API] Response sent at ${new Date().toISOString()}`);

    // ── Step 3: Send HTTP 201 immediately ──────────────────
    res.status(201).json(task);

    // ── Step 3: Emit event AFTER responding ────────────────
    // emit() itself is synchronous — it calls the listener
    // immediately — but the listener's setTimeout() defers its
    // completion log to a later event-loop tick (Step 5).
    // Console order will be:
    //   1. [API] Response sent at T+0
    //   2. [Notification] Received 'task-created' event  (T+0, sync)
    //   3. [Notification] ✅ Handler completed at T+2000  (T+2s, async)
    taskEvents.emit('task-created', task);

  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/tasks/:id  — invalidate cache after update
// ─────────────────────────────────────────────────────────────
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      const err = new Error(`Task with id ${id} not found`);
      err.status = 404;
      return next(err);
    }

    const { title, description, status } = req.body || {};

    if (status && !VALID_STATUSES.includes(status)) {
      const err = new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
      err.status = 400;
      return next(err);
    }

    if (title !== undefined) task.title = String(title).trim();
    if (description !== undefined) task.description = String(description).trim();
    if (status !== undefined) task.status = status;

    await task.save();
    invalidateCache(); // ← stale list is gone
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id  — invalidate cache after deletion
// ─────────────────────────────────────────────────────────────
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      const err = new Error(`Task with id ${id} not found`);
      err.status = 404;
      return next(err);
    }

    invalidateCache(); // ← stale list is gone
    res.status(200).json({ success: true, data: deletedTask });
  } catch (err) {
    next(err);
  }
};
