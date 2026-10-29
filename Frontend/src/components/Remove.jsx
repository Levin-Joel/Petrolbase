import { useState, useEffect } from "react";

export const toggleDeleteMode = () => {
  window.dispatchEvent(new CustomEvent("toggleDeleteMode"));
};

export const disableDeleteMode = () => {
  window.dispatchEvent(new CustomEvent("disableDeleteMode"));
};

export const deleteMode = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  useEffect(() => {
    const toggleHandler = () => {
      setIsDeleteMode((prev) => !prev);
      setSelectedTasks(new Set());
    };

    const disableHandler = () => {
      setIsDeleteMode(false);
      setSelectedTasks(new Set());
    };

    window.addEventListener("toggleDeleteMode", toggleHandler);
    window.addEventListener("disableDeleteMode", disableHandler);
    return () => {
      window.removeEventListener("toggleDeleteMode", toggleHandler);
      window.removeEventListener("disableDeleteMode", disableHandler);
    };
  }, []);

  const handleTaskSelect = (taskId) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const deleteSelected = () => {
    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}",
    );
    const storageKey = `columns_${currentUser.id}`;
    const columns = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const newColumns = { ...columns };

    Object.keys(newColumns).forEach((columnKey) => {
      newColumns[columnKey] = newColumns[columnKey].filter(
        (task) => !selectedTasks.has(task.id),
      );
    });

    localStorage.setItem(storageKey, JSON.stringify(newColumns));
    window.dispatchEvent(
      new CustomEvent("columnsUpdated", { detail: newColumns }),
    );
    window.dispatchEvent(new CustomEvent("toggleDeleteMode"));
  };

  return {
    isDeleteMode,
    selectedTasks,
    handleTaskSelect,
    deleteSelected,
  };
};
