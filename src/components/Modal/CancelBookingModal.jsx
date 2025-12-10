import React, { useState } from "react";

export default function CancelBookingModal({ booking, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a cancellation reason.");
      return;
    }

    onConfirm(reason);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Cancel Booking</h2>
        <p>Please provide a reason for cancelling your booking.</p>

        {error && <div className="error-message">{error}</div>}

        <textarea
          className="form-control"
          placeholder="Reason for cancellation..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button className="btn btn-danger btn-full" onClick={handleSubmit}>
          Confirm Cancellation
        </button>
      </div>
    </div>
  );
}
