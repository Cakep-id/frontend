import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";

const TrainingData = () => {
  // State untuk tema
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || 'light';
  });
  const isDark = theme === 'dark';

  // State untuk data training
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State untuk modal dan form
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [formData, setFormData] = useState({
    category: 'faq',
    question: '',
    answer: ''
  });

  // State untuk filter
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync tema dengan localStorage
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

  // Load data training saat komponen dimount
  useEffect(() => {
    // Menggunakan data statis instead of API call
    setTrainingData([
      {
        id: 1,
        category: 'faq',
        question: 'Apa itu Cakep.id?',
        answer: 'Cakep.id adalah platform manajemen aset migas berbasis AI yang membantu dalam monitoring, pemeliharaan, dan analisis risiko aset industri.',
        created_at: '2025-08-20T10:00:00Z'
      },
      {
        id: 2,
        category: 'faq',
        question: 'Bagaimana cara melaporkan kerusakan aset?',
        answer: 'Anda dapat melaporkan kerusakan melalui menu "Buat Laporan" di dashboard user. Upload foto, isi deskripsi, dan sistem AI akan menganalisis tingkat risiko.',
        created_at: '2025-08-20T10:15:00Z'
      },
      {
        id: 3,
        category: 'assistant',
        question: 'Tolong analisis foto kerusakan ini',
        answer: 'Saya akan menganalisis foto yang Anda berikan. Berdasarkan analisis AI, saya dapat memberikan assessment tingkat risiko dan rekomendasi tindakan.',
        created_at: '2025-08-20T10:30:00Z'
      },
      {
        id: 4,
        category: 'faq',
        question: 'Apa saja fitur utama platform ini?',
        answer: 'Fitur utama meliputi: AI Vision untuk deteksi kerusakan, Dashboard interaktif, Jadwal pemeliharaan otomatis, Analisis risiko, Riwayat kerusakan, dan Multi-user management.',
        created_at: '2025-08-20T11:00:00Z'
      },
      {
        id: 5,
        category: 'assistant',
        question: 'Buatkan jadwal pemeliharaan untuk conveyor',
        answer: 'Berdasarkan data historis dan kondisi aset, saya akan membuat jadwal pemeliharaan preventif untuk conveyor Anda dengan interval optimal.',
        created_at: '2025-08-20T11:15:00Z'
      }
    ]);
    setLoading(false);
  }, []);

  // Fungsi untuk filter data
  const filteredData = trainingData.filter(data => {
    const matchesCategory = filterCategory === 'all' || data.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      data.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Fungsi untuk handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Pertanyaan dan jawaban harus diisi');
      return;
    }

    setLoading(true);
    
    // Simulasi API call - menggunakan data statis
    try {
      if (editingData) {
        setTrainingData(prev => prev.map(item => 
          item.id === editingData.id 
            ? { ...item, ...formData }
            : item
        ));
        setSuccess('Data berhasil diupdate');
      } else {
        const newData = {
          id: Math.max(...trainingData.map(d => d.id), 0) + 1,
          ...formData,
          created_at: new Date().toISOString()
        };
        setTrainingData(prev => [...prev, newData]);
        setSuccess('Data berhasil ditambahkan');
      }
      setShowModal(false);
      setFormData({ category: 'faq', question: '', answer: '' });
      setEditingData(null);
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };  // Fungsi untuk handle edit
  const handleEdit = (data) => {
    setEditingData(data);
    setFormData({
      category: data.category,
      question: data.question,
      answer: data.answer
    });
    setShowModal(true);
  };

  // Fungsi untuk handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    setLoading(true);
    try {
      // Simulasi API call - menggunakan data statis
      setTrainingData(prev => prev.filter(item => item.id !== id));
      setSuccess('Data berhasil dihapus');
    } catch (error) {
      console.error('Error deleting data:', error);
      setError('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk handle tambah baru
  const handleAdd = () => {
    setEditingData(null);
    setFormData({ category: 'faq', question: '', answer: '' });
    setShowModal(true);
  };

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: isDark ? "#23272f" : "#f7f8fa",
      paddingTop: "80px"
    }}>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className={`fw-bold ${isDark ? "text-light" : "text-dark"}`}>
              Training Data Chatbot
            </h2>
            <p className={`mb-0 ${isDark ? "text-light" : "text-muted"}`}>
              Kelola data pelatihan untuk chatbot FAQ dan Assistant
            </p>
          </div>
          <Button variant="primary" onClick={handleAdd} disabled={loading}>
            <i className="fas fa-plus me-2"></i>
            Tambah Data Training
          </Button>
        </div>

        {/* Alert Messages */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            <i className="fas fa-check-circle me-2"></i>
            {success}
          </Alert>
        )}

        {/* Filter Section */}
        <Card className={`mb-4 shadow-sm ${isDark ? "bg-dark text-light" : ""}`}>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filter Kategori</Form.Label>
                  <Form.Select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="faq">FAQ Chatbot</option>
                    <option value="assistant">Assistant Chatbot</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Cari Pertanyaan/Jawaban</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Ketik untuk mencari..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className={`text-center ${isDark ? "bg-dark text-light border-secondary" : ""}`}>
              <Card.Body>
                <div className="display-6 text-primary mb-2">
                  <i className="fas fa-database"></i>
                </div>
                <h5 className="text-primary">{trainingData.length}</h5>
                <p className="mb-0">Total Training Data</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className={`text-center ${isDark ? "bg-dark text-light border-secondary" : ""}`}>
              <Card.Body>
                <div className="display-6 text-info mb-2">
                  <i className="fas fa-question-circle"></i>
                </div>
                <h5 className="text-info">
                  {trainingData.filter(d => d.category === 'faq').length}
                </h5>
                <p className="mb-0">FAQ Data</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className={`text-center ${isDark ? "bg-dark text-light border-secondary" : ""}`}>
              <Card.Body>
                <div className="display-6 text-success mb-2">
                  <i className="fas fa-robot"></i>
                </div>
                <h5 className="text-success">
                  {trainingData.filter(d => d.category === 'assistant').length}
                </h5>
                <p className="mb-0">Assistant Data</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabel Training Data */}
        <Card className={`shadow-sm ${isDark ? "bg-dark text-light" : ""}`}>
          <Card.Body>
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Memuat data...</p>
              </div>
            )}

            {!loading && (
              <div className="table-responsive">
                <Table hover className={isDark ? "table-dark" : ""}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kategori</th>
                      <th>Pertanyaan</th>
                      <th>Jawaban</th>
                      <th>Dibuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((data) => (
                      <tr key={data.id}>
                        <td>{data.id}</td>
                        <td>
                          <Badge bg={data.category === 'faq' ? 'info' : 'success'}>
                            {data.category === 'faq' ? 'FAQ' : 'Assistant'}
                          </Badge>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            <div className="fw-semibold">{data.question}</div>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '400px' }}>
                            <div className="text-truncate">{data.answer}</div>
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(data.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEdit(data)}
                              disabled={loading}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(data.id)}
                              disabled={loading}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
            {!loading && filteredData.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Tidak ada data ditemukan</h5>
                <p className="text-muted">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Coba ubah filter atau kata kunci pencarian'
                    : 'Belum ada data training. Tambahkan data pertama Anda!'
                  }
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal Add/Edit */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        className={isDark ? "modal-dark" : ""}
      >
        <Modal.Header closeButton className={isDark ? "bg-dark text-light border-secondary" : ""}>
          <Modal.Title>
            {editingData ? 'Edit Training Data' : 'Tambah Training Data'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kategori Chatbot</Form.Label>
              <Form.Select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={isDark ? "bg-dark text-light border-secondary" : ""}
              >
                <option value="faq">FAQ Chatbot</option>
                <option value="assistant">Assistant Chatbot</option>
              </Form.Select>
              <Form.Text className="text-muted">
                FAQ untuk pertanyaan umum, Assistant untuk bantuan interaktif
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pertanyaan</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                placeholder="Masukkan pertanyaan yang mungkin ditanyakan user..."
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className={isDark ? "bg-dark text-light border-secondary" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Jawaban</Form.Label>
              <Form.Control 
                as="textarea"
                rows={5}
                placeholder="Masukkan jawaban yang sesuai untuk pertanyaan di atas..."
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                className={isDark ? "bg-dark text-light border-secondary" : ""}
              />
            </Form.Group>

            <div className={`alert ${isDark ? "alert-info" : "alert-info"}`}>
              <i className="fas fa-info-circle me-2"></i>
              <strong>Tips:</strong> Buatlah pertanyaan dan jawaban yang jelas dan natural. 
              AI akan menggunakan data ini untuk memberikan respons yang relevan kepada user.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={loading || !formData.question.trim() || !formData.answer.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Menyimpan...
              </>
            ) : (
              editingData ? 'Update' : 'Simpan'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .modal-dark .modal-content {
          background-color: #2b3035;
          color: #fff;
        }
        .modal-dark .btn-close {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
};

export default TrainingData;
