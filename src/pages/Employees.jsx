
import { useState } from "react";
import { Pencil, Trash2, X, Users } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const departments = [
  "Engineering",
  "Human Resources",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
];

const initialEmployees = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    department: "Engineering",
    role: "Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9876543211",
    department: "Human Resources",
    role: "HR Executive",
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun Verma",
    email: "arjun@example.com",
    phone: "9876543212",
    department: "Sales",
    role: "Sales Executive",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "Engineering",
  role: "",
  status: "Active",
};

function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    [
      employee.name,
      employee.email,
      employee.phone,
      employee.department,
      employee.role,
      employee.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveCount = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setEditingId(employee.id);

    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status,
    });

    setError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = form.email.trim().toLowerCase();

    const emailExists = employees.some(
      (employee) =>
        employee.email.toLowerCase() === cleanEmail &&
        employee.id !== editingId
    );

    if (emailExists) {
      setError("This email is already assigned to another employee.");
      return;
    }

    const cleanPhone = form.phone.trim();

    if (!/^[0-9+() -]{7,20}$/.test(cleanPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    const employeeData = {
      ...form,
      name: form.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      role: form.role.trim(),
    };

    if (editingId !== null) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingId
            ? { ...employee, ...employeeData }
            : employee
        )
      );
    } else {
      setEmployees((previous) => [
        { id: Date.now(), ...employeeData },
        ...previous,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== id)
    );
  };

  const columns = [
    { key: "name", label: "Employee Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, employee) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            title="Edit employee"
            aria-label={`Edit ${employee.name}`}
            onClick={() => openEditForm(employee)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="action-button delete-action"
            title="Delete employee"
            aria-label={`Delete ${employee.name}`}
            onClick={() => handleDelete(employee.id)}
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
        title="Employee Management"
        description="Manage employee profiles, departments, roles and account status."
        actionLabel="+ Add Employee"
        onAction={openAddForm}
      />

      <div className="module-summary employee-summary">
        <div className="stat-card">
          <Users size={22} />
          <span>Total Employees</span>
          <h2>{employees.length}</h2>
        </div>

        <div className="stat-card">
          <span>Active Employees</span>
          <h2>{activeCount}</h2>
        </div>

        <div className="stat-card">
          <span>Inactive Employees</span>
          <h2>{inactiveCount}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, department or role..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployees}
        emptyMessage="No employees found. Try another search or add an employee."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="employee-form-title">
                  {editingId !== null ? "Edit Employee" : "Add Employee"}
                </h3>
                <p>Enter the employee's basic information.</p>
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
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter employee name"
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="employee@example.com"
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="Enter phone number"
                required
              />

              <label>Department</label>
              <select
                value={form.department}
                onChange={(event) =>
                  setForm({ ...form, department: event.target.value })
                }
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <label>Role</label>
              <input
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
                placeholder="e.g. Developer or Manager"
                required
              />

              <label>Account Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
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
                  {editingId !== null ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;

