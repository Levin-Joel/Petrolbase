import { AuthContext } from "./provider/AuthContext";
import { LoginView } from "./components/auth/LoginView";
import { MainView } from "./components/MainView";
import "./App.css";

function App() {
  const { isAuthenticated, isLoading } = AuthContext();

  return (
    <>
      {isLoading ? null : isAuthenticated ? <MainView /> : <LoginView />}
    </>
  );
}

export default App;
