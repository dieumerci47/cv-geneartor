import logo from "../assets/react.svg";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-9 w-9" />
        <span className="text-2xl font-bold text-blue-700 tracking-tight">
          CV Generator
        </span>
      </div>
      <div>
        <Link to="login">
          <Button
            className="px-6 py-2 text-base font-semibold shadow"
            variant="outline"
            // onClick={onLoginClick}
          >
            Se connecter
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
