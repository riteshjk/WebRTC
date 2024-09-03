import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
import { Toaster } from "react-hot-toast";
import Room from "./pages/Room/Room";


function App() {
   
  const {loading} = useLoadingWithRefresh()
  return loading ? (<Loader message="Please wait"/>) : (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
          <Route path="/authenticate" element={<GuestRoute><Authenticate /></GuestRoute>} />
          <Route path="/activate" element={<SemiProtectedRoute><Activate /></SemiProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
          <Route path="/room/:id" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}


const GuestRoute = ({ children }) => {
  // const { isAuth } = useSelector((state) => state.auth);
const {isAuth} = useSelector((state) => state.auth);
  if (isAuth) {
    return <Navigate to="/rooms" />;
  }

  return children;
};

const SemiProtectedRoute = ({ children }) => {
  // const { user, isAuth } = useSelector((state) => state.auth);
  const {isAuth,user} = useSelector((state) => state.auth);


  if (!isAuth) {
    return <Navigate to="/authenticate" />;
  }

  if (isAuth && user.activated) {
    return <Navigate to="/rooms" />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  // const { isAuth } = useSelector((state) => state.auth);
  const {isAuth,user} = useSelector((state) => state.auth);


  if (!isAuth) {
    return <Navigate to="/" />;
  }
  if(isAuth && !user.activated){
    return <Navigate to="/activate" />
  }

  return children;
};

export default App;
