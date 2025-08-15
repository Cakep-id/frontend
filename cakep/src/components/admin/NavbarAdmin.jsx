import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

const NavbarAdmin = () => {
  // Ambil preferensi tema dari localStorage atau system
  const getPreferredTheme = () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark' || stored === 'light') return stored;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getPreferredTheme());
  const darkMode = theme === 'dark';

  // Terapkan tema ke dokumen dan body
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.classList.toggle('bg-dark', darkMode);
    document.body.classList.toggle('text-light', darkMode);
    document.body.classList.toggle('bg-light', !darkMode);
    document.body.classList.toggle('text-dark', !darkMode);
  }, [theme, darkMode]);

  // Dengarkan perubahan tema sistem
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
      className="shadow-sm"
      style={{ padding: "0.5rem 0", position: "fixed", width: "100%", zIndex: 1030 }}
    >
      <Container fluid className="px-4">
        <Navbar.Brand href="/admin" className="fw-bold fs-4" style={{ color: darkMode ? "#fff" : "#2d3436" }}>
          Cakep.id Admin
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
          <Nav className="ms-auto">
            <Nav.Link href="/admin" className="fw-medium mx-2">Home</Nav.Link>
            <Nav.Link href="/admin/daftar-laporan" className="fw-medium mx-2">Daftar Laporan</Nav.Link>
            <Nav.Link href="/admin/management-pengguna" className="fw-medium mx-2">Management Pengguna</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2 ms-3">
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

export default NavbarAdmin;