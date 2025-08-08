import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaInstagram, FaYoutube, FaTiktok, FaPaperPlane } from "react-icons/fa";

const Footer = () => (
  <footer className="py-5 bg-light border-top mt-5">
    <Container>
      <Row className="align-items-start">
        {/* Kolom Kiri */}
        <Col md={4} className="mb-4 mb-md-0">
          <div className="d-flex align-items-center mb-2">
            <img
              src="/logo192.png" // Ganti dengan path logo kamu
              alt="Logo Cakep.id"
              style={{ width: 40, height: 40, marginRight: 12 }}
            />
            <span className="fw-bold fs-4">Cakep.id</span>
          </div>
          <div className="mb-2 text-secondary">Tim PKM-KC Universitas Lampung</div>
          <div className="d-flex gap-3 mt-2">
            <a href="https://www.instagram.com/cakep.id_unila/" target="_blank" rel="noopener noreferrer" className="text-secondary fs-5">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/@cakep.id_Unila" target="_blank" rel="noopener noreferrer" className="text-secondary fs-5">
              <FaYoutube />
            </a>
            <a href="https://www.tiktok.com/@cakep.ide" target="_blank" rel="noopener noreferrer" className="text-secondary fs-5">
              <FaTiktok />
            </a>
          </div>
        </Col>
        {/* Kolom Tengah */}
        <Col md={4} className="mb-4 mb-md-0">
          <h5 className="fw-bold mb-3">Fitur</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-secondary text-decoration-none">Home</a></li>
            <li><a href="#fitur" className="text-secondary text-decoration-none">Fitur</a></li>
            <li><a href="#carakerja" className="text-secondary text-decoration-none">Cara Kerja</a></li>
            <li><a href="#tentangkami" className="text-secondary text-decoration-none">Tentang Kami</a></li>
          </ul>
        </Col>
        {/* Kolom Kanan */}
        <Col md={4}>
          <h5 className="fw-bold mb-3">Hubungi Admin</h5>
          <Form
            action="mailto:info@cakep.id"
            method="POST"
            encType="text/plain"
            className="d-flex flex-column gap-2"
          >
            <Form.Control type="email" placeholder="Email Anda" required />
            <Form.Control as="textarea" rows={2} placeholder="Pesan Anda" required />
            <Button type="submit" variant="primary" className="d-flex align-items-center justify-content-center gap-2">
              <FaPaperPlane /> Kirim
            </Button>
          </Form>
        </Col>
      </Row>
      <hr className="my-4" />
      <div className="text-center text-secondary small">
        &copy; {new Date().getFullYear()} Cakep.id &mdash; Universitas Lampung
      </div>
    </Container>
  </footer>
);

export default Footer;