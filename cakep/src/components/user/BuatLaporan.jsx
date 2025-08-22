import React, { useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const BuatLaporan = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [desc, setDesc] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  // Ambil lokasi otomatis dan reverse geocoding ke alamat
  const handleGetLocation = () => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          
          // Static location mapping for demo purposes
          try {
            // Simulate location lookup with static data
            const staticLocations = [
              "Kilang Minyak Pertamina RU IV Cilacap, Jawa Tengah",
              "Terminal BBM Plumpang, Jakarta Utara",
              "Depot BBM Rewulu, Yogyakarta", 
              "Kilang Gas Bontang, Kalimantan Timur",
              "Terminal LPG Tanjung Priok, Jakarta"
            ];
            
            // Use lat/lng to determine which static location to show
            const locationIndex = Math.floor(Math.abs(lat + lng) * 1000) % staticLocations.length;
            const simulatedLocation = staticLocations[locationIndex];
            
            setLocation(`${simulatedLocation} (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
          } catch {
            setLocation(`${lat}, ${lng}`);
          }
          setLoadingLoc(false);
        },
        () => {
          setLocation("Gagal mendeteksi lokasi");
          setLoadingLoc(false);
        }
      );
    } else {
      setLocation("Geolocation tidak didukung");
      setLoadingLoc(false);
    }
  };

  // Buka kamera (fullscreen)
  const handleOpenCamera = async () => {
    setShowCamera(true);
    setTimeout(async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch {
          setShowCamera(false);
          alert("Tidak bisa mengakses kamera.");
        }
      }
    }, 100);
  };

  // Ambil foto dari kamera
  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/png"));
      setShowCamera(false);
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }
  };

  // Tutup kamera
  const handleCloseCamera = () => {
    setShowCamera(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Submit laporan
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photo || !location || !desc) {
      alert("Semua field wajib diisi!");
      return;
    }
    setShowSuccess(true);
    setPhoto(null);
    setDesc("");
    setLocation("");
    setCoords(null);
  };

  // Ambil lokasi otomatis saat pertama render
  React.useEffect(() => {
    handleGetLocation();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h3 className="mb-4 fw-bold text-center">Buat Laporan</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Ambil Foto</Form.Label>
          <div>
            {photo ? (
              <div className="mb-2">
                <img src={photo} alt="Preview" style={{ width: "100%", borderRadius: 8 }} />
                <Button variant="danger" size="sm" className="mt-2" onClick={() => setPhoto(null)}>
                  Hapus Foto
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={handleOpenCamera}>
                Ambil Foto (Kamera)
              </Button>
            )}
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Lokasi</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <Form.Control type="text" value={location} readOnly />
            <Button variant="outline-primary" size="sm" onClick={handleGetLocation} disabled={loadingLoc}>
              {loadingLoc ? <Spinner size="sm" animation="border" /> : "Refresh"}
            </Button>
          </div>
          {coords && (
            <div className="mt-2">
              <a
                href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13 }}
              >
                Lihat di Google Maps
              </a>
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Deskripsi</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Tuliskan deskripsi laporan..."
            required
          />
        </Form.Group>
        <Button type="submit" variant="success" className="w-100">
          Kirim Laporan
        </Button>
      </Form>

      {/* Modal Kamera Fullscreen */}
      <Modal show={showCamera} onHide={handleCloseCamera} fullscreen centered>
        <Modal.Body className="p-0" style={{ background: "#000" }}>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
            <video ref={videoRef} style={{ width: "100vw", height: "100vh", objectFit: "cover" }} autoPlay playsInline />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Button
              variant="light"
              size="lg"
              className="position-absolute"
              style={{ bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, fontWeight: 700 }}
              onClick={handleTakePhoto}
            >
              Ambil Foto
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="position-absolute"
              style={{ top: 20, right: 20, zIndex: 10 }}
              onClick={handleCloseCamera}
            >
              Tutup
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Sukses */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terima Kasih!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p>Terima kasih sudah melaporkan, laporanmu akan diproses oleh AI dan akan divalidasi oleh admin Cakep.id.</p>
            <Button variant="success" onClick={() => setShowSuccess(false)}>
              Tutup
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BuatLaporan;