import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  return (
    <section className="register-section">
      <div className="register-form-box">
        <div className="form-value">
          <form onSubmit={handleSubmit}>
            <h2>Register Now!</h2>

            <div className="inputbox">
              <ion-icon name="person-outline"></ion-icon>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Name</label>
            </div>

            <div className="inputbox">
              <ion-icon name="call-outline"></ion-icon>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <label>Phone No.</label>
            </div>

            <div className="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>

            <div className="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>
            </div>

            <button type="submit" id="registerButton">Register Now</button>

            <div className="register">
              <p>
                Already Have An Account? <Link to="/">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
