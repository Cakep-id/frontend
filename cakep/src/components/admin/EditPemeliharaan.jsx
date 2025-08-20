import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditPemeliharaan = () => {
  // Data assets dummy (bisa diambil dari API)
  const [assetsList] = useState([
    {
      id: 1,
      nama: "Mesin Conveyor 1",
      foto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
      kategori: "Mesin Produksi",
      lokasi: "Pabrik A - Lantai 1",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Panel Listrik Utama",
      foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      kategori: "Elektrikal",
      lokasi: "Pabrik B - Ruang Panel",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Forklift 2",
      foto: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      kategori: "Kendaraan",
      lokasi: "Gudang Utama",
      status: "Aktif",
    },
    {
      id: 4,
      nama: "Kompresor Udara",
      foto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
      kategori: "Utilitas",
      lokasi: "Workshop",
      status: "Aktif",
    },
    {
      id: 5,
      nama: "Generator Backup",
      foto: "https://images.unsplash.com/photo-1565114794697-1513067b4b39?auto=format&fit=crop&w=400&q=80",
      kategori: "Power",
      lokasi: "Ruang Generator",
      status: "Standby",
    },
  ]);

  // Data jadwal pemeliharaan (simulasi dari AI generate + manual edit)
  const [jadwalPemeliharaan, setJadwalPemeliharaan] = useState([
    {
      id: 1,
      assetId: 1,
      tanggal: "2025-08-20",
      jenisPemeliharaan: "Preventive",
      prioritas: "High",
      status: "Terjadwal",
      estimasiDurasi: "4 jam",
      teknisi: "Tim A",
      catatan: "Penggantian sabuk conveyor sesuai jadwal rutin",
      isAIGenerated: true,
      lastModified: "2025-08-15",
      modifiedBy: "AI System",
      prosedur: "Matikan mesin, lepas sabuk lama, pasang sabuk baru, cek kelancaran."
    },
    {
      id: 2,
      assetId: 2,
      tanggal: "2025-08-22",
      jenisPemeliharaan: "Corrective",
      prioritas: "Medium",
      status: "Terjadwal",
      estimasiDurasi: "2 jam",
      teknisi: "Tim B",
      catatan: "Perbaikan MCB yang mengalami warning",
      isAIGenerated: true,
      lastModified: "2025-08-16",
      modifiedBy: "AI System",
      prosedur: "Pastikan tidak ada arus, buka panel, cek MCB, ganti jika perlu."
    },
    {
      id: 3,
      assetId: 3,
      tanggal: "2025-08-25",
      jenisPemeliharaan: "Preventive",
      prioritas: "Low",
      status: "Terjadwal",
      estimasiDurasi: "3 jam",
      teknisi: "Tim A",
      catatan: "Service berkala forklift",
      isAIGenerated: false,
      lastModified: "2025-08-17",
      modifiedBy: "Admin User",
      prosedur: "Parkir di area servis, cek oli, ganti oli, cek rem."
    },
    {
      id: 4,
      assetId: 1,
      tanggal: "2025-09-15",
      jenisPemeliharaan: "Preventive",
      prioritas: "Medium",
      status: "Draft",
      estimasiDurasi: "3 jam",
      teknisi: "Tim C",
      catatan: "Pembersihan rutin conveyor",
      isAIGenerated: true,
      lastModified: "2025-08-18",
      modifiedBy: "AI System",
      prosedur: "Matikan mesin, bersihkan sabuk dan roller, lumasi bearing."
    },
  ]);

  // State untuk tema
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || 'light';
  });
  const isDark = theme === 'dark';

  // State untuk modal dan form
  const [showModal, setShowModal] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const [formData, setFormData] = useState({
    assetId: '',
    tanggal: new Date(),
    jenisPemeliharaan: 'Preventive',
    prioritas: 'Medium',
    status: 'Terjadwal',
    estimasiDurasi: '',
    teknisi: '',
    catatan: '',
    prosedur: ''
  });

  // State untuk filter
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPrioritas, setFilterPrioritas] = useState('all');
  const [filterAI, setFilterAI] = useState('all');
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

  // Fungsi untuk mendapatkan nama asset
  const getAssetName = (assetId) => {
    const asset = assetsList.find(a => a.id === assetId);
    return asset ? asset.nama : 'Unknown Asset';
  };

  // Fungsi untuk mendapatkan data asset
  const getAsset = (assetId) => {
    return assetsList.find(a => a.id === assetId);
  };

  // Fungsi untuk filter jadwal
  const filteredJadwal = jadwalPemeliharaan.filter(jadwal => {
    const matchesStatus = filterStatus === 'all' || jadwal.status === filterStatus;
    const matchesPrioritas = filterPrioritas === 'all' || jadwal.prioritas === filterPrioritas;
    const matchesAI = filterAI === 'all' || 
      (filterAI === 'ai' && jadwal.isAIGenerated) || 
      (filterAI === 'manual' && !jadwal.isAIGenerated);
    const matchesSearch = searchTerm === '' || 
      getAssetName(jadwal.assetId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      jadwal.catatan.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPrioritas && matchesAI && matchesSearch;
  });

  // Fungsi untuk handle edit
  const handleEdit = (jadwal) => {
    setEditingJadwal(jadwal);
    setFormData({
      assetId: jadwal.assetId,
      tanggal: new Date(jadwal.tanggal),
      jenisPemeliharaan: jadwal.jenisPemeliharaan,
      prioritas: jadwal.prioritas,
      status: jadwal.status,
      estimasiDurasi: jadwal.estimasiDurasi,
      teknisi: jadwal.teknisi,
      catatan: jadwal.catatan,
      prosedur: jadwal.prosedur
    });
    setShowModal(true);
  };

  // Fungsi untuk handle tambah baru
  const handleAdd = () => {
    setEditingJadwal(null);
    setFormData({
      assetId: '',
      tanggal: new Date(),
      jenisPemeliharaan: 'Preventive',
      prioritas: 'Medium',
      status: 'Terjadwal',
      estimasiDurasi: '',
      teknisi: '',
      catatan: '',
      prosedur: ''
    });
    setShowModal(true);
  };

  // Fungsi untuk save jadwal
  const handleSave = () => {
    const now = new Date().toISOString().split('T')[0];
    
    if (editingJadwal) {
      // Update existing
      setJadwalPemeliharaan(prev => prev.map(jadwal => 
        jadwal.id === editingJadwal.id 
          ? {
              ...jadwal,
              ...formData,
              tanggal: formData.tanggal.toISOString().split('T')[0],
              lastModified: now,
              modifiedBy: 'Admin User',
              isAIGenerated: false // Setelah di-edit manual, mark as manual
            }
          : jadwal
      ));
    } else {
      // Add new
      const newJadwal = {
        id: Math.max(...jadwalPemeliharaan.map(j => j.id)) + 1,
        ...formData,
        tanggal: formData.tanggal.toISOString().split('T')[0],
        lastModified: now,
        modifiedBy: 'Admin User',
        isAIGenerated: false
      };
      setJadwalPemeliharaan(prev => [...prev, newJadwal]);
    }
    
    setShowModal(false);
  };

  // Fungsi untuk delete
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setJadwalPemeliharaan(prev => prev.filter(jadwal => jadwal.id !== id));
    }
  };

  // Konfigurasi warna untuk prioritas
  const prioritasConfig = {
    High: { bg: 'danger', text: 'white' },
    Medium: { bg: 'warning', text: 'dark' },
    Low: { bg: 'success', text: 'white' }
  };

  // Konfigurasi warna untuk status
  const statusConfig = {
    'Terjadwal': { bg: 'primary', text: 'white' },
    'Sedang Berjalan': { bg: 'info', text: 'white' },
    'Selesai': { bg: 'success', text: 'white' },
    'Ditunda': { bg: 'warning', text: 'dark' },
    'Draft': { bg: 'secondary', text: 'white' }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: isDark ? "#23272f" : "#f7f8fa",
      paddingTop: "80px"
    }}>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className={`fw-bold ${isDark ? "text-light" : "text-dark"}`}>
            Edit Pemeliharaan Asset
          </h2>
          <Button variant="primary" onClick={handleAdd}>
            <i className="fas fa-plus me-2"></i>
            Tambah Jadwal Baru
          </Button>
        </div>

        {/* Filter Section */}
        <Card className={`mb-4 shadow-sm ${isDark ? "bg-dark text-light" : ""}`}>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Status</Form.Label>
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="all">Semua Status</option>
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditunda">Ditunda</option>
                    <option value="Draft">Draft</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Prioritas</Form.Label>
                  <Form.Select 
                    value={filterPrioritas} 
                    onChange={(e) => setFilterPrioritas(e.target.value)}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="all">Semua Prioritas</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Sumber</Form.Label>
                  <Form.Select 
                    value={filterAI} 
                    onChange={(e) => setFilterAI(e.target.value)}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="all">Semua Sumber</option>
                    <option value="ai">AI Generated</option>
                    <option value="manual">Manual</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Cari Asset</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Cari nama asset..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabel Jadwal */}
        <Card className={`shadow-sm ${isDark ? "bg-dark text-light" : ""}`}>
          <Card.Body>
            <div className="table-responsive">
              <Table hover className={isDark ? "table-dark" : ""}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Prioritas</th>
                    <th>Status</th>
                    <th>Teknisi</th>
                    <th>Sumber</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJadwal.map((jadwal) => {
                    const asset = getAsset(jadwal.assetId);
                    return (
                      <tr key={jadwal.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={asset?.foto} 
                              alt={asset?.nama}
                              style={{ width: 40, height: 40, borderRadius: 6, marginRight: 10 }}
                            />
                            <div>
                              <div className="fw-semibold">{getAssetName(jadwal.assetId)}</div>
                              <small className="text-muted">{asset?.lokasi}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{new Date(jadwal.tanggal).toLocaleDateString('id-ID')}</div>
                          <small className="text-muted">{jadwal.estimasiDurasi}</small>
                        </td>
                        <td>{jadwal.jenisPemeliharaan}</td>
                        <td>
                          <Badge bg={prioritasConfig[jadwal.prioritas].bg}>
                            {jadwal.prioritas}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={statusConfig[jadwal.status].bg}>
                            {jadwal.status}
                          </Badge>
                        </td>
                        <td>{jadwal.teknisi}</td>
                        <td>
                          <Badge bg={jadwal.isAIGenerated ? "info" : "secondary"}>
                            {jadwal.isAIGenerated ? "AI Generated" : "Manual"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEdit(jadwal)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(jadwal.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            
            {filteredJadwal.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Tidak ada jadwal pemeliharaan ditemukan</h5>
                <p className="text-muted">Coba ubah filter atau tambah jadwal baru</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal Edit/Add */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        className={isDark ? "modal-dark" : ""}
      >
        <Modal.Header closeButton className={isDark ? "bg-dark text-light border-secondary" : ""}>
          <Modal.Title>
            {editingJadwal ? 'Edit Jadwal Pemeliharaan' : 'Tambah Jadwal Pemeliharaan'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Asset</Form.Label>
                  <Form.Select 
                    value={formData.assetId} 
                    onChange={(e) => setFormData({...formData, assetId: parseInt(e.target.value)})}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="">Pilih Asset</option>
                    {assetsList.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.nama}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Pemeliharaan</Form.Label>
                  <DatePicker
                    selected={formData.tanggal}
                    onChange={(date) => setFormData({...formData, tanggal: date})}
                    dateFormat="dd/MM/yyyy"
                    className={`form-control ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                    minDate={new Date()}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jenis Pemeliharaan</Form.Label>
                  <Form.Select 
                    value={formData.jenisPemeliharaan} 
                    onChange={(e) => setFormData({...formData, jenisPemeliharaan: e.target.value})}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Predictive">Predictive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prioritas</Form.Label>
                  <Form.Select 
                    value={formData.prioritas} 
                    onChange={(e) => setFormData({...formData, prioritas: e.target.value})}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditunda">Ditunda</option>
                    <option value="Draft">Draft</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimasi Durasi</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="contoh: 2 jam"
                    value={formData.estimasiDurasi}
                    onChange={(e) => setFormData({...formData, estimasiDurasi: e.target.value})}
                    className={isDark ? "bg-dark text-light border-secondary" : ""}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Teknisi</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Nama teknisi atau tim"
                value={formData.teknisi}
                onChange={(e) => setFormData({...formData, teknisi: e.target.value})}
                className={isDark ? "bg-dark text-light border-secondary" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Catatan</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                placeholder="Catatan atau deskripsi pemeliharaan"
                value={formData.catatan}
                onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                className={isDark ? "bg-dark text-light border-secondary" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prosedur Pemeliharaan</Form.Label>
              <Form.Control 
                as="textarea"
                rows={4}
                placeholder="Langkah-langkah prosedur pemeliharaan"
                value={formData.prosedur}
                onChange={(e) => setFormData({...formData, prosedur: e.target.value})}
                className={isDark ? "bg-dark text-light border-secondary" : ""}
              />
            </Form.Group>

            {editingJadwal?.isAIGenerated && (
              <div className={`alert ${isDark ? "alert-info" : "alert-info"}`}>
                <i className="fas fa-info-circle me-2"></i>
                <strong>Info:</strong> Jadwal ini originally dibuat oleh AI. Setelah Anda edit, status akan berubah menjadi "Manual".
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!formData.assetId || !formData.teknisi || !formData.catatan}
          >
            {editingJadwal ? 'Update' : 'Simpan'}
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
        .react-datepicker__input-container input {
          background: ${isDark ? '#2b3035' : '#fff'};
          color: ${isDark ? '#fff' : '#000'};
          border: 1px solid ${isDark ? '#495057' : '#ced4da'};
        }
      `}</style>
    </div>
  );
};

export default EditPemeliharaan;
