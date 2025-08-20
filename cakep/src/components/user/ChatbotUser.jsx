import { useEffect, useRef, useState } from "react";
import { Badge, Button, Dropdown, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaBars, FaCopy, FaExclamationTriangle, FaPaperPlane, FaPlus, FaRobot, FaTimes, FaTrash, FaUser } from "react-icons/fa";

const ChatbotUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Selamat datang di chatbot Cakep.id! Saya adalah asisten AI yang siap membantu Anda dengan berbagai pertanyaan teknis mengenai platform ini. Silahkan tanya apapun yang ingin Anda ketahui!",
      timestamp: new Date(),
      confidence: 1.0,
      source: "system"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    { 
      id: 1, 
      title: "Chat Baru", 
      lastMessage: "Selamat datang di chatbot...",
      category: "assistant",
      messages: [
        {
          id: 1,
          from: "bot",
          text: "Selamat datang di chatbot Cakep.id! Saya adalah asisten AI yang siap membantu Anda dengan berbagai pertanyaan teknis mengenai platform ini. Silahkan tanya apapun yang ingin Anda ketahui!",
          timestamp: new Date(),
          confidence: 1.0,
          source: "system"
        }
      ]
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [chatMode, setChatMode] = useState("assistant"); // "faq" or "assistant"
  const [apiError, setApiError] = useState(null);
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

  // Send message to API
  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const newMessage = {
      id: Date.now(),
      from: "user",
      text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setApiError(null);

    // Update chat history with new message
    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: updatedMessages, lastMessage: text, category: chatMode }
          : chat
      )
    );

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Call backend API
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          category: chatMode
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: data.response,
        timestamp: new Date(),
        confidence: data.confidence || 0,
        source: data.source || 'api',
        matchedQuestion: data.matched_question,
        dataId: data.data_id
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Update chat history with bot response
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages, lastMessage: botMessage.text.substring(0, 50) + "..." }
            : chat
        )
      );

    } catch (error) {
      console.error('Chat API Error:', error);
      setApiError(error.message);
      
      // Fallback to static response
      const fallbackResponse = getFallbackResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: fallbackResponse,
        timestamp: new Date(),
        confidence: 0.5,
        source: 'fallback'
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages, lastMessage: botMessage.text.substring(0, 50) + "..." }
            : chat
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  // Fallback response when API is not available
  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (chatMode === 'faq') {
      if (message.includes('cakep') || message.includes('platform')) {
        return "Cakep.id adalah platform manajemen aset migas berbasis AI yang membantu dalam monitoring, pemeliharaan, dan analisis risiko aset industri.";
      }
      
      if (message.includes('laporan') || message.includes('report')) {
        return "Untuk membuat laporan, Anda bisa menggunakan fitur 'Buat Laporan' di dashboard. Fitur ini memungkinkan Anda untuk mengambil foto, mendeteksi lokasi otomatis, dan memberikan deskripsi detail tentang aset yang bermasalah.";
      }
      
      if (message.includes('status') || message.includes('tracking')) {
        return "Anda dapat memantau status laporan melalui halaman 'Status Laporan'. Di sana Anda akan melihat berbagai status seperti: Pending (kuning), Diproses (biru), Analisis AI (ungu), Selesai (hijau), dan Ditolak (merah).";
      }
      
      if (message.includes('jadwal') || message.includes('maintenance') || message.includes('pemeliharaan')) {
        return "Jadwal pemeliharaan aset dapat dilihat di dashboard utama dalam bentuk kalender interaktif. Anda dapat navigasi antar bulan menggunakan tombol panah atau keyboard shortcut (← →).";
      }
    } else {
      // Assistant mode
      if (message.includes('analisis') || message.includes('foto')) {
        return "Saya siap membantu menganalisis foto kerusakan Anda. Silakan upload foto dan saya akan memberikan assessment tingkat risiko serta rekomendasi tindakan.";
      }
      
      if (message.includes('jadwal') || message.includes('pemeliharaan')) {
        return "Saya dapat membantu membuat jadwal pemeliharaan yang optimal berdasarkan kondisi aset dan data historis. Silakan berikan detail aset yang ingin dijadwalkan.";
      }
      
      if (message.includes('bantuan') || message.includes('help')) {
        return "Saya di sini untuk membantu Anda. Saya dapat menganalisis foto kerusakan, membuat jadwal pemeliharaan, memberikan rekomendasi, dan menjawab pertanyaan teknis lainnya.";
      }
    }
    
    return `Terima kasih atas pertanyaan Anda. Saya sedang belajar untuk memberikan jawaban yang lebih baik. Silakan hubungi admin jika Anda memerlukan bantuan lebih lanjut.`;
  };

  // Copy message to clipboard
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Clear chat
  const clearChat = () => {
    const newMessages = [{
      id: Date.now(),
      from: "bot",
      text: "Chat telah dibersihkan. Bagaimana saya bisa membantu Anda hari ini?",
      timestamp: new Date()
    }];
    
    setMessages(newMessages);
    
    // Update chat history
    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: newMessages, lastMessage: "Chat telah dibersihkan..." }
          : chat
      )
    );
  };

  // New chat
  // Create new chat
  const newChat = () => {
    const newChatId = Date.now();
    const modeText = chatMode === 'faq' ? 'FAQ' : 'Assistant';
    const initialMessage = {
      id: Date.now(),
      from: "bot",
      text: `Halo! Saya dalam mode ${modeText}. Bagaimana saya bisa membantu Anda?`,
      timestamp: new Date(),
      confidence: 1.0,
      source: "system"
    };
    
    const newChatData = {
      id: newChatId,
      title: `${modeText} Chat ${chatHistory.length + 1}`,
      lastMessage: "Memulai percakapan baru...",
      category: chatMode,
      messages: [initialMessage]
    };
    
    setChatHistory(prev => [...prev, newChatData]);
    setCurrentChatId(newChatId);
    setMessages([initialMessage]);
  };

  // Switch chat
  const switchChat = (chatId) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages || []);
      setChatMode(selectedChat.category || 'assistant');
    }
  };

  // Change chat mode
  const changeChatMode = (mode) => {
    setChatMode(mode);
    // Update current chat category
    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, category: mode }
          : chat
      )
    );
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
        className={`${sidebarOpen ? 'd-block' : 'd-none'} ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}
        style={{ 
          width: "280px", 
          borderRight: "1px solid",
          position: "relative",
          zIndex: 1000,
          transition: "all 0.3s ease"
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
            <FaTimes className="me-2" />
            Tutup Sidebar
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
                onClick={() => switchChat(chat.id)}
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
                className="me-3"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FaBars />
              </Button>
              <div>
                <h5 className="mb-0 fw-bold">Chatbot Cakep.id</h5>
                <div className="d-flex align-items-center gap-2">
                  <small className={isDark ? "text-light" : "text-muted"}>
                    Asisten AI untuk platform manajemen aset
                  </small>
                  <Badge bg={chatMode === 'faq' ? 'info' : 'success'} className="ms-2">
                    {chatMode === 'faq' ? 'FAQ Mode' : 'Assistant Mode'}
                  </Badge>
                </div>
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
                  <Dropdown.Header>Mode Chatbot</Dropdown.Header>
                  <Dropdown.Item 
                    onClick={() => changeChatMode('faq')}
                    active={chatMode === 'faq'}
                  >
                    <FaRobot className="me-2" />
                    FAQ Mode
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => changeChatMode('assistant')}
                    active={chatMode === 'assistant'}
                  >
                    <FaUser className="me-2" />
                    Assistant Mode
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={clearChat}>
                    <FaTrash className="me-2" />
                    Hapus Chat
                  </Dropdown.Item>
                  <Dropdown.Item onClick={newChat}>
                    <FaPlus className="me-2" />
                    Chat Baru
                  </Dropdown.Item>
                  {apiError && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.ItemText className="text-warning small">
                        <FaExclamationTriangle className="me-1" />
                        API: {apiError}
                      </Dropdown.ItemText>
                    </>
                  )}
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
                        {/* Confidence indicator for bot messages */}
                        {message.from === 'bot' && message.confidence !== undefined && (
                          <Badge 
                            bg={
                              message.confidence >= 0.8 ? 'success' : 
                              message.confidence >= 0.5 ? 'warning' : 'secondary'
                            }
                            className="small"
                          >
                            {message.source === 'knowledge_base' && `${(message.confidence * 100).toFixed(0)}%`}
                            {message.source === 'fallback' && 'Fallback'}
                            {message.source === 'system' && 'System'}
                            {message.source === 'api' && 'API'}
                          </Badge>
                        )}
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
                      
                      {/* Show matched question for knowledge base responses */}
                      {message.from === 'bot' && message.matchedQuestion && message.source === 'knowledge_base' && (
                        <div className="mt-2">
                          <small className="text-muted">
                            💡 Berdasarkan pertanyaan: "{message.matchedQuestion}"
                          </small>
                        </div>
                      )}
                      
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
                        <Badge bg="primary" className="small">
                          {chatMode === 'faq' ? 'FAQ' : 'Assistant'}
                        </Badge>
                      </div>
                      <div 
                        className={`p-3 rounded d-flex align-items-center gap-2 ${isDark ? 'bg-dark border text-light' : 'bg-white border'}`}
                      >
                        <Spinner animation="grow" size="sm" variant="primary" />
                        <span>Sedang memproses...</span>
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
