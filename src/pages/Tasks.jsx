
import { useState } from "react";
import { Pencil, Trash2, X, CheckSquare } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const initialTasks = [
  {
    id: 1,
    title: "Design ERP Dashboard",
    project: "ERP Platform",
    assignee: "Rahul Sharma",
    priority: "High",
    deadline: "2026-10-17",
    status: "In Progress",
    description: "Complete the responsive dashboard UI.",
  },
  {
    id: 2,
    title: "Implement Customer Management",
    project: "ERP Platform",
    assignee: "Priya Singh",
    priority: "Medium",
    deadline: "2026-10-20",
    status: "To Do",
    description: "Develop customer CRUD functionality.",
  },
  {
    id: 3,
    title: "Review Authentication Flow",
    project: "ERP Platform",
    assignee: "Arjun Verma",
    priority: "Urgent",
    deadline: "2026-10-15",
    status: "Review",
    description: "Review login and protected route behavior.",
  },
  {
    id: 4,
    title: "Prepare Project Documentation",
    project: "ERP Platform",
    assignee: "Neha Gupta",
    priority: "Low",
    deadline: "2026-10-22",
    status: "Completed",
    description: "Document setup and project features.",
  },
];

const employees = [
  "Rahul Sharma",
  "Priya Singh",
  "Arjun Verma",
  "Neha Gupta",
];

const emptyForm = {
  title: "",
  project: "ERP Platform",
  assignee: employees[0],
  priority: "Medium",
  deadline: "",
  status: "To Do",
  description: "",
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN");
}

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredTasks = tasks.filter((task) =>
    [
      task.title,
      task.project,
      task.assignee,
      task.priority,
      task.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingCount = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      deadline: new Date().toISOString().slice(0, 10),
    });
    setError("");
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingId(task.id);

    setForm({
      title: task.title,
      project: task.project,
      assignee: task.assignee,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status,
      description: task.description,
    });

    setError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.project.trim()) {
      setError("Please enter the task title and project name.");
      return;
    }

    if (!form.deadline) {
      setError("Please select a deadline.");
      return;
    }

    const taskData = {
      ...form,
      title: form.title.trim(),
      project: form.project.trim(),
      description: form.description.trim(),
    };

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? { ...task, ...taskData }
            : task
        )
      );
    } else {
      setTasks((previous) => [
        { id: Date.now(), ...taskData },
        ...previous,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const updateStatus = (id, status) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const columns = [
    { key: "title", label: "Task" },
    { key: "project", label: "Project" },
    { key: "assignee", label: "Assigned To" },
    {
      key: "priority",
      label: "Priority",
      render: (priority) => (
        <span className={`priority-badge priority-${priority.toLowerCase()}`}>
          {priority}
        </span>
      ),
    },
    {
      key: "deadline",
      label: "Deadline",
      render: (deadline) => formatDate(deadline),
    },
    {
      key: "status",
      label: "Status",
      render: (status, task) => (
        <select
          className="inline-select"
          value={status}
          aria-label={`Status for ${task.title}`}
          onChange={(event) =>
            updateStatus(task.id, event.target.value)
          }
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, task) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-button"
            title="Edit task"
            aria-label={`Edit ${task.title}`}
            onClick={() => openEditForm(task)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="action-button delete-action"
            title="Delete task"
            aria-label={`Delete ${task.title}`}
            onClick={() => handleDelete(task.id)}
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
        title="Tasks & Projects"
        description="Create tasks, assign team members, and track progress."
        actionLabel="+ Create Task"
        onAction={openAddForm}
      />

      <div className="module-summary tasks-summary">
        <div className="stat-card">
          <CheckSquare size={22} />
          <span>Total Tasks</span>
          <h2>{tasks.length}</h2>
        </div>

        <div className="stat-card">
          <span>To Do</span>
          <h2>{pendingCount}</h2>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <h2>{inProgressCount}</h2>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <h2>{completedCount}</h2>
        </div>
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search task, project or assignee..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        emptyMessage="No tasks found. Create a task to get started."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="task-form-title">
                  {editingId !== null ? "Edit Task" : "Create Task"}
                </h3>
                <p>Enter task details and assign a team member.</p>
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
              <label>Task Title</label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Enter task title"
                required
              />

              <label>Project Name</label>
              <input
                value={form.project}
                onChange={(event) =>
                  setForm({ ...form, project: event.target.value })
                }
                placeholder="Enter project name"
                required
              />

              <label>Assign To</label>
              <select
                value={form.assignee}
                onChange={(event) =>
                  setForm({ ...form, assignee: event.target.value })
                }
                required
              >
                {employees.map((employee) => (
                  <option key={employee} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>

              <label>Priority</label>
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              <label>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm({ ...form, deadline: event.target.value })
                }
                required
              />

              <label>Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>

              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Describe the task (optional)"
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
                  {editingId !== null ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
