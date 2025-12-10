
import { useState, useEffect } from "react";
import Payment from "../../pages/Payment";

export default function BookingModal({ vehicle, onClose, setCurrentPage }) {
  // Prevent crash if vehicle is missing
  if (!vehicle) {
    return null;
  }

  const [rentalType, setRentalType] = useState("hourly");
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const hourly = parseInt(vehicle.pricePerHour) || 0;
    const daily = parseInt(vehicle.pricePerDay) || 0;
    const price = rentalType === "hourly" ? hourly : daily;
    setTotalCost(price * duration);
  }, [rentalType, duration, vehicle]);

  const handleProceed = () => {
    if (!startDate) {
      alert("Please select start date and time");
      return;
    }

const bookingData = {
  vehicle,                // <-- FIXED: store vehicle object
  vehicleId: vehicle.id,
  vehicleName: vehicle.name,
  rentalType,
  duration,
  startDate,
  totalCost,
};
sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    setCurrentPage("payment");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Book {vehicle.name}</h2>

        <div className="booking-form">

          <div className="form-group">
            <label>Rental Type</label>
            <select
              value={rentalType}
              onChange={(e) => setRentalType(e.target.value)}
            >
              <option value="hourly">
                Hourly (₹{vehicle.pricePerHour}/hr)
              </option>
              <option value="daily">
                Daily (₹{vehicle.pricePerDay}/day)
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Duration ({rentalType === "hourly" ? "hours" : "days"})
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) =>
                setDuration(Math.max(1, parseInt(e.target.value)))
              }
            />
          </div>

          <div className="form-group">
            <label>Start Date & Time</label>
            <input
              type="datetime-local"
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="total-cost">
            <h3>Total Cost: ₹{totalCost}</h3>
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={handleProceed}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
