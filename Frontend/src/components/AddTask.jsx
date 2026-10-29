import { useState } from "react";
import { Task } from "./Task";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import moveIcon from "../img/move.png";

export const AddTask = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Mittel");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [reminder, setReminder] = useState(false);

  // Dialog controls visibility via `visible` prop, no need to short-circuit

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Bitte einen Titel eingeben.");
      return;
    }

    Task({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      tags: tags.split(",").map((tag) => tag.trim()),
      assignedTo,
      reminder,
    });

    onClose();

    setTitle("");
    setDescription("");
    setPriority("Mittel");
    setDueDate("");
    setTags("");
    setAssignedTo("");
    setReminder(false);
  };

  const priorityOptions = [
    { label: "Hoch", value: "Hoch" },
    { label: "Mittel", value: "Mittel" },
    { label: "Niedrig", value: "Niedrig" },
  ];

  const headerTemplate = (
    <div className="dialog-header-with-move">
      <div className="dialog-title">Neue Aufgabe erstellen</div>
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
  );

  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      header={headerTemplate}
      modal={false}
      closable={false}
      style={{ width: "min(700px, 95%)" }}
      contentStyle={{
        background: "white",
        maxHeight: "80vh",
        overflow: "auto",
        borderRadius: "5px",
      }}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-main">
          <label>Titel:</label>
          <InputText
            type="text"
            placeholder="Aufgabentitel"
            maxLength={23}
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 30))}
          />

          <label>Beschreibung:</label>
          <InputTextarea
            placeholder="Beschreibung eingeben..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <label>Tags:</label>
          <InputText
            type="text"
            placeholder="Tags eingeben, getrennt durch Kommas"
            maxLength={26}
            value={tags}
            onChange={(e) => setTags(e.target.value.slice(0, 26))}
          />

          <label>Zugewiesen an:</label>
          <InputText
            type="text"
            placeholder="Person zuweisen"
            maxLength={26}
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value.slice(0, 26))}
          />

          <div className="modal-buttons">
            <Button
              type="button"
              onClick={onClose}
              className="signin-button"
              label={"Abbrechen"}
            />

            <Button
              type="submit"
              className="signin-button"
              label={"Speichern"}
            />
          </div>
        </div>

        <div className="modal-side">
          <label>Priorität:</label>
          <Dropdown
            value={priority}
            options={priorityOptions}
            onChange={(e) => setPriority(e.value)}
          />

          <label>Fälligkeitsdatum:</label>
          <Calendar
            value={dueDate ? new Date(dueDate) : null}
            onChange={(e) =>
              setDueDate(e.value ? e.value.toISOString().slice(0, 10) : "")
            }
            dateFormat="yy-mm-dd"
          />
        </div>
      </form>
    </Dialog>
  );
};
