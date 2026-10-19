const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "done"],
        message: "{VALUE} is not a valid status"
      },
      default: "pending"
    },
    assignedUser: {
      type: String,
      default: "unassigned",
      trim: true
    },
    // ── Ownership: every task belongs to exactly one user ──────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"]
    }
  },
  {
    timestamps: true
  }
);

// Virtual property to map '_id' to 'id' so that the frontend works unchanged
taskSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
taskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model("Task", taskSchema);
