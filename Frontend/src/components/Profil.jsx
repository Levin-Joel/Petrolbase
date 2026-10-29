import { Button } from "primereact/button";
import { AuthContext } from "../provider/AuthContext";

export const Profil = () => {
  const { currentUser, logout } = AuthContext();

  const handleLogout = () => {
    logout().catch((error) => {
      console.error("Abmeldung fehlgeschlagen:", error);
    });
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
