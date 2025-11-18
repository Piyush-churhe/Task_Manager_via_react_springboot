// src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, COMPLETED, PENDING

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await taskAPI.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      setError('Failed to delete task.');
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

export default TaskList;