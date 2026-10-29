import { DataContext } from "./DataContext";
import { useState, useEffect } from "react";

export const AuthContext = () => {
  const {users, saveUsers } = DataContext();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      const publicUser = { id: user.id, name: user.name, email: user.email };
      setCurrentUser(publicUser);
      return { success: true, user: publicUser };
    }

    return { success: false, message: "E-Mail oder Passwort ist falsch!" };
  };

  const logout = () => setCurrentUser(null);

  const deleteAccount = (email) => {
    const updated = users.filter((u) => u.email !== email);
    saveUsers(updated);
    if (currentUser && currentUser.email === email) {
      logout();
    }
    return { success: true };
  };

  return { login, logout, deleteAccount, currentUser, isAuthenticated };
};