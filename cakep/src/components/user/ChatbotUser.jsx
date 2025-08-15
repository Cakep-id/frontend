import { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { FaBars, FaCopy, FaPaperPlane, FaPlus, FaRobot, FaTimes, FaTrash, FaUser } from "react-icons/fa";

const ChatbotUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Selamat datang di chatbot Cakep.id! Saya adalah asisten AI yang siap membantu Anda dengan berbagai pertanyaan teknis mengenai platform ini. Silahkan tanya apapun yang ingin Anda ketahui!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Chat Baru", lastMessage: "Selamat datang di chatbot..." }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Theme management
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || 'light';
  });
  const isDark = theme === 'dark';

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
    
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('theme');
      if (newTheme) setTheme(newTheme);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  // Send message
  const sendMessage = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newMessage = {
      id: Date.now(),
      from: "user",
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: "bot",
        text: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Bot response logic (static for now)
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('laporan') || message.includes('report')) {
      return "Untuk membuat laporan, Anda bisa menggunakan fitur 'Buat Laporan' di dashboard. Fitur ini memungkinkan Anda untuk mengambil foto, mendeteksi lokasi otomatis, dan memberikan deskripsi detail tentang aset yang bermasalah. Apakah ada hal khusus tentang laporan yang ingin Anda ketahui?";
    }
    
    if (message.includes('status') || message.includes('tracking')) {
      return "Anda dapat memantau status laporan melalui halaman 'Status Laporan'. Di sana Anda akan melihat berbagai status seperti: Pending (kuning), Diproses (biru), Analisis AI (ungu), Selesai (hijau), dan Ditolak (merah). Setiap status memiliki warna yang berbeda untuk memudahkan identifikasi.";
    }
    
    if (message.includes('jadwal') || message.includes('maintenance') || message.includes('pemeliharaan')) {
      return "Jadwal pemeliharaan aset dapat dilihat di dashboard utama dalam bentuk kalender interaktif. Anda dapat navigasi antar bulan menggunakan tombol panah atau keyboard shortcut (← →). Tanggal yang memiliki jadwal akan ditandai dengan bintang (★).";
    }
    
    if (message.includes('ai') || message.includes('artificial intelligence')) {
      return "Platform Cakep.id menggunakan teknologi AI untuk menganalisis laporan aset secara otomatis. AI kami dapat mendeteksi pola kerusakan, memprediksi maintenance, dan memberikan rekomendasi tindakan. Semua analisis AI akan divalidasi oleh admin sebelum eksekusi.";
    }
    
    if (message.includes('kamera') || message.includes('foto') || message.includes('camera')) {
      return "Fitur kamera pada platform ini menggunakan teknologi WebRTC untuk akses real-time. Saat mengambil foto laporan, kamera akan membuka dalam mode fullscreen untuk hasil yang optimal. Pastikan browser Anda mengizinkan akses kamera.";
    }
    
    if (message.includes('lokasi') || message.includes('location') || message.includes('gps')) {
      return "Sistem lokasi menggunakan API Geolocation browser dan reverse geocoding untuk mendapatkan alamat lengkap. Lokasi akan terdeteksi otomatis saat membuat laporan, dan Anda dapat melihat posisi di Google Maps melalui link yang disediakan.";
    }
    
    if (message.includes('help') || message.includes('bantuan') || message.includes('cara')) {
      return "Berikut panduan singkat penggunaan platform:\n\n1. **Dashboard**: Lihat laporan terkini dan jadwal pemeliharaan\n2. **Buat Laporan**: Ambil foto, deteksi lokasi, dan buat laporan aset\n3. **Status Laporan**: Pantau progress laporan Anda\n4. **Chatbot**: Tanya apapun tentang platform ini\n\nAda yang ingin Anda pelajari lebih detail?";
    }
    
    return "Terima kasih atas pertanyaan Anda. Sebagai asisten AI Cakep.id, saya siap membantu dengan berbagai hal terkait platform ini seperti cara membuat laporan, memantau status, menggunakan fitur AI, navigasi jadwal pemeliharaan, dan fitur teknis lainnya. Bisa Anda jelaskan lebih spesifik apa yang ingin Anda ketahui?";
  };

  // Copy message to clipboard
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Clear chat
  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      from: "bot",
      text: "Chat telah dibersihkan. Bagaimana saya bisa membantu Anda hari ini?",
      timestamp: new Date()
    }]);
  };

  // New chat
  const newChat = () => {
    const newChatId = Date.now();
    setChatHistory(prev => [...prev, {
      id: newChatId,
      title: "Chat Baru",
      lastMessage: "Memulai percakapan baru..."
    }]);
    setCurrentChatId(newChatId);
    setMessages([{
      id: Date.now(),
      from: "bot",
      text: "Halo! Ini adalah percakapan baru. Bagaimana saya bisa membantu Anda?",
      timestamp: new Date()
    }]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          className="position-fixed rounded-circle shadow-lg"
          style={{
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            background: isDark 
              ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
              : "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
            border: "none",
            zIndex: 1050,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,123,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}
          title="Buka Chat AI"
        >
          <FaRobot size={24} color="white" />
        </Button>
      )}

      {/* Fullscreen Chat Interface */}
      {isOpen && (
        <div 
          className={`position-fixed w-100 h-100 d-flex ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}
          style={{ 
            top: 0, 
            left: 0, 
            zIndex: 2000,
            overflow: "hidden"
          }}
        >
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'd-block' : 'd-none d-md-block'} ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}
        style={{ 
          width: "280px", 
          borderRight: "1px solid",
          position: "relative",
          zIndex: 1000
        }}
      >
        <div className="p-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold">
              <FaRobot className="me-2" />
              Asisten AI
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={newChat}
              title="Chat Baru"
            >
              <FaPlus />
            </Button>
          </div>
          
          <Button
            variant={isDark ? "outline-light" : "outline-dark"}
            size="sm"
            className="w-100"
            onClick={() => setSidebarOpen(false)}
          >
            <FaBars className="me-2" />
            Sembunyikan Menu
          </Button>
        </div>

        <div className="p-3">
          <h6 className="fw-bold mb-3">Riwayat Chat</h6>
          <div className="d-flex flex-column gap-2">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 rounded cursor-pointer ${
                  currentChatId === chat.id 
                    ? (isDark ? 'bg-secondary' : 'bg-primary text-white')
                    : (isDark ? 'bg-secondary bg-opacity-25' : 'bg-light')
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <div className="fw-medium small">{chat.title}</div>
                <div className="text-muted small text-truncate">
                  {chat.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ height: "100vh" }}>
        {/* Header */}
        <div 
          className={`p-3 border-bottom ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}
          style={{ minHeight: "70px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-md-none me-3"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars />
              </Button>
              <div>
                <h5 className="mb-0 fw-bold">Chatbot Cakep.id</h5>
                <small className={isDark ? "text-light" : "text-muted"}>
                  Asisten AI untuk platform manajemen aset
                </small>
              </div>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  size="sm"
                  className="border-0"
                >
                  ⋮
                </Dropdown.Toggle>
                <Dropdown.Menu className={isDark ? "dropdown-menu-dark" : ""}>
                  <Dropdown.Item onClick={clearChat}>
                    <FaTrash className="me-2" />
                    Hapus Chat
                  </Dropdown.Item>
                  <Dropdown.Item onClick={newChat}>
                    <FaPlus className="me-2" />
                    Chat Baru
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              {/* Close Button */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setIsOpen(false)}
                title="Tutup Chat"
              >
                <FaTimes />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-grow-1 overflow-auto p-4"
          style={{ 
            background: isDark ? "#1a1a1a" : "#f8f9fa",
            paddingTop: "90px"
          }}
        >
          <div className="container" style={{ maxWidth: "800px" }}>
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className={`d-flex ${message.from === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div 
                    className={`d-flex gap-3 ${message.from === 'user' ? 'flex-row-reverse' : ''}`}
                    style={{ maxWidth: "85%" }}
                  >
                    {/* Avatar */}
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        message.from === 'user' 
                          ? 'bg-primary text-white' 
                          : (isDark ? 'bg-secondary text-light' : 'bg-light text-dark')
                      }`}
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}
                    >
                      {message.from === 'user' ? <FaUser size={14} /> : <FaRobot size={14} />}
                    </div>

                    {/* Message Content */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <small className={`fw-medium ${isDark ? 'text-light' : 'text-dark'}`}>
                          {message.from === 'user' ? 'Anda' : 'Asisten AI'}
                        </small>
                        <small className="text-muted">
                          {formatTime(message.timestamp)}
                        </small>
                      </div>
                      
                      <div 
                        className={`p-3 rounded ${
                          message.from === 'user'
                            ? 'bg-primary text-white'
                            : (isDark ? 'bg-dark border text-light' : 'bg-white border')
                        }`}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {message.text}
                      </div>
                      
                      {message.from === 'bot' && (
                        <div className="mt-2">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-muted"
                            onClick={() => copyMessage(message.text)}
                            title="Salin pesan"
                          >
                            <FaCopy size={12} className="me-1" />
                            Salin
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="mb-4">
                <div className="d-flex justify-content-start">
                  <div className="d-flex gap-3" style={{ maxWidth: "85%" }}>
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        isDark ? 'bg-secondary text-light' : 'bg-light text-dark'
                      }`}
                      style={{ width: "32px", height: "32px" }}
                    >
                      <FaRobot size={14} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <small className={`fw-medium ${isDark ? 'text-light' : 'text-dark'}`}>
                          Asisten AI
                        </small>
                      </div>
                      <div 
                        className={`p-3 rounded ${isDark ? 'bg-dark border text-light' : 'bg-white border'}`}
                      >
                        <div className="d-flex gap-1">
                          <div className="bg-secondary rounded-circle" style={{width: '8px', height: '8px', animation: 'pulse 1.5s infinite'}}></div>
                          <div className="bg-secondary rounded-circle" style={{width: '8px', height: '8px', animation: 'pulse 1.5s infinite 0.2s'}}></div>
                          <div className="bg-secondary rounded-circle" style={{width: '8px', height: '8px', animation: 'pulse 1.5s infinite 0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div 
          className={`border-top p-3 ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}
        >
          <div className="container" style={{ maxWidth: "800px" }}>
            <Form onSubmit={sendMessage}>
              <InputGroup>
                <Form.Control
                  ref={textareaRef}
                  as="textarea"
                  placeholder="Masukan pertanyaan Anda disini..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  style={{
                    resize: "none",
                    minHeight: "44px",
                    maxHeight: "120px",
                    overflowY: "auto"
                  }}
                  className={isDark ? 'bg-dark text-light border-secondary' : ''}
                />
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={!input.trim() || isTyping}
                >
                  <FaPaperPlane />
                </Button>
              </InputGroup>
            </Form>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 999, top: 0, left: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
        </div>
      )}

      {/* Pulse Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatbotUser;
