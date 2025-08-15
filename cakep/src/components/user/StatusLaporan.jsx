import { useEffect, useState } from "react";
import { Badge, Button, Card, Modal } from "react-bootstrap";

const StatusLaporan = () => {
  // Data dummy laporan dengan berbagai status
  const [laporanList] = useState([
    {
      id: 1,
      foto: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Mesin Conveyor 1",
      status: "pending",
      tanggal: "2025-08-10",
      lokasi: "Pabrik A - Lantai 1",
      deskripsi: "Mesin conveyor mengalami masalah pada bagian sabuk yang sudah mulai kendor"
    },
    {
      id: 2,
      foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Panel Listrik Utama",
      status: "diproses",
      tanggal: "2025-08-12",
      lokasi: "Pabrik B - Ruang Panel",
      deskripsi: "Panel listrik menunjukkan indikator warning pada MCB utama"
    },
    {
      id: 3,
      foto: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Forklift 2",
      status: "analisis",
      tanggal: "2025-08-13",
      lokasi: "Gudang Utama",
      deskripsi: "Forklift mengalami penurunan performa dan suara tidak normal pada mesin"
    },
    {
      id: 4,
      foto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Kompresor Udara",
      status: "selesai",
      tanggal: "2025-08-14",
      lokasi: "Workshop",
      deskripsi: "Kompresor udara telah diperbaiki dan berfungsi normal kembali"
    },
    {
      id: 5,
      foto: "https://images.unsplash.com/photo-1565114794697-1513067b4b39?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Generator Backup",
      status: "ditolak",
      tanggal: "2025-08-09",
      lokasi: "Ruang Generator",
      deskripsi: "Laporan tidak valid - generator berfungsi normal"
    },
    {
      id: 6,
      foto: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Crane Overhead",
      status: "pending",
      tanggal: "2025-08-15",
      lokasi: "Area Produksi",
      deskripsi: "Crane mengalami getaran berlebihan saat beroperasi"
    },
    {
      id: 7,
      foto: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Mesin CNC",
      status: "diproses",
      tanggal: "2025-08-11",
      lokasi: "Workshop Presisi",
      deskripsi: "Mesin CNC memerlukan kalibrasi ulang untuk akurasi cutting"
    },
    {
      id: 8,
      foto: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80",
      namaAssets: "Chiller AC",
      status: "analisis",
      tanggal: "2025-08-08",
      lokasi: "Ruang Server",
      deskripsi: "Sistem pendingin chiller tidak mencapai suhu optimal yang diinginkan"
    }
  ]);

  const [selectedLaporan, setSelectedLaporan] = useState(null);
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

  // Konfigurasi warna dan label untuk setiap status
  const statusConfig = {
    pending: {
      color: "#ffc107",
      bgColor: "#fff3cd",
      borderColor: "#ffecb5",
      textColor: "#664d03",
      label: "Pending",
      icon: "⏳"
    },
    diproses: {
      color: "#0dcaf0",
      bgColor: "#cff4fc",
      borderColor: "#b8ecf7",
      textColor: "#055160",
      label: "Diproses",
      icon: "🔄"
    },
    analisis: {
      color: "#6f42c1",
      bgColor: "#e2d9f3",
      borderColor: "#d1c7dd",
      textColor: "#432874",
      label: "Analisis AI",
      icon: "🤖"
    },
    selesai: {
      color: "#198754",
      bgColor: "#d1e7dd",
      borderColor: "#badbcc",
      textColor: "#0f5132",
      label: "Selesai",
      icon: "✅"
    },
    ditolak: {
      color: "#dc3545",
      bgColor: "#f8d7da",
      borderColor: "#f5c2c7",
      textColor: "#721c24",
      label: "Ditolak",
      icon: "❌"
    }
  };

  // Dark mode adjustments
  const getStatusStyle = (status) => {
    const config = statusConfig[status];
    if (isDark) {
      return {
        ...config,
        bgColor: config.color + "20",
        borderColor: config.color + "40",
        textColor: config.color
      };
    }
    return config;
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
          <h4 className={`fw-bold mb-4 ${isDark ? 'text-light' : 'text-dark'}`}>
            Status Laporan
          </h4>
          
          <div className="row g-4">
            {laporanList.map((laporan) => {
              const statusStyle = getStatusStyle(laporan.status);
              
              return (
                <div key={laporan.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <Card 
                    className={`h-100 shadow-sm ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      borderLeft: `4px solid ${statusStyle.color}`
                    }}
                    onClick={() => setSelectedLaporan(laporan)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={laporan.foto} 
                        style={{ 
                          height: "150px", 
                          objectFit: "cover" 
                        }} 
                      />
                      <Badge 
                        className="position-absolute top-0 end-0 m-2"
                        style={{
                          backgroundColor: statusStyle.color,
                          color: isDark ? "#000" : "#fff",
                          fontSize: "0.7rem",
                          padding: "0.4rem 0.8rem"
                        }}
                      >
                        {statusStyle.icon} {statusStyle.label}
                      </Badge>
                    </div>
                    
                    <Card.Body className="d-flex flex-column">
                      <Card.Title 
                        className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`}
                        style={{ fontSize: "1rem" }}
                      >
                        {laporan.namaAssets}
                      </Card.Title>
                      
                      <div className={`small mb-2 ${isDark ? 'text-light' : 'text-muted'}`}>
                        📅 {formatTanggal(laporan.tanggal)}
                      </div>
                      
                      <div className={`small mb-2 ${isDark ? 'text-light' : 'text-muted'}`}>
                        📍 {laporan.lokasi}
                      </div>
                      
                      <Card.Text 
                        className={`small flex-grow-1 ${isDark ? 'text-light' : 'text-muted'}`}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {laporan.deskripsi}
                      </Card.Text>
                      
                      <div className="mt-auto">
                        <div 
                          className="small fw-medium text-center py-2 rounded"
                          style={{
                            backgroundColor: statusStyle.bgColor,
                            color: statusStyle.textColor,
                            border: `1px solid ${statusStyle.borderColor}`
                          }}
                        >
                          {statusStyle.icon} {statusStyle.label}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Detail Laporan */}
      <Modal 
        show={!!selectedLaporan} 
        onHide={() => setSelectedLaporan(null)} 
        centered
        size="lg"
      >
        <Modal.Header 
          closeButton 
          className={isDark ? "bg-dark text-light border-secondary" : ""}
        >
          <Modal.Title>Detail Laporan</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          {selectedLaporan && (
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
                    <strong>Status:</strong>
                    <Badge 
                      className="ms-2"
                      style={{
                        backgroundColor: getStatusStyle(selectedLaporan.status).color,
                        color: isDark ? "#000" : "#fff"
                      }}
                    >
                      {getStatusStyle(selectedLaporan.status).icon} {getStatusStyle(selectedLaporan.status).label}
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
              
              <div>
                <h6 className="fw-bold mb-2">Deskripsi:</h6>
                <p className={isDark ? "text-light" : "text-dark"}>
                  {selectedLaporan.deskripsi}
                </p>
              </div>
              
              {selectedLaporan.status === 'ditolak' && (
                <div className="alert alert-danger">
                  <strong>Alasan Penolakan:</strong> Laporan tidak memenuhi kriteria atau informasi tidak valid.
                </div>
              )}
              
              {selectedLaporan.status === 'selesai' && (
                <div className="alert alert-success">
                  <strong>Tindakan Selesai:</strong> Asset telah diperbaiki dan kembali beroperasi normal.
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
          <Button 
            variant="secondary" 
            onClick={() => setSelectedLaporan(null)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StatusLaporan;
