import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { TaskDetailModal } from "./Task";
import { deleteMode } from "./Remove";

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

export const Category = () => {
  // Initialize board columns with user-specific tasks from localStorage
  const [columns, setColumns] = useState(() => {
    // Retrieve current logged-in user from sessionStorage
    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}",
    );
    // Create user-specific storage key to isolate each user's tasks
    const storageKey = `columns_${currentUser.id}`;
    // Load user's tasks from localStorage
    const saved = localStorage.getItem(storageKey);
    return saved
      ? normalizeColumns(JSON.parse(saved))
      : {
          todo: [],
          progress: [],
          review: [],
          done: [],
        };
  });

  // Persist task changes to localStorage whenever columns are modified
  useEffect(() => {
    // Get current user from sessionStorage for user-specific storage
    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}",
    );
    // Use user-specific storage key (columns_userId)
    const storageKey = `columns_${currentUser.id}`;
    // Save updated columns to localStorage under user-specific key
    localStorage.setItem(storageKey, JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    const handler = (e) => {
      const newColumns =
        e?.detail ||
        (() => {
          const currentUser = JSON.parse(
            sessionStorage.getItem("currentUser") || "{}",
          );
          const storageKey = `columns_${currentUser.id}`;
          const saved = localStorage.getItem(storageKey);
          return saved ? normalizeColumns(JSON.parse(saved)) : null;
        })();
      if (newColumns) setColumns(newColumns);
    };

    window.addEventListener("columnsUpdated", handler);
    return () => window.removeEventListener("columnsUpdated", handler);
  }, []);

  const handleDragStart = (e, itemId, fromColumn) => {
    e.dataTransfer.setData("item", itemId);
    e.dataTransfer.setData("fromColumn", fromColumn);
  };

  const handleDrop = (e, toColumn) => {
    const itemId = e.dataTransfer.getData("item");
    const fromColumn = e.dataTransfer.getData("fromColumn");

    if (!itemId || !fromColumn) return;
    if (fromColumn === toColumn) return;

    setColumns((prev) => {
      const item = prev[fromColumn].find((card) => card.id === itemId);
      if (!item) return prev;

      const newFrom = prev[fromColumn].filter((card) => card.id !== itemId);
      const newTo = [...prev[toColumn], item];

      return {
        ...prev,
        [fromColumn]: newFrom,
        [toColumn]: newTo,
      };
    });
  };

  const allowDrop = (e) => e.preventDefault();

  const [selectedTask, setSelectedTask] = useState(null);
  const handleCloseModal = () => setSelectedTask(null);

  const { isDeleteMode, selectedTasks, handleTaskSelect, deleteSelected } =
    deleteMode();

  const renderCard = (card, columnName) => (
    <Card
      key={card.id}
      className="card"
      style={{ position: "relative" }}
      onClick={() => !isDeleteMode && setSelectedTask(card)}
      draggable={!isDeleteMode}
      onDragStart={(e) => handleDragStart(e, card.id, columnName)}>
      {isDeleteMode && (
        <div className="card-checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            className="card-checkbox"
            checked={selectedTasks.has(card.id)}
            onChange={(e) => {
              e.originalEvent?.stopPropagation();
              handleTaskSelect(card.id);
            }}
          />
        </div>
      )}
      <div className="card-header">
        <span className="card-title">{card.title}</span>
        <span className="card-priority">{card.priority}</span>
      </div>
      <div className="card-meta">
        <span className="card-field">Fällig: {card.dueDate || "-"}</span>
        <span className="card-field">Person: {card.assignedTo || "-"}</span>
        <span className="card-field">
          Tags:{" "}
          {card.tags && card.tags.length > 0
            ? card.tags.filter(Boolean).join(", ")
            : "-"}
        </span>
      </div>
    </Card>
  );

  const renderColumn = (columnName, items, label) => (
    <div
      className="table"
      onDragOver={allowDrop}
      onDrop={(e) => handleDrop(e, columnName)}>
      <h3>{label}</h3>
      {items.map((card) => renderCard(card, columnName))}
    </div>
  );

  return (
    <>
      {isDeleteMode && (
        <Button
          className="delete-button"
          onClick={deleteSelected}
          label={"Jetzt löschen"}
        />
      )}
      {renderColumn("todo", columns.todo, "To Do")}
      {renderColumn("progress", columns.progress, "In Progress")}
      {renderColumn("review", columns.review, "Review")}
      {renderColumn("done", columns.done, "Done")}
      <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
    </>
  );
};
