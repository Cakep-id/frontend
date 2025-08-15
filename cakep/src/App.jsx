import AOS from "aos";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import TentangKami from "./pages/TentangKami";
import Login from "./pages/Login";

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
      </Routes>
    </Router>
  );
}

export default App;