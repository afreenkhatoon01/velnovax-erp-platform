
import { useState } from "react";
import { PackageCheck, XCircle, Eye } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const suppliers = [
  "Tech Supplies India",
  "Global Electronics",
  "Office Essentials",
  "Digital Products Co.",
];

const products = [
  { id: "P001", name: "Laptop", cost: 42000 },
  { id: "P002", name: "Wireless Mouse", cost: 500 },
  { id: "P003", name: "Keyboard", cost: 750 },
  { id: "P004", name: "Monitor", cost: 9000 },
];

const initialPurchases = [
  {
    id: "PO-1001",
    supplier: "Tech Supplies India",
    product: "Laptop",
    quantity: 5,
    unitCost: 42000,
    total: 210000,
    date: "14 Oct 2026",
    status: "Ordered",
  },
  {
    id: "PO-1002",
    supplier: "Office Essentials",
    product: "Wireless Mouse",
    quantity: 20,
    unitCost: 500,
    total: 10000,
    date: "13 Oct 2026",
    status: "Received",
  },
  {
    id: "PO-1003",
    supplier: "Global Electronics",
    product: "Monitor",
    quantity: 3,
    unitCost: 9000,
    total: 27000,
    date: "12 Oct 2026",
    status: "Pending",
  },
];

const emptyForm = {
  supplier: suppliers[0],
  productId: products[0].id,
  quantity: "1",
  unitCost: String(products[0].cost),
};

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function Purchases() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredPurchases = purchases.filter((purchase) =>
    [
      purchase.id,
      purchase.supplier,
      purchase.product,
      purchase.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPurchaseValue = purchases
    .filter((purchase) => purchase.status !== "Cancelled")
    .reduce((sum, purchase) => sum + purchase.total, 0);

  const pendingCount = purchases.filter(
    (purchase) =>
      purchase.status === "Pending" ||
      purchase.status === "Ordered"
  ).length;

  const receivedCount = purchases.filter(
    (purchase) => purchase.status === "Received"
  ).length;

  const selectedProduct = products.find(
    (product) => product.id === form.productId
  );

  const openForm = () => {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const handleProductChange = (productId) => {
    const product = products.find((item) => item.id === productId);

    setForm((previous) => ({
      ...previous,
      productId,
      unitCost: String(product?.cost ?? ""),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const quantity = Number(form.quantity);
    const unitCost = Number(form.unitCost);

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (!Number.isFinite(unitCost) || unitCost < 0) {
      setError("Enter a valid purchase cost.");
      return;
    }

    const product = products.find(
      (item) => item.id === form.productId
    );

    if (!product || !form.supplier) {
      setError("Please select a supplier and product.");
      return;
    }

    const newPurchase = {
      id: `PO-${Date.now().toString().slice(-8)}`,
      supplier: form.supplier,
      product: product.name,
      quantity,
      unitCost,
      total: quantity * unitCost,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending",
    };

    setPurchases((previous) => [newPurchase, ...previous]);
    setShowForm(false);
    setForm(emptyForm);
  };

  const updateStatus = (purchaseId, status) => {
    setPurchases((previous) =>
      previous.map((purchase) =>
        purchase.id === purchaseId
          ? { ...purchase, status }
          : purchase
      )
    );
  };

  const columns = [
    { key: "id", label: "Purchase ID" },
    { key: "supplier", label: "Supplier" },
    { key: "product", label: "Product" },
    { key: "quantity", label: "Quantity" },
    {
      key: "total",
      label: "Total Cost",
      render: (total) => formatCurrency(total),
    },
    { key: "date", label: "Order Date" },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, purchase) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            title="View purchase details"
            aria-label={`View ${purchase.id}`}
            onClick={() => setSelectedPurchase(purchase)}
          >
            <Eye size={16} />
          </button>

          {(purchase.status === "Pending" ||
            purchase.status === "Ordered") && (
            <button
              type="button"
              className="action-button"
              title="Mark goods received"
              aria-label={`Receive ${purchase.id}`}
              onClick={() =>
                updateStatus(purchase.id, "Received")
              }
            >
              <PackageCheck size={16} />
            </button>
          )}

          {purchase.status !== "Received" &&
            purchase.status !== "Cancelled" && (
              <button
                type="button"
                className="action-button delete-action"
                title="Cancel purchase"
                aria-label={`Cancel ${purchase.id}`}
                onClick={() => {
                  if (
                    window.confirm(
                      `Cancel purchase order ${purchase.id}?`
                    )
                  ) {
                    updateStatus(purchase.id, "Cancelled");
                  }
                }}
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
        title="Purchase Management"
        description="Manage suppliers, purchase orders, and received goods."
        actionLabel="+ Create Purchase"
        onAction={openForm}
      />

      <div className="module-summary purchase-summary">
        <div className="stat-card">
          <span>Total Purchase Value</span>
          <h2>{formatCurrency(totalPurchaseValue)}</h2>
        </div>

        <div className="stat-card">
          <span>Total Purchase Orders</span>
          <h2>{purchases.length}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Orders</span>
          <h2>{pendingCount}</h2>
        </div>

        <div className="stat-card">
          <span>Received Orders</span>
          <h2>{receivedCount}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search purchase ID, supplier or product..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredPurchases}
        emptyMessage="No purchase orders found."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="purchase-form-title">
                  Create Purchase Order
                </h3>
                <p>Enter supplier and purchase details.</p>
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

            <form onSubmit={handleSubmit}>
              <label>Supplier</label>
              <select
                value={form.supplier}
                onChange={(event) =>
                  setForm({
                    ...form,
                    supplier: event.target.value,
                  })
                }
                required
              >
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>

              <label>Product</label>
              <select
                value={form.productId}
                onChange={(event) =>
                  handleProductChange(event.target.value)
                }
                required
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
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
                  setForm({
                    ...form,
                    quantity: event.target.value,
                  })
                }
                required
              />

              <label>Unit Purchase Cost (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.unitCost}
                onChange={(event) =>
                  setForm({
                    ...form,
                    unitCost: event.target.value,
                  })
                }
                required
              />

              <div className="purchase-total-preview">
                <span>Estimated Total</span>
                <strong>
                  {formatCurrency(
                    (Number(form.quantity) || 0) *
                      (Number(form.unitCost) || 0)
                  )}
                </strong>
              </div>

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

      {selectedPurchase && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-details-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="purchase-details-title">
                  Purchase Details
                </h3>
                <p>{selectedPurchase.id}</p>
              </div>

              <button
                type="button"
                className="action-button"
                aria-label="Close details"
                onClick={() => setSelectedPurchase(null)}
              >
                ×
              </button>
            </div>

            <div className="purchase-details">
              <p><strong>Supplier:</strong> {selectedPurchase.supplier}</p>
              <p><strong>Product:</strong> {selectedPurchase.product}</p>
              <p><strong>Quantity:</strong> {selectedPurchase.quantity}</p>
              <p><strong>Unit Cost:</strong> {formatCurrency(selectedPurchase.unitCost)}</p>
              <p><strong>Total:</strong> {formatCurrency(selectedPurchase.total)}</p>
              <p><strong>Date:</strong> {selectedPurchase.date}</p>
              <p><strong>Status:</strong> {selectedPurchase.status}</p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setSelectedPurchase(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;
