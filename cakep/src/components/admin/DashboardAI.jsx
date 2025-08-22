import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useState } from 'react';
import { Alert, Badge, Card, Col, Container, ProgressBar, Row, Table } from 'react-bootstrap';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const DashboardAI = () => {
  const [aiMetrics, setAiMetrics] = useState({
    totalAnalysis: 156,
    accuracyRate: 94.2,
    avgProcessingTime: 2.3,
    totalTrainingData: 2847,
    activeModels: 3,
    lastModelUpdate: '2024-01-15T10:30:00Z'
  });

  const [riskDistribution] = useState({
    high: 23,
    medium: 45,
    low: 88
  });

  const [cvDetections] = useState([
    { type: 'oil_leak', count: 34, accuracy: 89.2 },
    { type: 'rust', count: 28, accuracy: 91.5 },
    { type: 'vibration_abnormal', count: 19, accuracy: 87.3 },
    { type: 'heat_signature', count: 15, accuracy: 93.1 },
    { type: 'belt_loose', count: 12, accuracy: 85.7 }
  ]);

  const [modelPerformance] = useState([
    { month: 'Jan', accuracy: 87.2, processed: 120 },
    { month: 'Feb', accuracy: 89.1, processed: 135 },
    { month: 'Mar', accuracy: 91.3, processed: 148 },
    { month: 'Apr', accuracy: 93.2, processed: 162 },
    { month: 'May', accuracy: 94.2, processed: 156 }
  ]);

  const [recentAnalysis] = useState([
    {
      id: 1,
      asset: 'Generator Diesel 100KVA',
      timestamp: '2024-01-15T14:30:00Z',
      riskScore: 0.89,
      confidence: 0.94,
      detections: ['oil_leak', 'vibration_abnormal'],
      status: 'completed'
    },
    {
      id: 2,
      asset: 'AC Central 5PK',
      timestamp: '2024-01-15T13:45:00Z',
      riskScore: 0.62,
      confidence: 0.88,
      detections: ['filter_dirty'],
      status: 'completed'
    },
    {
      id: 3,
      asset: 'Kompresor Udara',
      timestamp: '2024-01-15T12:20:00Z',
      riskScore: 0.35,
      confidence: 0.87,
      detections: ['normal_operation'],
      status: 'completed'
    },
    {
      id: 4,
      asset: 'Forklift 2',
      timestamp: '2024-01-15T11:15:00Z',
      riskScore: null,
      confidence: null,
      detections: [],
      status: 'processing'
    }
  ]);

  // Chart configurations
  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [riskDistribution.high, riskDistribution.medium, riskDistribution.low],
        backgroundColor: ['#dc3545', '#ffc107', '#198754'],
        borderWidth: 0
      }
    ]
  };

  const cvDetectionData = {
    labels: cvDetections.map(d => d.type.replace('_', ' ')),
    datasets: [
      {
        label: 'Detection Count',
        data: cvDetections.map(d => d.count),
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd',
        borderWidth: 1
      }
    ]
  };

  const performanceData = {
    labels: modelPerformance.map(p => p.month),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: modelPerformance.map(p => p.accuracy),
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Reports Processed',
        data: modelPerformance.map(p => p.processed),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left'
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const getRiskBadgeVariant = (score) => {
    if (!score) return 'secondary';
    if (score >= 0.8) return 'danger';
    if (score >= 0.6) return 'warning';
    if (score >= 0.4) return 'info';
    return 'success';
  };

  const getRiskLabel = (score) => {
    if (!score) return 'Pending';
    if (score >= 0.8) return 'HIGH';
    if (score >= 0.6) return 'MEDIUM';
    if (score >= 0.4) return 'LOW';
    return 'MINIMAL';
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>🤖 AI Analytics Dashboard</h2>
          <p className="text-muted">Real-time AI performance metrics and analysis insights</p>
        </Col>
      </Row>

      {/* AI Metrics Cards */}
      <Row className="mb-4">
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-6 text-primary mb-2">🔍</div>
              <h4 className="text-primary">{aiMetrics.totalAnalysis}</h4>
              <small className="text-muted">Total Analysis</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-6 text-success mb-2">🎯</div>
              <h4 className="text-success">{aiMetrics.accuracyRate}%</h4>
              <small className="text-muted">Accuracy Rate</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-6 text-info mb-2">⚡</div>
              <h4 className="text-info">{aiMetrics.avgProcessingTime}s</h4>
              <small className="text-muted">Avg Processing</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-6 text-warning mb-2">📊</div>
              <h4 className="text-warning">{aiMetrics.totalTrainingData.toLocaleString()}</h4>
              <small className="text-muted">Training Data</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-6 text-danger mb-2">🧠</div>
              <h4 className="text-danger">{aiMetrics.activeModels}</h4>
              <small className="text-muted">Active Models</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-6 text-secondary mb-2">🔄</div>
              <h6 className="text-secondary">Last Update</h6>
              <small className="text-muted">
                {new Date(aiMetrics.lastModelUpdate).toLocaleDateString()}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📈 Risk Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={riskDistributionData} />
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <small>Total Reports: {Object.values(riskDistribution).reduce((a, b) => a + b, 0)}</small>
                  <small>High Risk: {Math.round((riskDistribution.high / Object.values(riskDistribution).reduce((a, b) => a + b, 0)) * 100)}%</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">👁️ CV Detection Types</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={cvDetectionData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📊 Model Performance Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line data={performanceData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Tables Row */}
      <Row>
        <Col lg={8} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">🔍 Recent AI Analysis</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Timestamp</th>
                    <th>Risk Score</th>
                    <th>Confidence</th>
                    <th>Detections</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalysis.map((analysis) => (
                    <tr key={analysis.id}>
                      <td>
                        <strong>{analysis.asset}</strong>
                      </td>
                      <td>
                        {new Date(analysis.timestamp).toLocaleString()}
                      </td>
                      <td>
                        {analysis.riskScore ? (
                          <div>
                            <Badge variant={getRiskBadgeVariant(analysis.riskScore)}>
                              {getRiskLabel(analysis.riskScore)}
                            </Badge>
                            <br />
                            <small className="text-muted">
                              {Math.round(analysis.riskScore * 100)}%
                            </small>
                          </div>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </td>
                      <td>
                        {analysis.confidence ? (
                          <div>
                            <ProgressBar 
                              now={analysis.confidence * 100} 
                              label={`${Math.round(analysis.confidence * 100)}%`}
                              variant="success"
                              style={{ height: '20px' }}
                            />
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {analysis.detections.length > 0 ? (
                          <div>
                            {analysis.detections.map((detection, idx) => (
                              <Badge key={idx} variant="info" className="me-1 mb-1">
                                {detection.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No detections</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={analysis.status === 'completed' ? 'success' : 'warning'}>
                          {analysis.status === 'completed' ? '✅ Completed' : '⏳ Processing'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">👁️ CV Detection Performance</h5>
            </Card.Header>
            <Card.Body>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Detection Type</th>
                    <th>Count</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {cvDetections.map((detection, idx) => (
                    <tr key={idx}>
                      <td>
                        <Badge variant="info" className="mb-1">
                          {detection.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td>{detection.count}</td>
                      <td>
                        <ProgressBar 
                          now={detection.accuracy} 
                          label={`${detection.accuracy}%`}
                          variant={detection.accuracy >= 90 ? 'success' : detection.accuracy >= 85 ? 'warning' : 'danger'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Model Status */}
          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">🧠 Model Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Risk Assessment Model</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <ProgressBar now={94.2} label="94.2%" variant="success" size="sm" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Computer Vision Model</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <ProgressBar now={89.7} label="89.7%" variant="success" size="sm" />
              </div>
              
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>NLP Processing Model</span>
                  <Badge variant="warning">Training</Badge>
                </div>
                <ProgressBar now={67.3} label="67.3%" variant="warning" size="sm" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Status Alert */}
      <Row>
        <Col>
          <Alert variant="info">
            <Alert.Heading>🔄 System Status</Alert.Heading>
            <p className="mb-0">
              All AI models are running optimally. Last model retrain completed on {new Date(aiMetrics.lastModelUpdate).toLocaleDateString()}.
              Next scheduled maintenance: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardAI;
