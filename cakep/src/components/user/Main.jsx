import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";

// Dummy data laporan
const laporanList = [
  {
    id: 1,
    nama: "Mesin Conveyor 1",
    foto: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    riwayat: [
      { tanggal: "2024-01-10", tindakan: "Penggantian sabuk conveyor" },
      { tanggal: "2024-03-15", tindakan: "Pembersihan rutin" },
    ],
    status: "high",
    tempat: "Pabrik A - Lantai 1",
    prosedur: "Matikan mesin, lepas sabuk lama, pasang sabuk baru, cek kelancaran.",
  },
  {
    id: 2,
    nama: "Panel Listrik Utama",
    foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    riwayat: [
      { tanggal: "2024-02-20", tindakan: "Penggantian MCB" },
      { tanggal: "2024-04-01", tindakan: "Pengecekan kabel" },
    ],
    status: "medium",
    tempat: "Pabrik B - Ruang Panel",
    prosedur: "Pastikan tidak ada arus, buka panel, cek MCB, ganti jika perlu.",
  },
  {
    id: 3,
    nama: "Forklift 2",
    foto: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    riwayat: [
      { tanggal: "2024-03-05", tindakan: "Penggantian oli" },
      { tanggal: "2024-05-10", tindakan: "Pengecekan rem" },
    ],
    status: "low",
    tempat: "Gudang Utama",
    prosedur: "Parkir di area servis, cek oli, ganti oli, cek rem.",
  },
];

// Dummy data jadwal pemeliharaan dengan lebih banyak data
const jadwal = [
  { date: "2025-08-16", assets: [laporanList[0]] },
  { date: "2025-08-18", assets: [laporanList[1], laporanList[2]] },
  { date: "2025-09-05", assets: [laporanList[0], laporanList[2]] },
  { date: "2025-09-12", assets: [laporanList[1]] },
  { date: "2025-10-03", assets: [laporanList[0]] },
  { date: "2025-10-15", assets: [laporanList[1], laporanList[2]] },
  { date: "2025-11-08", assets: [laporanList[2]] },
  { date: "2025-12-20", assets: [laporanList[0], laporanList[1]] },
  { date: "2026-01-10", assets: [laporanList[1]] },
  { date: "2026-02-14", assets: [laporanList[0], laporanList[2]] },
  { date: "2026-03-22", assets: [laporanList[1], laporanList[2]] },
];

const statusColor = {
  high: "#e74c3c",
  medium: "#f39c12",
  low: "#f7ca18",
};

const statusLabel = {
  high: "High Risk",
  medium: "Medium Risk",
  low: "Low Risk",
};

function exportTableToPDF(title, tableId) {
  // Placeholder: Integrasi jsPDF/autoTable di sini jika ingin PDF beneran
  alert("Export PDF: " + title);
}

const getPreferredTheme = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  if (stored === 'dark' || stored === 'light') return stored;
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const Main = () => {
  const [showRiwayat, setShowRiwayat] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [selectedKalender, setSelectedKalender] = useState(null);
  const [theme, setTheme] = useState(getPreferredTheme());
  const isDark = theme === "dark";

  // State untuk navigasi kalender
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Fungsi navigasi kalender
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

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

  // Keyboard shortcuts untuk navigasi kalender
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hanya jika tidak ada modal yang terbuka
      if (!showRiwayat && !showDetail && !selectedKalender) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPreviousMonth();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNextMonth();
        } else if (e.key === 'Home') {
          e.preventDefault();
          goToToday();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showRiwayat, showDetail, selectedKalender, currentMonth, currentYear]);

  // Kalender dengan navigasi
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Nama bulan dalam bahasa Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Tanggal yang ada jadwal
  const jadwalDates = jadwal.map(j => j.date);

  // Fungsi cek apakah tanggal ada jadwal
  const isJadwal = (dateStr) => jadwalDates.includes(dateStr);

  // Fungsi ambil assets di tanggal tertentu
  const getAssetsByDate = (dateStr) => {
    const found = jadwal.find(j => j.date === dateStr);
    return found ? found.assets : [];
  };

  return (
    <div
      className={`container-fluid py-4 px-4 main-bg-${isDark ? "dark" : "light"}`}
      style={{
        minHeight: "100vh",
        background: isDark ? "#23272f" : "#f7f8fa",
        transition: "background 0.3s",
        paddingTop: "90px"
      }}
    >
      <div className="row g-4">
        {/* Kolom Kiri: Laporan Terkini */}
        <div className="col-lg-7 mb-4">
          <h4 className={`fw-bold mb-3 ${isDark ? "text-light" : "text-dark"}`}>Laporan Terkini</h4>
          <div className="row g-4">
            {laporanList.map((laporan) => (
              <div className="col-12 col-sm-6" key={laporan.id}>
                <div className={`custom-card shadow-sm ${isDark ? "custom-card-dark" : ""}`}>
                  <div className="custom-card-img">
                    <img
                      src={laporan.foto}
                      alt={laporan.nama}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        background: "#e0e0e0",
                        borderRadius: "8px 8px 0 0"
                      }}
                    />
                  </div>
                  <div className="custom-card-body">
                    <div className="custom-card-title">{laporan.nama}</div>
                    <div className="custom-card-actions">
                      <button className="custom-link" onClick={() => setShowRiwayat(laporan)}>
                        Riwayat
                      </button>
                      <span
                        className="custom-status"
                        style={{
                          color: "#fff",
                          background: statusColor[laporan.status],
                          borderRadius: 4,
                          padding: "2px 10px",
                          fontSize: 13,
                          fontWeight: 600,
                          margin: "0 8px"
                        }}
                      >
                        {statusLabel[laporan.status]}
                      </span>
                      <button className="custom-link" onClick={() => setShowDetail(laporan)}>
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Kalender Pemeliharaan */}
        <div className="col-lg-5 mb-4">
          <h4 className={`fw-bold mb-3 ${isDark ? "text-light" : "text-dark"}`}>Jadwal Pemeliharaan Aset</h4>
          <div className={`card shadow-sm p-3 ${isDark ? "calendar-dark" : ""}`}>
            <div className="calendar-table mb-2">
              {/* Header kalender dengan navigasi */}
              <div className={`d-flex justify-content-between align-items-center mb-3 ${isDark ? "text-light" : ""}`}>
                <Button
                  variant={isDark ? "outline-light" : "outline-secondary"}
                  size="sm"
                  onClick={goToPreviousMonth}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  &#8249;
                </Button>
                <div className="text-center flex-grow-1">
                  <div className="fw-bold" style={{ fontSize: '16px' }}>
                    {monthNames[currentMonth]} {currentYear}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={goToToday}
                    className={`p-0 ${isDark ? "text-light" : "text-primary"}`}
                    style={{ fontSize: '11px', textDecoration: 'none' }}
                  >
                    Hari Ini
                  </Button>
                </div>
                <Button
                  variant={isDark ? "outline-light" : "outline-secondary"}
                  size="sm"
                  onClick={goToNextMonth}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  &#8250;
                </Button>
              </div>
              <table className={`table table-bordered text-center mb-0 ${isDark ? "table-dark" : ""}`}>
                <thead>
                  <tr>
                    <th>M</th><th>S</th><th>S</th><th>R</th><th>K</th><th>J</th><th>S</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1; // Senin = 0
                    let rows = [];
                    let cells = [];
                    let day = 1;
                    for (let i = 0; i < 6; i++) {
                      cells = [];
                      for (let j = 0; j < 7; j++) {
                        if ((i === 0 && j < firstDayAdjusted) || day > daysInMonth) {
                          cells.push(<td key={j} style={{ color: isDark ? "#666" : "#ccc" }}></td>);
                        } else {
                          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const hasJadwal = isJadwal(dateStr);
                          const isToday = 
                            day === today.getDate() && 
                            currentMonth === today.getMonth() && 
                            currentYear === today.getFullYear();
                          
                          cells.push(
                            <td
                              key={j}
                              style={{
                                background: hasJadwal ? "#ffe082" : (isToday ? (isDark ? "#444" : "#e3f2fd") : undefined),
                                cursor: hasJadwal ? "pointer" : "default",
                                border: hasJadwal ? "2px solid #fbc02d" : (isToday ? `2px solid ${isDark ? "#666" : "#2196f3"}` : undefined),
                                fontWeight: hasJadwal || isToday ? 700 : 400,
                                color: isDark ? "#fff" : undefined,
                                position: "relative"
                              }}
                              onClick={() => hasJadwal && setSelectedKalender({ date: dateStr, assets: getAssetsByDate(dateStr) })}
                            >
                              {day}
                              {hasJadwal && <span style={{ color: "#fbc02d", fontSize: 18, marginLeft: 4 }}>★</span>}
                              {isToday && !hasJadwal && (
                                <div style={{
                                  position: "absolute",
                                  bottom: "2px",
                                  right: "2px",
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  background: isDark ? "#64b5f6" : "#2196f3"
                                }}></div>
                              )}
                            </td>
                          );
                          day++;
                        }
                      }
                      rows.push(<tr key={i}>{cells}</tr>);
                      if (day > daysInMonth) break; // Hentikan jika sudah selesai
                    }
                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
            <div className={`small ${isDark ? "text-light" : "text-muted"}`}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  Klik tanggal yang bertanda <span style={{ color: "#fbc02d" }}>★</span> untuk detail jadwal.
                </span>
                <span className="fw-bold">
                  {(() => {
                    const currentMonthSchedules = jadwal.filter(j => {
                      const scheduleDate = new Date(j.date);
                      return scheduleDate.getMonth() === currentMonth && scheduleDate.getFullYear() === currentYear;
                    });
                    return `${currentMonthSchedules.length} jadwal`;
                  })()}
                </span>
              </div>
              <div className="mt-1" style={{ fontSize: '10px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: isDark ? "#64b5f6" : "#2196f3",
                  marginRight: '4px'
                }}></span>
                Hari ini
                <span className="ms-3" style={{ opacity: 0.7 }}>
                  Navigasi: ← → (bulan), Home (hari ini)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Riwayat */}
      <Modal show={!!showRiwayat} onHide={() => setShowRiwayat(null)} centered size="lg">
        <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
          <Modal.Title>Riwayat Perbaikan - {showRiwayat?.nama}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          <div className="d-flex gap-4 align-items-center mb-3">
            <img src={showRiwayat?.foto} alt={showRiwayat?.nama} style={{ width: 120, borderRadius: 8 }} />
            <div>
              <div className="fw-semibold">{showRiwayat?.nama}</div>
            </div>
          </div>
          <Table striped bordered hover id="riwayat-table" variant={isDark ? "dark" : undefined}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {showRiwayat?.riwayat.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.tanggal}</td>
                  <td>{r.tindakan}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-danger" className="me-2" onClick={() => exportTableToPDF("Riwayat Perbaikan", "riwayat-table")}>
            Export PDF
          </Button>
          <Button variant="secondary" onClick={() => setShowRiwayat(null)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal Detail */}
      <Modal show={!!showDetail} onHide={() => setShowDetail(null)} centered>
        <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
          <Modal.Title>Detail Asset - {showDetail?.nama}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          <div className="d-flex gap-4 align-items-center mb-3">
            <img src={showDetail?.foto} alt={showDetail?.nama} style={{ width: 120, borderRadius: 8 }} />
            <div>
              <div className="fw-semibold">{showDetail?.nama}</div>
              <div className="text-muted small">{showDetail?.tempat}</div>
            </div>
          </div>
          <div>
            <div className="fw-semibold mb-2">Prosedur Perbaikan:</div>
            <div className="mb-3">{showDetail?.prosedur}</div>
          </div>
          <Button variant="outline-danger" className="me-2" onClick={() => exportTableToPDF("Detail Asset", "detail-table")}>
            Export PDF
          </Button>
          <Button variant="secondary" onClick={() => setShowDetail(null)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal Kalender */}
      <Modal show={!!selectedKalender} onHide={() => setSelectedKalender(null)} centered>
        <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
          <Modal.Title>Jadwal Pemeliharaan - {selectedKalender?.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          {selectedKalender?.assets.map((asset, idx) => (
            <div key={idx} className="mb-3">
              <div className="fw-semibold">{asset.nama}</div>
              <img src={asset.foto} alt={asset.nama} style={{ width: 100, borderRadius: 6, marginBottom: 6 }} />
              <div className="text-muted small">{asset.tempat}</div>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      <style>{`
        .main-bg-dark {
          background: #23272f !important;
        }
        .main-bg-light {
          background: #f7f8fa !important;
        }
        .custom-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          overflow: hidden;
          min-height: 210px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0;
          transition: background 0.3s;
        }
        .custom-card-dark {
          background: #23272f !important;
          color: #fff;
          border: 1px solid #444;
        }
        .custom-card-title {
          font-weight: 600;
          font-size: 1.08rem;
          margin-bottom: 6px;
          text-align: center;
        }
        .custom-card-body {
          width: 100%;
          padding: 12px 10px 10px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .custom-card-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          justify-content: center;
          width: 100%;
        }
        .custom-link {
          background: none;
          border: none;
          color: #333;
          font-size: 14px;
          font-family: 'Courier New', Courier, monospace;
          cursor: pointer;
          padding: 0 4px;
          text-decoration: underline;
        }
        .custom-card-dark .custom-link {
          color: #fff;
        }
        .custom-link:hover {
          color: #1976d2;
        }
        .custom-card-dark .custom-link:hover {
          color: #90caf9;
        }
        .custom-status {
          font-family: 'Courier New', Courier, monospace;
          letter-spacing: 0.5px;
        }
        .calendar-dark {
          background: #23272f !important;
          color: #fff;
          border: 1px solid #444;
        }
        .calendar-dark .table,
        .calendar-dark .table-bordered {
          background: #23272f !important;
          color: #fff;
        }
        .calendar-dark th,
        .calendar-dark td {
          background: #23272f !important;
          color: #fff !important;
          border-color: #444 !important;
        }
        .calendar-dark .small {
          color: #bbb !important;
        }
      `}</style>
    </div>
  );
};

export default Main;