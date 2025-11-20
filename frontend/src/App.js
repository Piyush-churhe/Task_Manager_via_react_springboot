import React, { useState, useEffect } from 'react';
import './App.css';
import { adminAPI } from './services/api';

// Import the Notification component
const Notification = ({ username }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // For now, we'll use a simple implementation without external libraries
    console.log('Notifications enabled for user:', username);

    // Demo notifications - remove in production
    const demoNotification = setTimeout(() => {
      addNotification({
        type: 'DEADLINE_SOON',
        message: 'Demo: Task "Complete project" is due in 25 minutes!',
        taskId: 1
      });
    }, 3000);

    return () => clearTimeout(demoNotification);
  }, [username]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);

    // Auto remove notification after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== notification));
    }, 10000);
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="notification-container">
      {/* Notification Bell Icon */}
      <div className="notification-bell" onClick={toggleNotifications}>
        🔔
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>

      {/* Notifications List */}
      {showNotifications && (
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="notification empty">
              <div className="notification-message">No new notifications</div>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`notification ${notification.type.toLowerCase()}`}
                onClick={() => removeNotification(index)}
              >
                <div className="notification-header">
                  <span className="notification-type">
                    {notification.type === 'DEADLINE_SOON' ? '⏰ Deadline Soon' : 'ℹ️ Notification'}
                  </span>
                  <button className="close-btn">×</button>
                </div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">Just now</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Login Component
const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = isLogin ? 'https://task-manager-0-ev1i.onrender.com/api/auth/login' : 'https://task-manager-0-ev1i.onrender.com/api/auth/register';

      console.log('Sending request to:', url);
      console.log('Request data:', { username: formData.username, password: formData.password, email: formData.email });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email
        })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, token received');
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.username);
        // Explicitly mark authentication as successful
        onLogin(true);
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setError(errorText || `Authentication failed (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple admin panel component
const AdminPanel = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="admin-container">
      <header className="app-header">
        <h1>👑 Admin Dashboard</h1>
        <div className="header-right">
          <div className="user-section">
            <span>Logged in as Admin</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content admin-main">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Registered Users ({users.length})</h3>
            <button className="refresh-btn" onClick={fetchUsers}>Refresh</button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

// TaskForm Component
const TaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '', // New time field
    priority: 'MEDIUM'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      const response = await fetch('https://task-manager-0-ev1i.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newTask = await response.json();
        onTaskAdded(newTask);

        // Reset form
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          dueTime: '',
          priority: 'MEDIUM'
        });

      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to create task');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3>➕ Add New Task</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Task title *"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Task description (optional)"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Due Time:</label>
            <input
              type="time"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="create-btn"
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

// TaskItem Component
const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-manager-0-ev1i.onrender.com/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedTask)
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(updatedTask);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCompletion = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-manager-0-ev1i.onrender.com/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed
        })
      });

      if (response.ok) {
        onUpdate({ ...task, completed: !task.completed });
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#e74c3c';
      case 'MEDIUM': return '#f39c12';
      case 'LOW': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
            className="edit-input"
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            className="edit-textarea"
          />
          <div className="edit-actions">
            <button onClick={handleSave} disabled={isLoading} className="save-btn">
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="task-header">
            <div className="task-main">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={toggleCompletion}
                className="task-checkbox"
              />
              <div className="task-content">
                <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>
            </div>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                ✏️ Edit
              </button>
              <button onClick={handleDelete} className="delete-btn">
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="task-meta">
            <span
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>

            {task.dueDate && (
              <span className="due-date">
                📅 {new Date(task.dueDate).toLocaleDateString()}
                {task.dueTime && ` at ${task.dueTime}`}
              </span>
            )}

            <span className={`status ${task.completed ? 'completed' : 'pending'}`}>
              {task.completed ? '✅ Completed' : '⏳ Pending'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// TaskList Component
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://task-manager-0-ev1i.onrender.com/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        setError('Failed to load tasks');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-manager-0-ev1i.onrender.com/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'COMPLETED':
        return task.completed;
      case 'PENDING':
        return !task.completed;
      default:
        return true;
    }
  });

  if (loading) {
    return <div className="loading">Loading your tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h3>Your Tasks ({filteredTasks.length})</h3>

        <div className="filter-buttons">
          <button
            className={filter === 'ALL' ? 'active' : ''}
            onClick={() => setFilter('ALL')}
          >
            All ({tasks.length})
          </button>
          <button
            className={filter === 'PENDING' ? 'active' : ''}
            onClick={() => setFilter('PENDING')}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            className={filter === 'COMPLETED' ? 'active' : ''}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          {filter === 'ALL'
            ? "No tasks yet. Create your first task above! 🚀"
            : `No ${filter.toLowerCase()} tasks found.`
          }
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    setUsername(localStorage.getItem('username'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  const handleTaskAdded = () => {
    // This will trigger a refresh in TaskList
    window.location.reload();
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : username === 'admin' ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <div className="app-container">
          <header className="app-header">
            <h1>📝 Task Manager</h1>
            <div className="header-right">
              <Notification username={username} />
              <div className="user-section">
                <span>Welcome, {username}!</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </div>
          </header>

          <main className="main-content">
            <TaskForm onTaskAdded={handleTaskAdded} />
            <TaskList />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;