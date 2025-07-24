import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import "./index.css";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4">
        <Home />
      </main>
    </div>
  );
}

export default App;
