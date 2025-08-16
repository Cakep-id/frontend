import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { useEffect, useState } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Main = () => {
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

  // Data statistik dummy
  const stats = {
    totalLaporan: 156,
    laporanMasuk: 23,
    aiTerdeteksi: 89,
    disetujui: 67,
    totalUser: 45,
    laporanHariIni: 8
  };

  // Data laporan terbaru
  const laporanTerbaru = [
    {
      id: 1,
      asset: "Mesin Conveyor 1",
      pelapor: "John Doe",
      aiDetected: true,
      approved: false,
      waktu: "2 jam yang lalu"
    },
    {
      id: 2,
      asset: "Panel Listrik",
      pelapor: "Jane Smith",
      aiDetected: true,
      approved: true,
      waktu: "4 jam yang lalu"
    },
    {
      id: 3,
      asset: "Forklift Unit 2",
      pelapor: "Mike Johnson",
      aiDetected: false,
      approved: false,
      waktu: "6 jam yang lalu"
    },
    {
      id: 4,
      asset: "Kompresor Udara",
      pelapor: "Sarah Wilson",
      aiDetected: true,
      approved: true,
      waktu: "1 hari yang lalu"
    }
  ];

  // Data untuk chart trend laporan
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Laporan',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'AI Terdeteksi',
        data: [8, 15, 12, 20, 18, 25, 23],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#ffffff' : '#000000'
        }
      },
      title: {
        display: true,
        text: 'Trend Laporan Bulanan',
        color: isDark ? '#ffffff' : '#000000'
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? '#ffffff' : '#000000'
        },
        grid: {
          color: isDark ? '#444444' : '#e0e0e0'
        }
      },
      y: {
        ticks: {
          color: isDark ? '#ffffff' : '#000000'
        },
        grid: {
          color: isDark ? '#444444' : '#e0e0e0'
        }
      }
    }
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
            Dashboard Admin
          </h4>
          
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                <Card.Body className="text-center">
                  <div className="display-4 text-primary mb-2">📊</div>
                  <h5 className="text-primary">{stats.totalLaporan}</h5>
                  <p className="mb-0">Total Laporan</p>
                  <small className="text-success">Semua laporan yang masuk</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-3">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                <Card.Body className="text-center">
                  <div className="display-4 text-warning mb-2">📥</div>
                  <h5 className="text-warning">{stats.laporanMasuk}</h5>
                  <p className="mb-0">Laporan Masuk</p>
                  <small className="text-muted">Hari ini</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-3">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                <Card.Body className="text-center">
                  <div className="display-4 text-info mb-2">🤖</div>
                  <h5 className="text-info">{stats.aiTerdeteksi}</h5>
                  <p className="mb-0">AI Terdeteksi</p>
                  <small className="text-muted">Berhasil dianalisis AI</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-3">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                <Card.Body className="text-center">
                  <div className="display-4 text-success mb-2">✅</div>
                  <h5 className="text-success">{stats.disetujui}</h5>
                  <p className="mb-0">Disetujui</p>
                  <small className="text-success">Laporan yang disetujui</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Chart and Recent Reports */}
          <Row className="mb-4">
            <Col md={8} className="mb-4">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Header className={isDark ? 'bg-dark border-secondary' : ''}>
                  <h6 className="mb-0 fw-bold">Trend Laporan</h6>
                </Card.Header>
                <Card.Body>
                  <Line data={chartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Header className={isDark ? 'bg-dark border-secondary' : ''}>
                  <h6 className="mb-0 fw-bold">Status AI & Approval</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>🤖 AI Terdeteksi</span>
                      <Badge bg="success">{stats.aiTerdeteksi}</Badge>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${(stats.aiTerdeteksi / stats.totalLaporan) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>✅ Disetujui</span>
                      <Badge bg="primary">{stats.disetujui}</Badge>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${(stats.disetujui / stats.totalLaporan) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Reports */}
          <Row>
            <Col md={12} className="mb-4">
              <Card className={`h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Header className={isDark ? 'bg-dark border-secondary' : ''}>
                  <h6 className="mb-0 fw-bold">Laporan Terbaru</h6>
                </Card.Header>
                <Card.Body>
                  {laporanTerbaru.map((laporan) => (
                    <div key={laporan.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <div className="fw-bold">{laporan.asset}</div>
                        <small className={isDark ? 'text-light' : 'text-muted'}>
                          Dilaporkan oleh: {laporan.pelapor}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="mb-1">
                          {laporan.aiDetected ? (
                            <Badge bg="success">🤖 AI Terdeteksi</Badge>
                          ) : (
                            <Badge bg="warning">⏳ Proses AI</Badge>
                          )}
                          {laporan.approved ? (
                            <Badge bg="primary" className="ms-1">✅ Disetujui</Badge>
                          ) : (
                            <Badge bg="secondary" className="ms-1">⏸️ Pending</Badge>
                          )}
                        </div>
                        <small className="text-muted">{laporan.waktu}</small>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-3">
                    <a href="/admin/daftar-laporan" className="btn btn-outline-primary btn-sm">
                      Lihat Semua Laporan
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Main;
