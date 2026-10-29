export const defaultColumns = () => ({
  todo: [],
  progress: [],
  review: [],
  done: [],
});

export const getColumnsFromStorage = (currentUser) => {
  const storageKey = `columns_${currentUser.id}`;
  const saved = localStorage.getItem(storageKey);
  if (!saved) return defaultColumns();

  try {
    const data = JSON.parse(saved);
    return {
      todo: (data.todo || []).filter((task) => task.createdBy === currentUser.id),
      progress: (data.progress || []).filter(
        (task) => task.createdBy === currentUser.id,
      ),
      review: (data.review || []).filter(
        (task) => task.createdBy === currentUser.id,
      ),
      done: (data.done || []).filter((task) => task.createdBy === currentUser.id),
    };
  } catch {
    return defaultColumns();
  }
};
