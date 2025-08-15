import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import aboutImg from "../../assets/tentang/logo.jpg"; // ganti path jika perlu

const HeroTentang = () => {
  return (
    <section className="py-5">
      <Container  style={{ paddingTop: "100px" }}>
        <Row className="align-items-center">
          {/* Kolom kiri: gambar */}
          <Col xs={12} md={6} className="mb-4 mb-md-0" data-aos="fade-right">
            <img
              src={aboutImg}
              alt="Tentang CAKEP"
              className="img-fluid about-logo"
              style={{ width: "100%", maxHeight: 420, objectFit: "contain" }}
            />
          </Col>

          {/* Kolom kanan: judul + deskripsi */}
          <Col xs={12} md={6} data-aos="fade-left">
            <h3 className="fw-bold mb-3">Tentang CAKEP</h3>
            <p className="text-secondary">
              CAKEP.id adalah sistem peringatan dini berbasis AI dan Web untuk monitoring aset migas.
              Kami membantu tim operasional mendeteksi potensi kerusakan lebih cepat melalui analisis visual
              dan rekomendasi otomatis. Tim PKM-KC Universitas Lampung mengembangkan solusi ini dengan fokus
              pada kemudahan penggunaan dan akurasi.
            </p>
          </Col>
        </Row>
      </Container>

      <style>{`
        .about-logo-wrap { display:flex; justify-content:center; align-items:center; padding: 20px; }
        .about-logo {
          width: 100%;
          max-width: 360px;
          height: 360px;
          object-fit: cover;
          border-radius: 50%;
          border: 6px solid #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        @media (max-width: 768px) {
          .about-logo {
            max-width: 260px;
            height: 260px;
          }
        }
        @media (max-width: 480px) {
          .about-logo {
            max-width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroTentang;