import "./App.css";
import { Button } from "./components/ui/button";
import { supabase } from "./supabase/supabase";

function App() {
  const Test = async () => {
    const { data, error } = await supabase.from("user").select("*");
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };
  return (
    <>
      <button onClick={Test} className="bg-black text-3xl text-white">
        HELLO
      </button>
      <Button className="bg-red-800">UI</Button>
    </>
  );
}

export default App;
