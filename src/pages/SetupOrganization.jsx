import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function SetupOrganization() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;

    let active = true;

    async function checkProfile() {
      try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        if (!active) return;

        if (
          profileSnapshot.exists() &&
          profileSnapshot.data().organizationId
        ) {
          navigate("/", { replace: true });
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError(
            "Profile check failed. Please verify that Firestore Rules are published."
          );
          setChecking(false);
        }
      }
    }

    checkProfile();

    return () => {
      active = false;
    };
  }, [user, loading, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in first.");
      return;
    }

    if (!businessName.trim() || !industry.trim()) {
      setError("Business name and industry are required.");
      return;
    }

    setSaving(true);

    try {
      // Create a unique organization document reference
      const organizationRef = doc(collection(db, "organizations"));
      const userRef = doc(db, "users", user.uid);

      // Save organization and user profile atomically
      const batch = writeBatch(db);

      batch.set(organizationRef, {
        name: businessName.trim(),
        industry: industry.trim(),
        phone: phone.trim(),
        address: address.trim(),
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      batch.set(userRef, {
        uid: user.uid,
        name:
          user.displayName ||
          user.email?.split("@")[0] ||
          "Admin",
        email: user.email || "",
        organizationId: organizationRef.id,
        role: "org_admin",
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Organization setup failed. Please check your Firestore Rules."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || checking) {
    return <div className="setup-loading">Checking your account...</div>;
  }

  return (
    <div className="setup-page">
      <form className="setup-card" onSubmit={handleSubmit}>
        <div className="setup-logo">V</div>

        <h1>Set up your organization</h1>
        <p className="setup-description">
          Add your business details to start using the ERP platform.
        </p>

        <label htmlFor="businessName">Business name *</label>
        <input
          id="businessName"
          className="setup-input"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="e.g. Afreen Technologies"
          required
        />

        <label htmlFor="industry">Industry *</label>
        <input
          id="industry"
          className="setup-input"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g. IT Services, Retail"
          required
        />

        <label htmlFor="phone">Business phone</label>
        <input
          id="phone"
          className="setup-input"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />

        <label htmlFor="address">Business address</label>
        <textarea
          id="address"
          className="setup-input setup-textarea"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter business address"
          rows={3}
        />

        {error && <p className="setup-error">{error}</p>}

        <button
          className="setup-button"
          type="submit"
          disabled={saving}
        >
          {saving ? "Creating organization..." : "Create Organization"}
        </button>

        <p className="setup-note">
          Your account will become the organization administrator.
        </p>
      </form>
    </div>
  );
}
export default SetupOrganization;