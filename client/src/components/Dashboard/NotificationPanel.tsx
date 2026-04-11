import { Bell, X, CheckCircle, AlertCircle, Info, MessageCircle, Calendar, UserPlus, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Notification Item Component
function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'user':
        return <UserPlus className="w-5 h-5 text-teal-500" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 hover:bg-gray-50 transition-all duration-200
        ${!notification.read ? 'bg-blue-50/50' : ''}
        group
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {notification.title}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {getTimeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        {notification.action && (
          <button
            onClick={() => notification.action.onClick()}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 hover:underline"
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Mark as read"
          >
            <CheckCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1 hover:bg-gray-200 rounded transition-colors ml-1"
          title="Delete"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
      )}
    </div>
  );
}

// Main Notification Panel Component
export function NotificationPanel({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead, onDelete }) {
  const panelRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 overflow-hidden z-50 animate-slideDown"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
              <p className="text-gray-400 text-xs mt-1">We'll notify you when something arrives</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <button
              onClick={() => {
                // Navigate to all notifications page
                console.log('View all notifications');
                onClose();
              }}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              View all notifications →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Hook to manage notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage or API
  useEffect(() => {
    // Sample notifications - replace with API call
    const sampleNotifications = [
      {
        id: 1,
        title: "Welcome to PenClub!",
        message: "Thank you for joining PenClub. Get started by exploring the dashboard.",
        type: "success",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        action: {
          label: "Get Started",
          onClick: () => console.log("Get started clicked")
        }
      },
      {
        id: 2,
        title: "New message from Admin",
        message: "Your account has been successfully verified. You now have full access.",
        type: "message",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: 3,
        title: "System Update",
        message: "New features available! Check out the latest updates to improve your experience.",
        type: "info",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: 4,
        title: "Meeting Reminder",
        message: "Team sync meeting in 30 minutes. Don't forget to join!",
        type: "calendar",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        action: {
          label: "Join Meeting",
          onClick: () => console.log("Join meeting clicked")
        }
      },
      {
        id: 5,
        title: "Performance Update",
        message: "Your content is trending! Views have increased by 150% this week.",
        type: "trending",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      }
    ];
    
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const wasUnread = notifications.find(n => n.id === id)?.read === false;
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
}