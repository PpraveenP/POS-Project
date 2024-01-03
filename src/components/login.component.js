import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthServicestore from "../services/auth.service";
import AuthServicetech from "../services/technician.service";
import AuthServicesuper from "../services/superadmin.service";
import AuthServiceuser from "../services/adduser.service";
import { withRouter } from "../common/with-router";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  // ------ THIS CODE USE FOR MUTI ROLE USER lOGIN -------- // FOR THIS CODE DO CHANGES IN ALL SEVICES PAGE RELOADING .

handleLogin(e) {
  e.preventDefault();
  this.setState({
      message: "",
      loading: true,
  });
  this.form.validateAll();
  
  if (this.checkBtn.context._errors.length === 0) {
    //  AuthServicestore.login(this.state.username, this.state.password)    // FOR STORE ADMIN LOGIN
      AuthServiceuser.login(this.state.username , this.state.password)
       .then(() => {
          toast.success("Login successful", {
           position: toast.POSITION.TOP_RIGHT,
           autoClose: 2000,
           onClose: () => {
              this.props.router.navigate("/userdashbord");
              window.location.reload();
           }
          });
       })
       .catch((error) => {
          // Handle the error for AuthService1
          // Stop the promise chain on error by returning
         // return AuthServicetech.login(this.state.username, this.state.password) // FOR TECH LOGIN
          return AuthServicestore.login(this.state.username, this.state.password)
       })
       .then(() => {
          toast.success('Login successful', {
           position: toast.POSITION.TOP_RIGHT,
           autoClose: 2000,
           onClose: () => {
              // this.props.router.navigate("/dashbord");
              this.props.router.navigate("/userdashbord");
              window.location.reload();
           }
          });
       })
       .catch((error) => {
          // Handle the error for AuthService2
          // Stop the promise chain on error by returning
          return AuthServicesuper.login(this.state.username, this.state.password) // FOR SUPERADMIN LOGIN
       })
       .then(() => {
          toast.success('Login successful', {
           position: toast.POSITION.TOP_RIGHT,
           autoClose: 2000,
           onClose: () => {
              this.props.router.navigate("/dashbord");
              window.location.reload();
           }
          });
       })
       .catch((error) => {
         // return AuthServiceuser.login(this.state.username , this.state.password) // FOR USER LOGIN
        return AuthServicetech.login(this.state.username, this.state.password)
       })
       .then(() => {
          toast.success('Login successful', {
           position : toast.POSITION.TOP_RIGHT,
           autoClose : 2000,
           onClose : ()=>{
              this.props.router.navigate("/home");
              window.location.reload();
           }
          });
  
       })
       .catch((error) => {
          // Handle the error for AuthService3
          this.setState({
           loading: false,
           message: 'User not found',
          });
       });
  }
  }
  
      // ----- THIS CODE END HERE MULTI USER ROLE LOGIN ------------------

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  resetHandler = () => {
    this.setState({
      username: "",
      password: "",
    });
  };
  render() {
    return (
      <div className="background animation">
        <img src="login.jpg" style={{ filter: " blur(1.5px)" }} />
        <div
          className="container-fluid d-flex justify-content-center align-items-center p-2"
          style={{ height: "100vh", marginTop: "-100vh" }}
        >
          <div className="card">
            <h4 className="text-center text-info mt-6 text23"style={{fontSize:"3.5vh",fontWeight:"700"}}>
              <i class="fa-solid fa-users">{""}</i>Login
            </h4>
            <Form
              className="p-2"
              onSubmit={this.handleLogin}
              ref={(c) => {
                this.form = c;
              }}>
              <div className="form-group text65">
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  style={{fontSize:"2vh"}}
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                  validations={[required]}
                  placeholder="Username"
                />
              </div>
              <div className="form-group text65">
                <div className="input-group">
                  <input
                    type={this.state.showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    style={{fontSize:"2vh"}}
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required]}
                    placeholder="Password"
                  />
                  <div className="input-group-append">
                     <button
                             className="btn btn-outline-secondary"
                      type="button"
                      style={{ height: "5vh" }} // Adjust the height value as needed
                       onClick={this.togglePasswordVisibility}
               >
                 <FontAwesomeIcon
                   icon={this.state.showPassword ? faEyeSlash : faEye}
                    />
                   </button>
                   </div>

                </div>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-block text-white button23"
                  style={{ backgroundColor: "#03989e" }}
                  disabled={this.state.loading}
                >
                  <span>
                    Log In <i class="fa-solid fa-right-to-bracket"></i>{" "}
                  </span>
                </button>
              </div>
              <div className="text-center">
                {this.state.loading && (
                  <span className="spinner-border spinner-border-lg border-info"></span>
                )}
              </div>

              {this.state.message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            <div className="mt-2 text-center text25">
              <Link
                to="/forgotpassword"
                className="text-decoration-none text-info"
              >
                Forgot Password?
              </Link>

              <p className="mt-2 text-dark text25">
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
            theme="dark"
            style={{ marginTop: "70px", marginRight: "10px" }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
