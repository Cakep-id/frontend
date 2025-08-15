import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarUser from "../components/user/NavbarUser";
import Main from "../components/user/Main";
import BuatLaporan from "../components/user/BuatLaporan";
import StatusLaporan from "../components/user/StatusLaporan";
import FooterUser from "../components/user/FooterUser";

// Dummy page untuk contoh, silakan ganti dengan komponen asli nanti


const User = () => {
  return (
    <>
      <NavbarUser />
      <div style={{ paddingTop: 70 }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/buat-laporan" element={<BuatLaporan />} />
          <Route path="/status-laporan" element={<StatusLaporan />} />
          {/* tambahkan ke sini untuk yang lain */}
        </Routes>
      </div>
      <FooterUser />
    </>
  );
};

export default User;