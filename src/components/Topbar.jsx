import { Search, Bell, ChevronDown } from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search anything..."
          />
        </div>

        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button className="profile-button">
          <div className="user-avatar small">A</div>

          <div className="profile-info">
            <strong>Admin User</strong>
            <span>Admin</span>
          </div>

          <ChevronDown size={17} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;