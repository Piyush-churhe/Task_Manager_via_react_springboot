// Create new file: src/components/Notification.js
import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Notification = ({ username }) => {
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (username) {
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [username]);

  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS('https://task-manager-0-ev1i.onrender.com/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/notifications/${username}`, (message) => {
          const notification = JSON.parse(message.body);
          addNotification(notification);
        });
      },
    });

    client.activate();
    setStompClient(client);
  };

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

  return (
    <div className="notification-container">
      {/* Notification Bell Icon */}
      <div className="notification-bell">
        🔔
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.map((notification, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Notification;