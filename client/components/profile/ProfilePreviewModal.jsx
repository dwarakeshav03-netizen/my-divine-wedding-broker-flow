import React, { useState } from "react";

export default function ProfilePreviewModal({ data, onClose, onConfirm }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Verify Your Details</h3>

        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            <b>{key}</b>: {String(value)}
          </p>
        ))}

        <label>
          <input
            type="checkbox"
            onChange={(e) => setChecked(e.target.checked)}
          />
          I verify all details are correct
        </label>

        <br /><br />

        <button onClick={onClose}>Cancel</button>
        <button
          disabled={!checked}
          onClick={onConfirm}
          style={{ marginLeft: "10px" }}
        >
          Submit Profile
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,  
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
};
