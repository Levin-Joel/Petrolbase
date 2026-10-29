import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import moveIcon from "../img/move.png";
import { defaultColumns, getColumnsFromStorage } from "./taskStorage";

// Creates a task object with current user information
const createTaskObject = ({
  title,
  description,
  priority,
  dueDate,
  tags,
  assignedTo,
  reminder,
}, currentUser) => {
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
  currentUser,
}) => {
  if (!currentUser) return defaultColumns();
  const storageKey = `columns_${currentUser.id}`;
  const columns = getColumnsFromStorage(currentUser);
  const task = createTaskObject({
    title,
    description,
    priority,
    dueDate,
    tags,
    assignedTo,
    reminder,
  }, currentUser);

  // Add new task to the 'todo' column
  const newColumns = {
    ...columns,
    todo: [...columns.todo, task],
  };

  // Save updated task data to localStorage under user-specific key
  localStorage.setItem(storageKey, JSON.stringify(newColumns));
  window.dispatchEvent(
    new CustomEvent("columnsUpdated", { detail: newColumns }),
  );

  return newColumns;
};
