import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { AddTask } from "./AddTask";
import { toggleDeleteMode, disableDeleteMode } from "./Remove";
import { AuthContext } from "../provider/AuthContext";

export const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const auth = AuthContext();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Abmeldung fehlgeschlagen:", error);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Möchten Sie Ihren Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    ) {
      if (auth.currentUser) {
        auth.deleteAccount().catch((error) => {
          console.error("Account konnte nicht gelöscht werden:", error);
        });
      }
    }
  };

  return (
    <>
      <div className="gap">
        <h2>Menü</h2>
        <hr></hr>
      </div>

      <div className="gap">
        <Button
          className="task-icon"
          onClick={() => {
            setShowAddTask((prev) => {
              if (prev) return false;
              disableDeleteMode();
              return true;
            });
          }}>
          <img src="../src/img/addTask.png"></img>
          Hinzufügen
        </Button>
        <hr></hr>
      </div>

      <div className="gap">
        <Button className="task-icon" onClick={toggleDeleteMode} disabled={showAddTask}>
          <img src="../src/img/removeTask.png"></img>
          Löschen
        </Button>
        <hr></hr>
      </div>

      <div className="gap">
        <Button
          className="task-icon"
          onClick={() => {
            if (!showAddTask) setShowMenu(!showMenu);
          }}
          disabled={showAddTask}
        >
          <img src="../src/img/profile.png" />
          Profil
        </Button>
        <hr></hr>

        {showMenu && (
          <div className="menu">
            <label disabled>{auth.currentUser?.name || "Benutzer"}</label>
            <hr></hr>
            <Button
              onClick={handleDeleteAccount}
              label={"Löschen"}
            />

            <Button onClick={handleLogout} label={"Abmelden"} />
          </div>
        )}
      </div>

      {/** Close profile menu when AddTask opens */}
      <>
        {useEffect(() => {
          if (showAddTask) setShowMenu(false);
        }, [showAddTask])}
      </>
      <AddTask
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        currentUser={auth.currentUser}
      />
    </>
  );
};
