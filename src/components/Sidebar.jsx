
import {
  LayoutDashboard,
  Users,
  UserRound,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  FileText,
  Wallet,
  CalendarCheck,
  CheckSquare,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Employees", icon: Users, path: "/employees" },
  { name: "Customers", icon: UserRound, path: "/customers" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Inventory", icon: Warehouse, path: "/inventory" },
  { name: "Sales", icon: ShoppingCart, path: "/sales" },
  { name: "Purchases", icon: Truck, path: "/purchases" },
  { name: "Invoices", icon: FileText, path: "/invoices" },
  { name: "Expenses", icon: Wallet, path: "/expenses" },
  { name: "Attendance", icon: CalendarCheck, path: "/attendance" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "Reports", icon: BarChart3, path: "/reports" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">E</div>

        <div>
          <h2>ERP Platform</h2>
          <span>Business Management</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="sidebar-menu">
        <p className="menu-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* System */}
        <p className="menu-title bottom-title">SYSTEM</p>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          <Bell size={19} />
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        {/* Logout */}
        <button
          type="button"
          className="menu-item logout-button"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </nav>

      {/* User profile */}
      <div className="sidebar-user">
        <div className="user-avatar">A</div>

        <div>
          <strong>Admin User</strong>
          <span>Organization Admin</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
