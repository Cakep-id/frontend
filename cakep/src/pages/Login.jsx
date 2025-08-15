import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import { FaUser, FaLock, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import factoryLeft from "../assets/login/login.png";
import factoryRight from "../assets/login/daftar.png";

const getPreferredTheme = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  if (stored === 'dark' || stored === 'light') return stored;
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalType, setModalType] = useState(""); // "login" | "signup" | "error"
  const [theme, setTheme] = useState(getPreferredTheme());
  const navigate = useNavigate();

  // Sync theme with localStorage and system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') setTheme(stored);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.classList.toggle('bg-dark', theme === 'dark');
    document.body.classList.toggle('text-light', theme === 'dark');
    document.body.classList.toggle('bg-light', theme === 'light');
    document.body.classList.toggle('text-dark', theme === 'light');
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      setModalMsg("Anda berhasil mendaftar. Silakan login.");
      setModalType("signup");
      setShowModal(true);
      setIsSignup(false);
      return;
    }
    // Login statis
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === "admin@gmail.com" && password === "admin") {
      setModalMsg("Login berhasil! Anda akan diarahkan ke halaman admin.");
      setModalType("login");
      setShowModal(true);
      setTimeout(() => navigate("/admin"), 1200);
    } else if (email === "user@gmail.com" && password === "user") {
      setModalMsg("Login berhasil! Anda akan diarahkan ke halaman user.");
      setModalType("login");
      setShowModal(true);
      setTimeout(() => navigate("/user"), 1200);
    } else {
      setModalMsg("Email atau password salah.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const bgImage = isSignup ? factoryRight : factoryLeft;
  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark ? "#23272f" : "#f5f6f8",
        transition: "background 0.3s"
      }}
    >
      <Container className="d-flex justify-content-center">
        <div className={`auth-card ${isSignup ? "reverse" : ""} ${isDark ? "dark" : "light"}`}
        style={isDark ? { border: "1px solid #fff" } : {}}
        >

          <div
            className="panel image-panel"
            aria-hidden="true"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,${isDark ? "0.56" : "0.36"}), rgba(0,0,0,${isDark ? "0.48" : "0.28"})), url(${bgImage})`
            }}
          >
            <div className="image-overlay">
              <h3>{isSignup ? "Selamat Datang!" : "Selamat Datang Kembali"}</h3>
              <p>
                {isSignup
                  ? "Buat akun untuk mengakses dashboard CAKEP dan fitur monitoring aset."
                  : "Masuk untuk melihat status aset Anda dan hasil analisis AI."}
              </p>
              <Button variant={isDark ? "outline-light" : "outline-dark"} onClick={() => setIsSignup((v) => !v)}>
                {isSignup ? "Sudah punya akun? Masuk" : "Belum mendaftar? Daftar"}
              </Button>
            </div>
          </div>

          <div className="panel form-panel">
            <div className="form-wrap">
              <h4 className="mb-3">{isSignup ? "Daftar" : "Masuk"}</h4>

              <Form onSubmit={handleSubmit} autoComplete="off">
                {isSignup && (
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nama Lengkap</Form.Label>
                    <div className="input-with-icon">
                      <FaUser className="input-icon" />
                      <Form.Control name="name" placeholder="Nama lengkap" required />
                    </div>
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <Form.Control type="email" name="email" placeholder="nama@contoh.com" required />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <Form.Control type="password" name="password" placeholder="********" required />
                  </div>
                </Form.Group>

                {isSignup && (
                  <Form.Group className="mb-3" controlId="confirm">
                    <Form.Label>Konfirmasi Password</Form.Label>
                    <div className="input-with-icon">
                      <FaLock className="input-icon" />
                      <Form.Control type="password" name="confirm" placeholder="Konfirmasi password" required />
                    </div>
                  </Form.Group>
                )}

                <Button type="submit" className="w-100 mb-2" variant={isDark ? "light" : "primary"}>
                  {isSignup ? "Daftar Sekarang" : "Masuk"}
                </Button>

                <div className="text-center small">
                  {isSignup ? (
                    <>
                      Sudah punya akun?{" "}
                      <button type="button" className="link-btn" onClick={() => setIsSignup(false)}>Masuk</button>
                    </>
                  ) : (
                    <>
                      Belum mendaftar?{" "}
                      <button type="button" className="link-btn" onClick={() => setIsSignup(true)}>Daftar</button>
                    </>
                  )}
                </div>
              </Form>
            </div>
          </div>

        </div>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="custom-modal-content">
        <Modal.Body className="text-center">
          <div className="modal-icon-anim">
            {modalType === "login" || modalType === "signup" ? (
              <FaCheckCircle size={60} color="#28c76f" />
            ) : (
              <FaTimesCircle size={60} color="#ea5455" />
            )}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, marginTop: 10 }}>
            {modalMsg}
          </div>
          <Button
            variant={modalType === "error" ? (isDark ? "outline-light" : "danger") : (isDark ? "success" : "primary")}
            onClick={() => setShowModal(false)}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>

      <style>{`
        .auth-card {
          width: 920px;
          max-width: calc(100% - 40px);
          height: 520px;
          display: flex;
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(15,15,15,0.12);
          background: #fff;
          transition: background 0.3s;
        }
        .auth-card.dark {
          background: #23272f;
        }
        .panel {
          flex: 1 1 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 0.5s cubic-bezier(.22,.9,.33,1),
            transform 0.7s cubic-bezier(.22,.9,.33,1);
          will-change: transform, opacity;
          z-index: 1;
        }
        .image-panel {
          left: 0;
          background-size: cover;
          background-position: center;
          color: #fff;
        }
        .form-panel {
          right: 0;
          background: transparent;
        }
        .auth-card.light .form-panel {
          background: #fff;
        }
        .auth-card.dark .form-panel {
          background: #23272f;
        }
        /* Login mode (default) */
        .auth-card:not(.reverse) .image-panel {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0) scale(1);
          z-index: 2;
          animation: fadeInLeft 0.7s;
        }
        .auth-card:not(.reverse) .form-panel {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0) scale(1);
          z-index: 3;
          animation: fadeInRight 0.7s;
        }
        /* Signup mode (reverse) */
        .auth-card.reverse .image-panel {
          opacity: 1;
          pointer-events: auto;
          right: 0;
          left: auto;
          transform: translateX(0) scale(1);
          z-index: 2;
          animation: fadeInRight 0.7s;
        }
        .auth-card.reverse .form-panel {
          opacity: 1;
          pointer-events: auto;
          left: 0;
          right: auto;
          transform: translateX(0) scale(1);
          z-index: 3;
          animation: fadeInLeft 0.7s;
        }
        /* Fade keyframes */
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-60px) scale(0.98);}
          to   { opacity: 1; transform: translateX(0) scale(1);}
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.98);}
          to   { opacity: 1; transform: translateX(0) scale(1);}
        }
        .image-overlay { text-align:center; max-width:420px; }
        .image-overlay h3 { margin-bottom:12px; font-weight:700; font-size:1.4rem; }
        .image-overlay p { opacity:.95; margin-bottom:16px; color:#f0f0f0; }
        .form-wrap { width:100%; max-width:420px; }
        .input-with-icon { position:relative; display:flex; align-items:center; }
        .input-with-icon .input-icon { position:absolute; left:12px; color:#8a8f98; }
        .input-with-icon .form-control { padding-left:36px; }
        .link-btn { background:none; border:none; color:#0d6efd; padding:0; cursor:pointer; font-weight:600; }
        .auth-card.dark .link-btn { color: #6cb2ff; }
        /* Modal icon animation */
        .modal-icon-anim {
          margin-bottom: 10px;
          animation: popIn 0.5s cubic-bezier(.22,.9,.33,1);
        }
        @keyframes popIn {
          0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        /* Responsive: stack panels */
        @media (max-width: 768px) {
          .auth-card {
            width: 100%;
            height: auto;
            min-height: 0;
            display: block;
          }
          .panel {
            position: static;
            width: 100%;
            height: auto;
            opacity: 1 !important;
            pointer-events: auto !important;
            z-index: 1 !important;
            padding: 28px 18px;
            transform: none !important;
            animation: none !important;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;