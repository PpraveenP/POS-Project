import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { withRouter } from "../common/with-router";
import "./loginform2.css";
import { ToastContainer, toast } from "react-toastify";

class TechForgotUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      otp: "",
      loading: false,
      message: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSendOTP = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    this.setState({
      loading: true,
      message: "",
    });

    const { email } = this.state;

    // Make an API call to send OTP to the provided email
    axios
      .post("http://localhost:8083/api/auth/Tech/forgot-password", {
        email: email, // Use the email from state
      })
      .then((response) => {
        console.log("OTP Send Successfully");
        toast.success("OTP Send Successfully");

        // Clear the email input field after successful OTP send
        this.setState({
          loading: false,
          email: "", // Reset the email field to empty
        });
      })
      .catch((error) => {
        console.log(error);

        if (error.response && error.response.status === 404) {
          // Handle the case where the email does not exist
          this.setState({
            loading: false,
            message: "Email does not exist. Please enter a register email.",
          });
        } else {
          // Handle other errors
          this.setState({
            loading: false,
            message: "Failed to send OTP. Please try again.",
          });
        }
      });
  };

  render() {
    return (
      <div className="background animation">
        <img src="login.jpg" style={{ filter: " blur(1.5px)" }} />
      <div className="container-fluid d-flex justify-content-center align-items-center p-5" style={{ height: '100vh', marginTop: "-100vh" }}>
        <div className="card border-info">
          <h4 className="text-center text-info mt-3 font-weight-bold" style={{fontSize:"3.5vh"}}><i class="fa-solid fa-key"></i> Forgot Tech Password</h4>
          <Form
            className="mt-2"
            onSubmit={this.handleSendOTP}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                style={{fontSize:"2vh"}}
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                required
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-block text-white" style={{ backgroundColor: "#03989e",fontSize:"2.5vh" }}
              >
                <span className="font-weight-bold">Send OTP <i class="fa-solid fa-right-to-bracket"></i> </span>
              </button>

            </div>
          </Form>
          <div className="text-center">
            {this.state.message && (
              <div className="text-danger mt-2" style={{ fontSize: "1.8vh" }}>{this.state.message}</div>
            )}
          </div>
          <div className="mt-2 text-center"style={{fontSize:"2.5vh"}}>
            <Link to="/techresetpassword" className="text-decoration-none text-info ">
              Reset Password?
            </Link>

            <p className="mt-2 text-dark" style={{fontSize:"2.5vh"}}>
              Customer support :{" "}
              <a href="mailto:tech.ubsbill@gmail.com">tech.ubsbill@gmail.com
</a>
            </p>
          </div>
        </div>
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
          theme="dark" />
 </div>
 </div>
    );
  }
}

export default TechForgotUserPassword;