
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import BookingModal from "../components/Modal/BookingModal";

export default function Vehicles({ setCurrentPage }) {
  const { vehicles = [], currentUser } = useAppContext();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredVehicles = vehicles.filter((v) => {
    const name = (v.name || "").toLowerCase();
    const type = (v.type || "").toLowerCase();
    const address = (v.address || "").toLowerCase(); // location
    const search = searchTerm.toLowerCase();

    // Search by name + type + location (NO PHONE SEARCH)
    const matchesSearch =
      name.includes(search) ||
      type.includes(search) ||
      address.includes(search);

    const matchesType = filterType === "all" || type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="content-page">
      <h1>Available Vehicles</h1>

      {/* Search + Filter */}
      <div className="vehicle-filters" style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Search by name, type or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="bike">Bike</option>
          <option value="scooter">Scooter</option>
          <option value="car">Car</option>
          <option value="suv">SUV</option>
          <option value="van">Van</option>
        </select>
      </div>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              {vehicle.image && (
                <div
                  className="vehicle-image"
                  style={{
                    backgroundImage: `url(${vehicle.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 160,
                    borderRadius: 8,
                  }}
                />
              )}

              <div className="vehicle-info">
                <h3>{vehicle.name}</h3>
                <p style={{ textTransform: "capitalize" }}>{vehicle.type}</p>

                <p><strong>Location:</strong> {vehicle.address || "Not provided"}</p>
                <p><strong>Contact:</strong> {vehicle.contactNumber || "Not provided"}</p>

                <p>Year: {vehicle.year}</p>

                <div className="vehicle-pricing">
                  <span>₹{vehicle.pricePerHour}/hr</span>
                  <span>₹{vehicle.pricePerDay}/day</span>
                </div>

                {currentUser ? (
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary btn-full"
                    onClick={() => setCurrentPage("login")}
                  >
                    Login to Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}


