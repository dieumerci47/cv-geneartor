import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import logo from "../assets/react.svg";
import { Button } from "../components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Logout from "@/log/Logout";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        console.error(error);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(!!data?.session);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setIsAuthenticated(!!session);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-9 w-9" />
        <span className="text-2xl font-bold text-blue-700 tracking-tight">
          CV Generator
        </span>
      </div>
      <div>
        {isAuthenticated ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                className="px-4 py-2 text-base font-semibold shadow rounded-full border-blue-100"
                variant="outline"
              >
                Menu ▾
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={8}
                align="end"
                className="min-w-44 bg-white/95 backdrop-blur border border-blue-100 rounded-xl shadow-xl p-1 mr-2 ring-1 ring-blue-100"
              >
                <DropdownMenu.Item asChild>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-100 focus:outline-none"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px my-1 bg-blue-100" />
                <DropdownMenu.Item asChild>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    <Logout />
                  </div>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Link to="/login">
            <Button
              className="px-6 py-2 text-base font-semibold shadow"
              variant="outline"
            >
              Se connecter
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
