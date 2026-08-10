import Column from "./Column.jsx";

const COLUMNS = [
  { status: "pending", label: "Pending", icon: "📌", emptyText: "Nothing pending — rest easy ☕" },
  { status: "in-progress", label: "In Progress", icon: "⏳", emptyText: "Ready when you are 🪴" },
  { status: "done", label: "Done", icon: "✨", emptyText: "No completed tasks yet 🎯" }
];

export default function Board({ tasks, onStatusChange, onDelete }) {
  return (
    <div className="board">
      {COLUMNS.map((col) => (
        <Column
          key={col.status}
          status={col.status}
          label={col.label}
          icon={col.icon}
          emptyText={col.emptyText}
          tasks={tasks.filter((t) => t.status === col.status)}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

