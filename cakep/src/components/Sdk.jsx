import { useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import tutorImg from "../assets/tutor.png"; // Assuming you have a tutorial image

const Sdk = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <section id="syarat-ketentuan" className="py-5 bg-white">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold text-center mb-3" data-aos="fade-up">Syarat dan Ketentuan</h2>
            <p className="text-center text-secondary" data-aos="fade-up" data-aos-delay="100">
              Berikut adalah syarat dan ketentuan penggunaan SDK CAKEP. Pastikan Anda membaca dengan seksama sebelum menggunakan layanan kami.
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4 align-items-center">
          <Col md={6} className="text-center" data-aos="fade-right" data-aos-delay="300">
            <img
              src={tutorImg}
              alt="Ilustrasi Syarat dan Ketentuan"
              className="img-fluid"
              style={{ maxHeight: "300px" }}
            />
          </Col>
          <Col md={6} data-aos="zoom-in" data-aos-delay="200">
            <ul>
              <li>Pengguna wajib mendaftar akun terlebih dahulu.</li>
              <li>SDK hanya digunakan untuk keperluan monitoring aset migas.</li>
              <li>Dilarang menyalahgunakan data yang diperoleh dari sistem.</li>
              <li>Setiap perubahan pada SDK harus mengikuti update resmi dari CAKEP.</li>
            </ul>
            <Button style={{ backgroundColor: "#EB7F35" }} onClick={handleShow}>
              Lihat Tutorial
            </Button>
          </Col>
        </Row>
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Tutorial Penggunaan SDK CAKEP</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial SDK CAKEP"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Modal.Body>
        </Modal>
      </Container>
    </section>
  );
};

export default Sdk;