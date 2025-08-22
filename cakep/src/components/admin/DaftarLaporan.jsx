import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";

const DaftarLaporan = () => {
  // Data dummy laporan untuk admin dengan enhanced AI integration
  const [laporanList, setLaporanList] = useState([
    {
      id: 1,
      foto: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Mesin Conveyor 1",
      aiDetected: true,
      approved: false,
      tanggal: "2025-08-10",
      lokasi: "Pabrik A - Lantai 1",
      deskripsi: "Mesin conveyor mengalami masalah pada bagian sabuk yang sudah mulai kendor",
      pelapor: "John Doe",
      prioritas: "high",
      riskScore: 0.89,
      riskCategory: "high",
      confidenceScore: 0.94,
      aiAnalysis: "AI mendeteksi kerusakan KRITIS pada sabuk conveyor dengan confidence 94%. Risk assessment: HIGH (89%). Deteksi: belt_loose, vibration_abnormal. Rekomendasi: SEGERA lakukan penggantian sabuk dalam 24 jam.",
      cvDetections: [
        { label: "belt_loose", confidence: 0.89, bbox: { x: 120, y: 80, width: 150, height: 100 } },
        { label: "vibration_abnormal", confidence: 0.82, bbox: { x: 200, y: 150, width: 80, height: 60 } }
      ],
      maintenanceRecommendation: "Scheduled maintenance: Belt replacement + bearing inspection",
      estimatedCost: "Rp 2,500,000",
      urgencyLevel: "critical",
      riwayat: [
        { tanggal: "2024-01-10", tindakan: "Penggantian sabuk conveyor" },
        { tanggal: "2024-03-15", tindakan: "Pembersihan rutin" },
      ],
      tempat: "Pabrik A - Lantai 1",
      prosedur: "Matikan mesin, lepas sabuk lama, pasang sabuk baru, cek kelancaran."
    },
    {
      id: 2,
      foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Panel Listrik Utama",
      aiDetected: true,
      approved: true,
      tanggal: "2025-08-12",
      lokasi: "Pabrik B - Ruang Panel",
      deskripsi: "Panel listrik menunjukkan indikator warning pada MCB utama",
      pelapor: "Jane Smith",
      prioritas: "medium",
      riskScore: 0.65,
      riskCategory: "medium",
      confidenceScore: 0.91,
      aiAnalysis: "AI mengidentifikasi masalah SEDANG pada MCB dengan confidence 91%. Risk assessment: MEDIUM (65%). Deteksi: mcb_warning, heat_signature. Status: APPROVED untuk perbaikan.",
      cvDetections: [
        { label: "mcb_warning", confidence: 0.91, bbox: { x: 50, y: 40, width: 100, height: 80 } },
        { label: "heat_signature", confidence: 0.73, bbox: { x: 80, y: 120, width: 60, height: 40 } }
      ],
      maintenanceRecommendation: "MCB replacement + thermal inspection",
      estimatedCost: "Rp 1,200,000",
      urgencyLevel: "moderate",
      riwayat: [
        { tanggal: "2024-02-20", tindakan: "Penggantian MCB" },
        { tanggal: "2024-04-01", tindakan: "Pengecekan kabel" },
      ],
      tempat: "Pabrik B - Ruang Panel",
      prosedur: "Pastikan tidak ada arus, buka panel, cek MCB, ganti jika perlu."
    },
    {
      id: 3,
      foto: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Forklift 2",
      aiDetected: false,
      approved: false,
      tanggal: "2025-08-13",
      lokasi: "Gudang Utama",
      deskripsi: "Forklift mengalami penurunan performa dan suara tidak normal pada mesin",
      pelapor: "Mike Johnson",
      prioritas: "low",
      riskScore: null,
      riskCategory: "pending",
      confidenceScore: null,
      aiAnalysis: "⏳ Sedang dalam proses analisis AI... Estimasi selesai dalam 5 menit.",
      cvDetections: [],
      maintenanceRecommendation: "Pending AI analysis",
      estimatedCost: "TBD",
      urgencyLevel: "low",
      riwayat: [
        { tanggal: "2024-03-05", tindakan: "Penggantian oli" },
        { tanggal: "2024-05-10", tindakan: "Pengecekan rem" },
      ],
      tempat: "Gudang Utama",
      prosedur: "Parkir di area servis, cek oli, ganti oli, cek rem."
    },
    {
      id: 4,
      foto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Kompresor Udara",
      aiDetected: true,
      approved: true,
      tanggal: "2025-08-14",
      lokasi: "Workshop",
      deskripsi: "Kompresor udara telah diperbaiki dan berfungsi normal kembali",
      pelapor: "Sarah Wilson",
      prioritas: "medium",
      riskScore: 0.35,
      riskCategory: "low",
      confidenceScore: 0.87,
      aiAnalysis: "AI mengkonfirmasi perbaikan BERHASIL dengan confidence 87%. Risk assessment: LOW (35%). Status: COMPLETED. Prediksi maintenance berikutnya: 3 bulan.",
      cvDetections: [
        { label: "normal_operation", confidence: 0.87, bbox: { x: 100, y: 60, width: 180, height: 120 } },
        { label: "pressure_optimal", confidence: 0.93, bbox: { x: 200, y: 80, width: 80, height: 60 } }
      ],
      maintenanceRecommendation: "Routine maintenance in 3 months",
      estimatedCost: "Rp 0 (Completed)",
      urgencyLevel: "none",
      riwayat: [
        { tanggal: "2024-04-15", tindakan: "Service berkala" },
        { tanggal: "2024-06-20", tindakan: "Penggantian filter" },
      ],
      tempat: "Workshop",
      prosedur: "Cek tekanan, bersihkan filter, tes fungsi kompresor.",
      aiAnalysis: "AI mendeteksi kerusakan minor pada filter dengan tingkat kepercayaan 76%. Status: Telah disetujui dan diperbaiki."
    },
    {
      id: 5,
      foto: "https://images.unsplash.com/photo-1565114794697-1513067b4b39?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Generator Backup",
      aiDetected: true,
      approved: false,
      tanggal: "2025-08-09",
      lokasi: "Ruang Generator",
      deskripsi: "Laporan tidak valid - generator berfungsi normal",
      pelapor: "David Brown",
      prioritas: "low",
      riwayat: [
        { tanggal: "2024-01-25", tindakan: "Maintenance rutin" },
        { tanggal: "2024-05-30", tindakan: "Test backup system" },
      ],
      tempat: "Ruang Generator",
      prosedur: "Tes sistem backup, cek fuel level, monitor performance.",
      aiAnalysis: "AI tidak mendeteksi masalah signifikan. Confidence: 92%. Kemungkinan false alarm."
    }
  ]);

  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");
  const [filterAI, setFilterAI] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || 'light';
  });
  
  const isDark = theme === 'dark';

  // Sync dengan localStorage theme
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

  // Konfigurasi warna untuk risk level dengan kontras yang lebih baik
  const riskConfig = {
    high: { 
      color: "#ffffff", 
      bgColor: "#dc3545", 
      label: "High Risk",
      textColor: "white"
    },
    medium: { 
      color: "#ffffff", 
      bgColor: "#fd7e14", 
      label: "Medium Risk",
      textColor: "white"
    },
    low: { 
      color: "#ffffff", 
      bgColor: "#198754", 
      label: "Low Risk",
      textColor: "white"
    }
  };

  // Filter laporan
  const filteredLaporan = laporanList.filter(laporan => {
    const aiMatch = filterAI === "all" || 
      (filterAI === "detected" && laporan.aiDetected) ||
      (filterAI === "not-detected" && !laporan.aiDetected);
    const approvalMatch = filterApproval === "all" || 
      (filterApproval === "approved" && laporan.approved) ||
      (filterApproval === "not-approved" && !laporan.approved);
    const searchMatch = searchTerm === "" || 
      laporan.namaAssets.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laporan.pelapor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laporan.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    return aiMatch && approvalMatch && searchMatch;
  });

  // Approve laporan
  const approveLaporan = (id) => {
    setLaporanList(prev => 
      prev.map(laporan => 
        laporan.id === id ? { ...laporan, approved: true } : laporan
      )
    );
  };

  const formatTanggal = (dateStr) => {
    const options = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  return (
    <div 
      className={`container-fluid py-4 px-4 ${isDark ? 'bg-dark text-light' : 'bg-light'}`}
      style={{
        minHeight: "100vh",
        paddingTop: "90px",
        background: isDark ? "#23272f" : "#f7f8fa"
      }}
    >
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className={`fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>
              Daftar Laporan
            </h4>
            
            {/* Search Bar */}
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                type="text"
                placeholder="Cari laporan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isDark ? 'bg-dark text-light border-secondary' : ''}
                style={{ width: "250px" }}
              />
              
              {/* Filter Controls */}
              <Form.Select 
                size="sm" 
                value={filterAI} 
                onChange={(e) => setFilterAI(e.target.value)}
                className={isDark ? 'bg-dark text-light border-secondary' : ''}
                style={{ width: "160px" }}
              >
                <option value="all">Semua Status AI</option>
                <option value="detected">AI Terdeteksi</option>
                <option value="not-detected">Belum Terdeteksi</option>
              </Form.Select>
              
              <Form.Select 
                size="sm" 
                value={filterApproval} 
                onChange={(e) => setFilterApproval(e.target.value)}
                className={isDark ? 'bg-dark text-light border-secondary' : ''}
                style={{ width: "160px" }}
              >
                <option value="all">Semua Approval</option>
                <option value="approved">Sudah Disetujui</option>
                <option value="not-approved">Belum Disetujui</option>
              </Form.Select>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-primary">🤖 {laporanList.filter(l => l.aiDetected).length}</h5>
                  <small>AI Terdeteksi</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-warning">⏳ {laporanList.filter(l => !l.aiDetected).length}</h5>
                  <small>Belum Terdeteksi</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-success">✅ {laporanList.filter(l => l.approved).length}</h5>
                  <small>Disetujui</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-danger">⏸️ {laporanList.filter(l => !l.approved).length}</h5>
                  <small>Belum Disetujui</small>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Laporan Table */}
          <Card className={`shadow-sm ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
            <Card.Body>
              <Table responsive striped bordered hover variant={isDark ? "dark" : undefined}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Asset</th>
                    <th>Pelapor</th>
                    <th>Tanggal</th>
                    <th>🤖 AI Analysis</th>
                    <th>Risk Score</th>
                    <th>CV Detection</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporan.map((laporan) => (
                    <tr key={laporan.id}>
                      <td>#{laporan.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={laporan.foto} 
                            alt={laporan.namaAssets}
                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }}
                          />
                          <div>
                            <div className="fw-bold">{laporan.namaAssets}</div>
                            <small className="text-muted">{laporan.lokasi}</small>
                          </div>
                        </div>
                      </td>
                      <td>{laporan.pelapor}</td>
                      <td>{formatTanggal(laporan.tanggal)}</td>
                      <td>
                        {laporan.aiDetected ? (
                          <div>
                            <Badge bg="success" className="mb-1">
                              ✅ AI Analyzed
                            </Badge>
                            {laporan.confidenceScore && (
                              <div>
                                <small className="text-muted">
                                  Confidence: {Math.round(laporan.confidenceScore * 100)}%
                                </small>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge bg="warning">⏳ Processing</Badge>
                        )}
                      </td>
                      <td>
                        {laporan.riskScore ? (
                          <div>
                            <Badge 
                              bg={laporan.riskCategory === 'high' ? 'danger' : 
                                  laporan.riskCategory === 'medium' ? 'warning' : 'success'}
                              className="mb-1"
                            >
                              {laporan.riskCategory?.toUpperCase()}
                            </Badge>
                            <div>
                              <small className="text-muted">
                                {Math.round(laporan.riskScore * 100)}%
                              </small>
                            </div>
                          </div>
                        ) : (
                          <Badge bg="secondary">Pending</Badge>
                        )}
                      </td>
                      <td>
                        {laporan.cvDetections && laporan.cvDetections.length > 0 ? (
                          <div>
                            <Badge bg="info" className="mb-1">
                              👁️ {laporan.cvDetections.length} detections
                            </Badge>
                            <div>
                              <small className="text-muted">
                                {laporan.cvDetections[0].label.replace('_', ' ')}
                                {laporan.cvDetections.length > 1 && ' +more'}
                              </small>
                            </div>
                          </div>
                        ) : (
                          <Badge bg="secondary">No CV data</Badge>
                        )}
                      </td>
                      <td>
                        {laporan.approved ? (
                          <Badge bg="success">
                            ✅ Disetujui
                          </Badge>
                        ) : (
                          <Badge bg="secondary">
                            ⏸️ Pending
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedLaporan(laporan);
                              setActiveTab("detail");
                              setShowModal(true);
                            }}
                          >
                            Detail
                          </Button>
                          
                          {laporan.aiDetected && !laporan.approved && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => approveLaporan(laporan.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modal Detail Laporan */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header 
          closeButton 
          className={isDark ? "bg-dark text-light border-secondary" : ""}
        >
          <Modal.Title>Detail Laporan #{selectedLaporan?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          {selectedLaporan && (
            <>
              {/* Tab Navigation */}
              <div className="mb-3">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${activeTab === "detail" ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-primary"}`}
                    onClick={() => setActiveTab("detail")}
                  >
                    Detail Laporan
                  </button>
                  <button
                    type="button"
                    className={`btn ${activeTab === "riwayat" ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-primary"}`}
                    onClick={() => setActiveTab("riwayat")}
                  >
                    Riwayat
                  </button>
                  <button
                    type="button"
                    className={`btn ${activeTab === "prosedur" ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-primary"}`}
                    onClick={() => setActiveTab("prosedur")}
                  >
                    Prosedur
                  </button>
                  <button
                    type="button"
                    className={`btn ${activeTab === "ai-analysis" ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-primary"}`}
                    onClick={() => setActiveTab("ai-analysis")}
                  >
                    🤖 AI Analysis
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "detail" && (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <img 
                        src={selectedLaporan.foto} 
                        alt={selectedLaporan.namaAssets}
                        className="img-fluid rounded"
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h5 className="fw-bold mb-3">{selectedLaporan.namaAssets}</h5>
                      
                      <div className="mb-2">
                        <strong>Pelapor:</strong> {selectedLaporan.pelapor}
                      </div>
                      
                      <div className="mb-2">
                        <strong>AI Detection:</strong>
                        {selectedLaporan.aiDetected ? (
                          <Badge bg="success" className="ms-2">
                            🤖 Terdeteksi AI
                          </Badge>
                        ) : (
                          <Badge bg="warning" className="ms-2">
                            ⏳ Proses AI
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mb-2">
                        <strong>Status Approval:</strong>
                        {selectedLaporan.approved ? (
                          <Badge bg="success" className="ms-2">
                            ✅ Disetujui
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="ms-2">
                            ⏸️ Pending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mb-2">
                        <strong>Risk Level:</strong>
                        <Badge 
                          className="ms-2"
                          style={{ 
                            backgroundColor: riskConfig[selectedLaporan.prioritas].bgColor,
                            color: riskConfig[selectedLaporan.prioritas].color
                          }}
                        >
                          {riskConfig[selectedLaporan.prioritas].label}
                        </Badge>
                      </div>
                      
                      <div className="mb-2">
                        <strong>Tanggal:</strong> {formatTanggal(selectedLaporan.tanggal)}
                      </div>
                      
                      <div className="mb-3">
                        <strong>Lokasi:</strong> {selectedLaporan.lokasi}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Deskripsi:</h6>
                    <p className={isDark ? "text-light" : "text-dark"}>
                      {selectedLaporan.deskripsi}
                    </p>
                  </div>

                  {selectedLaporan.aiDetected && (
                    <div className="mb-3">
                      <h6 className="fw-bold mb-2">Analisis AI:</h6>
                      <div className={`p-3 rounded ${isDark ? 'bg-secondary' : 'bg-light'}`}>
                        <p className={isDark ? "text-light mb-0" : "text-dark mb-0"}>
                          {selectedLaporan.aiAnalysis}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "riwayat" && (
                <div>
                  <h6 className="fw-bold mb-3">Riwayat Pemeliharaan Asset</h6>
                  {selectedLaporan.riwayat && selectedLaporan.riwayat.length > 0 ? (
                    <div className="list-group">
                      {selectedLaporan.riwayat.map((item, index) => (
                        <div key={index} className={`list-group-item ${isDark ? 'bg-dark text-light border-secondary' : ''}`}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{item.tindakan}</h6>
                              <small className={isDark ? 'text-light' : 'text-muted'}>
                                {formatTanggal(item.tanggal)}
                              </small>
                            </div>
                            <Badge bg="success">Selesai</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={isDark ? "text-light" : "text-muted"}>
                      Belum ada riwayat pemeliharaan untuk asset ini.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "prosedur" && (
                <div>
                  <h6 className="fw-bold mb-3">Prosedur Pemeliharaan</h6>
                  <div className={`p-3 rounded ${isDark ? 'bg-secondary' : 'bg-light'}`}>
                    <h6 className="fw-bold">Lokasi:</h6>
                    <p className="mb-3">{selectedLaporan.tempat}</p>
                    
                    <h6 className="fw-bold">Langkah-langkah:</h6>
                    <p className="mb-0">{selectedLaporan.prosedur}</p>
                  </div>
                </div>
              )}

              {activeTab === "ai-analysis" && (
                <div>
                  <h6 className="fw-bold mb-3">🤖 AI Analysis & Recommendations</h6>
                  
                  {/* AI Analysis Summary */}
                  <Card className={`mb-3 ${isDark ? 'bg-secondary' : 'bg-light'}`}>
                    <Card.Body>
                      <h6 className="fw-bold mb-2">Analysis Summary</h6>
                      <p className="mb-0">{selectedLaporan.aiAnalysis}</p>
                    </Card.Body>
                  </Card>

                  {/* Risk Assessment */}
                  {selectedLaporan.riskScore && (
                    <Row className="mb-3">
                      <Col md={4}>
                        <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                          <Card.Body>
                            <h5 className="text-danger">{Math.round(selectedLaporan.riskScore * 100)}%</h5>
                            <small>Risk Score</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                          <Card.Body>
                            <Badge 
                              bg={selectedLaporan.riskCategory === 'high' ? 'danger' : 
                                  selectedLaporan.riskCategory === 'medium' ? 'warning' : 'success'}
                              className="h6"
                            >
                              {selectedLaporan.riskCategory?.toUpperCase()}
                            </Badge>
                            <div><small>Risk Category</small></div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                          <Card.Body>
                            <h5 className="text-success">{Math.round(selectedLaporan.confidenceScore * 100)}%</h5>
                            <small>AI Confidence</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  )}

                  {/* Computer Vision Detections */}
                  {selectedLaporan.cvDetections && selectedLaporan.cvDetections.length > 0 && (
                    <Card className={`mb-3 ${isDark ? 'bg-secondary' : 'bg-light'}`}>
                      <Card.Body>
                        <h6 className="fw-bold mb-3">👁️ Computer Vision Detection Results</h6>
                        <Table size="sm" className={isDark ? 'table-dark' : ''}>
                          <thead>
                            <tr>
                              <th>Detection Type</th>
                              <th>Confidence</th>
                              <th>Location (x, y, w, h)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedLaporan.cvDetections.map((detection, index) => (
                              <tr key={index}>
                                <td>
                                  <Badge bg="info">{detection.label.replace('_', ' ')}</Badge>
                                </td>
                                <td>{Math.round(detection.confidence * 100)}%</td>
                                <td>
                                  ({detection.bbox.x}, {detection.bbox.y}, {detection.bbox.width}, {detection.bbox.height})
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Maintenance Recommendations */}
                  {selectedLaporan.maintenanceRecommendation && (
                    <Card className={`mb-3 ${isDark ? 'bg-secondary' : 'bg-light'}`}>
                      <Card.Body>
                        <h6 className="fw-bold mb-2">🔧 Maintenance Recommendation</h6>
                        <p className="mb-2">{selectedLaporan.maintenanceRecommendation}</p>
                        
                        <Row>
                          <Col md={6}>
                            <strong>Estimated Cost:</strong> {selectedLaporan.estimatedCost}
                          </Col>
                          <Col md={6}>
                            <strong>Urgency Level:</strong> 
                            <Badge 
                              bg={selectedLaporan.urgencyLevel === 'critical' ? 'danger' : 
                                  selectedLaporan.urgencyLevel === 'moderate' ? 'warning' : 
                                  selectedLaporan.urgencyLevel === 'low' ? 'info' : 'success'}
                              className="ms-2"
                            >
                              {selectedLaporan.urgencyLevel}
                            </Badge>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )}

                  {/* AI Training Feedback */}
                  <Card className={`${isDark ? 'bg-secondary' : 'bg-light'}`}>
                    <Card.Body>
                      <h6 className="fw-bold mb-2">🎯 Feedback for AI Training</h6>
                      <p className="text-muted mb-2">Help improve AI accuracy by providing feedback on this analysis:</p>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="success">
                          👍 Accurate Analysis
                        </Button>
                        <Button size="sm" variant="warning">
                          ⚠️ Partially Correct
                        </Button>
                        <Button size="sm" variant="danger">
                          👎 Incorrect Analysis
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
          {selectedLaporan && selectedLaporan.aiDetected && !selectedLaporan.approved && (
            <Button 
              variant="success" 
              onClick={() => {
                approveLaporan(selectedLaporan.id);
                setShowModal(false);
              }}
            >
              Approve Laporan
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DaftarLaporan;
