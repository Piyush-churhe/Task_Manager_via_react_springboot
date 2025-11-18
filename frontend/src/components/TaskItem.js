// src/components/TaskItem.js
import React, { useState } from 'react';
import { taskAPI } from '../services/api';

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedTask = await taskAPI.updateTask(task.id, editedTask);
      onUpdate(updatedTask);
      setIsEditing(false);
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
      const updatedTask = await taskAPI.updateTask(task.id, {
        ...task,
        completed: !task.completed
      });
      onUpdate(updatedTask);
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
              <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </h4>
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

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

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

export default TaskItem;