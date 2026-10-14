
import { useState } from "react";
import { LogIn, LogOut, Users, Clock3, CalendarDays } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";

const employees = [
  { id: 1, name: "Rahul Sharma", department: "Engineering" },
  { id: 2, name: "Priya Singh", department: "Human Resources" },
  { id: 3, name: "Arjun Verma", department: "Sales" },
  { id: 4, name: "Neha Gupta", department: "Marketing" },
];

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const today = getLocalDate();

const initialAttendance = [
  {
    id: 1,
    employeeId: 1,
    employee: "Rahul Sharma",
    department: "Engineering",
    date: today,
    checkIn: "09:05 AM",
    checkOut: "",
    status: "Present",
  },
  {
    id: 2,
    employeeId: 2,
    employee: "Priya Singh",
    department: "Human Resources",
    date: today,
    checkIn: "09:12 AM",
    checkOut: "05:04 PM",
    status: "Checked Out",
  },
  {
    id: 3,
    employeeId: 3,
    employee: "Arjun Verma",
    department: "Sales",
    date: today,
    checkIn: "09:30 AM",
    checkOut: "",
    status: "Present",
  },
];

function Attendance() {
  const [records, setRecords] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");

  const todaysRecords = records.filter(
    (record) => record.date === getLocalDate()
  );

  const checkedInEmployees = new Set(
    todaysRecords.map((record) => record.employeeId)
  );

  const eligibleEmployees = employees.filter(
    (employee) => !checkedInEmployees.has(employee.id)
  );

  const presentCount = todaysRecords.length;

  const checkedOutCount = todaysRecords.filter(
    (record) => record.status === "Checked Out"
  ).length;

  const workingCount = todaysRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const notCheckedInCount = Math.max(
    employees.length - presentCount,
    0
  );

  const filteredRecords = records.filter((record) =>
    [
      record.employee,
      record.department,
      record.date,
      record.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openCheckInForm = () => {
    setEmployeeId(String(eligibleEmployees[0]?.id ?? ""));
    setError("");
    setShowForm(true);
  };

  const handleCheckIn = (event) => {
    event.preventDefault();
    setError("");

    const selectedEmployee = eligibleEmployees.find(
      (employee) => employee.id === Number(employeeId)
    );

    if (!selectedEmployee) {
      setError("Select an employee who has not checked in today.");
      return;
    }

    const record = {
      id: Date.now(),
      employeeId: selectedEmployee.id,
      employee: selectedEmployee.name,
      department: selectedEmployee.department,
      date: getLocalDate(),
      checkIn: getCurrentTime(),
      checkOut: "",
      status: "Present",
    };

    setRecords((previous) => [record, ...previous]);
    setShowForm(false);
    setEmployeeId("");
  };

  const handleCheckOut = (recordId) => {
    const record = records.find((item) => item.id === recordId);

    if (
      !record ||
      record.date !== getLocalDate() ||
      record.status !== "Present"
    ) {
      return;
    }

    setRecords((previous) =>
      previous.map((item) =>
        item.id === recordId
          ? {
              ...item,
              checkOut: getCurrentTime(),
              status: "Checked Out",
            }
          : item
      )
    );
  };

  const columns = [
    { key: "employee", label: "Employee" },
    { key: "department", label: "Department" },
    {
      key: "date",
      label: "Date",
      render: (date) =>
        new Date(`${date}T12:00:00`).toLocaleDateString("en-IN"),
    },
    { key: "checkIn", label: "Check In" },
    {
      key: "checkOut",
      label: "Check Out",
      render: (time) => time || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, record) =>
        record.date === getLocalDate() &&
        record.status === "Present" ? (
          <button
            type="button"
            className="action-button"
            title="Check out employee"
            aria-label={`Check out ${record.employee}`}
            onClick={() => handleCheckOut(record.id)}
          >
            <LogOut size={16} />
          </button>
        ) : (
          <span className="attendance-complete">
            {record.status === "Checked Out" ? "Completed" : "—"}
          </span>
        ),
    },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Attendance Management"
        description="Track employee attendance, check-in times, and check-out records."
        actionLabel="+ Employee Check In"
        onAction={openCheckInForm}
      />

      <div className="module-summary attendance-summary">
        <div className="stat-card">
          <Users size={22} />
          <span>Total Employees</span>
          <h2>{employees.length}</h2>
        </div>

        <div className="stat-card">
          <CalendarDays size={22} />
          <span>Checked In Today</span>
          <h2>{presentCount}</h2>
        </div>

        <div className="stat-card">
          <Clock3 size={22} />
          <span>Currently Working</span>
          <h2>{workingCount}</h2>
        </div>

        <div className="stat-card">
          <LogOut size={22} />
          <span>Not Checked In</span>
          <h2>{notCheckedInCount}</h2>
        </div>
      </div>

      <div className="attendance-info">
        <div>
          <strong>Today's Attendance</strong>
          <p>
            {new Date(`${getLocalDate()}T12:00:00`).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </p>
        </div>

        <StatusBadge status={`${checkedOutCount} Checked Out`} />
      </div>

      <div className="module-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search employee, department or status..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredRecords}
        emptyMessage="No attendance records found."
      />

      {showForm && (
        <div className="modal-backdrop">
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkin-form-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="checkin-form-title">Employee Check In</h3>
                <p>Record the start of an employee's working day.</p>
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

            {eligibleEmployees.length > 0 ? (
              <form onSubmit={handleCheckIn}>
                <label>Select Employee</label>

                <select
                  value={employeeId}
                  onChange={(event) => setEmployeeId(event.target.value)}
                  required
                >
                  {eligibleEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} — {employee.department}
                    </option>
                  ))}
                </select>

                <p className="section-description attendance-time">
                  Check-in time will be recorded automatically as{" "}
                  {getCurrentTime()}.
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
                    <LogIn size={16} />
                    Confirm Check In
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="section-description">
                  All sample employees have already checked in today.
                </p>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
