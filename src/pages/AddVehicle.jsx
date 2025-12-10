import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";


export default function AddVehicle({ setCurrentPage }) {
  const { currentUser, addVehicle } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    type: "car",
    location: "",
    contactNumber: "",
    year: new Date().getFullYear(),
    pricePerHour: "",
    pricePerDay: "",
    image: "",
    rcBook: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!currentUser) {
    return (
      <div className="content-page">
        <h2>Please login to list your vehicle</h2>
        <button className="btn btn-primary" onClick={() => setCurrentPage("login")}>
          Login
        </button>
      </div>
    );
  }

  const handleFileUpload = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2_000_000) {
      setError("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [key]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.image || !formData.rcBook) {
      setError("Please upload both vehicle image and RC book");
      return;
    }
      if (!formData.location || !formData.contactNumber) {
    setError("Please provide vehicle location and contact number");
    return;
  }

    const result = await addVehicle({
      ...formData,
      pricePerHour: parseInt(formData.pricePerHour),
      pricePerDay: parseInt(formData.pricePerDay),
    });

    if (result.success) {
      setSuccess("Vehicle listed successfully!");
      setTimeout(() => setCurrentPage("dashboard"), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="content-page">
      <h1>List Your Vehicle</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="vehicle-form">

        <input type="text" placeholder="Vehicle Name" name="name"
          value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required />

        <select name="type" value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
          <option value="bike">Bike</option>
          <option value="scooter">Scooter</option>
          <option value="car">Car</option>
          <option value="suv">SUV</option>
          <option value="van">Van</option>
        </select>
        <input type="text" placeholder="Location" value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
        
        <input type="tel" placeholder="Contact Number" value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} required />

        <input type="number" placeholder="Manufacturing Year" value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          min="1990" max={new Date().getFullYear()} required />

        <input type="number" placeholder="Price per Hour (₹)" value={formData.pricePerHour}
          onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })} required />

        <input type="number" placeholder="Price per Day (₹)" value={formData.pricePerDay}
          onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} required />

        <label>Vehicle Image</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} required />

        <label>RC Book Image</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "rcBook")} required />

        <button type="submit" className="btn btn-primary btn-full">List Vehicle</button>
      </form>
      
    </div>
  );
}

