// import Navbar from "@/components/Navbar";
import Index from "@/log/Index";
import SignIn from "@/log/SignIn";
import SignUp from "@/log/SignUp";
import Home from "@/pages/Home";
import Editor from "@/pages/Editor";
import Dashboard from "@/pages/Dashboard";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";

function RequireAuth({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthed(!!data?.session);
      setChecking(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;
      setIsAuthed(!!session);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (checking) return null;
  if (!isAuthed)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
const Routeur = () => {
  return (
    <>
      <BrowserRouter>
        <>
          <Navbar />
        </>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/editor"
            element={
              <RequireAuth>
                <Editor />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Index />}>
            {/*     <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routeur;
