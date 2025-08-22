import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";

const MainTrain = () => {
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

  // Data statistik training
  const trainingStats = {
    totalDatasets: 12,
    activeTraining: 3,
    completedTraining: 45,
    accuracy: 94.2,
    modelsDeployed: 8,
    pendingReview: 5
  };

  // Data training yang sedang berjalan
  const activeTrainings = [
    {
      id: 1,
      name: "Generator Detection v3.0",
      type: "Computer Vision",
      progress: 75,
      accuracy: 92.1,
      eta: "2 hours",
      status: "training"
    },
    {
      id: 2,
      name: "HVAC Fault Detection",
      type: "Classification",
      progress: 45,
      accuracy: 88.7,
      eta: "4 hours",
      status: "training"
    },
    {
      id: 3,
      name: "Maintenance Prediction",
      type: "Regression",
      progress: 90,
      accuracy: 91.5,
      eta: "30 minutes",
      status: "validation"
    }
  ];

  // Recent completed trainings
  const recentCompleted = [
    {
      id: 1,
      name: "Elevator Safety Model",
      accuracy: 95.3,
      completedAt: "2 hours ago",
      status: "deployed"
    },
    {
      id: 2,
      name: "Pipeline Leak Detection",
      accuracy: 89.1,
      completedAt: "1 day ago",
      status: "review"
    },
    {
      id: 3,
      name: "Equipment Temperature Monitor",
      accuracy: 93.8,
      completedAt: "2 days ago",
      status: "deployed"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'training':
        return <Badge bg="primary">Training</Badge>;
      case 'validation':
        return <Badge bg="warning">Validation</Badge>;
      case 'deployed':
        return <Badge bg="success">Deployed</Badge>;
      case 'review':
        return <Badge bg="info">Review</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <Container fluid 
      className={`py-4 px-4 ${isDark ? 'bg-dark text-light' : 'bg-light'}`} 
      style={{ minHeight: "100vh", paddingTop: "90px", background: isDark ? "#23272f" : "#f7f8fa" }}
    >
      <div className="mb-4">
        <h2 className="fw-bold mb-1">🤖 Training Dashboard</h2>
        <p className={`mb-0 ${isDark ? 'text-light' : 'text-muted'}`}>
          Monitor and manage AI model training processes
        </p>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className={`text-center border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Body>
              <div className="display-6 text-primary mb-2">📊</div>
              <h3 className="fw-bold mb-1">{trainingStats.totalDatasets}</h3>
              <small className={isDark ? 'text-light' : 'text-muted'}>Total Datasets</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className={`text-center border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Body>
              <div className="display-6 text-warning mb-2">⚡</div>
              <h3 className="fw-bold mb-1">{trainingStats.activeTraining}</h3>
              <small className={isDark ? 'text-light' : 'text-muted'}>Active Training</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className={`text-center border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Body>
              <div className="display-6 text-success mb-2">✅</div>
              <h3 className="fw-bold mb-1">{trainingStats.completedTraining}</h3>
              <small className={isDark ? 'text-light' : 'text-muted'}>Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className={`text-center border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Body>
              <div className="display-6 text-info mb-2">🎯</div>
              <h3 className="fw-bold mb-1">{trainingStats.accuracy}%</h3>
              <small className={isDark ? 'text-light' : 'text-muted'}>Avg Accuracy</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className={`text-center border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Body>
              <div className="display-6 text-primary mb-2">🚀</div>
              <h3 className="fw-bold mb-1">{trainingStats.modelsDeployed}</h3>
              <small className={isDark ? 'text-light' : 'text-muted'}>Models Deployed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className={`text-center border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Body>
              <div className="display-6 text-warning mb-2">⏳</div>
              <h3 className="fw-bold mb-1">{trainingStats.pendingReview}</h3>
              <small className={isDark ? 'text-light' : 'text-muted'}>Pending Review</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Active Training */}
        <Col lg={8} className="mb-4">
          <Card className={`border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Header className={`${isDark ? 'bg-dark border-secondary' : 'bg-light border-light'} fw-bold`}>
              ⚡ Active Training Sessions
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className={`mb-0 ${isDark ? 'table-dark' : ''}`}>
                <thead className={isDark ? 'table-dark' : 'table-light'}>
                  <tr>
                    <th>Model Name</th>
                    <th>Type</th>
                    <th>Progress</th>
                    <th>Accuracy</th>
                    <th>ETA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTrainings.map((training) => (
                    <tr key={training.id}>
                      <td className="fw-bold">{training.name}</td>
                      <td>{training.type}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress me-2" style={{ width: '100px', height: '6px' }}>
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${training.progress}%` }}
                            ></div>
                          </div>
                          <small>{training.progress}%</small>
                        </div>
                      </td>
                      <td>
                        <span className="text-success fw-bold">{training.accuracy}%</span>
                      </td>
                      <td>{training.eta}</td>
                      <td>{getStatusBadge(training.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Completed */}
        <Col lg={4} className="mb-4">
          <Card className={`border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Header className={`${isDark ? 'bg-dark border-secondary' : 'bg-light border-light'} fw-bold`}>
              ✅ Recent Completed
            </Card.Header>
            <Card.Body>
              {recentCompleted.map((item, index) => (
                <div key={item.id} className={`${index > 0 ? 'border-top pt-3 mt-3' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold mb-1">{item.name}</div>
                      <small className={isDark ? 'text-light' : 'text-muted'}>
                        Accuracy: <span className="text-success">{item.accuracy}%</span>
                      </small>
                      <br />
                      <small className={isDark ? 'text-light' : 'text-muted'}>
                        {item.completedAt}
                      </small>
                    </div>
                    <div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className={`border-0 shadow-sm ${isDark ? 'bg-secondary text-light' : 'bg-white'}`}>
            <Card.Header className={`${isDark ? 'bg-dark border-secondary' : 'bg-light border-light'} fw-bold`}>
              🚀 Quick Actions
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-2">
                  <Button href="/train/training-data" variant={isDark ? "outline-light" : "outline-primary"} className="w-100">
                    📝 Manage Training Data
                  </Button>
                </Col>
                <Col md={3} className="mb-2">
                  <Button href="/train/training-ai" variant={isDark ? "outline-light" : "outline-primary"} className="w-100">
                    🧠 Start New Training
                  </Button>
                </Col>
                <Col md={3} className="mb-2">
                  <Button href="/train/dataset-manager" variant={isDark ? "outline-light" : "outline-primary"} className="w-100">
                    🗂️ Upload Dataset
                  </Button>
                </Col>
                <Col md={3} className="mb-2">
                  <Button variant={isDark ? "outline-light" : "outline-secondary"} className="w-100" disabled>
                    📊 View Analytics
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainTrain;
