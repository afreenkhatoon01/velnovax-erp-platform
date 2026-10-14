
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const initialProducts = [
  {
    id: 1,
    name: "Laptop",
    sku: "PRD-001",
    category: "Electronics",
    price: 55000,
    stock: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    sku: "PRD-002",
    category: "Accessories",
    price: 850,
    stock: 60,
    status: "Active",
  },
  {
    id: 3,
    name: "Keyboard",
    sku: "PRD-003",
    category: "Accessories",
    price: 1200,
    stock: 0,
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  status: "Active",
};

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredProducts = products.filter((product) =>
    [
      product.name,
      product.sku,
      product.category,
      product.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.sku.trim().toLowerCase() ===
          form.sku.trim().toLowerCase() &&
        product.id !== editingId
    );

    if (duplicateSku) {
      setError("This SKU is already in use.");
      return;
    }

    const productData = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price,
      stock,
    };

    if (editingId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((previous) => [
        ...previous,
        { id: Date.now(), ...productData },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmed) {
      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );
    }
  };

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    {
      key: "price",
      label: "Price",
      render: (price) =>
        `₹${Number(price).toLocaleString("en-IN")}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (stock) => (
        <span style={{ color: stock === 0 ? "#dc2626" : "inherit" }}>
          {stock}
          {stock === 0 ? " (Out of stock)" : ""}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, product) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            title="Edit product"
            aria-label={`Edit ${product.name}`}
            onClick={() => openEditForm(product)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="action-button delete-action"
            title="Delete product"
            aria-label={`Delete ${product.name}`}
            onClick={() => handleDelete(product.id)}
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
        title="Products"
        description="Manage products, categories, pricing and stock quantities."
        actionLabel="+ Add Product"
        onAction={openAddForm}
      />

      <div className="module-summary">
        <div className="stat-card">
          <span>Total Products</span>
          <h2>{products.length}</h2>
        </div>

        <div className="stat-card">
          <span>Active Products</span>
          <h2>
            {products.filter((p) => p.status === "Active").length}
          </h2>
        </div>

        <div className="stat-card">
          <span>Out of Stock</span>
          <h2>{products.filter((p) => p.stock === 0).length}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search products, SKU or category..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        emptyMessage="No products found. Try another search or add a product."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="product-form-title">
                  {editingId !== null ? "Edit Product" : "Add Product"}
                </h3>
                <p>Enter the product details below.</p>
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
              <label>Product Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />

              <label>SKU / Product Code</label>
              <input
                value={form.sku}
                onChange={(e) =>
                  setForm({ ...form, sku: e.target.value })
                }
                placeholder="Example: PRD-004"
                required
              />

              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="Enter category"
                required
              />

              <label>Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                placeholder="Enter price"
                required
              />

              <label>Stock Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                placeholder="Enter quantity"
                required
              />

              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

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
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
