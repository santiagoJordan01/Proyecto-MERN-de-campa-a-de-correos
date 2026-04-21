import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import "./index.css";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      <main className="flex-grow flex items-center justify-center px-4">
        <Home />
      </main>
    </div>
  );
}

export default App;
