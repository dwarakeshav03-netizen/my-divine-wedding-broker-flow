import React, { useState } from "react";

export default function ProfilePreviewModal({ data, onClose, onConfirm }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={title}>Verify Your Details</h2>

        {/* BASIC INFO */}
        <Section title="Basic Details">
          <Row label="Profile For" value={data.createdFor} />
          <Row label="Name" value={`${data.firstName} ${data.lastName}`} />
          <Row label="Gender" value={data.gender} />
          <Row label="DOB" value={data.dob} />
          <Row label="Location" value={data.location} />
        </Section>

        {/* CONTACT */}
        <Section title="Contact">
          <Row label="Email" value={data.email} />
          <Row label="Mobile" value={`${data.mobileCode} ${data.mobile}`} />
        </Section>

        {/* ASTROLOGY */}
        <Section title="Astrology">
          <Row label="Raasi" value={data.raasi} />
          <Row label="Star" value={data.star} />
          <Row label="Lagnam" value={data.lagnam} />
        </Section>

        {/* COMMUNITY */}
        <Section title="Community">
          <Row label="Religion" value={data.religion} />
          <Row label="Caste" value={data.caste} />
          <Row label="Sub Caste" value={data.subCaste} />
          <Row label="Kuladeivam" value={data.kuladeivam} />
        </Section>

        {/* TRUST */}
        <Section title="Verification">
          <Row label="Aadhaar" value={data.aadhaarNumber} />
        </Section>

        <label style={checkbox}>
          <input type="checkbox" onChange={e => setChecked(e.target.checked)} />
          I verify all details are correct
        </label>

        <div style={actions}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button
            disabled={!checked}
            onClick={onConfirm}
            style={{
              ...submitBtn,
              opacity: checked ? 1 : 0.5
            }}
          >
            Submit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL UI COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <h4 style={{ marginBottom: 6, color: "#7c3aed" }}>{title}</h4>
    {children}
  </div>
);

const Row = ({ label, value }) =>
  value ? (
    <div style={{ fontSize: 14, marginBottom: 4 }}>
      <b>{label}:</b> {value}
    </div>
  ) : null;

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999999,
};

const modal = {
  background: "#fff",
  width: "420px",
  maxHeight: "85vh",
  overflowY: "auto",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
};

const title = {
  textAlign: "center",
  marginBottom: 16,
};

const checkbox = {
  display: "block",
  marginTop: 10,
  fontSize: 14,
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 20,
};

const cancelBtn = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#f3f4f6",
};

const submitBtn = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  background: "#7c3aed",
  color: "#fff",
  cursor: "pointer",
};
