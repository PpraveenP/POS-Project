import React, { Component, useEffect, useState } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from "../services/adduser.service";
import authService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";


const validateEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
  if (!value.endsWith("@gmail.com") && !value.endsWith("@outlook.com") && !value.endsWith("@yahoo.com")) {
    return (
      <div className="alert alert-danger" role="alert">
        This email must be a Gmail, Outlook, or Yahoo address.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};
const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};
const validateContact = (value) => {
  if (!/^[6789]\d{9}$/.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Contact number must contain exactly 10 digits starting with 6, 7, 8, or
        9.
      </div>
    );
  }
};

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const currentuser = authService.getCurrentUser();
export default class Adduser extends Component {
  constructor(props) {
    super(props);
    this.handleUserRegister = this.handleUserRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeComfirmpassword = this.onChangeComfirmpassword.bind(this);
    this.onChangeStoreid = this.onChangeStoreid.bind(this);
    this.onChangeGstNo = this.onChangeGstNo.bind(this);
    this.onChangeCrtBy = this.onChangeCrtBy.bind(this);
    this.onChangeUpdtaeby = this.onChangeUpdtaeby.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);

    this.state = {
      username: "",
      email: "",
      contact: "",
      password: "",
      comfirmpassword: "",
      storeid: currentuser.storeid,
      gstno: currentuser.gstno,
      crtby: currentuser.username,
      updtaeby: currentuser.username,
      address: "",
      currency:currentuser.currency,
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }
  onChangeContact(e) {
    this.setState({
      contact: e.target.value,
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  onChangeComfirmpassword(e) {
    this.setState({
      comfirmpassword: e.target.value,
    });
  }
  onChangeStoreid(e) {
    this.setState({
      storeid: e.target.value,
    });
  }

  onChangeGstNo(e) {
    this.setState({
      gstno: e.target.value,
    });
  }

  onChangeCrtBy(e) {
    this.setState({
      crtby: e.target.value,
    });
  }
  onChangeUpdtaeby(e) {
    this.setState({
      updtaeby: e.target.value,
    });
  }
  onChangeAddress(e) {
    this.setState({
      address: e.target.value,
    });
  }

  onChangeCurrency(e) {
    this.setState({
      currency: e.target.value,
    });
  }


 handleUserRegister(e) {
  e.preventDefault();

  
  if (!this.state.username.trim()) {
    toast.error("Username is required."); 
    return;
  }

  if (!this.state.email.trim()) {
    toast.error("Email is required."); 
    return;
  }

  if (!this.state.contact.trim()) {
    toast.error("Contact is required.");  
    return;
  }


  if (!this.state.address.trim()) {
    toast.error("Address is required."); 
  }

  if (!this.state.password.trim()) {
    toast.error("Password is required.");
    return;
  }

  if (!this.state.comfirmpassword.trim()) {
    toast.error("Confirm Password is required.");
    return;
  }



  this.setState({
    message: "",
    successful: false,
  });
  this.form.validateAll();
  if (this.state.password !== this.state.comfirmpassword) {
    toast.error("Passwords does not match."); // Display an error toast
    return;
  }

  // Check for other validations if needed

  // Proceed with form submission if all validations pass
  userService
    .userRegister(
      this.state.username,
      this.state.email,
      this.state.contact,
      this.state.password,
      this.state.comfirmpassword,
      this.state.storeid,
      this.state.gstno,
      this.state.crtby,
      this.state.updtaeby,
      this.state.address,
      this.state.currency
    )
    .then(
      (response) => {
        // ... (success handling code)

        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        this.setState({
          successful: false,
          message: resMessage,
        });

        toast.error(resMessage); 
      }
    );
}

  resetHandler = () => {
    this.setState({
      username: "",
      email: "",
      address: "",
      contact: "",
      password: "",
      comfirmpassword: "",
      message: "",
      successful: false,
      currency:""
    });
  };
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };
  toggleconfirmPasswordVisibility = () => {
    this.setState((prevState) => ({
      showconfirmPassword: !prevState.showconfirmPassword,
    }));
  };
  render() {
    return (
      <>
        <div className="p-15 animation" style={{ marginTop: "3vh" }}>
          <div className="row p-3">
            <div
              className="col-md-8"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <div className="card">
                <h4
                  className="text-gray"
                  style={{ fontSize: "3.5vh", color: "#000099" }}
                >
                  <i class="fa-solid fa-user-plus"></i> ADD USER
                </h4>
                <div className="card-body" style={{ fontSize: "3vh" }}></div>
                <Form
                  className="row g-1"
                  onSubmit={this.handleUserRegister}
                  ref={(c) => {
                    this.form = c;
                  }}
                >
                  <div class="col-md-6">
                    <label
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Username <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      style={{ fontSize: "2vh" }}
                      placeholder=" "
                      value={this.state.username}
                      onChange={this.onChangeUsername}
                      validations={[vusername]}
                      maxLength={20}
                    />
                  </div>
                  <div class="col-md-6">
                    <label
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Email <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      style={{ fontSize: "2vh" }}
                      placeholder=" "
                      value={this.state.email}
                      title="valid only for @gmail.com"
                      onChange={this.onChangeEmail}
                      validations={[validateEmail]}
                    />
                  </div>
                  <div class="col-md-6">
                    <label
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Contact <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="tel"
                      className="form-control"
                      name="contact"
                      placeholder=" "
                      style={{ fontSize: "2vh" }}
                      value={this.state.contact}
                      onChange={this.onChangeContact}
                      validations={[validateContact]}
                      maxLength={10}
                    />
                  </div>
                  <div class="col-md-6">
                    <label
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Address <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder=" "
                      style={{ fontSize: "2vh" }}
                      name="address"
                      value={this.state.address}
                      onChange={this.onChangeAddress}
                     
                    />
                  </div>
                  <div class="col-md-6">
                    <label
                      htmlFor="password"
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={this.state.showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        placeholder=" "
                        style={{ fontSize: "2vh",height:"5vh" }}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        validations={[required,vpassword]}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={this.togglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={this.state.showPassword ? faEyeSlash : faEye}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label
                      htmlFor="password"
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={
                          this.state.showconfirmPassword ? "text" : "password"
                        }
                        className="form-control"
                        name="comfirmpassword"
                        style={{ fontSize: "2vh",height:"5vh" }}
                        placeholder="  "
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        value={this.state.comfirmpassword}
                        onChange={this.onChangeComfirmpassword}
                        validations={[required, vpassword]}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={this.toggleconfirmPasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={
                              this.state.showconfirmPassword
                                ? faEyeSlash
                                : faEye
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Store ID :
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "2vh" }}
                      name="storeid"
                      value={this.state.storeid}
                      onChange={this.onChangeStoreid}
                      disabled
                    />
                  </div>

                  <div class="col-md-6">
                    <label
                      className="font-weight-bold"
                      style={{ fontSize: "2vh" }}
                    >
                      Currency :
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "2vh" }}
                      name="currency"
                      value={this.state.currency}
                      onChange={this.onChangeCurrency}
                      disabled
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button
                      class="btn btn-outline-light"
                      type="submit"
                      style={{
                        width: "14vw",
                        padding: "4px",
                        color: "white",
                        backgroundColor: "#03989e",
                        borderRadius: "5px",
                        marginTop: "2vh",
                        fontSize: "3vh",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                 
                  <CheckButton
                    style={{ display: "none" }}
                    ref={(c) => {
                      this.checkBtn = c;
                    }}
                  />
                </Form>
              </div>
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
            theme="dark"
            style={{ marginTop: "20vh", marginRight: "10px"}}
          />
        </div>
      </>
    );
  }
}
/////////////////////////////////////        update user      //////////////////////////////////
export const Update_User = () => {
  const currentuser = authService.getCurrentUser();
  const { id } = useParams();
  const [state, setState] = useState({
    serial_no: "",
    id: "",
    username: "",
    email: "",
    contact: "",
    address: "",
    updby: currentuser.username,
    successful: false,
  });
  useEffect(() => {
    axios
      .get("http://localhost:8083/api/auth/user/getusersByID/" + id)
      .then((res) => {
        setState({
          ...state,
          username: res.data.username,
          email: res.data.email,
          contact: res.data.contact,
          address: res.data.address,
        });
      })
      .catch((err) => console.log(err));
  }, []);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch("http://localhost:8083/api/auth/user/users/" + id, state)
      .then((res) => {
        navigate("/user/update_user/:id");
        toast.success("User Updated Successfully");
        setState({
          id: id,
          username: "",
          email: "",
          contact: "",
          address: "",
        });
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          const errorMessage = err.response.data.message; // Extract error message from response
          toast.error(errorMessage); // Display the specific error message using toast
        } else {
          console.log(err); // Log any other type of error
        }
      });
  };
  
  const fetchCurrentUser = () => {
    userService
      .allAccesss()
      .then((response) => {
        const currentUser = response.data; // Assuming the API response contains current user data
        setState({
          username: currentUser.username,
          email: currentUser.email,
          contact: currentUser.contact,
          address: currentUser.address,
        });
      })
      .catch((error) => {
        // Handle error fetching current user data
      });
  };
  return (
    <>
      <div className="container-fluid">
        <div className="p-5 animation">
          {/* Tital removed by neha */}
          <div className="col-md-8 offset-md-2 p-5 mb-5">
            <div className="card card-container">
              <div className="card-header fs-3 text-left">
                <h4
                  className="text-gray"
                  style={{ fontSize: "4vh", color: "#000099" }}
                >
                  <i class="fa-solid fa-square-plus"></i> Update User
                </h4>
              </div>
              <Form onSubmit={handleSubmit}>
                <div style={{ fontSize: "2vh" }}>
                  <div className="form-group">
                    <label htmlFor="username">
                      Username <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "2vh" }}
                      name="username"
                      onChange={(e) =>
                        setState({ ...state, username: e.target.value })
                      }
                      value={state.username}
                      validations={[]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="email"
                      className="form-control"
                      name="email"
                      style={{ fontSize: "2vh" }}
                      value={state.email}
                      title="valid only for @gmail.com"
                      onChange={(e) =>
                        setState({ ...state, email: e.target.value })
                      }
                      validations={[]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">
                      Contact <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="tel"
                      className="form-control"
                      name="contact"
                      maxLength="10"
                      style={{ fontSize: "2vh" }}
                      pattern="[6789][0-9]{9}"
                      title="Must contain at least 10 digits"
                      value={state.contact}
                      onChange={(e) =>
                        setState({ ...state, contact: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">
                      Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="text"
                      style={{ fontSize: "2vh" }}
                      className="form-control"
                      name="address"
                      value={state.address}
                      onChange={(e) =>
                        setState({ ...state, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button
                      class="btn btn-outline-light"
                      type="submit"
                      style={{
                        width: "12vw",
                        padding: "4px",
                        color: "white",
                        backgroundColor: "#03989e",
                        borderRadius: "5px",
                        marginTop: "2vh",
                        fontSize: "3vh",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Form>
              {state.message && (
                <div
                  className={state.successful ? "success" : "error"}
                  style={{ marginLeft: "40vh", width: "60vh" }}
                >
                  {state.message}
                </div>
              )}
            </div>
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
          theme="dark"
          style={{ marginTop: "70px", marginRight: "10px" }}
        />
      </div>
    </>
  );
};
