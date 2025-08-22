import AOS from "aos";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import TentangKami from "./pages/TentangKami";
import Train from "./pages/Train";
import User from "./pages/User";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/user/*" 
          element={
            <ProtectedRoute requiredRole="user">
              <User />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/train/*" 
          element={
            <ProtectedRoute requiredRole="train">
              <Train />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;