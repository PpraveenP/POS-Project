import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { withRouter } from "../common/with-router";
import "./loginform2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const PasswordResetForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.comfirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8083/api/auth/user/user-reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Password reset was successful
        console.log("Password reset successful"); // Log success to the console
        toast.success("Password reset successful"); // Show an alert
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        const successData = await response.json();
        setMessage(successData.message);
        setIsError(false);
      } else {
        // Password reset failed
        const errorData = await response.text(); // Read response as text
        setMessage(`Password reset failed: ${errorData}`);
        setIsError(true);
        console.error("Password reset error:", errorData);
      }
    } catch (error) {
      toast.error("An error occurred during password reset.");

    }
  };

  return (
    <div className="background animation">
      <img src="login.jpg" style={{ filter: " blur(1.5px)" }} />
      <div
        className="container-fluid d-flex justify-content-center align-items-center p-5"
        style={{ height: "100vh", marginTop: "-100vh" }}
      >
        <div className="card border-info "style={{width:"25vw"}}>
          <h4 className="text-center text-info mt-3 font-weight-bold" style={{ marginBottom: "3vh",fontSize:"3.5vh" }} >
            <i class="fa-solid fa-rotate-right"></i> Reset User Password
          </h4>
          <Form onSubmit={handleSubmit} className="col-md-12 ">
            <div className="input-group mb-3 text65" style={{border: "1px solid #ccc"}}>
              <span className="input-group-text ">
                <i className="fa-solid fa-envelope"></i>
              </span>

              <input
                type="email"
                id="email"
                name="email"
               
                className="login__input5"
                placeholder=" Email "
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: "25vh", fontSize: "2vh" }}
              />
            </div>

            <div className="input-group mb-3 text65" style={{border: "1px solid #ccc"}}>
              <span className="input-group-text">
                <i class="fa-solid fa-check"></i>
              </span>

              <input
                type="text"
                id="otp"
                name="otp"
                className="login__input5"
                placeholder="OTP "
                value={formData.otp}
                onChange={handleInputChange}
                style={{ width: "25vh", fontSize: "2vh" }}
              />
            </div>


            <div className="form-group">
              <div className="password-input">
              <div className="input-container"  style={{width:"45vh",
                      height: "5vh"}}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className="login__input5"
                  placeholder="New Password "
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  style={{ width: "25vh", fontSize: "2vh" }}

                />
                <span
                  className={`toggle-password ${showPassword ? "show" : ""}`}
                  onClick={() => setShowPassword(!showPassword)}   style={{fontSize: "1.6vh" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="password-input">
              <div className="input-container"  style={{width:"45vh",
                      height: "5vh"}}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="login__input5"
                  placeholder="Confirm Password "
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{ width: "25vh", fontSize: "2vh" }}
                />
                <span
                  className={`toggle-password ${showConfirmPassword ? "show" : ""}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}  style={{fontSize: "1.6vh" }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
                </div>
              </div>
            </div>
            <div className="form-group text65">
              <button
                className="btn btn-block text-white"
                style={{ backgroundColor: "#03989e" }}
                type="submit"
              >
                <span className="font-weight-bold"style={{fontSize:"2.5vh"}}>
                  Reset <i class="fa-solid fa-right-to-bracket"></i>{" "}
                </span>
              </button>
            </div>
          </Form>

          <div className="mt-2 text-center"style={{fontSize:"2.5vh"}}>
            <Link
              to="/userlogin"
              className="text-decoration-none text-info font-weight-bold"
            >
              Log In?
            </Link>

            <p className="mt-2 text-dark" style={{fontSize:"2.5vh"}}>
              Customer support :{" "}
              <a href="mailto:tech.ubsbill@gmail.com">tech.ubsbill@gmail.com
</a>
            </p>

          </div>
        </div>
      </div>{" "}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default PasswordResetForm;
