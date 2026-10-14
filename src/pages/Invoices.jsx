
import { useState } from "react";
import { CheckCircle2, Trash2, X } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const initialInvoices = [
  {
    id: "INV-1001",
    customer: "Rahul Sharma",
    description: "Laptop Purchase",
    issueDate: "2026-10-10",
    dueDate: "2026-10-20",
    subtotal: 55000,
    tax: 9900,
    total: 64900,
    amountPaid: 64900,
    status: "Sent",
  },
  {
    id: "INV-1002",
    customer: "Priya Singh",
    description: "Office Accessories",
    issueDate: "2026-10-12",
    dueDate: "2026-10-22",
    subtotal: 5000,
    tax: 900,
    total: 5900,
    amountPaid: 2000,
    status: "Sent",
  },
  {
    id: "INV-1003",
    customer: "Arjun Verma",
    description: "Monitor Purchase",
    issueDate: "2026-09-20",
    dueDate: "2026-09-30",
    subtotal: 12000,
    tax: 2160,
    total: 14160,
    amountPaid: 0,
    status: "Sent",
  },
];

const emptyForm = {
  customer: "",
  description: "",
  subtotal: "",
  taxPercent: "18",
  amountPaid: "0",
  dueDate: "",
  status: "Sent",
};

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function getInvoiceStatus(invoice) {
  if (invoice.status === "Draft") return "Draft";

  if (invoice.total > 0 && invoice.amountPaid >= invoice.total) {
    return "Paid";
  }

  if (invoice.amountPaid > 0) {
    return "Partially Paid";
  }

  const today = new Date().toISOString().slice(0, 10);

  if (invoice.dueDate < today) return "Overdue";

  return "Sent";
}

function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const subtotal = Number(form.subtotal) || 0;
  const taxPercent = Number(form.taxPercent) || 0;
  const taxAmount = subtotal * taxPercent / 100;
  const total = subtotal + taxAmount;

  const visibleInvoices = invoices.map((invoice) => ({
    ...invoice,
    status: getInvoiceStatus(invoice),
  }));

  const filteredInvoices = visibleInvoices.filter((invoice) =>
    [
      invoice.id,
      invoice.customer,
      invoice.description,
      invoice.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalInvoiced = invoices
    .filter((invoice) => invoice.status !== "Draft")
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const totalReceived = invoices.reduce(
    (sum, invoice) => sum + invoice.amountPaid,
    0
  );

  const outstanding = invoices.reduce(
    (sum, invoice) =>
      sum +
      (invoice.status === "Draft"
        ? 0
        : Math.max(0, invoice.total - invoice.amountPaid)),
    0
  );

  const overdueCount = visibleInvoices.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  const openForm = () => {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const cleanSubtotal = Number(form.subtotal);
    const cleanTaxPercent = Number(form.taxPercent);
    const cleanAmountPaid = Number(form.amountPaid);

    if (!form.customer.trim() || !form.description.trim()) {
      setError("Please enter customer and invoice description.");
      return;
    }

    if (!Number.isFinite(cleanSubtotal) || cleanSubtotal <= 0) {
      setError("Invoice amount must be greater than zero.");
      return;
    }

    if (
      !Number.isFinite(cleanTaxPercent) ||
      cleanTaxPercent < 0 ||
      cleanTaxPercent > 100
    ) {
      setError("Tax must be between 0 and 100 percent.");
      return;
    }

    const taxAmount = cleanSubtotal * cleanTaxPercent / 100;
    const invoiceTotal = cleanSubtotal + taxAmount;

    if (
      !Number.isFinite(cleanAmountPaid) ||
      cleanAmountPaid < 0 ||
      cleanAmountPaid > invoiceTotal
    ) {
      setError("Amount paid must be between ₹0 and the invoice total.");
      return;
    }

    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-8)}`,
      customer: form.customer.trim(),
      description: form.description.trim(),
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: form.dueDate,
      subtotal: cleanSubtotal,
      tax: taxAmount,
      total: invoiceTotal,
      amountPaid: cleanAmountPaid,
      status: form.status,
    };

    setInvoices((previous) => [newInvoice, ...previous]);
    setShowForm(false);
    setForm(emptyForm);
  };

  const markAsPaid = (invoiceId) => {
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              amountPaid: invoice.total,
            }
          : invoice
      )
    );
  };

  const deleteInvoice = (invoiceId) => {
    if (!window.confirm("Delete this invoice?")) return;

    setInvoices((previous) =>
      previous.filter((invoice) => invoice.id !== invoiceId)
    );
  };

  const columns = [
    { key: "id", label: "Invoice ID" },
    { key: "customer", label: "Customer" },
    { key: "description", label: "Description" },
    { key: "issueDate", label: "Issue Date" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "total",
      label: "Total",
      render: (amount) => formatCurrency(amount),
    },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (amount) => formatCurrency(amount),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, invoice) => (
        <div className="table-actions">
          {invoice.status !== "Paid" &&
            invoice.status !== "Draft" && (
              <button
                type="button"
                className="action-button"
                title="Mark invoice as paid"
                aria-label={`Mark ${invoice.id} as paid`}
                onClick={() => markAsPaid(invoice.id)}
              >
                <CheckCircle2 size={16} />
              </button>
            )}

          <button
            type="button"
            className="action-button delete-action"
            title="Delete invoice"
            aria-label={`Delete ${invoice.id}`}
            onClick={() => deleteInvoice(invoice.id)}
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
        title="Invoice Management"
        description="Create invoices, track payments and monitor outstanding balances."
        actionLabel="+ Create Invoice"
        onAction={openForm}
      />

      <div className="module-summary invoice-summary">
        <div className="stat-card">
          <span>Total Invoiced</span>
          <h2>{formatCurrency(totalInvoiced)}</h2>
        </div>

        <div className="stat-card">
          <span>Payments Received</span>
          <h2>{formatCurrency(totalReceived)}</h2>
        </div>

        <div className="stat-card">
          <span>Outstanding</span>
          <h2>{formatCurrency(outstanding)}</h2>
        </div>

        <div className="stat-card">
          <span>Overdue Invoices</span>
          <h2>{overdueCount}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search invoice ID, customer or status..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredInvoices}
        emptyMessage="No invoices found."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="invoice-form-title">Create Invoice</h3>
                <p>Enter the billing and payment details.</p>
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
              <label>Customer Name</label>
              <input
                value={form.customer}
                onChange={(event) =>
                  setForm({ ...form, customer: event.target.value })
                }
                placeholder="Enter customer name"
                required
              />

              <label>Description</label>
              <input
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Enter invoice description"
                required
              />

              <label>Subtotal (₹)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.subtotal}
                onChange={(event) =>
                  setForm({ ...form, subtotal: event.target.value })
                }
                required
              />

              <label>Tax (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.taxPercent}
                onChange={(event) =>
                  setForm({ ...form, taxPercent: event.target.value })
                }
                required
              />

              <label>Amount Already Paid (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amountPaid}
                onChange={(event) =>
                  setForm({ ...form, amountPaid: event.target.value })
                }
                required
              />

              <label>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm({ ...form, dueDate: event.target.value })
                }
                required
              />

              <label>Initial Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
              </select>

              <div className="purchase-total-preview">
                <span>Invoice Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <p className="section-description">
                The displayed invoice status updates from payment and due-date information.
              </p>

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
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;
