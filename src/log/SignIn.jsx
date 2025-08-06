import { useState } from "react";
import { Button } from "../components/ui/button";
import { supabase } from "../supabase/supabase";
import { useNavigate } from "react-router-dom";
const SignIn = ({ Handle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate("/");
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.includes("login")) setError("Email/password Incorect");
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      if (error.message.includes("login")) setError("Email/password Incorect");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <form
        onSubmit={handleSignIn}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
          Connexion
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
        <div className="flex flex-col gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("google")}
          >
            Se connecter avec Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("github")}
          >
            Se connecter avec GitHub
          </Button>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">
          Pas de compte ?{" "}
          <span
            onClick={(e) => Handle(e)}
            id="register"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            S'inscrire
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
