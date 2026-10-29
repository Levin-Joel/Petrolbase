import { useEffect, useState } from "react";
import { Button } from "primereact/button";

export const Profil = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    onLogout();
  };

  if (!currentUser) {
    return (
      <div className="profil-container">
        <p>Bitte melden Sie sich an.</p>
      </div>
    );
  }

  return (
    <div className="profil-container">
      <h2 className="signin-name">Willkommen, {currentUser.name}!</h2>

      <div className="profil-info">
        <p>
          <strong>Benutzername:</strong> {currentUser.name}
        </p>
        <p>
          <strong>E-Mail:</strong> {currentUser.email}
        </p>
      </div>

      <Button
        className="signin-button"
        onClick={handleLogout}
        label={"Abmelden"}
      />
    </div>
  );
};
