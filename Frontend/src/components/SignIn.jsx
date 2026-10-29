import { useState } from "react";
import { AuthContext } from "../provider/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const Signin = ({
  onSwitchToRegister,
  onSwitchToChange,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { login } = AuthContext();

  const isValid = validateEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateEmail(email) && password !== "") {
      const result = login(email, password);

      if (result.success) {
        setMessage("");
        setIsError(false);

        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setMessage(result.message);
        setIsError(true);
      }
    }
  };

  return (
    <div>
      <h2 className="signin-name">Einloggen</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <InputText
            className="signin-field"
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="signin-button"
          type="submit"
          disabled={!isValid || password === ""}
          label={"Bestätigen"}
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
          onClick={onSwitchToRegister}
          label={"Registrieren"}
        />

        <Button
          type="button"
          className="linklike"
          onClick={onSwitchToChange}
          label={"Passwort zurücksetzen"}
        />
      </div>
    </div>
  );
};
