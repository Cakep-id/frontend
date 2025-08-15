import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

// import images as variables
import riduan from "../../assets/tentang/tim/Riduan.jpg";
import rahmi from "../../assets/tentang/tim/rahmi.jpg";
import budi from "../../assets/tentang/tim/budi.jpg";
import imam from "../../assets/tentang/tim/Imam.jpg";
import fahan from "../../assets/tentang/tim/fahan.jpg";

const team = [
  {
    name: "Riduan",
    role: "Project Lead",
    img: riduan,
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Rahmi",
    role: "Frontend Developer",
    img: rahmi,
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Pria Budi Tobing",
    role: "Machine Learning Engineer",
    img: budi,
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Imam Ariadi",
    role: "Fullstack Developer",
    img: imam,
    linkedin: "https://www.linkedin.com/in/imamariadi/",
    instagram: "https://www.instagram.com/imam_ariadi33/",
  },
  {
    name: "Isfahan Ardanni",
    role: "Backend Developer",
    img: fahan,
    linkedin: "#",
    instagram: "#",
  },
];

const Tim = () => {
  return (
    <section className="py-5">
      <Container>
        <h3 className="fw-bold text-center mb-4">Tim Kami</h3>

        <Row className="g-4 justify-content-center">
          {team.map((m, i) => (
            <Col key={i} xs={12} sm={6} md={4} lg={4} className="d-flex">
              <Card className="h-100 w-100 shadow-sm text-center" style={{ borderRadius: 12 }}>
                <div className="d-flex justify-content-center mt-4">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="team-img"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "4px solid #fff",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
                    }}
                  />
                </div>

                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title className="mb-1 fw-semibold">{m.name}</Card.Title>
                  <div className="text-secondary mb-3" style={{ fontSize: 14 }}>{m.role}</div>

                  <div className="d-flex gap-3">
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn ${m.name}`}
                      className="text-secondary"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href={m.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Instagram ${m.name}`}
                      className="text-secondary"
                    >
                      <FaInstagram />
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <style>{`
        .team-img { transition: transform .18s ease; }
        .team-img:hover { transform: translateY(-4px) scale(1.02); }
        @media (max-width: 576px) {
          .team-img { width: 110px !important; height: 110px !important; }
        }
      `}</style>
    </section>
  );
};

export default Tim;