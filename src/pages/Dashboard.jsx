
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import CancelBookingModal from "../components/Modal/CancelBookingModal";

export default function Dashboard({ setCurrentPage }) {
  const {
    currentUser,
    vehicles,
    bookings,
    cancelBooking,
    deleteBooking,
    deleteVehicle  
  } = useAppContext();

  const [cancelTarget, setCancelTarget] = useState(null);

  if (!currentUser) {
    return (
      <div className="content-page">
        <h2>Please login to access dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage("login")}
        >
          Login
        </button>
      </div>
    );
  }

  const userId = String(currentUser.id);

  const activeBookings = bookings.filter(
    (b) => String(b.userId) === userId && b.status !== "cancelled"
  );

  const cancelledBookings = bookings.filter(
    (b) => String(b.userId) === userId && b.status === "cancelled"
  );

  const myVehicles = vehicles.filter((v) => String(v.ownerId) === userId);

  const totalEarnings = bookings
    .filter((b) => b.status !== "cancelled")
    .filter((b) => {
      const vehicle = vehicles.find((v) => v.id === b.vehicleId);
      return vehicle && String(vehicle.ownerId) === userId;
    })
    .reduce((sum, b) => sum + Number(b.totalCost), 0);

  return (
    <div className="content-page">
      <h1>Dashboard</h1>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>My Vehicles</h3>
          <p>{myVehicles.length}</p>
        </div>
        <div className="stat-card">
          <h3>My Bookings</h3>
          <p>{activeBookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>₹{totalEarnings}</p>
        </div>
      </div>
      {/*myVehicles*/}
      <div className="dashboard-section">
  <h2>My Listed Vehicles</h2>

  {myVehicles.length === 0 ? (
    <p>No vehicles listed.</p>
  ) : (
    <div className="vehicles-grid">
      {myVehicles.map(v => (
        <div key={v.id} className="vehicle-card">

          {v.image && (
            <div
              className="vehicle-image"
              style={{ backgroundImage: `url(${v.image})` }}
            ></div>
          )}

          <div className="vehicle-info">
            <h3>{v.name}</h3>
            <p>Type: {v.type}</p>
            <p>₹{v.pricePerHour}/hr | ₹{v.pricePerDay}/day</p>

            <button
              className="btn btn-danger"
              onClick={async () => {
                if (confirm("Are you sure you want to remove this vehicle?")) {
                  const result = await deleteVehicle(v.id);
                  if (result.success) {
                    alert("Vehicle removed successfully.");
                  }
                }
              }}
            >
              Remove Vehicle
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Active Bookings */}
      <div className="dashboard-section">
        <h2>My Bookings</h2>

        {activeBookings.length === 0 ? (
          <p>No active bookings.</p>
        ) : (
          <div className="bookings-list">
            {activeBookings.map((b) => {
              const vehicle = vehicles.find((v) => v.id === b.vehicleId);

              return (
                <div key={b.id} className="booking-card">
                  <div className="booking-info">
                    <h3>{vehicle?.name}</h3>
                    <p>
                      Duration: {b.duration}{" "}
                      {b.rentalType === "hourly" ? "hours" : "days"}
                    </p>
                    <p>Start: {new Date(b.startDate).toLocaleString()}</p>
                    <p>Total: ₹{b.totalCost}</p>
                    <p className="status-badge status-confirmed">Confirmed</p>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => setCancelTarget(b)}
                  >
                    Cancel Booking
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancelled Bookings */}
      <div className="dashboard-section">
        <h2>Cancelled Bookings</h2>

        {cancelledBookings.length === 0 ? (
          <p>No cancelled bookings.</p>
        ) : (
          <div className="bookings-list cancelled-list">
            {cancelledBookings.map((b) => {
              const vehicle = vehicles.find((v) => v.id === b.vehicleId);

              return (
                <div key={b.id} className="booking-card cancelled">
                  <h3>{vehicle?.name}</h3>
                  <p>
                    <strong>Reason:</strong> {b.cancelReason}
                  </p>

                  <p>
                    <strong>Cancelled On:</strong>{" "}
                    {b.cancelledAt
                      ? new Date(b.cancelledAt).toLocaleString()
                      : "Unknown"}
                  </p>

                  <span className="status-badge status-cancelled">
                    Cancelled
                  </span>

                  <button
                    className="btn btn-danger"
                    onClick={async () => {
                      if (
                        confirm(
                          "Are you sure you want to delete this cancelled booking?"
                        )
                      ) {
                        const result = await deleteBooking(b.id);
                        if (result.success) alert("Cancelled booking deleted.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelBookingModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={async (reason) => {
            const result = await cancelBooking(cancelTarget.id, reason);
            if (result.success) {
              alert("Booking cancelled successfully.");
              setCancelTarget(null);
            }
          }}
        />
      )}
    </div>
  );
}
