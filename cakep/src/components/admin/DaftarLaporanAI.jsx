import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';

const DaftarLaporanAI = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    risk_category: ''
  });

  const statusOptions = ['pending', 'in_progress', 'completed', 'rejected'];
  const severityOptions = ['low', 'medium', 'high', 'critical'];

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await fetch(`http://localhost:5000/api/reports?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setReports(data.data.reports || []);
      } else {
        setMessage('Error loading reports');
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setMessage('Error loading reports');
      // Fallback to mock data for development
      setReports([
        {
          id: 1,
          title: 'Generator Berisik Abnormal',
          description: 'Generator mengeluarkan suara berisik yang tidak normal dan getaran berlebihan',
          severity: 'high',
          status: 'pending',
          asset_name: 'Generator Diesel 100KVA',
          asset_code: 'GEN001',
          reporter_name: 'John Doe',
          reported_at: '2024-01-15T10:30:00Z',
          risk_score: 0.85,
          risk_category: 'high',
          confidence_score: 0.92,
          analysis_summary: 'Analisis AI menunjukkan tingkat risiko TINGGI. Terdeteksi masalah pada bearing engine yang memerlukan penanganan segera.',
          cv_detection: [
            { label: 'oil_leak', confidence: 0.89, bbox: { x: 120, y: 80, width: 150, height: 100 } },
            { label: 'rust', confidence: 0.76, bbox: { x: 200, y: 150, width: 80, height: 60 } }
          ]
        },
        {
          id: 2,
          title: 'AC Tidak Dingin',
          description: 'AC ruang server tidak mengeluarkan udara dingin, compressor mati',
          severity: 'medium',
          status: 'in_progress',
          asset_name: 'AC Central 5PK',
          asset_code: 'AC001',
          reporter_name: 'Jane Smith',
          reported_at: '2024-01-16T14:20:00Z',
          risk_score: 0.62,
          risk_category: 'medium',
          confidence_score: 0.88,
          analysis_summary: 'Kerusakan dengan tingkat risiko SEDANG. Kemungkinan masalah pada compressor atau refrigerant yang memerlukan perbaikan dalam beberapa hari.',
          cv_detection: [
            { label: 'filter_dirty', confidence: 0.94, bbox: { x: 50, y: 40, width: 200, height: 120 } }
          ]
        }
      ]);
    }
    setLoading(false);
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Report status updated successfully!');
        loadReports();
      } else {
        setMessage('Error updating report status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Error updating report status');
    }
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      rejected: 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getSeverityBadgeVariant = (severity) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'dark'
    };
    return variants[severity] || 'secondary';
  };

  const getRiskIndicator = (score, category) => {
    if (!score) return <span className="text-muted">No AI Analysis</span>;
    
    const percentage = Math.round(score * 100);
    const color = score >= 0.8 ? 'danger' : score >= 0.6 ? 'warning' : score >= 0.4 ? 'info' : 'success';
    
    return (
      <div>
        <Badge variant={color}>{category?.toUpperCase()}</Badge>
        <br />
        <small className="text-muted">{percentage}% confidence</small>
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>📋 Daftar Laporan Kerusakan (AI Enhanced)</h2>
          <p className="text-muted">Laporan kerusakan dengan analisis AI Risk Assessment</p>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">
          {message}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Severity</Form.Label>
                <Form.Select
                  value={filters.severity}
                  onChange={(e) => setFilters({...filters, severity: e.target.value})}
                >
                  <option value="">All Severity</option>
                  {severityOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>AI Risk Category</Form.Label>
                <Form.Select
                  value={filters.risk_category}
                  onChange={(e) => setFilters({...filters, risk_category: e.target.value})}
                >
                  <option value="">All Risk Levels</option>
                  {severityOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={loadReports} className="w-100">
                <i className="fas fa-refresh"></i> Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Reports Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading reports...</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Asset</th>
                  <th>Reporter</th>
                  <th>Reported Date</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>AI Risk Assessment</th>
                  <th>CV Detection</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>#{report.id}</td>
                    <td>
                      <strong>{report.title}</strong><br />
                      <small className="text-muted">
                        {report.asset_name} ({report.asset_code})
                      </small>
                    </td>
                    <td>{report.reporter_name}</td>
                    <td>{new Date(report.reported_at).toLocaleDateString()}</td>
                    <td>
                      <Badge variant={getSeverityBadgeVariant(report.severity)}>
                        {report.severity?.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(report.status)}>
                        {report.status?.toUpperCase().replace('_', ' ')}
                      </Badge>
                    </td>
                    <td>
                      {getRiskIndicator(report.risk_score, report.risk_category)}
                    </td>
                    <td>
                      {report.cv_detection && report.cv_detection.length > 0 ? (
                        <div>
                          <Badge variant="info">
                            {report.cv_detection.length} detections
                          </Badge>
                          <br />
                          <small className="text-muted">
                            {report.cv_detection[0].label}
                            {report.cv_detection.length > 1 && ' +more'}
                          </small>
                        </div>
                      ) : (
                        <span className="text-muted">No CV data</span>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleViewDetail(report)}
                      >
                        <i className="fas fa-eye"></i> Detail
                      </Button>
                      
                      {report.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => handleStatusUpdate(report.id, 'in_progress')}
                        >
                          <i className="fas fa-play"></i> Process
                        </Button>
                      )}
                      
                      {report.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleStatusUpdate(report.id, 'completed')}
                        >
                          <i className="fas fa-check"></i> Complete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📋 Detail Laporan & AI Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              {/* Basic Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <h5>{selectedReport.title}</h5>
                  <p><strong>Asset:</strong> {selectedReport.asset_name} ({selectedReport.asset_code})</p>
                  <p><strong>Reporter:</strong> {selectedReport.reporter_name}</p>
                  <p><strong>Date:</strong> {new Date(selectedReport.reported_at).toLocaleString()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedReport.status)}>
                    {selectedReport.status?.toUpperCase().replace('_', ' ')}
                  </Badge></p>
                  <p><strong>Severity:</strong> <Badge variant={getSeverityBadgeVariant(selectedReport.severity)}>
                    {selectedReport.severity?.toUpperCase()}
                  </Badge></p>
                </Col>
              </Row>

              {/* Description */}
              <Row className="mb-4">
                <Col>
                  <h6>Description</h6>
                  <p className="bg-light p-3 rounded">{selectedReport.description}</p>
                </Col>
              </Row>

              {/* AI Analysis */}
              {selectedReport.risk_score && (
                <Row className="mb-4">
                  <Col>
                    <h6>🤖 AI Risk Assessment</h6>
                    <Card className="bg-light">
                      <Card.Body>
                        <Row>
                          <Col md={4}>
                            <strong>Risk Score:</strong><br />
                            <span className="h4">{Math.round(selectedReport.risk_score * 100)}%</span>
                          </Col>
                          <Col md={4}>
                            <strong>Risk Category:</strong><br />
                            <Badge variant={getSeverityBadgeVariant(selectedReport.risk_category)} className="h6">
                              {selectedReport.risk_category?.toUpperCase()}
                            </Badge>
                          </Col>
                          <Col md={4}>
                            <strong>Confidence:</strong><br />
                            <span className="h5">{Math.round(selectedReport.confidence_score * 100)}%</span>
                          </Col>
                        </Row>
                        {selectedReport.analysis_summary && (
                          <div className="mt-3">
                            <strong>Analysis Summary:</strong>
                            <p className="mt-2">{selectedReport.analysis_summary}</p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Computer Vision Detection */}
              {selectedReport.cv_detection && selectedReport.cv_detection.length > 0 && (
                <Row className="mb-4">
                  <Col>
                    <h6>👁️ Computer Vision Detection</h6>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Detection</th>
                          <th>Confidence</th>
                          <th>Location (x, y, w, h)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.cv_detection.map((detection, index) => (
                          <tr key={index}>
                            <td>
                              <Badge variant="info">{detection.label.replace('_', ' ')}</Badge>
                            </td>
                            <td>{Math.round(detection.confidence * 100)}%</td>
                            <td>
                              ({detection.bbox.x}, {detection.bbox.y}, {detection.bbox.width}, {detection.bbox.height})
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}

              {/* Status Update Actions */}
              <Row>
                <Col>
                  <h6>Actions</h6>
                  <div className="d-flex gap-2">
                    {selectedReport.status === 'pending' && (
                      <Button
                        variant="success"
                        onClick={() => {
                          handleStatusUpdate(selectedReport.id, 'in_progress');
                          setShowDetailModal(false);
                        }}
                      >
                        <i className="fas fa-play"></i> Start Processing
                      </Button>
                    )}
                    
                    {selectedReport.status === 'in_progress' && (
                      <Button
                        variant="outline-success"
                        onClick={() => {
                          handleStatusUpdate(selectedReport.id, 'completed');
                          setShowDetailModal(false);
                        }}
                      >
                        <i className="fas fa-check"></i> Mark Complete
                      </Button>
                    )}
                    
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        // This would open maintenance scheduling
                        setMessage('Maintenance scheduling feature will be implemented');
                      }}
                    >
                      <i className="fas fa-calendar"></i> Schedule Maintenance
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DaftarLaporanAI;
