import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import moveIcon from "../img/move.png";

// Creates a task object with current user information
const createTaskObject = ({
  title,
  description,
  priority,
  dueDate,
  tags,
  assignedTo,
  reminder,
}) => {
  // Get current user from sessionStorage
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    description,
    priority,
    dueDate,
    tags,
    assignedTo,
    reminder,
    createdBy: currentUser.id, // Store user ID to filter tasks per user
    createdAt: new Date().toISOString(),
  };
};

const parseLegacyTask = (item) => {
  if (typeof item !== "string") return item;

  const parts = item.split(" - ");
  const assignedTo = parts.pop() || "";
  const dueDate = parts.pop() || "";
  const titleWithPriority = parts.join(" - ");
  const match = titleWithPriority.match(/^(.*)\s+\((.*)\)$/);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: match ? match[1] : titleWithPriority || "Neue Aufgabe",
    description: "",
    priority: match ? match[2] : "Mittel",
    dueDate,
    tags: [],
    assignedTo,
    reminder: false,
  };
};

const normalizeColumns = (saved) => ({
  todo: Array.isArray(saved.todo) ? saved.todo.map(parseLegacyTask) : [],
  progress: Array.isArray(saved.progress)
    ? saved.progress.map(parseLegacyTask)
    : [],
  review: Array.isArray(saved.review) ? saved.review.map(parseLegacyTask) : [],
  done: Array.isArray(saved.done) ? saved.done.map(parseLegacyTask) : [],
});

export const defaultColumns = () => {
  return {
    todo: [],
    progress: [],
    review: [],
    done: [],
  };
};

// Retrieves user-specific tasks from localStorage
export const getColumnsFromStorage = () => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  const storageKey = `columns_${currentUser.id}`;
  const saved = localStorage.getItem(storageKey);
  if (!saved) return defaultColumns();

  try {
    const data = JSON.parse(saved);
    // Filter tasks to show only those created by the current user
    return {
      todo: (data.todo || []).filter(
        (task) => task.createdBy === currentUser.id,
      ),
      progress: (data.progress || []).filter(
        (task) => task.createdBy === currentUser.id,
      ),
      review: (data.review || []).filter(
        (task) => task.createdBy === currentUser.id,
      ),
      done: (data.done || []).filter(
        (task) => task.createdBy === currentUser.id,
      ),
    };
  } catch (e) {
    // Return empty columns if data parsing fails
    return defaultColumns();
  }
};

export const TaskDetailModal = ({ task, onClose }) => {
  const visible = !!task;
  const headerTemplate = task ? (
    <div className="dialog-header-with-move">
      <div className="dialog-title">{task.title}</div>
      <img
        src={moveIcon}
        alt="move"
        className="dialog-move-icon"
        draggable={false}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onDragStart={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
    </div>
  ) : null;

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header={headerTemplate}
      modal
      closable={false}
      className="task-detail-modal"
      contentClassName="task-detail-modal"
      style={{ width: "min(500px, 90%)" }}>
      {task && (
        <>
          <div className="task-detail-row">
            <span className="task-detail-label">Beschreibung:</span>
            <span>{task.description || "Keine Beschreibung"}</span>
          </div>
          <div className="task-detail-row">
            <span className="task-detail-label">Fällig:</span>
            <span>{task.dueDate || "-"}</span>
          </div>
          <div className="task-detail-row">
            <span className="task-detail-label">Person:</span>
            <span>{task.assignedTo || "-"}</span>
          </div>
          <div className="task-detail-row">
            <span className="task-detail-label">Priorität:</span>
            <span>{task.priority}</span>
          </div>
          <div className="task-detail-row">
            <span className="task-detail-label">Tags:</span>
            <span>
              {task.tags && task.tags.length > 0
                ? task.tags.filter(Boolean).join(", ")
                : "-"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 12,
            }}>
            <Button
              className="close-button"
              onClick={onClose}
              label={"Schließen"}
            />
          </div>
        </>
      )}
    </Dialog>
  );
};

// Tasks are stored per user to ensure each user only sees their own tasks
export const Task = ({
  title = "Neue Aufgabe",
  description = "",
  priority = "Mittel",
  dueDate = "",
  tags = [],
  assignedTo = "",
  reminder = false,
}) => {
  // Get current user from sessionStorage
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  const storageKey = `columns_${currentUser.id}`;
  const columns = getColumnsFromStorage();
  const task = createTaskObject({
    title,
    description,
    priority,
    dueDate,
    tags,
    assignedTo,
    reminder,
  });

  // Add new task to the 'todo' column
  const newColumns = {
    ...columns,
    todo: [...columns.todo, task],
  };

  // Save updated task data to localStorage under user-specific key
  localStorage.setItem(storageKey, JSON.stringify(newColumns));
  try {
    window.dispatchEvent(
      new CustomEvent("columnsUpdated", { detail: newColumns }),
    );
  } catch (e) {}

  return newColumns;
};
