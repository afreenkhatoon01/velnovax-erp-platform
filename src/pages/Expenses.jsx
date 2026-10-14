
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const categories = [
  "Office Supplies",
  "Travel",
  "Utilities",
  "Salary",
  "Software",
  "Marketing",
  "Maintenance",
  "Other",
];

const initialExpenses = [
  {
    id: 1,
    title: "Office Stationery",
    category: "Office Supplies",
    date: "2026-10-10",
    amount: 2500,
    paymentMethod: "UPI",
    status: "Paid",
    notes: "Monthly stationery purchase",
  },
  {
    id: 2,
    title: "Internet Bill",
    category: "Utilities",
    date: "2026-10-12",
    amount: 1200,
    paymentMethod: "Bank Transfer",
    status: "Pending",
    notes: "Office internet charges",
  },
  {
    id: 3,
    title: "Software Subscription",
    category: "Software",
    date: "2026-10-13",
    amount: 3500,
    paymentMethod: "Card",
    status: "Paid",
    notes: "Monthly software subscription",
  },
];

const emptyForm = {
  title: "",
  category: "Office Supplies",
  date: new Date().toISOString().slice(0, 10),
  amount: "",
  paymentMethod: "UPI",
  status: "Pending",
  notes: "",
};

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredExpenses = expenses.filter((expense) =>
    [
      expense.title,
      expense.category,
      expense.paymentMethod,
      expense.status,
      expense.notes,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const paidExpenses = expenses
    .filter((expense) => expense.status === "Paid")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const pendingExpenses = expenses
    .filter((expense) => expense.status === "Pending")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const thisMonthExpenses = expenses
    .filter((expense) =>
      expense.date.startsWith(new Date().toISOString().slice(0, 7))
    )
    .reduce((sum, expense) => sum + expense.amount, 0);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      category: expense.category,
      date: expense.date,
      amount: String(expense.amount),
      paymentMethod: expense.paymentMethod,
      status: expense.status,
      notes: expense.notes,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const amount = Number(form.amount);

    if (!form.title.trim()) {
      setError("Please enter an expense title.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Expense amount must be greater than zero.");
      return;
    }

    if (!form.date) {
      setError("Please select the expense date.");
      return;
    }

    const expenseData = {
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      amount,
    };

    if (editingId !== null) {
      setExpenses((previous) =>
        previous.map((expense) =>
          expense.id === editingId
            ? { ...expense, ...expenseData }
            : expense
        )
      );
    } else {
      setExpenses((previous) => [
        { id: Date.now(), ...expenseData },
        ...previous,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
  };

  const columns = [
    { key: "title", label: "Expense" },
    { key: "category", label: "Category" },
    { key: "date", label: "Date" },
    {
      key: "amount",
      label: "Amount",
      render: (amount) => formatCurrency(amount),
    },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, expense) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            title="Edit expense"
            aria-label={`Edit ${expense.title}`}
            onClick={() => openEditForm(expense)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="action-button delete-action"
            title="Delete expense"
            aria-label={`Delete ${expense.title}`}
            onClick={() => handleDelete(expense.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Expense Management"
        description="Track business expenses, categories and payment status."
        actionLabel="+ Add Expense"
        onAction={openAddForm}
      />

      <div className="module-summary expense-summary">
        <div className="stat-card">
          <span>Total Expenses</span>
          <h2>{formatCurrency(totalExpenses)}</h2>
        </div>

        <div className="stat-card">
          <span>Paid Expenses</span>
          <h2>{formatCurrency(paidExpenses)}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Payments</span>
          <h2>{formatCurrency(pendingExpenses)}</h2>
        </div>

        <div className="stat-card">
          <span>This Month</span>
          <h2>{formatCurrency(thisMonthExpenses)}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search expense, category or payment..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredExpenses}
        emptyMessage="No expenses found. Add an expense to get started."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="expense-form-title">
                  {editingId !== null ? "Edit Expense" : "Add Expense"}
                </h3>
                <p>Enter the business expense details.</p>
              </div>

              <button
                type="button"
                className="action-button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Expense Title</label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="e.g. Office electricity bill"
                required
              />

              <label>Category</label>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm({ ...form, date: event.target.value })
                }
                required
              />

              <label>Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(event) =>
                  setForm({ ...form, amount: event.target.value })
                }
                placeholder="Enter amount"
                required
              />

              <label>Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(event) =>
                  setForm({ ...form, paymentMethod: event.target.value })
                }
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>

              <label>Payment Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>

              <label>Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                placeholder="Optional expense details"
              />

              {error && <p className="auth-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingId !== null ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
