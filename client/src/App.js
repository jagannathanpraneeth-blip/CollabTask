import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskService from './services/taskService';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch initial tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('task:created', (newTask) => {
      setTasks(prevTasks => [newTask, ...prevTasks]);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks(prevTasks =>
        prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
      );
    });

    socket.on('task:deleted', (taskId) => {
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [socket]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TaskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await TaskService.createTask(taskData);
      socket?.emit('task:create', newTask);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const updatedTask = await TaskService.updateTask(taskId, updatedData);
      socket?.emit('task:update', updatedTask);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      socket?.emit('task:delete', taskId);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>CollabTask</h1>
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}
        
        <TaskForm onAddTask={handleAddTask} />
        
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;
