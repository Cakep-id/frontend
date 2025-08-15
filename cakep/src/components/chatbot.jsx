import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Halo! Saya Asisten CAKEP. Ketik pesan untuk mulai." },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    // static bot reply (replace with API later)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Terima kasih — ini respons statis. (Nanti akan dihubungkan ke API Anda)" },
      ]);
    }, 700);
  };

  return (
    <>
      <style>{`
        .chatbot-fab {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          z-index: 1100;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg,#2d3436,#1f2a2a);
          color: #fff;
          box-shadow: 0 8px 26px rgba(0,0,0,0.35);
          border: none;
        }
        .chat-window {
          position: fixed;
          right: 20px;
          bottom: 86px;
          width: 360px;
          max-width: calc(100% - 40px);
          height: 520px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(15,15,15,0.25);
          overflow: hidden;
          transform: translateY(12px) scale(0.98);
          opacity: 0;
          pointer-events: none;
          transition: opacity .16s ease, transform .16s ease;
          z-index: 1099;
        }
        .chat-window.open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: auto;
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(90deg,#fff,#fbfbfb);
        }
        .chat-header .title { display:flex; align-items:center; gap:8px; font-weight:600; }
        .chat-body {
          padding: 12px;
          flex: 1 1 auto;
          overflow-y: auto;
          background: #f7f7fb;
        }
        .msg { display:flex; margin-bottom:10px; max-width:85%; }
        .msg.bot { justify-content:flex-start; }
        .msg.user { justify-content:flex-end; }
        .msg .bubble {
          padding:10px 12px;
          border-radius:12px;
          font-size:14px;
          line-height:1.3;
        }
        .msg.bot .bubble { background:#fff; border:1px solid #e8e8ee; color:#222; }
        .msg.user .bubble { background:#0d6efd; color:#fff; }
        .chat-input {
          padding:10px;
          border-top:1px solid #eee;
          display:flex;
          gap:8px;
          align-items:center;
          background:#fff;
        }
        @media (max-width:576px) {
          .chat-window { right:12px; left:12px; bottom:76px; width:auto; height:60vh; }
          .chatbot-fab { right:12px; bottom:12px; width:52px; height:52px; }
        }
      `}</style>

      <Button
        aria-label={open ? "Tutup chat" : "Buka chat"}
        title={open ? "Tutup Chat" : "Chat dengan Bot"}
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FaTimes /> : <FaRobot />}
      </Button>

      <div className={`chat-window ${open ? "open" : ""}`} role="dialog" aria-hidden={!open}>
        <div className="chat-header">
          <div className="title">
            <FaRobot />
            <span>Asisten CAKEP</span>
          </div>
          <Button variant="link" className="p-0" onClick={() => setOpen(false)} aria-label="Tutup chat">
            <FaTimes />
          </Button>
        </div>

        <div className="chat-body" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.from}`}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form className="chat-input" onSubmit={sendMessage}>
          <Form.Control
            size="sm"
            placeholder="Ketik pesan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(e); }}
          />
          <Button type="submit" variant="primary" size="sm" aria-label="Kirim">
            <FaPaperPlane />
          </Button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;