// import Navbar from "@/components/Navbar";
import Index from "@/log/Index";
import SignIn from "@/log/SignIn";
import SignUp from "@/log/SignUp";
import Home from "@/pages/Home";
import Editor from "@/pages/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./../components/Navbar";
const Routeur = () => {
  return (
    <>
      <BrowserRouter>
        <>
          <Navbar />
        </>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
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
