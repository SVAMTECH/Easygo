
import React, { createContext, useContext, useState, useEffect } from "react";
import storage from "../utils/storage";
import Contact from "../pages/Contact";

const AppContext = createContext();


const DEFAULT_VEHICLES = [
  {
    id: "v1",
    name: "Pulser 150",
    type: "bike",
    address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 50,
    pricePerDay: 600,
    image:
      "https://images.91wheels.com/assets/b_images/gallery/bajaj/pulsar-125/bajaj-pulsar-125-1-1716800151.jpg?w=480&q=80",
    ownerId: "admin",
    year:2024,
  },
  {
    id: "v2",
    name: "Activa 6G",
    type: "scooter",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 40,
    pricePerDay: 500,
    image:
      "https://i.cdn.newsbytesapp.com/images/l200_30851597390379.jpg",
    ownerId: "admin",
    year: 2021,
  },
   {
    id: "v4",
    name: "Appache 160-4v",
    type: "bike",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 120,
    pricePerDay: 800,
    image:
      "https://cdn.bikedekho.com/upload/standoutfeatures/66263fdd67225.jpg",
    ownerId: "admin",
    year: 2025,
  },
    {
    id: "v5",
    name: "Hero Honda Splendor",
    type: "bike",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 80,
    pricePerDay: 400,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Hero_Honda_Splendor_2007.jpg/1200px-Hero_Honda_Splendor_2007.jpg",
    ownerId: "admin",
    year: 2025,
  },
    {
    id: "v6",
    name: "royal enfield classic 350",
    type: "bike",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 150,
    pricePerDay: 800,
    image:
      "https://images.unsplash.com/photo-1622185135505-2d795003994a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm95YWwlMjBlbmZpZWxkfGVufDB8fDB8fHww",
    ownerId: "admin",
    year: 2025,
  },
    {
    id: "v7",
    name: "force urbania",
    type: "van",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 500,
    pricePerDay: 2500,
    image:
      "https://www.team-bhp.com/sites/default/files/pictures2024-07/urbfront.jpg",
    ownerId: "admin",
    year: 2025,
  },
    {
    id: "v8",
    name: "xuv 700",
    type: "suv",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 500,
    pricePerDay: 2000,
    image:
      "https://etimg.etb2bimg.com/photo/111612794.cms",
    ownerId: "admin",
    year: 2025,
  },
     {
    id: "v9",
    name: "jupiter 125",
    type: "scooter",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 100,
    pricePerDay: 500,
    image:
      "https://img.autocarindia.com/ExtraImages/20211007124858_TVS_Jupiter_125_image.jpg?w=728&q=75",
    ownerId: "admin",
    year: 2024,
  },
    {
    id: "v10",
    name: "Tata Punch",
    type: "car",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 300,
    pricePerDay: 1000,
    image:
      "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/39015/punch-exterior-right-front-three-quarter-53.jpeg?isig=0&q=80&q=80",
    ownerId: "admin",
    year: 2024,
  },
  
  {
    id: "v3",
    name: "Swift",
    type: "car",
        address:"salem esay-goo",
    contactNumber:"9876543210",
    pricePerHour: 200,
    pricePerDay: 2000,
    image:
      "data:image/jpeg;base64,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",
    ownerId: "admin",
    year: 2024,
  },
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  // SAFE LOADING (prevents blank page)
  useEffect(() => {
    try {
      const user = storage.get("currentUser");
      const storedVehicles = storage.get("vehicles") || [];
      const storedBookings = storage.get("bookings") || [];

      if (user) setCurrentUser(user);

      //  ALWAYS include default vehicles + user added
      setVehicles([...DEFAULT_VEHICLES, ...storedVehicles]);

      setBookings(storedBookings);
    } catch (error) {
      console.error("LOAD ERROR:", error);
      setVehicles(DEFAULT_VEHICLES); // fallback
    }
  }, []);

  // LOGIN
  const login = (email, password) => {
    const users = storage.get("users") || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return { success: false, message: "Invalid credentials" };

    const safeUser = { ...found };
    delete safeUser.password;

    storage.set("currentUser", safeUser);
    setCurrentUser(safeUser);

    return { success: true };
  };

  // REGISTER
  const register = (data) => {
    const users = storage.get("users") || [];

    if (users.find((u) => u.email === data.email)) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = { ...data, id: Date.now().toString() };
    users.push(newUser);

    storage.set("users", users);

    return { success: true };
  };

  // LOGOUT
  const logout = () => {
    storage.remove("currentUser");
    setCurrentUser(null);
  };

  // ADD VEHICLE
  const addVehicle = (vehicleData) => {
    const newVehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      ownerId: currentUser.id,
    };

    // Add user vehicle to state
    setVehicles((prev) => [...prev, newVehicle]);

    // Store only user-added vehicles
    const storedVehicles = storage.get("vehicles") || [];
    storage.set("vehicles", [...storedVehicles, newVehicle]);

    return { success: true };
  };

  // ADD BOOKING
  // const addBooking = (bookingData) => {
  //   const newBooking = { ...bookingData, id: Date.now().toString() };
  //   const updated = [...bookings, newBooking];

  //   setBookings(updated);
  //   storage.set("bookings", updated);

  //   return { success: true };
// ADD BOOKING - FIXED
const addBooking = (bookingData) => {
  // keep the same ID passed from Payment.jsx
  const newBooking = { ...bookingData };

  const updated = [...bookings, newBooking];

  setBookings(updated);
  storage.set("bookings", updated);

  return { success: true };
};



  // CANCEL BOOKING
  const cancelBooking = async (bookingId, reason) => {
    try {
      const updated = bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "cancelled",
              cancelReason: reason,
              cancelledAt: new Date().toISOString(),
            }
          : b
      );

      setBookings(updated);
      storage.set("bookings", updated);

      return { success: true };
    } catch (error) {
      return { success: false, message: "Failed to cancel booking" };
    }
  };

  // DELETE BOOKING
  const deleteBooking = async (bookingId) => {
    try {
      const updated = bookings.filter((b) => b.id !== bookingId);

      setBookings(updated);
      storage.set("bookings", updated);

      return { success: true };
    } catch {
      return { success: false, message: "Failed to delete booking" };
    }
  };
  // DELETE VEHICLE (only owner can remove)
const deleteVehicle = (vehicleId) => {
  try {
    // Remove from vehicles list
    const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
    setVehicles(updatedVehicles);

    // Update storage (only store user-added vehicles)
    const storedVehicles = storage.get("vehicles") || [];
    const newStored = storedVehicles.filter(v => v.id !== vehicleId);
    storage.set("vehicles", newStored);

    // Also remove bookings for this vehicle
    const updatedBookings = bookings.filter(b => b.vehicleId !== vehicleId);
    setBookings(updatedBookings);
    storage.set("bookings", updatedBookings);

    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete vehicle" };
  }
};


  return (
    <AppContext.Provider
      value={{
        currentUser,
        vehicles,
        bookings,
        Contact,
        login,
        register,
        logout,
        addVehicle,
        addBooking,
        cancelBooking,
        deleteBooking,
        deleteVehicle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
