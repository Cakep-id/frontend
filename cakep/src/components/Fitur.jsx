import { useState } from "react";
import { Card, Col, Container, Modal, Row } from "react-bootstrap";

// Import gambar fitur
import aiVision from "../assets/fitur/ai-vision.png";
import analisisNlp from "../assets/fitur/analisis-nlp.png";
import dashboard from "../assets/fitur/dashboard.png";
import jadwalPemeliharaan from "../assets/fitur/jadwal-pemeliharaan.png";
import multiUser from "../assets/fitur/multi-user.png";
import risikoOtomatis from "../assets/fitur/risiko-otomatis.png";
import riwayatKerusakan from "../assets/fitur/riwayat-kerusakan.png";

// Data fitur
const fiturList = [
  {
    title: "Multi-User & Akses Riwayat",
    img: multiUser,
    desc: "Mendukung banyak pengguna sekaligus dan akses riwayat aktivitas secara lengkap untuk memudahkan kolaborasi tim.",
  },
  {
    title: "Dashboard Interaktif",
    img: dashboard,
    desc: "Visualisasi data aset migas secara real-time dan interaktif, memudahkan pengambilan keputusan.",
  },
  {
    title: "AI Vision",
    img: aiVision,
    desc: "Deteksi otomatis kerusakan aset menggunakan teknologi AI dari laporan visual.",
  },
  {
    title: "Riwayat Kerusakan",
    img: riwayatKerusakan,
    desc: "Pantau dan telusuri riwayat kerusakan aset secara detail untuk analisis dan perbaikan.",
  },
  {
    title: "Risiko Otomatis",
    img: risikoOtomatis,
    desc: "Identifikasi risiko secara otomatis berdasarkan data dan laporan yang masuk.",
  },
  {
    title: "Jadwal Pemeliharaan",
    img: jadwalPemeliharaan,
    desc: "Atur dan pantau jadwal pemeliharaan aset agar operasional tetap optimal.",
  },
  {
    title: "Analisis NLP",
    img: analisisNlp,
    desc: "Analisis laporan dan deskripsi kerusakan menggunakan Natural Language Processing.",
  },
];

const Fitur = () => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleShow = (fitur) => {
    setSelected(fitur);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  return (
    <section id="fitur" className="py-5 bg-light">
      <Container>
        <h2 className="fw-bold text-center mb-4" data-aos="fade-up">Fitur Unggulan</h2>
        <Row className="g-4 justify-content-center">
          {fiturList.map((fitur, idx) => (
            <Col key={idx} xs={12} sm={6} md={4} lg={3} className="d-flex" data-aos="fade-up" data-aos-delay={idx * 100}>
              <Card
                className="h-100 w-100 shadow-sm text-center fitur-card d-flex flex-column align-items-center justify-content-between"
                style={{ cursor: "pointer", borderRadius: "18px", minHeight: 320 }}
                onClick={() => handleShow(fitur)}
              >
                <div className="d-flex justify-content-center align-items-center flex-grow-1 w-100">
                  <img
                    src={fitur.img}
                    alt={fitur.title}
                    className="fitur-img"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "contain",
                      margin: "32px 0 16px 0",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
                <Card.Body className="w-100">
                  <Card.Title className="fw-semibold">{fitur.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          show={show}
          onHide={handleClose}
          centered
          size="lg"
          aria-labelledby="fitur-modal"
        >
          {selected && (
            <Row className="g-0 flex-column flex-md-row">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center p-4 bg-light">
                <img
                  src={selected.img}
                  alt={selected.title}
                  style={{
                    width: "220px",
                    height: "220px",
                    objectFit: "contain",
                    margin: "auto",
                  }}
                />
              </Col>
              <Col xs={12} md={6} className="p-4">
                <Modal.Header closeButton className="border-0 pb-0">
                  <Modal.Title id="fitur-modal">{selected.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                  <p className="text-secondary">{selected.desc}</p>
                </Modal.Body>
              </Col>
            </Row>
          )}
        </Modal>
      </Container>
    </section>
  );
};

export default Fitur;