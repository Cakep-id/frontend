import { useEffect, useRef, useState } from "react";
import { Badge, Button, Form, Spinner } from "react-bootstrap";
import { FaBrain, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [aiStatus, setAiStatus] = useState({ source: 'grok', available: true });
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "🤖 Halo! Saya CAKEP Assistant powered by Grok AI. Saya siap membantu Anda dengan pertanyaan tentang manajemen aset dan maintenance. Ketik pesan untuk mulai!",
      confidence: 1.0,
      source: 'system'
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      if (!conversationId) {
        generateConversationId();
      }
      checkAIStatus();
    }
  }, [messages, open]);

  const generateConversationId = () => {
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setConversationId(newId);
  };

  const checkAIStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chatbot/system-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiStatus({
          source: data.data.grok_api.available ? 'grok' : 'fallback',
          available: true,
          grokAvailable: data.data.grok_api.available
        });
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      setAiStatus({ source: 'fallback', available: false });
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    
    // Add user message
    const userMessage = { from: "user", text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const context = messages.slice(-6).map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          context: context
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const botMessage = {
          from: "bot",
          text: data.data.response,
          confidence: data.data.confidence,
          source: data.data.source,
          timestamp: data.data.timestamp
        };
        setMessages((m) => [...m, botMessage]);
        
        // Update AI status based on response
        setAiStatus(prev => ({
          ...prev,
          source: data.data.source
        }));
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        from: "bot",
        text: "🚨 Maaf, saya mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat atau hubungi support jika masalah berlanjut.",
        confidence: 0,
        source: 'error',
        timestamp: new Date().toISOString()
      };
      setMessages((m) => [...m, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getSourceBadge = (source) => {
    const badges = {
      'grok_api': <Badge bg="success" size="sm">🧠 Grok AI</Badge>,
      'training_data': <Badge bg="info" size="sm">📚 Training</Badge>,
      'fallback': <Badge bg="warning" size="sm">🔄 Fallback</Badge>,
      'error': <Badge bg="danger" size="sm">❌ Error</Badge>,
      'system': <Badge bg="secondary" size="sm">⚙️ System</Badge>
    };
    return badges[source] || <Badge bg="secondary" size="sm">❓ Unknown</Badge>;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-danger';
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
        title={open ? "Tutup Chat" : `Chat dengan CAKEP AI (${aiStatus.source === 'grok' ? 'Grok AI' : 'Fallback'})`}
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FaTimes /> : <FaBrain />}
      </Button>

      <div className={`chat-window ${open ? "open" : ""}`} role="dialog" aria-hidden={!open}>
        <div className="chat-header">
          <div className="title">
            <FaBrain />
            <span>CAKEP AI Assistant</span>
            {aiStatus.source && (
              <Badge 
                bg={aiStatus.source === 'grok' ? 'success' : 'warning'} 
                size="sm" 
                className="ms-2"
              >
                {aiStatus.source === 'grok' ? 'Grok AI' : 'Fallback'}
              </Badge>
            )}
          </div>
          <Button variant="link" className="p-0" onClick={() => setOpen(false)} aria-label="Tutup chat">
            <FaTimes />
          </Button>
        </div>

        <div className="chat-body" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.from}`}>
              <div className="bubble">
                {m.text}
                {m.from === 'bot' && m.confidence !== undefined && (
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    {getSourceBadge(m.source)}
                    {m.confidence > 0 && (
                      <small className={`${getConfidenceColor(m.confidence)}`}>
                        {Math.round(m.confidence * 100)}% confident
                      </small>
                    )}
                  </div>
                )}
                {m.timestamp && (
                  <div className="mt-1">
                    <small className="text-muted">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg bot">
              <div className="bubble d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>AI sedang berpikir...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="chat-input" onSubmit={sendMessage}>
          <Form.Control
            size="sm"
            placeholder={loading ? "Menunggu respons AI..." : "Ketik pertanyaan Anda..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(e); }}
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="sm" 
            aria-label="Kirim"
            disabled={loading || !input.trim()}
          >
            {loading ? <Spinner animation="border" size="sm" /> : <FaPaperPlane />}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;