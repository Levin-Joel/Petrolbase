import { useState, useEffect } from "react";
import { LoginView } from "./components/LoginView";
import { MainView } from "./components/MainView";
import "./App.css";

function App() {
  const [showBoard, setShowBoard] = useState(() => {
    const saved = sessionStorage.getItem("showBoard");
    return saved === "true";
  });

  useEffect(() => {
    sessionStorage.setItem("showBoard", showBoard);
  }, [showBoard]);

  const handleLogout = () => {
    sessionStorage.removeItem("showBoard");
    setShowBoard(false);
  };

  return (
    <>
      {!showBoard && <LoginView onLoginSuccess={() => setShowBoard(true)} />}

      {showBoard && <MainView onLogout={handleLogout} />}
    </>
  );
}

export default App;
