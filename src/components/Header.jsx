import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Header({ currentPage, setCurrentPage }) {
  const { currentUser, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => setCurrentPage("home")}>
      <span className="logo-icon">
  <img 
    style={{ height: '50px', width: '50px' ,borderRadius: '25px' }} 
    src=".\src\assets\images\Eg.png"
    alt="Logo"
  />
</span>
          <span className="logo-text">Easy Goo</span>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          <a
            onClick={() => {
              setCurrentPage("home");
              setMenuOpen(false);
            }}
            className={currentPage === "home" ? "active" : ""}
          >
            Home
          </a>
          <a
            onClick={() => {
              setCurrentPage("vehicles");
              setMenuOpen(false);
            }}
            className={currentPage === "vehicles" ? "active" : ""}
          >
            Vehicles
          </a>
          <a
            onClick={() => {
              setCurrentPage("add-vehicle");
              setMenuOpen(false);
            }}
            className={currentPage === "add-vehicle" ? "active" : ""}
          >
            List Vehicle
          </a>
          {currentUser && (
            <a
              onClick={() => {
                setCurrentPage("dashboard");
                setMenuOpen(false);
              }}
              className={currentPage === "dashboard" ? "active" : ""}
            >
              Dashboard
            </a>

          )}
          <a
            onClick={() => {
              setCurrentPage("contact");  
              setMenuOpen(false);
            }}
            className={currentPage === "Contact" ? "active" : ""}
          >
            Contact
          </a>


          

          <div className="auth-links">
            {currentUser ? (
              <>
                <span className="user-name">👤 {currentUser.name}</span>
                <button
                  className="btn-logout"
                  onClick={() => {
                    logout();
                    setCurrentPage("home");
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-login"
                  onClick={() => {
                    setCurrentPage("login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="btn-register"
                  onClick={() => {
                    setCurrentPage("register");
                    setMenuOpen(false);
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
