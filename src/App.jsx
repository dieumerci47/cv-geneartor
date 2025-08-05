import { useState } from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Routeur from "./routes/routes";

function App() {
  // const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <Routeur />
    </>
  );
}

export default App;
