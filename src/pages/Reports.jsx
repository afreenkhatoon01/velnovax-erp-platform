
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  TrendingUp,
  Wallet,
  Users,
  FileText,
  Package,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";

const reportData = {
  week: {
    summary: {
      revenue: 84500,
      expenses: 28700,
      customers: 18,
      pendingInvoices: 4,
    },
    sales: [
      { label: "Mon", revenue: 12000, expenses: 4500 },
      { label: "Tue", revenue: 18000, expenses: 7000 },
      { label: "Wed", revenue: 9500, expenses: 3200 },
      { label: "Thu", revenue: 15000, expenses: 5000 },
      { label: "Fri", revenue: 11000, expenses: 4000 },
      { label: "Sat", revenue: 19000, expenses: 6000 },
      { label: "Sun", revenue: 0, expenses: 0 },
    ],
    customers: [
      { label: "Mon", customers: 3 },
      { label: "Tue", customers: 5 },
      { label: "Wed", customers: 7 },
      { label: "Thu", customers: 9 },
      { label: "Fri", customers: 12 },
      { label: "Sat", customers: 16 },
      { label: "Sun", customers: 18 },
    ],
  },

  month: {
    summary: {
      revenue: 284500,
      expenses: 92700,
      customers: 86,
      pendingInvoices: 12,
    },
    sales: [
      { label: "Week 1", revenue: 54000, expenses: 19000 },
      { label: "Week 2", revenue: 68000, expenses: 22000 },
      { label: "Week 3", revenue: 72000, expenses: 25000 },
      { label: "Week 4", revenue: 90500, expenses: 26700 },
    ],
    customers: [
      { label: "Week 1", customers: 15 },
      { label: "Week 2", customers: 32 },
      { label: "Week 3", customers: 58 },
      { label: "Week 4", customers: 86 },
    ],
  },

  year: {
    summary: {
      revenue: 3250000,
      expenses: 1120000,
      customers: 642,
      pendingInvoices: 28,
    },
    sales: [
      { label: "May", revenue: 420000, expenses: 140000 },
      { label: "Jun", revenue: 465000, expenses: 155000 },
      { label: "Jul", revenue: 510000, expenses: 170000 },
      { label: "Aug", revenue: 480000, expenses: 165000 },
      { label: "Sep", revenue: 610000, expenses: 210000 },
      { label: "Oct", revenue: 765000, expenses: 280000 },
    ],
    customers: [
      { label: "May", customers: 310 },
      { label: "Jun", customers: 365 },
      { label: "Jul", customers: 410 },
      { label: "Aug", customers: 465 },
      { label: "Sep", customers: 550 },
      { label: "Oct", customers: 642 },
    ],
  },
};

const inventoryData = [
  { name: "In Stock", value: 68 },
  { name: "Low Stock", value: 22 },
  { name: "Out of Stock", value: 10 },
];

const pendingInvoices = [
  {
    id: "INV-1002",
    customer: "Priya Singh",
    amount: 5900,
    status: "Partially Paid",
  },
  {
    id: "INV-1003",
    customer: "Arjun Verma",
    amount: 14160,
    status: "Overdue",
  },
  {
    id: "INV-1004",
    customer: "Neha Gupta",
    amount: 8200,
    status: "Sent",
  },
];

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

const formatAxisValue = (value) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}k`;
  }

  return `₹${value}`;
};

function Reports() {
  const [period, setPeriod] = useState("month");

  const currentData = reportData[period];
  const summary = currentData.summary;

  const profit = summary.revenue - summary.expenses;

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.revenue),
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summary.expenses),
      icon: Wallet,
    },
    {
      title: "Customer Growth",
      value: summary.customers.toLocaleString("en-IN"),
      icon: Users,
    },
    {
      title: "Pending Invoices",
      value: summary.pendingInvoices,
      icon: FileText,
    },
  ];

  return (
    <div className="dashboard reports-page">
      <PageHeader
        title="Reports & Analytics"
        description="Monitor business performance and operational metrics."
      />

      <div className="report-toolbar">
        <div>
          <h3>Business Overview</h3>
          <p>Review your key business indicators.</p>
        </div>

        <select
          className="report-period"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Report date range"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Year Overview</option>
        </select>
      </div>

      <div className="report-cards">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card report-card" key={card.title}>
              <div className="report-card-heading">
                <span>{card.title}</span>
                <Icon size={20} />
              </div>

              <h2>{card.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="profit-strip">
        <div>
          <span>Estimated Profit</span>
          <h2>{formatCurrency(profit)}</h2>
        </div>

        <p>
          Revenue minus expenses for the selected sample reporting period.
        </p>
      </div>

      <div className="reports-grid">
        <section className="panel report-panel">
          <div className="panel-header">
            <div>
              <h3>Revenue vs Expenses</h3>
              <p>Compare revenue and business expenses.</p>
            </div>
          </div>

          <div className="report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentData.sales}
                margin={{ top: 15, right: 10, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={formatAxisValue} width={65} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#334e9e"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#e6a04b"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel report-panel">
          <div className="panel-header">
            <div>
              <h3>Inventory Summary</h3>
              <p>Illustrative stock distribution.</p>
            </div>
            <Package size={20} />
          </div>

          <div className="report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="#334e9e" />
                  <Cell fill="#e6a04b" />
                  <Cell fill="#df6464" />
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel report-panel">
          <div className="panel-header">
            <div>
              <h3>Customer Growth</h3>
              <p>Customer count over the selected period.</p>
            </div>
          </div>

          <div className="report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={currentData.customers}
                margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="customers"
                  name="Customers"
                  stroke="#334e9e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel report-panel">
          <div className="panel-header">
            <div>
              <h3>Pending Invoices</h3>
              <p>Sample invoices requiring attention.</p>
            </div>
          </div>

          <div className="pending-invoice-list">
            {pendingInvoices.map((invoice) => (
              <div className="pending-invoice" key={invoice.id}>
                <div>
                  <strong>{invoice.id}</strong>
                  <p>{invoice.customer}</p>
                  <StatusBadge status={invoice.status} />
                </div>

                <strong>{formatCurrency(invoice.amount)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
