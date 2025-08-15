import { Button, Col, Container, Row } from "react-bootstrap";
import tentangImg from "../assets/tentang-kami.png"; // Ganti dengan path gambar ilustrasi kamu

const Tentang = () => {
  return (
    <section className="py-5 bg-light" id="tentangkami">
      <Container>
        <Row className="align-items-center">
          <Col md={6} data-aos="fade-right">
            <h2 className="fw-bold mb-3">Tentang Kami</h2>
            <p className="text-secondary mb-4">
              CAKEP.id dikembangkan oleh tim mahasiswa Universitas Lampung dalam program PKM-KC. Kami berfokus pada teknologi yang membantu industri migas dalam meningkatkan efisiensi dan keselamatan kerja melalui AI.
            </p>
            <Button style={{ backgroundColor: "#EB7F35" }} href="/tentang-kami">
              Selengkapnya
            </Button>
          </Col>
          <Col md={6} className="text-center" data-aos="fade-left" data-aos-delay="200">
            <img
              src={tentangImg}
              alt="Tentang Kami"
              className="img-fluid rounded"
              style={{ maxHeight: "320px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Tentang;