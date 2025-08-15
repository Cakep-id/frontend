import Cara from "../components/Cara";
import Fitur from "../components/Fitur";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import NavbarCakep from "../components/Navbar";
import Sdk from "../components/Sdk";
import Tentang from "../components/Tentang";
import Chatbot from "../components/chatbot";

const LandingPage = () => {
  return (
    <>
        <NavbarCakep />
        <Hero />
        <Sdk />
        <Fitur />
        <Cara />
        <Tentang />
        <Footer />
        <Chatbot />
    </>
  );
};

export default LandingPage;