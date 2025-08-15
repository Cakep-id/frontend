import { Button, Col, Container, Row } from "react-bootstrap";
import heroImg from "../assets/hero.png";

const Hero = () => {
  return (
    <section id="home" className="d-flex align-items-center py-5 bg-light" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0" data-aos="fade-right">
            <h1 className="fw-bold display-4 mb-3 hero-title">
              Monitoring Asset Migas
            </h1>
            <h4 className="mb-3 hero-subtitle">
              Lebih Cerdas dan Tepat
            </h4>
            <p className="mb-4 text-secondary">
                CAKEP.id adalah sistem peringatan dini berbasis AI dan Web 
                yang membantu mendeteksi risiko kerusakan aset secara 
                otomatis hanya dari satu laporan visual dan deskripsi singkat.
            </p>
            <Button style={{ backgroundColor: "#EB7F35" }} size="lg" href="#daftar">
              Coba Sekarang
            </Button>
          </Col>
          <Col md={6} className="text-center" data-aos="fade-left" data-aos-delay="200">
            <img
              src={heroImg}
              alt="Ilustrasi Hero"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;