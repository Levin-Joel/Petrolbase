import { useState } from "react";
import { AuthContext } from "../../provider/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const Register = ({ onSwitchToSignIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { register } = AuthContext();

  const isValid = validateEmail(email);

  const passwordsMatch = password === confirmPassword && password !== "";
  const nameTooLong = name.trim().length > 20;
  const nameHasSpace = name.trim().includes(" ");

  const canSubmit =
    name.trim() !== "" &&
    !nameTooLong &&
    nameHasSpace &&
    isValid &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    register(name.trim(), email.trim(), password)
      .then(() => {
        setMessage("Registrierung erfolgreich!");
        setIsError(false);
        setName("");
        setEmail("");
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
      <h2 className="signin-name">Registrieren</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <InputText
            className="signin-field"
            type="text"
            placeholder="Benutzername"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={20}
          />
          {!nameTooLong && name.trim() !== "" && !nameHasSpace && (
            <p className="error-text" role="alert">
              Der Benutzername muss mindestens ein Leerzeichen enthalten.
            </p>
          )}
        </div>

        <div>
          <InputText
            className="signin-field"
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isValid && email !== "" && (
            <p className="error-text" role="alert">
              Bitte eine gültige E-Mail eingeben.
            </p>
          )}
        </div>

        <div>
          <InputText
            className="signin-field"
            type="password"
            placeholder="Passwort"
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
            placeholder="Passwort bestätigen"
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
          label={"Konto erstellen"}
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
