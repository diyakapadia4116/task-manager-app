export default function Header({ connected, taskCount }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__prompt">cozy-workspace:~/tasks 🪴</span>
        <div className="app-header__title-group">
          <h1>Nook</h1>
          <span className="app-header__subtitle">Your Cozy Task Space</span>
        </div>
      </div>
      <div className="app-header__meta">
        <span className="task-count">
          <span className="task-count__icon">📌</span>
          {taskCount} task{taskCount === 1 ? "" : "s"}
        </span>
        <span className={`status-pill ${connected ? "status-pill--up" : "status-pill--down"}`}>
          <span className="status-pill__dot" />
          {connected ? "API connected" : "API offline"}
        </span>
      </div>
    </header>
  );
}

