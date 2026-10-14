
import { useState } from "react";
import { CheckCircle2, Plus, XCircle } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const customerOptions = [
  "Rahul Sharma",
  "Priya Singh",
  "Arjun Verma",
  "Neha Gupta",
];

const productOptions = [
  { id: "1", name: "Laptop", price: 55000 },
  { id: "2", name: "Wireless Mouse", price: 850 },
  { id: "3", name: "Keyboard", price: 1200 },
  { id: "4", name: "Monitor", price: 12000 },
];

const initialOrders = [
  {
    id: "ORD-1001",
    customer: "Rahul Sharma",
    product: "Laptop",
    quantity: 1,
    subtotal: 55000,
    discountAmount: 0,
    taxAmount: 9900,
    total: 64900,
    status: "Completed",
    paymentStatus: "Paid",
  },
  {
    id: "ORD-1002",
    customer: "Priya Singh",
    product: "Wireless Mouse",
    quantity: 2,
    subtotal: 1700,
    discountAmount: 0,
    taxAmount: 306,
    total: 2006,
    status: "Processing",
    paymentStatus: "Unpaid",
  },
  {
    id: "ORD-1003",
    customer: "Arjun Verma",
    product: "Keyboard",
    quantity: 1,
    subtotal: 1200,
    discountAmount: 0,
    taxAmount: 216,
    total: 1416,
    status: "Pending",
    paymentStatus: "Unpaid",
  },
];

const emptyForm = {
  customer: "",
  productId: "1",
  quantity: "1",
  discount: "0",
  tax: "18",
};

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Sales() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const selectedProduct = productOptions.find(
    (product) => product.id === form.productId
  );

  const quantity = Number(form.quantity) || 0;
  const discountPercent = Number(form.discount) || 0;
  const taxPercent = Number(form.tax) || 0;

  const previewSubtotal = (selectedProduct?.price || 0) * quantity;
  const previewDiscount = previewSubtotal * discountPercent / 100;
  const previewTax =
    (previewSubtotal - previewDiscount) * taxPercent / 100;
  const previewTotal =
    previewSubtotal - previewDiscount + previewTax;

  const filteredOrders = orders.filter((order) =>
    [
      order.id,
      order.customer,
      order.product,
      order.status,
      order.paymentStatus,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const unpaidOrders = orders.filter(
    (order) => order.paymentStatus === "Unpaid"
  ).length;

  const openForm = () => {
    setForm({
      ...emptyForm,
      customer: customerOptions[0],
    });
    setError("");
    setShowForm(true);
  };

  const handleCreateOrder = (event) => {
    event.preventDefault();
    setError("");

    const product = productOptions.find(
      (item) => item.id === form.productId
    );

    const qty = Number(form.quantity);
    const discount = Number(form.discount);
    const tax = Number(form.tax);

    if (!form.customer || !product) {
      setError("Please select a customer and product.");
      return;
    }

    if (!Number.isInteger(qty) || qty < 1) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      setError("Discount must be between 0 and 100 percent.");
      return;
    }

    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      setError("Tax must be between 0 and 100 percent.");
      return;
    }

    const subtotal = product.price * qty;
    const discountAmount = subtotal * discount / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * tax / 100;
    const total = taxableAmount + taxAmount;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      customer: form.customer,
      product: product.name,
      quantity: qty,
      subtotal,
      discountAmount,
      taxAmount,
      total,
      status: "Pending",
      paymentStatus: "Unpaid",
    };

    setOrders((previous) => [newOrder, ...previous]);
    setShowForm(false);
    setForm(emptyForm);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const markAsPaid = (orderId) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus: "Paid" }
          : order
      )
    );
  };

  const cancelOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: "Cancelled" }
          : order
      )
    );
  };

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    { key: "product", label: "Product" },
    { key: "quantity", label: "Qty" },
    {
      key: "total",
      label: "Total Amount",
      render: (total) => formatCurrency(total),
    },
    {
      key: "status",
      label: "Order Status",
      render: (status, order) => (
        <select
          className="inline-select"
          aria-label={`Status for ${order.id}`}
          value={status}
          onChange={(event) =>
            updateOrderStatus(order.id, event.target.value)
          }
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, order) => (
        <div className="table-actions">
          {order.paymentStatus !== "Paid" && (
            <button
              type="button"
              className="action-button"
              title="Mark as paid"
              aria-label={`Mark ${order.id} as paid`}
              onClick={() => markAsPaid(order.id)}
            >
              <CheckCircle2 size={16} />
            </button>
          )}

          {order.status !== "Cancelled" &&
            order.status !== "Completed" && (
              <button
                type="button"
                className="action-button delete-action"
                title="Cancel order"
                aria-label={`Cancel ${order.id}`}
                onClick={() => cancelOrder(order.id)}
              >
                <XCircle size={16} />
              </button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Sales & Orders"
        description="Create orders, track sales, and manage payment status."
        actionLabel="+ Create Order"
        onAction={openForm}
      />

      <div className="module-summary sales-summary">
        <div className="stat-card">
          <span>Total Order Value</span>
          <h2>{formatCurrency(totalSales)}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Orders</span>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="stat-card">
          <span>Completed Orders</span>
          <h2>{completedOrders}</h2>
        </div>

        <div className="stat-card">
          <span>Unpaid Orders</span>
          <h2>{unpaidOrders}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search order ID, customer or product..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        emptyMessage="No orders found. Create a new order to get started."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="order-form-title">Create Sales Order</h3>
                <p>Select a customer and add product details.</p>
              </div>

              <button
                type="button"
                className="action-button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <label>Customer</label>
              <select
                value={form.customer}
                onChange={(event) =>
                  setForm({ ...form, customer: event.target.value })
                }
                required
              >
                {customerOptions.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>

              <label>Product</label>
              <select
                value={form.productId}
                onChange={(event) =>
                  setForm({ ...form, productId: event.target.value })
                }
                required
              >
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {formatCurrency(product.price)}
                  </option>
                ))}
              </select>

              <label>Quantity</label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(event) =>
                  setForm({ ...form, quantity: event.target.value })
                }
                required
              />

              <label>Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.discount}
                onChange={(event) =>
                  setForm({ ...form, discount: event.target.value })
                }
                required
              />

              <label>Tax (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.tax}
                onChange={(event) =>
                  setForm({ ...form, tax: event.target.value })
                }
                required
              />

              <div className="order-total-preview">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(previewSubtotal)}</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong>−{formatCurrency(previewDiscount)}</strong>
                </div>
                <div>
                  <span>Tax</span>
                  <strong>{formatCurrency(previewTax)}</strong>
                </div>
                <div className="order-grand-total">
                  <span>Order Total</span>
                  <strong>{formatCurrency(previewTotal)}</strong>
                </div>
              </div>

              <p className="section-description">
                New orders start with Pending status and Unpaid payment status.
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
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
