import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Container, Modal, Table } from 'react-bootstrap';

function DatasetManager() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || 'light';
  });
  
  const isDark = theme === 'dark';
  
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      name: "Generator Training Set v1.2",
      description: "Dataset untuk deteksi kerusakan generator",
      category: "Generator",
      uploadDate: "2025-08-15",
      status: "approved",
      totalImages: 1250,
      approvedImages: 1180,
      rejectedImages: 70,
      accuracy: 94.2
    },
    {
      id: 2,
      name: "HVAC System Dataset v2.0",
      description: "Dataset komprehensif untuk sistem HVAC",
      category: "HVAC",
      uploadDate: "2025-08-10",
      status: "pending",
      totalImages: 850,
      approvedImages: 0,
      rejectedImages: 0,
      accuracy: null
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleApprove = (id) => {
    setDatasets(prev => 
      prev.map(dataset => 
        dataset.id === id 
          ? { 
              ...dataset, 
              status: 'approved', 
              approvedImages: dataset.totalImages,
              accuracy: Math.floor(Math.random() * 20) + 80
            }
          : dataset
      )
    );
    setMessage('Dataset telah disetujui');
  };

  const handleReject = (id) => {
    setDatasets(prev => 
      prev.map(dataset => 
        dataset.id === id 
          ? { 
              ...dataset, 
              status: 'rejected',
              rejectedImages: dataset.totalImages
            }
          : dataset
      )
    );
    setMessage('Dataset telah ditolak');
  };

  return (
    <Container fluid 
      className={`py-4 px-4 ${isDark ? 'bg-dark text-light' : 'bg-light'}`} 
      style={{ minHeight: "100vh", paddingTop: "90px", background: isDark ? "#23272f" : "#f7f8fa" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">🗂️ Dataset Manager</h2>
          <p className={`mb-0 ${isDark ? 'text-light' : 'text-muted'}`}>
            Kelola dataset untuk training AI detection model
          </p>
        </div>
        <Button 
          variant={isDark ? "outline-light" : "primary"}
          onClick={() => setShowUploadModal(true)}
          className="fw-medium"
        >
          📤 Upload Dataset
        </Button>
      </div>

      {message && (
        <Alert 
          variant={message.includes('berhasil') || message.includes('disetujui') ? 'success' : 'info'} 
          dismissible 
          onClose={() => setMessage('')}
          className="mb-4"
        >
          {message}
        </Alert>
      )}

      <Card className={`${isDark ? 'bg-secondary text-light' : 'bg-white'} border-0 shadow-sm`}>
        <Card.Header className={`${isDark ? 'bg-dark border-secondary' : 'bg-light border-light'} fw-bold`}>
          📊 Dataset List
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive className={`mb-0 ${isDark ? 'table-dark' : ''}`}>
            <thead className={isDark ? 'table-dark' : 'table-light'}>
              <tr>
                <th>Dataset Name</th>
                <th>Category</th>
                <th>Images</th>
                <th>Status</th>
                <th>Accuracy</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset) => (
                <tr key={dataset.id}>
                  <td>
                    <div>
                      <div className="fw-bold">{dataset.name}</div>
                      <small className={isDark ? 'text-light' : 'text-muted'}>
                        {dataset.description}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info" className="fw-normal">
                      {dataset.category}
                    </Badge>
                  </td>
                  <td>
                    <div>
                      <div className="fw-bold">{dataset.totalImages}</div>
                      {dataset.status === 'approved' && (
                        <small className="text-success">
                          ✓ {dataset.approvedImages} approved
                        </small>
                      )}
                      {dataset.status === 'rejected' && (
                        <small className="text-danger">
                          ✗ {dataset.rejectedImages} rejected
                        </small>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(dataset.status)}</td>
                  <td>
                    {dataset.accuracy ? (
                      <span className="text-success fw-bold">
                        {dataset.accuracy}%
                      </span>
                    ) : (
                      <span className={isDark ? 'text-light' : 'text-muted'}>-</span>
                    )}
                  </td>
                  <td>{formatDate(dataset.uploadDate)}</td>
                  <td>
                    {dataset.status === 'pending' && (
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleApprove(dataset.id)}
                          title="Approve"
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleReject(dataset.id)}
                          title="Reject"
                        >
                          ✗
                        </Button>
                      </div>
                    )}
                    {dataset.status !== 'pending' && (
                      <Button
                        size="sm"
                        variant={isDark ? "outline-light" : "outline-secondary"}
                        disabled
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg" centered>
        <Modal.Header closeButton className={isDark ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>📤 Upload New Dataset</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
          <p>Upload dataset functionality coming soon...</p>
        </Modal.Body>
        <Modal.Footer className={isDark ? 'bg-dark border-secondary' : ''}>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant={isDark ? "light" : "primary"} disabled>
            Upload Dataset
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DatasetManager;
