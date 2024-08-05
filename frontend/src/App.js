import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navigation/>
      <Routes>
            <Route path="/" element={<Home />}/>  
      </Routes>
      <Routes>
            <Route path="/register" element={<Register />}/>  
      </Routes>
      <Routes>
            <Route path="/login" element={<Login />}/>  
      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
