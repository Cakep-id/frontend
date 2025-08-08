import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

const NavbarCakep = () => {
  // Determine preferred theme (localStorage -> system preference)
  const getPreferredTheme = () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark' || stored === 'light') return stored;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getPreferredTheme());
  const darkMode = theme === 'dark';

  // Apply theme to document and body
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.classList.toggle('bg-dark', darkMode);
    document.body.classList.toggle('text-light', darkMode);
  }, [theme, darkMode]);

  // Listen to system theme changes (optional enhancement)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handleToggle = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <Navbar
      expand="lg"
      bg={darkMode ? "dark" : "white"}
      variant={darkMode ? "dark" : "light"}
      className="shadow-sm px-0"
      style={{ padding: "0.5rem 0" }}
    >
      <Container>
        <Navbar.Brand href="#" className="fw-bold fs-4 text-dark" style={{ color: darkMode ? "#fff" : "#2d3436" }}>
          Cakep.id
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="cakep-navbar" />
        <Navbar.Collapse id="cakep-navbar">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className="fw-medium mx-2">Home</Nav.Link>
            <Nav.Link href="#fitur" className="fw-medium mx-2">Fitur</Nav.Link>
            <Nav.Link href="#carakerja" className="fw-medium mx-2">Cara Kerja</Nav.Link>
            <Nav.Link href="#tentangkami" className="fw-medium mx-2">Tentang Kami</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2 ms-3">
                        <Button 
                          variant={darkMode ? "light" : "dark"}
                          href="#daftar"
                          className="px-3 py-2 fw-medium"
                          style={{
                            backgroundColor: darkMode ? "#fff" : "#2d3436",
                            borderColor: darkMode ? "#fff" : "#2d3436",
                            color: darkMode ? "#2d3436" : "#fff"
                          }}
                        >
                          Daftar Sekarang
                        </Button>
            <Button
              variant={darkMode ? "outline-light" : "outline-secondary"}
              onClick={handleToggle}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              className="rounded-circle p-0"
              style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarCakep;