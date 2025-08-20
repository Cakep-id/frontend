import { Route, Routes } from "react-router-dom";
import DaftarLaporan from "../components/admin/DaftarLaporan";
import DaftarUser from "../components/admin/DaftarUser";
import EditPemeliharaan from "../components/admin/EditPemeliharaan";
import FooterAdmin from "../components/admin/FooterAdmin";
import Main from "../components/admin/Main";
import NavbarAdmin from "../components/admin/NavbarAdmin";
import TrainingData from "../components/admin/TrainingData";

const Admin = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarAdmin />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/daftar-laporan" element={<DaftarLaporan />} />
          <Route path="/management-pengguna" element={<DaftarUser />} />
          <Route path="/edit-pemeliharaan" element={<EditPemeliharaan />} />
          <Route path="/training-data" element={<TrainingData />} />
        </Routes>
      </main>
      <FooterAdmin />
    </div>
  );
};

export default Admin;
