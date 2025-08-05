import { useState } from "react";
import SignUp from "./Signup";
import SignIn from "./SignIn";

const Index = () => {
  const [SignUpModal, setSignUpModal] = useState(true);
  const [SignInModal, setSignInModal] = useState(false);

  const HandleModal = (e) => {
    if (e.target.id === "register") {
      setSignUpModal(true);
      setSignInModal(false);
    } else if (e.target.id === "login") {
      setSignUpModal(false);
      setSignInModal(true);
    }
  };
  return (
    <>
      <div className="">
        <div className=" ">
          <div className="">
            <div>
              <button
                className=""
                onClick={HandleModal}
                id="register"
                type="button"
              >
                S'inscrire
              </button>
            </div>
            <div>
              <button
                className=""
                onClick={HandleModal}
                id="login"
                type="button"
              >
                Se connecter
              </button>
            </div>
          </div>
          {SignInModal && <SignIn />}
          {SignUpModal && <SignUp Handle={HandleModal} />}
        </div>
      </div>
    </>
  );
};

export default Index;
