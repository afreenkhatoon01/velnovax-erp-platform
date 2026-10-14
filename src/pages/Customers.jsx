
import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const initialCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    company: "Sharma Enterprises",
    email: "rahul@example.com",
    phone: "9876543210",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    company: "Singh Solutions",
    email: "priya@example.com",
    phone: "9876543211",
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun Verma",
    company: "Verma Traders",
    email: "arjun@example.com",
    phone: "9876543212",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "Active",
};

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredCustomers = customers.filter((customer) =>
    [
      customer.name,
      customer.company,
      customer.email,
      customer.phone,
      customer.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...form }
            : customer
        )
      );
    } else {
      setCustomers((previous) => [
        ...previous,
        { id: Date.now(), ...form },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (confirmed) {
      setCustomers((previous) =>
        previous.filter((customer) => customer.id !== id)
      );
    }
  };

  const columns = [
    { key: "name", label: "Customer Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, customer) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            aria-label={`Edit ${customer.name}`}
            title="Edit customer"
            onClick={() => openEditForm(customer)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="action-button delete-action"
            aria-label={`Delete ${customer.name}`}
            title="Delete customer"
            onClick={() => handleDelete(customer.id)}
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
        title="Customers"
        description="Manage customer profiles and business relationships."
        actionLabel="+ Add Customer"
        onAction={openAddForm}
      />

      <div className="module-summary">
        <div className="stat-card">
          <span>Total Customers</span>
          <h2>{customers.length}</h2>
        </div>

        <div className="stat-card">
          <span>Active Customers</span>
          <h2>
            {customers.filter((customer) => customer.status === "Active").length}
          </h2>
        </div>

        <div className="stat-card">
          <span>Inactive Customers</span>
          <h2>
            {customers.filter((customer) => customer.status === "Inactive").length}
          </h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, company or email..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        emptyMessage="No customers found. Try another search or add a customer."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="customer-form-title">
                  {editingId !== null ? "Edit Customer" : "Add Customer"}
                </h3>
                <p>Enter the customer details below.</p>
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
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter full name"
                required
              />

              <label>Company</label>
              <input
                value={form.company}
                onChange={(event) =>
                  setForm({ ...form, company: event.target.value })
                }
                placeholder="Enter company name"
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="Enter email address"
                required
              />

              <label>Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="Enter phone number"
                pattern="[0-9+() -]{7,20}"
                required
              />

              <label>Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingId !== null ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
