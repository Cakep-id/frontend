import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Spinner, Table } from 'react-bootstrap';

const DatasetManager = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [uploadForm, setUploadForm] = useState({
    description: '',
    category: '',
    labels: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const categoryOptions = ['Generator', 'HVAC', 'IT Equipment', 'Elevator', 'Mechanical', 'Electrical'];

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      // Simulate dataset loading since we don't have full implementation
      // In real app, this would fetch from /api/datasets
      const mockDatasets = [
        {
          id: 1,
          file_name: 'generator_damage_001.jpg',
          category: 'Generator',
          description: 'Generator with oil leak',
          is_approved: true,
          uploaded_by_name: 'Admin',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          file_name: 'hvac_filter_002.jpg',
          category: 'HVAC',
          description: 'Dirty HVAC filter',
          is_approved: false,
          uploaded_by_name: 'User1',
          created_at: '2024-01-16T14:20:00Z'
        }
      ];
      setDatasets(mockDatasets);
    } catch (error) {
      console.error('Error loading datasets:', error);
      setMessage('Error loading datasets');
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Generate previews
    const previews = [];
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews[index] = e.target.result;
          if (previews.length === files.length) {
            setPreviewImages([...previews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setMessage('Please select files to upload');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Add files
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Add metadata
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('labels', uploadForm.labels);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/training/dataset/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      
      if (data.success) {
        setMessage('Dataset uploaded successfully! Waiting for admin approval.');
        setShowUploadModal(false);
        resetUploadForm();
        loadDatasets();
      } else {
        setMessage(data.message || 'Error uploading dataset');
      }
    } catch (error) {
      console.error('Error uploading dataset:', error);
      setMessage('Error uploading dataset');
    }
    
    setLoading(false);
    setUploadProgress(0);
  };

  const handleApproval = async (id, approved) => {
    try {
      // Simulate approval API call
      // In real app: PUT /api/datasets/:id/approve
      setMessage(`Dataset ${approved ? 'approved' : 'rejected'} successfully!`);
      loadDatasets();
    } catch (error) {
      console.error('Error updating approval:', error);
      setMessage('Error updating approval status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dataset?')) return;

    try {
      // Simulate delete API call
      // In real app: DELETE /api/datasets/:id
      setMessage('Dataset deleted successfully!');
      loadDatasets();
    } catch (error) {
      console.error('Error deleting dataset:', error);
      setMessage('Error deleting dataset');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      description: '',
      category: '',
      labels: ''
    });
    setSelectedFiles([]);
    setPreviewImages([]);
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <Badge variant="success">Approved</Badge>
    ) : (
      <Badge variant="warning">Pending</Badge>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>📁 Dataset Manager</h2>
          <p className="text-muted">Manage training datasets untuk Computer Vision AI</p>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">
          {message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{datasets.length}</h3>
              <small className="text-muted">Total Datasets</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{datasets.filter(d => d.is_approved).length}</h3>
              <small className="text-muted">Approved</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{datasets.filter(d => !d.is_approved).length}</h3>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Button 
                variant="primary" 
                onClick={() => setShowUploadModal(true)}
                className="w-100"
              >
                <i className="fas fa-upload"></i> Upload Dataset
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CV Training Status */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>🤖 Computer Vision Training Status</Card.Title>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Model Training Progress</span>
                  <span>75%</span>
                </div>
                <ProgressBar variant="info" now={75} />
              </div>
              <div className="row">
                <div className="col-md-3">
                  <strong>Current Model:</strong><br/>
                  <small className="text-muted">YOLOv8 - Asset Damage Detection</small>
                </div>
                <div className="col-md-3">
                  <strong>Training Images:</strong><br/>
                  <small className="text-muted">{datasets.filter(d => d.is_approved).length} approved</small>
                </div>
                <div className="col-md-3">
                  <strong>Last Training:</strong><br/>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <div className="col-md-3">
                  <strong>Model Accuracy:</strong><br/>
                  <small className="text-success">87.3%</small>
                </div>
              </div>
              <div className="mt-3">
                <Button variant="success" size="sm" className="me-2">
                  <i className="fas fa-play"></i> Start Training
                </Button>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <i className="fas fa-download"></i> Download Model
                </Button>
                <Button variant="outline-info" size="sm">
                  <i className="fas fa-chart-line"></i> View Metrics
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Dataset Table */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Dataset Files</h5>
            <Button variant="outline-secondary" onClick={loadDatasets}>
              <i className="fas fa-refresh"></i> Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Uploaded By</th>
                  <th>Upload Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td>
                      <strong>{dataset.file_name}</strong>
                    </td>
                    <td>
                      <Badge variant="info">{dataset.category}</Badge>
                    </td>
                    <td>{dataset.description}</td>
                    <td>{dataset.uploaded_by_name}</td>
                    <td>{new Date(dataset.created_at).toLocaleDateString()}</td>
                    <td>{getStatusBadge(dataset.is_approved)}</td>
                    <td>
                      {!dataset.is_approved && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleApproval(dataset.id, true)}
                          >
                            <i className="fas fa-check"></i> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => handleApproval(dataset.id, false)}
                          >
                            <i className="fas fa-times"></i> Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => {/* View details */}}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(dataset.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📁 Upload Training Dataset</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Images *</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                required
              />
              <Form.Text className="text-muted">
                Select multiple images for training. Supported formats: JPG, PNG, GIF, WEBP
              </Form.Text>
            </Form.Group>

            {previewImages.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Preview</Form.Label>
                <div className="row">
                  {previewImages.slice(0, 4).map((preview, index) => (
                    <div key={index} className="col-3">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px' }}
                      />
                    </div>
                  ))}
                  {previewImages.length > 4 && (
                    <div className="col-3 d-flex align-items-center justify-content-center">
                      <span className="text-muted">+{previewImages.length - 4} more</span>
                    </div>
                  )}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Asset Category *</Form.Label>
              <Form.Select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Describe what type of damage or condition is shown in these images..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Labels/Annotations (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadForm.labels}
                onChange={(e) => setUploadForm({...uploadForm, labels: e.target.value})}
                placeholder='{"damage_type": "corrosion", "severity": "medium", "location": "top_right"}'
              />
              <Form.Text className="text-muted">
                Optional: Provide labels for computer vision training in JSON format
              </Form.Text>
            </Form.Group>

            {uploadProgress > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Progress</Form.Label>
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                'Upload Dataset'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DatasetManager;
