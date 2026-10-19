const connectDB = require("./config/db");
const app = require("./app");
require("./listeners"); // Lab Step 2 — registers 'task-created' listener (with artificial delay)

const PORT = process.env.PORT || 5000;

// ---- Connect to MongoDB then start server ----
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
