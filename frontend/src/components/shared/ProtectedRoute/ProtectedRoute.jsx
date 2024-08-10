import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuth = false; // Replace with your actual authentication logic

  if (!isAuth) {
    return <Navigate to="/authenticate" />;
  }

  return children;
};

export default ProtectedRoute;