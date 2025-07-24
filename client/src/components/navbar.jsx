import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-neutral-800 flex justify-between items-center px-20 py-4">
      <Link to="/" className="text-white font-bold text-lg">
        <h1 className="text-center">Gestor de campañas</h1>
      </Link>

      <ul className="flex gap-x-1 items-center">
        <li>
          <Link
            to="https://proyecto-mern-de-campa-a-de-correos.onrender.com/admin/queues/"
            className="bg-teal-200 px-3 py-2 rounded text-sm font-semibold"
          >
            Ver colas
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
