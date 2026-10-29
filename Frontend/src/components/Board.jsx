import { Navbar } from "./Navbar";
import { Category } from "./Category";

export const Board = () => {
  return (
    <div className="board">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="split">
        <Category />
      </div>
    </div>
  );
};
