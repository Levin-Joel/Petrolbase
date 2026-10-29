import { Board } from "./Board";

export const MainView = ({onLogout}) => {
    return (
        <Board onLogout={onLogout} />
    );
};