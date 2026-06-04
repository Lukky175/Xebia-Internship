import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // check if user is logged in
  const isLoggedIn = localStorage.getItem("auth") === "true";

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("auth"); // clear auth
    alert("Logged out successfully");
    navigate("/"); // redirect to login
  };

  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Xebia
          </Link>
        </div>

        <ul>
          <li>
            <ion-icon name="home-outline"></ion-icon>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
          </li>
          <li>
            <ion-icon name="heart-outline"></ion-icon>
            <Link to="/donate" style={{ textDecoration: "none", color: "inherit" }}>
              Donate Us
            </Link>
          </li>
          <li>
            <ion-icon name="people-outline"></ion-icon>
            <Link to="/about" style={{ textDecoration: "none", color: "inherit" }}>
              About Us
            </Link>
          </li>
          <li>
            <ion-icon name="call-outline"></ion-icon>
            <Link to="/contact" style={{ textDecoration: "none", color: "inherit" }}>
              Contact
            </Link>
          </li>

          {/* 🔹 If user is logged in → show Logout */}
          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <>
              <li>
                <button>
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Login
                  </Link>
                </button>
              </li>
              <li>
                <button>
                  <Link
                    to="/register"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Register
                  </Link>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
