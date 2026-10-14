
import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Users,
  FileText,
  ClipboardList,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";

const initialNotifications = [
  {
    id: 1,
    title: "Low Stock Alert",
    message: "Wireless Mouse has reached its minimum stock level.",
    category: "Inventory",
    time: "Today, 10:30 AM",
    read: false,
    icon: Package,
  },
  {
    id: 2,
    title: "New Task Assigned",
    message: "A new task has been assigned to Rahul Sharma.",
    category: "Tasks",
    time: "Today, 09:45 AM",
    read: false,
    icon: ClipboardList,
  },
  {
    id: 3,
    title: "Invoice Payment Pending",
    message: "Invoice INV-1003 requires payment follow-up.",
    category: "Invoices",
    time: "Yesterday",
    read: true,
    icon: FileText,
  },
  {
    id: 4,
    title: "New Employee Added",
    message: "A new employee record has been created.",
    category: "Employees",
    time: "Yesterday",
    read: true,
    icon: Users,
  },
];

function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) => {
      if (filter === "Unread") return !notification.read;
      if (filter === "Read") return notification.read;
      return true;
    }
  );

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="dashboard">
      <PageHeader
        title="Notifications"
        description="Stay updated about your business activities."
        actionLabel="Mark All as Read"
        onAction={markAllAsRead}
      />

      <div className="notification-summary">
        <div className="stat-card">
          <Bell size={22} />
          <span>Total Notifications</span>
          <h2>{notifications.length}</h2>
        </div>

        <div className="stat-card">
          <CheckCheck size={22} />
          <span>Unread Notifications</span>
          <h2>{unreadCount}</h2>
        </div>
      </div>

      <div className="notification-toolbar">
        <div className="notification-filters">
          {["All", "Unread", "Read"].map((item) => (
            <button
              type="button"
              key={item}
              className={`filter-button ${
                filter === item ? "selected" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === "Unread" && ` (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <Bell size={30} />
            <h3>No notifications found</h3>
            <p>There are no notifications in this category.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;

            return (
              <article
                className={`notification-card ${
                  notification.read ? "is-read" : "is-unread"
                }`}
                key={notification.id}
              >
                <div className="notification-icon">
                  <Icon size={20} />
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    <StatusBadge
                      status={notification.read ? "Read" : "Unread"}
                    />
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-meta">
                    <span>{notification.category}</span>
                    <span>{notification.time}</span>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      type="button"
                      className="action-button"
                      title="Mark as read"
                      aria-label={`Mark ${notification.title} as read`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}

                  <button
                    type="button"
                    className="action-button delete-action"
                    title="Delete notification"
                    aria-label={`Delete ${notification.title}`}
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Notifications;
