import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';

const TrainingAI = () => {
  const [activeTab, setActiveTab] = useState('risk');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Risk Training State
  const [riskData, setRiskData] = useState([]);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [riskForm, setRiskForm] = useState({
    damage_description: '',
    severity_label: 'low',
    risk_factors: '',
    admin_notes: ''
  });

  // Maintenance Training State
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    asset_category: '',
    damage_type: '',
    severity_level: 'low',
    recommended_action: '',
    priority_level: 'low',
    estimated_duration: '',
    cost_range_min: '',
    cost_range_max: '',
    schedule_offset_days: '',
    admin_notes: ''
  });

  const [statistics, setStatistics] = useState({
    risk: { total: 0, verified: 0, bySeverity: [] },
    maintenance: { total: 0, active: 0, byCategory: [] }
  });

  const severityOptions = ['low', 'medium', 'high', 'critical'];
  const priorityOptions = ['low', 'medium', 'high', 'critical'];
  const categoryOptions = ['Generator', 'HVAC', 'IT Equipment', 'Elevator', 'Mechanical', 'Electrical'];

  useEffect(() => {
    loadData();
    loadStatistics();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'risk') {
        const response = await fetch('http://localhost:5000/api/training/risk', { headers });
        const data = await response.json();
        if (data.success) {
          setRiskData(data.data.risk_training || []);
        }
      } else if (activeTab === 'maintenance') {
        const response = await fetch('http://localhost:5000/api/training/maintenance', { headers });
        const data = await response.json();
        if (data.success) {
          setMaintenanceData(data.data.maintenance_training || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading training data');
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/training/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Risk Training Functions
  const handleRiskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingRisk 
        ? `http://localhost:5000/api/training/risk/${editingRisk.id}`
        : 'http://localhost:5000/api/training/risk';
      
      const method = editingRisk ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...riskForm,
          risk_factors: riskForm.risk_factors ? JSON.parse(riskForm.risk_factors) : {}
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(editingRisk ? 'Risk training data updated!' : 'Risk training data created!');
        setShowRiskModal(false);
        resetRiskForm();
        loadData();
        loadStatistics();
      } else {
        setMessage(data.message || 'Error saving risk training data');
      }
    } catch (error) {
      console.error('Error saving risk training:', error);
      setMessage('Error saving risk training data');
    }
    setLoading(false);
  };

  const handleRiskEdit = (item) => {
    setEditingRisk(item);
    setRiskForm({
      damage_description: item.damage_description,
      severity_label: item.severity_label,
      risk_factors: JSON.stringify(item.risk_factors || {}),
      admin_notes: item.admin_notes || ''
    });
    setShowRiskModal(true);
  };

  const handleRiskDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this risk training data?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/training/risk/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Risk training data deleted!');
        loadData();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error deleting risk training:', error);
      setMessage('Error deleting risk training data');
    }
  };

  const handleRiskVerify = async (id, isVerified) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/training/risk/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_verified: isVerified })
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Risk training data ${isVerified ? 'verified' : 'unverified'}!`);
        loadData();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error verifying risk training:', error);
      setMessage('Error updating verification status');
    }
  };

  const resetRiskForm = () => {
    setRiskForm({
      damage_description: '',
      severity_label: 'low',
      risk_factors: '',
      admin_notes: ''
    });
    setEditingRisk(null);
  };

  // Maintenance Training Functions
  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingMaintenance 
        ? `http://localhost:5000/api/training/maintenance/${editingMaintenance.id}`
        : 'http://localhost:5000/api/training/maintenance';
      
      const method = editingMaintenance ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...maintenanceForm,
          estimated_duration: parseInt(maintenanceForm.estimated_duration),
          cost_range_min: parseFloat(maintenanceForm.cost_range_min),
          cost_range_max: parseFloat(maintenanceForm.cost_range_max),
          schedule_offset_days: parseInt(maintenanceForm.schedule_offset_days)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(editingMaintenance ? 'Maintenance training data updated!' : 'Maintenance training data created!');
        setShowMaintenanceModal(false);
        resetMaintenanceForm();
        loadData();
        loadStatistics();
      } else {
        setMessage(data.message || 'Error saving maintenance training data');
      }
    } catch (error) {
      console.error('Error saving maintenance training:', error);
      setMessage('Error saving maintenance training data');
    }
    setLoading(false);
  };

  const handleMaintenanceEdit = (item) => {
    setEditingMaintenance(item);
    setMaintenanceForm({
      asset_category: item.asset_category,
      damage_type: item.damage_type,
      severity_level: item.severity_level,
      recommended_action: item.recommended_action,
      priority_level: item.priority_level,
      estimated_duration: item.estimated_duration?.toString() || '',
      cost_range_min: item.cost_range_min?.toString() || '',
      cost_range_max: item.cost_range_max?.toString() || '',
      schedule_offset_days: item.schedule_offset_days?.toString() || '',
      admin_notes: item.admin_notes || ''
    });
    setShowMaintenanceModal(true);
  };

  const handleMaintenanceDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance training data?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/training/maintenance/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Maintenance training data deleted!');
        loadData();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error deleting maintenance training:', error);
      setMessage('Error deleting maintenance training data');
    }
  };

  const resetMaintenanceForm = () => {
    setMaintenanceForm({
      asset_category: '',
      damage_type: '',
      severity_level: 'low',
      recommended_action: '',
      priority_level: 'low',
      estimated_duration: '',
      cost_range_min: '',
      cost_range_max: '',
      schedule_offset_days: '',
      admin_notes: ''
    });
    setEditingMaintenance(null);
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

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>🤖 AI Training Management</h2>
          <p className="text-muted">Train AI models untuk Risk Assessment dan Maintenance Scheduling</p>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">
          {message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>📊 Risk Training Statistics</Card.Title>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{statistics.risk.total}</h4>
                  <small className="text-muted">Total Data</small>
                </div>
                <div>
                  <h4>{statistics.risk.verified}</h4>
                  <small className="text-muted">Verified</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>🔧 Maintenance Training Statistics</Card.Title>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{statistics.maintenance.total}</h4>
                  <small className="text-muted">Total Rules</small>
                </div>
                <div>
                  <h4>{statistics.maintenance.active}</h4>
                  <small className="text-muted">Active</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Training Data Tabs */}
      <Card>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="risk" title="🚨 Risk Assessment Training">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Risk Assessment Training Data</h5>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    resetRiskForm();
                    setShowRiskModal(true);
                  }}
                >
                  <i className="fas fa-plus"></i> Add Risk Training Data
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
                      <th>Damage Description</th>
                      <th>Severity</th>
                      <th>Risk Factors</th>
                      <th>Verified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.damage_description}</td>
                        <td>
                          <Badge variant={getSeverityBadgeVariant(item.severity_label)}>
                            {item.severity_label.toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          {item.risk_factors && typeof item.risk_factors === 'object' 
                            ? Object.keys(item.risk_factors).length + ' factors'
                            : 'No factors'
                          }
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant={item.is_verified ? 'success' : 'outline-secondary'}
                            onClick={() => handleRiskVerify(item.id, !item.is_verified)}
                          >
                            {item.is_verified ? '✓ Verified' : 'Not Verified'}
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleRiskEdit(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleRiskDelete(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            <Tab eventKey="maintenance" title="🔧 Maintenance Scheduling Training">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Maintenance Scheduling Rules</h5>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    resetMaintenanceForm();
                    setShowMaintenanceModal(true);
                  }}
                >
                  <i className="fas fa-plus"></i> Add Maintenance Rule
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
                      <th>Asset Category</th>
                      <th>Damage Type</th>
                      <th>Severity</th>
                      <th>Priority</th>
                      <th>Duration (hrs)</th>
                      <th>Cost Range</th>
                      <th>Schedule Offset</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.asset_category}</td>
                        <td>{item.damage_type}</td>
                        <td>
                          <Badge variant={getSeverityBadgeVariant(item.severity_level)}>
                            {item.severity_level.toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant={getSeverityBadgeVariant(item.priority_level)}>
                            {item.priority_level.toUpperCase()}
                          </Badge>
                        </td>
                        <td>{item.estimated_duration}h</td>
                        <td>
                          Rp {item.cost_range_min?.toLocaleString()} - Rp {item.cost_range_max?.toLocaleString()}
                        </td>
                        <td>{item.schedule_offset_days} days</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleMaintenanceEdit(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleMaintenanceDelete(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Risk Training Modal */}
      <Modal show={showRiskModal} onHide={() => setShowRiskModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRisk ? 'Edit Risk Training Data' : 'Add Risk Training Data'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRiskSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Damage Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={riskForm.damage_description}
                onChange={(e) => setRiskForm({...riskForm, damage_description: e.target.value})}
                placeholder="Describe the damage or problem..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Severity Level *</Form.Label>
              <Form.Select
                value={riskForm.severity_label}
                onChange={(e) => setRiskForm({...riskForm, severity_label: e.target.value})}
                required
              >
                {severityOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Risk Factors (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={riskForm.risk_factors}
                onChange={(e) => setRiskForm({...riskForm, risk_factors: e.target.value})}
                placeholder='{"factor1": "value1", "factor2": "value2"}'
              />
              <Form.Text className="text-muted">
                Enter risk factors as JSON object (optional)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Admin Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={riskForm.admin_notes}
                onChange={(e) => setRiskForm({...riskForm, admin_notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRiskModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : (editingRisk ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Maintenance Training Modal */}
      <Modal show={showMaintenanceModal} onHide={() => setShowMaintenanceModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMaintenance ? 'Edit Maintenance Rule' : 'Add Maintenance Rule'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleMaintenanceSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Asset Category *</Form.Label>
                  <Form.Select
                    value={maintenanceForm.asset_category}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, asset_category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Damage Type *</Form.Label>
                  <Form.Control
                    type="text"
                    value={maintenanceForm.damage_type}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, damage_type: e.target.value})}
                    placeholder="e.g., Engine Noise, Compressor Failure"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Severity Level *</Form.Label>
                  <Form.Select
                    value={maintenanceForm.severity_level}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, severity_level: e.target.value})}
                    required
                  >
                    {severityOptions.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority Level *</Form.Label>
                  <Form.Select
                    value={maintenanceForm.priority_level}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, priority_level: e.target.value})}
                    required
                  >
                    {priorityOptions.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Recommended Action *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={maintenanceForm.recommended_action}
                onChange={(e) => setMaintenanceForm({...maintenanceForm, recommended_action: e.target.value})}
                placeholder="Describe the recommended maintenance action..."
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Duration (hours)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={maintenanceForm.estimated_duration}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, estimated_duration: e.target.value})}
                    placeholder="Hours"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Cost (Rp)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={maintenanceForm.cost_range_min}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, cost_range_min: e.target.value})}
                    placeholder="Minimum cost"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Cost (Rp)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={maintenanceForm.cost_range_max}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, cost_range_max: e.target.value})}
                    placeholder="Maximum cost"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Schedule Offset (days from damage report)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="30"
                value={maintenanceForm.schedule_offset_days}
                onChange={(e) => setMaintenanceForm({...maintenanceForm, schedule_offset_days: e.target.value})}
                placeholder="Days"
              />
              <Form.Text className="text-muted">
                0 = immediate, 1 = next day, etc.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Admin Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={maintenanceForm.admin_notes}
                onChange={(e) => setMaintenanceForm({...maintenanceForm, admin_notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMaintenanceModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : (editingMaintenance ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TrainingAI;
