import { useState } from "react";
import { AuthContext } from "../../provider/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const Change = ({ onSwitchToSignIn }) => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { changePassword } = AuthContext();

  const isValid = validateEmail(email);

  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    isValid &&
    currentPassword !== "" &&
    password.length >= 8 &&
    confirmPassword !== "" &&
    passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    changePassword(email.trim(), currentPassword, password)
      .then(() => {
        setMessage("Passwort erfolgreich geändert!");
        setIsError(false);
        setEmail("");
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
        setTouchedConfirm(false);
        setTimeout(onSwitchToSignIn, 2000);
      })
      .catch((error) => {
        setMessage(error.message);
        setIsError(true);
      });
  };

  return (
    <div>
      <h2 className="signin-name">Passwort zurücksetzen</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <InputText
            className="signin-field"
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {!isValid && email !== "" && (
          <p className="error-text" role="alert">
            Bitte eine gültige E-Mail eingeben.
          </p>
        )}

        <div>
          <InputText
            className="signin-field"
            type="password"
            placeholder="Aktuelles Passwort"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <InputText
            className="signin-field"
            type="password"
            placeholder="Neues Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div>
          <InputText
            className="signin-field"
            type="password"
            placeholder="Neues Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setTouchedConfirm(true)}
            aria-invalid={touchedConfirm && !passwordsMatch ? "true" : "false"}
            required
            minLength={8}
          />
          {touchedConfirm && confirmPassword !== "" && !passwordsMatch && (
            <p className="error-text" role="alert">
              Passwörter stimmen nicht überein.
            </p>
          )}
        </div>

        <Button
          className="signin-button"
          type="submit"
          disabled={!canSubmit}
          label={"Ändern"}
        />
      </form>

      {message && (
        <p className={isError ? "error-text" : "success-text"} role="alert">
          {message}
        </p>
      )}

      <div className="signin-switch">
        <Button
          type="button"
          className="linklike"
          onClick={onSwitchToSignIn}
          aria-label="Zum Anmelden wechseln"
          label={"Zurück zum Anmelden"}
        />
      </div>
    </div>
  );
};
