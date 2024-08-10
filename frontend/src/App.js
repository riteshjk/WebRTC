import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Room from "./pages/Room/Room";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
          <Route path="/authenticate" element={<GuestRoute><Authenticate /></GuestRoute>} />
          <Route path="/activate" element={<SemiProtectedRoute><Activate /></SemiProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const GuestRoute = ({ children }) => {
  // const { isAuth } = useSelector((state) => state.auth);
  const isAuth = false;

  if (isAuth) {
    return <Navigate to="/rooms" />;
  }

  return children;
};

const SemiProtectedRoute = ({ children }) => {
  // const { user, isAuth } = useSelector((state) => state.auth);

  const isAuth = false;

  const user = {
    isActivated: false,
  }

  if (!isAuth) {
    return <Navigate to="/authenticate" />;
  }

  if (isAuth && user.isActivated) {
    return <Navigate to="/rooms" />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  // const { isAuth } = useSelector((state) => state.auth);
  const isAuth = false;
  const user = {
    isActivated: false,
  }

  if (!isAuth) {
    return <Navigate to="/" />;
  }
  if(isAuth && !user.isActivated){
    return <Navigate to="/activate" />
  }

  return children;
};

export default App;
