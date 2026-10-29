import { useState } from "react";
import { Signin } from "./Signin";
import { Register } from "./Register";
import { Change } from "./Change";

export const LoginView = () => {
  const [mode, setMode] = useState("signin");

  return (
    <div className="login-optics">
    <div className="login-container">
      {mode === "signin" && (
        <Signin
          onSwitchToRegister={() => setMode("register")}
          onSwitchToChange={() => setMode("change")}
        />
      )}

      {mode === "register" && (
        <Register onSwitchToSignIn={() => setMode("signin")} />
      )}

      {mode === "change" && (
        <Change onSwitchToSignIn={() => setMode("signin")} />
      )}
    </div>
    </div>
  );
};
