import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { withRouter } from "../common/with-router";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
class LoginById extends Component {
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
      showPassword: false,
    };
  }
  componentDidMount() {
    //const { id } = this.props.match.params;
    axios
      .get(`http://localhost:8083/api/auth/store/stores/10`)
      .then((response) => {
        const { username, comfirmpassword } = response.data;
        this.setState({
          username,
          password: comfirmpassword,
        });
      });
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
  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true,
    });
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.router.navigate("/profile");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage,
          });
        }
      );
    } else {
      this.setState({
        loading: false,
      });
    }
  }
  render() {
    return (
      <div className="col-md-12 p-5">
        <div className="container3">
          <div className="screen">
            <div className="screen__content">
              <div className="userlabel" style={{ marginLeft: "100px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "30px",
                    color: "#6C63AC",
                  }}
                >
                  ADMIN LOGIN
                </label>
              </div>
              <Form
                className="login"
                onSubmit={this.handleLogin}
                ref={(c) => {
                  this.form = c;
                }}
              >
                <div className="login__field">
                  <i className="login__icon fas fa-user"></i>
                  <Input
                    type="text"
                    className="login__input"
                    placeholder="__Username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                  />
                </div>
                <div className="login__field">
                  <i className="login__icon fas fa-lock"></i>
                  <Input
                    type={this.state.showPassword ? "text" : "password"} 
                    className="login__input"
                    placeholder="__Password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
                </div>

                <button className="button login__submit">
                  <span className="button__text">Log In</span>
                  <i className="button__icon fas fa-chevron-right"></i>
                </button>
                <CheckButton
                  style={{ display: "none" }}
                  ref={(c) => {
                    this.checkBtn = c;
                  }}
                />
              </Form>
              <div className="form-group">
                <Link
                  to="/forgotpassword"
                  style={{
                    color: "#0345fc",
                    marginLeft: "80px",
                    fontWeight: "bold",
                    fontSize: "20px",
                    textDecoration: "underline",
                    transition:
                      "color 0.3s ease-in-out, text-decoration 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#008000")}
                  onMouseLeave={(e) => (e.target.style.color = "#0345fc")}
                >
                  Forgot Password ?
                </Link>
              </div>
            </div>
            <div className="screen__background">
              <span className="screen_backgroundshape screenbackground_shape4"></span>
              <span className="screen_backgroundshape screenbackground_shape3"></span>
              <span className="screen_backgroundshape screenbackground_shape2"></span>
              <span className="screen_backgroundshape screenbackground_shape1"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginById);
