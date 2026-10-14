
import { useState } from "react";
import { Building2, BellRing, Globe, Save } from "lucide-react";

import PageHeader from "../components/common/PageHeader";

const initialSettings = {
  companyName: "My Organization",
  email: "",
  phone: "",
  address: "",
  industry: "Technology",
  currency: "INR",
  timezone: "Asia/Kolkata",
  emailNotifications: true,
  lowStockAlerts: true,
  invoiceReminders: true,
  taskNotifications: true,
};

function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedMessage, setSavedMessage] = useState("");

  const updateField = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSavedMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Frontend-only demonstration: saves to component state.
    setSavedMessage(
      "Settings saved for this session. Database saving is not connected yet."
    );
  };

  return (
    <div className="dashboard">
      <PageHeader
        title="Organization Settings"
        description="Manage your business profile and application preferences."
      />

      {savedMessage && (
        <div className="settings-message" role="status">
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <section className="panel settings-panel">
          <div className="settings-section-title">
            <Building2 size={21} />

            <div>
              <h3>Business Information</h3>
              <p>Basic details about your organization.</p>
            </div>
          </div>

          <div className="settings-fields">
            <div className="settings-field">
              <label htmlFor="companyName">Business Name</label>
              <input
                id="companyName"
                value={settings.companyName}
                onChange={(event) =>
                  updateField("companyName", event.target.value)
                }
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                value={settings.industry}
                onChange={(event) =>
                  updateField("industry", event.target.value)
                }
              >
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="settings-field">
              <label htmlFor="companyEmail">Business Email</label>
              <input
                id="companyEmail"
                type="email"
                value={settings.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                placeholder="business@example.com"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="companyPhone">Phone Number</label>
              <input
                id="companyPhone"
                type="tel"
                value={settings.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                placeholder="Enter business phone"
              />
            </div>

            <div className="settings-field full-width">
              <label htmlFor="companyAddress">Business Address</label>
              <textarea
                id="companyAddress"
                rows={3}
                value={settings.address}
                onChange={(event) =>
                  updateField("address", event.target.value)
                }
                placeholder="Enter the registered business address"
              />
            </div>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="settings-section-title">
            <Globe size={21} />

            <div>
              <h3>Regional Preferences</h3>
              <p>Choose your currency and time zone.</p>
            </div>
          </div>

          <div className="settings-fields">
            <div className="settings-field">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={settings.currency}
                onChange={(event) =>
                  updateField("currency", event.target.value)
                }
              >
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>

            <div className="settings-field">
              <label htmlFor="timezone">Time Zone</label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(event) =>
                  updateField("timezone", event.target.value)
                }
              >
                <option value="Asia/Kolkata">
                  Asia/Kolkata (IST)
                </option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">
                  Europe/London
                </option>
                <option value="America/New_York">
                  America/New_York
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="settings-section-title">
            <BellRing size={21} />

            <div>
              <h3>Notification Preferences</h3>
              <p>Choose which updates you want to receive.</p>
            </div>
          </div>

          <div className="settings-options">
            <label className="settings-option">
              <div>
                <strong>Email Notifications</strong>
                <p>Receive business updates through email.</p>
              </div>

              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(event) =>
                  updateField(
                    "emailNotifications",
                    event.target.checked
                  )
                }
              />
            </label>

            <label className="settings-option">
              <div>
                <strong>Low Stock Alerts</strong>
                <p>Get notified when products reach minimum stock.</p>
              </div>

              <input
                type="checkbox"
                checked={settings.lowStockAlerts}
                onChange={(event) =>
                  updateField("lowStockAlerts", event.target.checked)
                }
              />
            </label>

            <label className="settings-option">
              <div>
                <strong>Invoice Reminders</strong>
                <p>Receive reminders about unpaid invoices.</p>
              </div>

              <input
                type="checkbox"
                checked={settings.invoiceReminders}
                onChange={(event) =>
                  updateField("invoiceReminders", event.target.checked)
                }
              />
            </label>

            <label className="settings-option">
              <div>
                <strong>Task Notifications</strong>
                <p>Receive task assignments and status updates.</p>
              </div>

              <input
                type="checkbox"
                checked={settings.taskNotifications}
                onChange={(event) =>
                  updateField("taskNotifications", event.target.checked)
                }
              />
            </label>
          </div>
        </section>

        <div className="settings-save-row">
          <button type="submit" className="primary-button">
            <Save size={17} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
