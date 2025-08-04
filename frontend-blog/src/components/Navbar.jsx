import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-24 left-0 right-0 bg-gradient-to-r from-pink-500 via-indigo-500 to-yellow-400 shadow-xl flex justify-center items-center space-x-7 py-3 px-4 h-16 z-40">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          "group px-6 py-2 rounded-2xl flex items-center gap-2 text-lg font-extrabold transition-all duration-200 " +
          (isActive
            ? "bg-white/90 text-indigo-700 shadow"
            : "text-white hover:bg-white/20 hover:text-yellow-100")
        }
      >
        <span>🏡</span> Inicio
      </NavLink>
      
      <NavLink
        to="/añadir"
        className={({ isActive }) =>
          "group px-6 py-2 rounded-2xl flex items-center gap-2 text-lg font-extrabold transition-all duration-200 " +
          (isActive
            ? "bg-white/90 text-pink-700 shadow"
            : "text-white hover:bg-white/20 hover:text-pink-100")
        }
      >
        <span>🎁</span> Añadir
      </NavLink>

      {/* NUEVA OPCIÓN DE FILTROS */}
      <NavLink
        to="/filtros"
        className={({ isActive }) =>
          "group px-6 py-2 rounded-2xl flex items-center gap-2 text-lg font-extrabold transition-all duration-200 " +
          (isActive
            ? "bg-white/90 text-purple-700 shadow"
            : "text-white hover:bg-white/20 hover:text-purple-100")
        }
      >
        <span>🔍</span> Filtros
      </NavLink>
    </nav>
  );
}
