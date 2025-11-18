// src/components/TaskForm.js
import React, { useState } from 'react';
import { taskAPI } from '../services/api';

const TaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
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
      const newTask = await taskAPI.createTask(formData);
      onTaskAdded(newTask);

      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM'
      });

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3>➕ Create New Task</h3>

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
            placeholder="Task description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        // In your TaskForm component, update the form to include time
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
              onChange={handleInputChange}>
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

export default TaskForm;