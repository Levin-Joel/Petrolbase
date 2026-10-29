import { Navbar } from "./Navbar";
import { Category } from "./Category";

export const Board = ({ onLogout }) => {
  return (
    <div className="board">
      <div className="navbar">
        <Navbar onLogout={onLogout} />
      </div>
      <div className="split">
        <Category />
      </div>
    </div>
  );
};
