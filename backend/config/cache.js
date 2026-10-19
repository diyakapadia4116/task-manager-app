/**
 * cache.js — Shared node-cache instance for the Task Manager API.
 *
 * stdTTL : 60 seconds  — every key expires automatically after 1 minute.
 * checkperiod : 120 s  — background sweep that removes expired keys.
 *
 * Import this module wherever you need to read / write the cache so the
 * same singleton is reused across all route handlers.
 */
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

module.exports = cache;
