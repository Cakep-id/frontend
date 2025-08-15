import React from "react";
import NavbarCakep from "../components/Navbar";
import HeroTentang from "../components/tentang/heroTentang";
import Tim from "../components/tentang/tim"; 
import Footer from "../components/Footer";
import Chatbot from "../components/chatbot";

const TentangKami = () => {
  return (
    <>
      <NavbarCakep />
      <HeroTentang />
      <Tim />
      <Footer />
      <Chatbot />
    </>
  );
};

export default TentangKami;