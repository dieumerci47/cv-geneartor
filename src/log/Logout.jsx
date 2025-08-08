import { Button } from "@/components/ui/button";
import { supabase } from "./../supabase/supabase";
const Logout = () => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="px-6 py-2 text-base font-semibold shadow"
      variant="outline"
      // onClick={onLoginClick}
    >
      Se Deconecter
    </Button>
  );
};

export default Logout;
