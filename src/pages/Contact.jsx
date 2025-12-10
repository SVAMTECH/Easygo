
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";


const COMPANY = {
  name: "Easy Goo",
  address: "No. 12, Central Street, Chennai, Tamil Nadu, India - 600001",
  phone: "+91 98765 43210",
  email: "support@easygo.example", // update if needed
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  issueType: "general", // general | vehicle | owner
  vehicleId: "", // optional
  subject: "",
  message: "",
};

export default function Contact() {
  const { currentUser, vehicles } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: "success"|"error", message }
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    // Prefill when logged in
    if (currentUser) {
      setForm((f) => ({
        ...f,
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || f.phone,
      }));
    }
    // load ticket count
    const tickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    setTicketCount(tickets.length);
  }, [currentUser]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email is invalid";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Please describe the issue";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setStatus(null);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      setStatus({ type: "error", message: "Please fix the errors above." });
      return;
    }

    // build ticket
    const tickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    const ticket = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      issueType: form.issueType,
      vehicleId: form.vehicleId || null,
      vehicleName:
        (form.vehicleId && vehicles.find((v) => v.id === form.vehicleId)?.name) ||
        null,
      subject: form.subject.trim(),
      message: form.message.trim(),
      status: "open", // open | in-progress | resolved | closed
    };

    tickets.push(ticket);
    localStorage.setItem("supportTickets", JSON.stringify(tickets));
    setTicketCount(tickets.length);

    setStatus({ type: "success", message: "Ticket submitted successfully. We'll get back to you soon." });


    setForm((f) => ({ ...f, subject: "", message: "", issueType: "general", vehicleId: "" }));


  };

  return (
    <div className="content-page contact-page" style={{ padding: 24 }}>
      <h1>Contact Support</h1>

      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
        {/* Left: Company info */}
        <div className="company-card" style={{ padding: 20, borderRadius: 8, background: "#fff", boxShadow: "0 6px 18px rgba(20,20,40,0.06)" }}>
          <h2 style={{ marginTop: 0 }}>{COMPANY.name}</h2>
          <p style={{ margin: "8px 0" }}><strong>Address:</strong><br />{COMPANY.address}</p>
          <p style={{ margin: "8px 0" }}><strong>Phone:</strong> <a href={`tel:${COMPANY.phone}`} style={{ color: "#0b66ff" }}>{COMPANY.phone}</a></p>
          <p style={{ margin: "8px 0" }}><strong>Email:</strong> <a href={`mailto:${COMPANY.email}`} style={{ color: "#0b66ff" }}>{COMPANY.email}</a></p>

          <hr style={{ margin: "16px 0" }} />

          <p style={{ margin: 0 }}>
            <strong>Support tickets:</strong> {ticketCount}<br />
            We typically reply within 24 hours. For urgent matters, call us.
          </p>
        </div>

        {/* Right: Form */}
        <div className="form-card" style={{ padding: 20, borderRadius: 8, background: "#fff", boxShadow: "0 6px 18px rgba(20,20,40,0.06)" }}>
          <h3 style={{ marginTop: 0 }}>Submit an Issue</h3>

          {status && (
            <div
              style={{
                marginBottom: 12,
                padding: "10px 12px",
                borderRadius: 6,
                background: status.type === "success" ? "#e6ffef" : "#fff0f0",
                color: status.type === "success" ? "#026a36" : "#a12a2a",
                border: status.type === "success" ? "1px solid #b7f2c9" : "1px solid #f3c2c2",
              }}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="label">Your name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input" />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>

              <div>
                <label className="label">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="input" />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div>
                <label className="label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input" />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>

              <div>
                <label className="label">Issue Type</label>
                <select name="issueType" value={form.issueType} onChange={handleChange} className="input">
                  <option value="general">General / Account</option>
                  <option value="vehicle">Issue with a Vehicle</option>
                  <option value="owner">Issue with an Owner/Renter</option>
                </select>
              </div>
            </div>

            {/* show vehicle selector only if there are vehicles */}
            <div style={{ marginTop: 12 }}>
              <label className="label">Vehicle (optional)</label>
              <select name="vehicleId" value={form.vehicleId} onChange={handleChange} className="input">
                <option value="">-- Not related to a specific vehicle --</option>
                {vehicles && vehicles.length > 0 ? (
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.type} {v.year ? `(${v.year})` : ""}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No vehicles listed</option>
                )}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="label">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="input" placeholder="Short title for the issue" />
              {errors.subject && <div className="field-error">{errors.subject}</div>}
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="label">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="input" rows="6" placeholder="Describe your issue in detail..." />
              {errors.message && <div className="field-error">{errors.message}</div>}
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setForm(initialForm); setErrors({}); setStatus(null); }}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* small help text */}
      <div style={{ marginTop: 18, color: "#666", fontSize: 13 }}>
        Tip: If the issue is about a particular booking, please include booking date/time and the vehicle name in the message.
      </div>
    </div>
  );
}
