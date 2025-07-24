import { Route, Routes } from "react-router-dom";


import { Home } from "./pages/Home";
import "./index.css";
import Navbar from "./components/navbar";
function App() {
  return(
      <div className="bg-gray-100 min-h-screen">
        <Navbar />

      <div >
        <Home />
      </div>

      </div>

    
  )
}

export default App;
// Este es el componente principal de la aplicación que renderiza la página de inicio.
// Importa el componente Home que contiene la lógica de la aplicación y los componentes secundarios.
// Utiliza la sintaxis JSX para renderizar el componente Home dentro de la función App.
// La función App es el punto de entrada de la aplicación React y se exporta como el componente por defecto.
// Esto permite que el componente Home sea renderizado en el DOM cuando la aplicación se inicia.
// La estructura del componente es simple y clara, facilitando la comprensión de la jerarquía de componentes.
// Además, se asegura de que la aplicación esté organizada y modular, separando la lógica
