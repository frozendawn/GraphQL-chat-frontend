// import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import SignIn from "./pages/SignIn/SignIn";
import Signup from "./pages/Signup/Signup";
import { useContext } from "react";
import UserContext from "./components/context/user-context";

function App() {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            userCtx.signedIn ? <Chat /> : <Navigate replace to={"signin"} />
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
