import { createContext, useContext, useEffect, useState } from "react";

const AuthStateContext = createContext(null);
const API_URL = "/api/auth";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(
      body.detail || body.message || "Die Anfrage ist fehlgeschlagen.",
    );
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    request("/me")
      .then(setCurrentUser)
      .catch((error) => {
        if (error.status !== 401) {
          console.error("Sitzung konnte nicht geladen werden:", error);
        }
        setCurrentUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const user = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setCurrentUser(user);
    return user;
  };

  const register = (name, email, password) =>
    request("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

  const changePassword = (email, currentPassword, newPassword) =>
    request("/change-password", {
      method: "POST",
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });

  const logout = async () => {
    await request("/logout", { method: "POST" });
    setCurrentUser(null);
  };

  const deleteAccount = async () => {
    await request("/account", { method: "DELETE" });
    setCurrentUser(null);
  };

  return (
    <AuthStateContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        login,
        register,
        changePassword,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const AuthContext = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("AuthContext muss innerhalb des AuthProvider verwendet werden.");
  }
  return context;
};