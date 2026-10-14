
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const monthlySales = [
  { month: "May", sales: 42000 },
  { month: "Jun", sales: 58000 },
  { month: "Jul", sales: 49000 },
  { month: "Aug", sales: 76000 },
  { month: "Sep", sales: 65000 },
  { month: "Oct", sales: 85000 },
];

const recentOrders = [
  {
    id: "ORD-1001",
    customer: "Rahul Sharma",
    amount: 64900,
    status: "Completed",
  },
  {
    id: "ORD-1002",
    customer: "Priya Singh",
    amount: 2006,
    status: "Processing",
  },
  {
    id: "ORD-1003",
    customer: "Arjun Verma",
    amount: 1416,
    status: "Pending",
  },
];

const lowStockProducts = [
  { id: 1, name: "Keyboard", stock: 0, minimum: 5 },
  { id: 2, name: "Monitor", stock: 7, minimum: 8 },
  { id: 3, name: "Wireless Mouse", stock: 10, minimum: 10 },
];

const currency = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function Dashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,84,500",
      change: "+12.5%",
      positive: true,
      icon: TrendingUp,
    },
    {
      title: "Total Customers",
      value: "1,248",
      change: "+8.2%",
      positive: true,
      icon: Users,
    },
    {
      title: "Total Products",
      value: "356",
      change: "+4.6%",
      positive: true,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: "842",
      change: "-2.4%",
      positive: false,
      icon: ShoppingCart,
    },
  ];

  const orderColumns = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    {
      key: "amount",
      label: "Amount",
      render: (amount) => currency(amount),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Business Overview"
        description="Monitor your business operations from one place."
      />

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive
            ? ArrowUpRight
            : ArrowDownRight;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-top">
                <span>{stat.title}</span>
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
              </div>

              <h2>{stat.value}</h2>

              <p
                className={`stat-change ${
                  stat.positive ? "positive-change" : "negative-change"
                }`}
              >
                <ChangeIcon size={14} />
                {stat.change}
                <span> vs previous period</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Monthly sales performance</p>
            </div>
          </div>

          <div className="dashboard-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySales}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [currency(value), "Sales"]}
                />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill="#334e9e"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Inventory Alerts</h3>
              <p>Products needing attention</p>
            </div>

            <AlertTriangle size={20} />
          </div>

          <div className="low-stock-list">
            {lowStockProducts.map((product) => (
              <div className="low-stock-item" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <p>Minimum stock: {product.minimum}</p>
                </div>

                <span
                  className={
                    product.stock === 0
                      ? "stock-count stock-danger"
                      : "stock-count"
                  }
                >
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>

          <p className="dashboard-note">
            Review inventory regularly to prevent stock shortages.
          </p>
        </section>
      </div>

      <section className="panel dashboard-orders">
        <div className="panel-header">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest order activity</p>
          </div>
        </div>

        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyMessage="No recent orders available."
        />
      </section>

      <p className="dashboard-disclaimer">
        Dashboard figures are sample data for frontend demonstration.
        Live business metrics will be connected to Firestore later.
      </p>
    </div>
  );
}

export default Dashboard;
