import { NavLink } from "react-router-dom";
import { Home, Clock, PieChart } from "lucide-react";

const Navbar = () => {
  // Matching the design's active state
  const activeClass = "flex items-center gap-2 text-black font-bold border-b-2 border-black pb-1";
  const defaultClass = "flex items-center gap-2 text-gray-500 hover:text-black transition-colors pb-1";

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo using your uploaded asset */}
        <div className="flex items-center gap-2 text-2xl font-extrabold text-black">
          <img src="/assets/logo.png" alt="KinKeeper Logo" className="h-8 w-8 object-contain" />
          KinKeeper
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : defaultClass}>
            <Home size={18} /> <span className="hidden sm:inline">Home</span>
          </NavLink>
          <NavLink to="/timeline" className={({ isActive }) => isActive ? activeClass : defaultClass}>
            <Clock size={18} /> <span className="hidden sm:inline">Timeline</span>
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? activeClass : defaultClass}>
            <PieChart size={18} /> <span className="hidden sm:inline">Stats</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;