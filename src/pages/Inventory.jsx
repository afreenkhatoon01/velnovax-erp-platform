
import { useState } from "react";
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const initialInventory = [
  {
    id: 1,
    name: "Laptop",
    sku: "PRD-001",
    category: "Electronics",
    quantity: 25,
    minStock: 5,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    sku: "PRD-002",
    category: "Accessories",
    quantity: 60,
    minStock: 10,
  },
  {
    id: 3,
    name: "Keyboard",
    sku: "PRD-003",
    category: "Accessories",
    quantity: 0,
    minStock: 5,
  },
  {
    id: 4,
    name: "Monitor",
    sku: "PRD-004",
    category: "Electronics",
    quantity: 7,
    minStock: 8,
  },
];

function getStockStatus(quantity, minStock) {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= minStock) return "Low Stock";
  return "In Stock";
}

function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [movement, setMovement] = useState({
    productId: "1",
    type: "Stock In",
    quantity: "",
    note: "",
  });

  const [history, setHistory] = useState([]);

  const filteredInventory = inventory
    .filter((item) =>
      [item.name, item.sku, item.category]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .map((item) => ({
      ...item,
      status: getStockStatus(item.quantity, item.minStock),
    }));

  const totalUnits = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const lowStockCount = inventory.filter(
    (item) => item.quantity > 0 && item.quantity <= item.minStock
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => item.quantity === 0
  ).length;

  const openForm = (productId) => {
    setMovement({
      productId: String(productId ?? inventory[0]?.id ?? ""),
      type: "Stock In",
      quantity: "",
      note: "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const product = inventory.find(
      (item) => item.id === Number(movement.productId)
    );

    const quantity = Number(movement.quantity);

    if (!product) {
      setError("Please select a valid product.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (movement.type === "Stock Out" && quantity > product.quantity) {
      setError(`Only ${product.quantity} units are currently available.`);
      return;
    }

    const updatedQuantity =
      movement.type === "Stock In"
        ? product.quantity + quantity
        : product.quantity - quantity;

    setInventory((previous) =>
      previous.map((item) =>
        item.id === product.id
          ? { ...item, quantity: updatedQuantity }
          : item
      )
    );

    setHistory((previous) => [
      {
        id: `${Date.now()}-${previous.length}`,
        product: product.name,
        sku: product.sku,
        type: movement.type,
        quantity,
        note: movement.note.trim() || "No notes",
        date: new Date().toLocaleString(),
      },
      ...previous,
    ]);

    setShowForm(false);
  };

  const inventoryColumns = [
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Available Stock" },
    { key: "minStock", label: "Minimum Stock" },
    {
      key: "status",
      label: "Stock Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, item) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            title="Stock In"
            aria-label={`Stock in ${item.name}`}
            onClick={() => openForm(item.id)}
          >
            <ArrowDownToLine size={16} />
          </button>

          <button
            type="button"
            className="action-button delete-action"
            title="Stock Out"
            aria-label={`Stock out ${item.name}`}
            disabled={item.quantity === 0}
            onClick={() => {
              setMovement({
                productId: String(item.id),
                type: "Stock Out",
                quantity: "",
                note: "",
              });
              setError("");
              setShowForm(true);
            }}
          >
            <ArrowUpFromLine size={16} />
          </button>
        </div>
      ),
    },
  ];

  const historyColumns = [
    { key: "date", label: "Date" },
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    {
      key: "type",
      label: "Movement",
      render: (type) => (
        <StatusBadge
          status={type === "Stock In" ? "Stock In" : "Stock Out"}
        />
      ),
    },
    { key: "quantity", label: "Quantity" },
    { key: "note", label: "Notes" },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Inventory Management"
        description="Monitor stock levels and record incoming and outgoing products."
        actionLabel="+ Stock Movement"
        onAction={() => openForm()}
      />

      <div className="module-summary inventory-summary">
        <div className="stat-card">
          <Package size={22} />
          <span>Total Product Types</span>
          <h2>{inventory.length}</h2>
        </div>

        <div className="stat-card">
          <ArrowDownToLine size={22} />
          <span>Total Units in Stock</span>
          <h2>{totalUnits}</h2>
        </div>

        <div className="stat-card">
          <AlertTriangle size={22} />
          <span>Low Stock Products</span>
          <h2>{lowStockCount}</h2>
        </div>

        <div className="stat-card">
          <ArrowUpFromLine size={22} />
          <span>Out of Stock</span>
          <h2>{outOfStockCount}</h2>
        </div>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="inventory-alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Inventory needs attention</strong>
            <p>
              {lowStockCount} low-stock product(s) and{" "}
              {outOfStockCount} out-of-stock product(s).
            </p>
          </div>
        </div>
      )}

      <div className="inventory-section">
        <h3>Current Stock</h3>
        <p className="section-description">
          View product quantities and record stock changes.
        </p>

        <div className="module-toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products or SKU..."
          />
        </div>

        <DataTable
          columns={inventoryColumns}
          data={filteredInventory}
          emptyMessage="No inventory items found."
        />
      </div>

      <div className="inventory-section">
        <h3>Stock Movement History</h3>
        <p className="section-description">
          Recent stock-in and stock-out records for this session.
        </p>

        <DataTable
          columns={historyColumns}
          data={history}
          emptyMessage="No stock movements recorded yet."
        />
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="movement-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="movement-title">Record Stock Movement</h3>
                <p>Update the available product quantity.</p>
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
              <label>Product</label>
              <select
                value={movement.productId}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    productId: event.target.value,
                  })
                }
                required
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — Available: {item.quantity}
                  </option>
                ))}
              </select>

              <label>Movement Type</label>
              <select
                value={movement.type}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    type: event.target.value,
                  })
                }
              >
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>

              <label>Quantity</label>
              <input
                type="number"
                min="1"
                step="1"
                value={movement.quantity}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    quantity: event.target.value,
                  })
                }
                placeholder="Enter quantity"
                required
              />

              <label>Notes</label>
              <input
                value={movement.note}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    note: event.target.value,
                  })
                }
                placeholder="e.g. New purchase or customer order"
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
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
