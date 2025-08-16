import { useEffect, useState } from "react";
import { Badge, Button, Card, Dropdown, Form, Modal, Table } from "react-bootstrap";

const DaftarUser = () => {
  // Data dummy user untuk admin
  const [userList, setUserList] = useState([
    {
      id: 1,
      nama: "John Doe",
      email: "john.doe@company.com",
      role: "user",
      status: "active",
      tanggalDaftar: "2025-01-15",
      lastLogin: "2025-08-15",
      totalLaporan: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      nama: "Jane Smith",
      email: "jane.smith@company.com",
      role: "user",
      status: "active",
      tanggalDaftar: "2025-02-20",
      lastLogin: "2025-08-14",
      totalLaporan: 3,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b167?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 3,
      nama: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "admin",
      status: "active",
      tanggalDaftar: "2024-12-10",
      lastLogin: "2025-08-16",
      totalLaporan: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 4,
      nama: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "user",
      status: "inactive",
      tanggalDaftar: "2025-03-05",
      lastLogin: "2025-07-20",
      totalLaporan: 8,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 5,
      nama: "David Brown",
      email: "david.brown@company.com",
      role: "user",
      status: "suspended",
      tanggalDaftar: "2025-04-12",
      lastLogin: "2025-08-10",
      totalLaporan: 2,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
    }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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
    active: { color: "#198754", label: "Active", icon: "✅" },
    inactive: { color: "#6c757d", label: "Inactive", icon: "⏸️" },
    suspended: { color: "#dc3545", label: "Suspended", icon: "🚫" }
  };

  const roleConfig = {
    admin: { color: "#6f42c1", label: "Admin", icon: "👑" },
    user: { color: "#0dcaf0", label: "User", icon: "👤" }
  };

  // Filter dan search user
  const filteredUsers = userList.filter(user => {
    const roleMatch = filterRole === "all" || user.role === filterRole;
    const statusMatch = filterStatus === "all" || user.status === filterStatus;
    const searchMatch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && statusMatch && searchMatch;
  });

  // Update status user
  const updateUserStatus = (id, newStatus) => {
    setUserList(prev => 
      prev.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  // Update role user
  const updateUserRole = (id, newRole) => {
    setUserList(prev => 
      prev.map(user => 
        user.id === id ? { ...user, role: newRole } : user
      )
    );
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className={`fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>
              Management Pengguna
            </h4>
            
            <Button variant="primary">
              + Tambah User Baru
            </Button>
          </div>
          
          {/* Filter Controls */}
          <Card className={`mb-4 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
            <Card.Body>
              <div className="row g-3">
                <div className="col-md-4">
                  <Form.Control
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isDark ? 'bg-dark text-light border-secondary' : ''}
                  />
                </div>
                <div className="col-md-3">
                  <Form.Select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                    className={isDark ? 'bg-dark text-light border-secondary' : ''}
                  >
                    <option value="all">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Form.Select>
                </div>
                <div className="col-md-3">
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={isDark ? 'bg-dark text-light border-secondary' : ''}
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </Form.Select>
                </div>
                <div className="col-md-2">
                  <Button variant="outline-secondary" className="w-100">
                    Reset Filter
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-primary">👥 {userList.length}</h5>
                  <small>Total Users</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-success">✅ {userList.filter(u => u.status === 'active').length}</h5>
                  <small>Active Users</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-warning">👑 {userList.filter(u => u.role === 'admin').length}</h5>
                  <small>Admins</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className={`text-center ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="text-danger">🚫 {userList.filter(u => u.status === 'suspended').length}</h5>
                  <small>Suspended</small>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* User Table */}
          <Card className={`shadow-sm ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
            <Card.Body>
              <Table responsive striped bordered hover variant={isDark ? "dark" : undefined}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Tanggal Daftar</th>
                    <th>Last Login</th>
                    <th>Total Laporan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={user.avatar} 
                            alt={user.nama}
                            style={{ 
                              width: "40px", 
                              height: "40px", 
                              objectFit: "cover", 
                              borderRadius: "50%", 
                              marginRight: "10px" 
                            }}
                          />
                          <div>
                            <div className="fw-bold">{user.nama}</div>
                            <small className="text-muted">ID: #{user.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Badge 
                          style={{ backgroundColor: roleConfig[user.role].color }}
                        >
                          {roleConfig[user.role].icon} {roleConfig[user.role].label}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          style={{ backgroundColor: statusConfig[user.status].color }}
                        >
                          {statusConfig[user.status].icon} {statusConfig[user.status].label}
                        </Badge>
                      </td>
                      <td>{formatTanggal(user.tanggalDaftar)}</td>
                      <td>{formatTanggal(user.lastLogin)}</td>
                      <td>
                        <Badge bg="info">{user.totalLaporan}</Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                          >
                            Detail
                          </Button>
                          
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Status
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => updateUserStatus(user.id, 'active')}>
                                ✅ Active
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => updateUserStatus(user.id, 'inactive')}>
                                ⏸️ Inactive
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => updateUserStatus(user.id, 'suspended')}>
                                🚫 Suspended
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>

                          <Dropdown>
                            <Dropdown.Toggle variant="outline-warning" size="sm">
                              Role
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => updateUserRole(user.id, 'admin')}>
                                👑 Admin
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => updateUserRole(user.id, 'user')}>
                                👤 User
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modal Detail User */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header 
          closeButton 
          className={isDark ? "bg-dark text-light border-secondary" : ""}
        >
          <Modal.Title>Detail User: {selectedUser?.nama}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          {selectedUser && (
            <div>
              <div className="row mb-3">
                <div className="col-md-3 text-center">
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.nama}
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <h5>{selectedUser.nama}</h5>
                  <Badge 
                    style={{ backgroundColor: roleConfig[selectedUser.role].color }}
                    className="mb-2"
                  >
                    {roleConfig[selectedUser.role].icon} {roleConfig[selectedUser.role].label}
                  </Badge>
                  <br />
                  <Badge 
                    style={{ backgroundColor: statusConfig[selectedUser.status].color }}
                  >
                    {statusConfig[selectedUser.status].icon} {statusConfig[selectedUser.status].label}
                  </Badge>
                </div>
                <div className="col-md-9">
                  <div className="mb-3">
                    <strong>Informasi Akun:</strong>
                    <ul className="list-unstyled mt-2">
                      <li><strong>Email:</strong> {selectedUser.email}</li>
                      <li><strong>User ID:</strong> #{selectedUser.id}</li>
                      <li><strong>Tanggal Daftar:</strong> {formatTanggal(selectedUser.tanggalDaftar)}</li>
                      <li><strong>Last Login:</strong> {formatTanggal(selectedUser.lastLogin)}</li>
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Aktivitas:</strong>
                    <ul className="list-unstyled mt-2">
                      <li><strong>Total Laporan:</strong> {selectedUser.totalLaporan} laporan</li>
                      <li><strong>Status Akun:</strong> 
                        <Badge 
                          className="ms-2"
                          style={{ backgroundColor: statusConfig[selectedUser.status].color }}
                        >
                          {statusConfig[selectedUser.status].label}
                        </Badge>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
          >
            Tutup
          </Button>
          <Button variant="primary">
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DaftarUser;
