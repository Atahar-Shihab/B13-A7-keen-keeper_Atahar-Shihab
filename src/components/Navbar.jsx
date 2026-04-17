import { NavLink } from "react-router-dom";
import { Home, Clock, PieChart } from "lucide-react";

const Navbar = () => {

  const navClass = ({ isActive }) => 
    isActive ? "btn btn-ghost text-primary font-bold" : "btn btn-ghost";

  return (
    <div className="navbar bg-base-100 shadow-sm mb-8">

      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost text-xl">
          👥 KeenKeeper
        </NavLink>
      </div>

      <div className="flex-none gap-2 hidden sm:flex">
        <NavLink to="/" className={navClass}>
          <Home size={18} /> Home
        </NavLink>
        <NavLink to="/timeline" className={navClass}>
          <Clock size={18} /> Timeline
        </NavLink>
        <NavLink to="/stats" className={navClass}>
          <PieChart size={18} /> Stats
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;