import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-neutral-800 text-white px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center shadow-md">
      {/* Título */}
      <Link to="/" className="font-bold text-lg sm:text-xl">
        <h1 className="text-center">Gestor de campañas</h1>
      </Link>

      {/* Botón menú móvil */}
      <button
        className="sm:hidden text-2xl focus:outline-none"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Contenedor del menú */}
      <div
        className={`${
          menuAbierto ? "block" : "hidden"
        } w-full sm:w-auto mt-3 sm:mt-0`}
      >
        <ul className="flex flex-col sm:flex-row items-center gap-3 sm:gap-x-3">
          <li className="w-full sm:w-auto">
            <Link
              to="https://proyecto-mern-de-campa-a-de-correos.onrender.com/admin/queues/"
              target="_blank"
              className="block text-center bg-teal-300 hover:bg-teal-400 text-neutral-800 px-4 py-2 rounded-md text-sm font-semibold transition w-full sm:w-auto"
            >
              Ver colas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
