import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
//import authService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert" style={{height:"5vh",fontSize:"2vh"}}>
        This field is required!
      </div>
    );
  }
};

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
      <div className="alert alert-danger" role="alert"style={{height:"5vh",fontSize:"2vh"}}>
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vstorename = value => {
  if (value.length < 3 || value.length > 50) {
      return (
       <div className="alert alert-danger" role="alert"style={{height:"5vh",fontSize:"2vh"}}>
          The store name must be between 3 and 50 characters.
       </div>
      );
  }
  };

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert"style={{height:"5vh",fontSize:"2vh"}}>
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const vcontact = value => {
  if (value.length != 10) {
      return (
       <div className="alert alert-danger" role="alert"style={{height:"5vh",fontSize:"2vh"}}>
          The Contact No must be 10 digits only.
       </div>
      );
  }
  };

export default class Freetrial extends Component {
  constructor(props) {
    super(props);
    this.onChangeStore_name = this.onChangeStore_name.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeSaddress = this.onChangeSaddress.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.onChangeGstno = this.onChangeGstno.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeCountry_Code = this.onChangeCountry_Code.bind(this);
    this.onChangeState = this.onChangeState.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeComfirmpassword = this.onChangeComfirmpassword.bind(this);
    this.onChangeCreatedby = this.onChangeCreatedby.bind(this);
    this.onChangeUpdatedby = this.onChangeUpdatedby.bind(this);
    this.onChangefreeTrialRequested =this.onChangefreeTrialRequested.bind(this);
    this.onChangefreeTrialType = this.onChangefreeTrialType.bind(this);
    this.onchangeSubscriptionType = this.onchangeSubscriptionType.bind(this);


    const currentuser = AuthService.getCurrentUser();

    this.state = {
      store_name: "",
      username: "",
      saddress: "",
      contact: "",
      gstno: "",
      email: "",
      currency: "",
      country: "",
      country_code:"",
      countryInfo: null,
      state: "",
      password: "",
      comfirmpassword: "",
      createdby: currentuser.username,
      updatedby: currentuser.username,
      freeTrialRequested: true,
      freeTrialType: " ",
      subscriptionType:"FREE",
      successful: false,
      message: "",
    };
  }
  onChangeStore_name(e) {
    this.setState({
      store_name: e.target.value,
    });
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeSaddress(e) {
    this.setState({
      saddress: e.target.value,
    });
  }

  onChangeContact(e) {
    this.setState({
      contact: e.target.value,
    });
  }

  onChangeGstno(e) {
    this.setState({
      gstno: e.target.value,
    });
  }

  onChangeCurrency(e) {
    this.setState({
      currency: e.target.value,
    });
  }


  onChangeCountry_Code(e) {
    this.setState({
     country_code: e.target.value
    });
  }

  onChangeState(e) {
    this.setState({
      state: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
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

  onChangeUpdatedby(e) {
    this.setState({
      updatedby: e.target.value,
    });
  }

  onChangeCreatedby(e) {
    this.setState({
      createdby: e.target.value,
    });
  }
  onChangefreeTrialRequested(e) {
    this.setState({
      freeTrialRequested: e.target.value,
    });
  }
  onChangefreeTrialType(e) {
    this.setState({
      freeTrialType: e.target.value,
    });
  }
  onchangeSubscriptionType(e){
    this.setState({
      subscriptionType: e.target.value,
    })
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.freetrial(
        this.state.store_name,
        this.state.username,
        this.state.saddress,
        this.state.contact,
        this.state.gstno,
        this.state.currency,
        this.state.country,
        this.state.country_code,
        this.state.state,
        this.state.email,
        this.state.password,
        this.state.comfirmpassword,
        this.state.createdby,
        this.state.updatedby,
        this.state.freeTrialRequested,
        this.state.freeTrialType,
        this.state.subscriptionType,
      ).then(
        (response) => {
          this.setState({
            store_name: "",
            username: "",
            email: "",
            saddress: "",
            contact: "",
            password: "",
            comfirmpassword: "",
            gstno: "",
            currency: "",
            country: "",
            country_code: "",
            createdby: "",
            state: "",
            updatedby: "",
            freeTrialRequested: "",
            freeTrialType: "",
            subscriptionType:"",
            successful: true,
          });
      

          // Clear the message after a certain duration (e.g., 5000 milliseconds or 5 seconds)
          setTimeout(() => {
            this.setState({
              message: "",
              successful: false,
            });
          }, 10000); // Adjust the duration as needed
          toast.success(response.data.message);
          console.log("Store Registered successfully...!!! ✔✔✔✔");
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

          // Clear the error message after a certain duration (e.g., 8000 milliseconds or 8 seconds)
          setTimeout(() => {
            this.setState({
              message: "",
              successful: false,
            });
          }, 10000); // Adjust the duration as needed
          // toast.warn(resMessage); // Display warning toast
        }
      );
    }
  }

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

  resetHandler = () => {
    this.setState({
      store_name: "",
      username: "",
      saddress: "",
      contact: "",
      gstno: "",
      currency: "",
      country: "",
      country_code: "",
      state: "",
      email: "",
      password: "",
      comfirmpassword: "",
      createdby: "",
      updatedby: "",
      freeTrialRequested: "",
      freeTrialType: "",
      subscriptionType:"",
      successful: false,
    });
  };


  onChangeCountry = (event) => {
    const countryName = event.target.value;
    this.setState({ country: countryName });

    if (countryName !== "") {
      fetch(`http://localhost:8083/sys/api/countries/info/${countryName}`)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ countryInfo: data });

          // Update currency in the state
          if (data.currency) {
            this.setState({ currency: data.currency_code });
            this.setState({country_code:data.country_code});
          }
        })
        .catch((error) => {
          console.error("Error fetching country info:", error);
          this.setState({ countryInfo: null });
        });
    } else {
      this.setState({ countryInfo: null, currency: "" });
    }
  };

  render() {
    const { country, countryInfo } = this.state;

    return (
      <>
        <div className="p-15 animation" style={{marginTop:"3vh"}}>
          <div className="row p-3">
           <div className="col-md-8" style={{marginLeft:"auto",marginRight:"auto"}}>
              <div className="card">
                <h4 className="text-gray" style={{fontSize:"4vh",color:"#000099"}}>
                    <i class="fa-solid fa-store"></i> Free Trial
                  </h4>
               
      
                <div className="card-body" style={{fontSize:"3vh"}}>
                  <Form
                    className="row g-1"
                    onSubmit={this.handleRegister}
                    ref={(c) => {
                      this.form = c;
                    }}
                  >
                 
                   <div className="col-md-6">
                        <label
                        className="font-weight-bold"
                        style={{ fontSize: "2vh" }}
                        >
                          Store Name<span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="store_name"
                          style={{ fontSize: "2vh" }}
                          value={this.state.store_name}
                          onChange={this.onChangeStore_name}
                          validations={[required, vstorename]}
                          placeholder=""
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="font-weight-bold"   style={{ fontSize: "2vh" }}>
                          Username <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="username"
                          style={{ fontSize: "2vh" }}
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                          validations={[required, vusername]}
                          placeholder=""
                        />
                      </div>
                      
                      
                      <div className="col-md-6">
                        <label className="font-weight-bold"    style={{ fontSize: "2vh" }}>
                          {" "}
                          Select country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="country"
                          style={{ fontSize: "2vh" }}
                          value={this.state.country}
                          onChange={this.onChangeCountry}
                          validations={[required]}
                        >
                          <option value="">-----Select Country-----</option>
                          <option
                            className="font-weight-bold"
                            value="AFGHANISTAN"
                          >
                            AFGHANISTAN
                          </option>
                          <option className="font-weight-bold" value="ALBANIA">
                            ALBANIA
                          </option>
                          <option className="font-weight-bold" value="ALGERIA">
                            ALGERIA
                          </option>
                          <option className="font-weight-bold" value="ANDORRA">
                            ANDORRA
                          </option>
                          <option className="font-weight-bold" value="ANGOLA">
                            ANGOLA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="ANTIGUA AND BARBUDA"
                          >
                            ANTIGUA AND BARBUDA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="ARGENTINA"
                          >
                            ARGENTINA
                          </option>
                          <option className="font-weight-bold" value="ARMENIA">
                            ARMENIA
                          </option>
                          <option className="font-weight-bold" value="ASTRALIA">
                            Australia
                          </option>
                          <option className="font-weight-bold" value="AUSTRIA">
                            AUSTRIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="Azerbaijan"
                          >
                            Azerbaijan
                          </option>
                          <option className="font-weight-bold" value="BAHAMAS ">
                            {" "}
                            BAHAMAS{" "}
                          </option>
                          <option className="font-weight-bold" value="BAHRAIN">
                            BAHRAIN
                          </option>
                          <option
                            className="font-weight-bold"
                            value="BANGLADESH"
                          >
                            BANGLADESH
                          </option>
                          <option className="font-weight-bold" value="BARBADOS">
                            BARBADOS
                          </option>
                          <option className="font-weight-bold" value="BELARUS">
                            BELARUS
                          </option>
                          <option className="font-weight-bold" value="BELGIUM">
                            BELGIUM
                          </option>
                          <option className="font-weight-bold" value="BELIZE">
                            BELIZE
                          </option>
                          <option className="font-weight-bold" value="BENIN">
                            BENIN
                          </option>
                          <option className="font-weight-bold" value="BHUTAN">
                            BHUTAN
                          </option>
                          <option className="font-weight-bold" value="BOLIVIA">
                            BOLIVIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="BOSNIA AND HERZEGOVINA"
                          >
                            BOSNIA AND HERZEGOVINA
                          </option>
                          <option className="font-weight-bold" value="BOTSWANA">
                            BOTSWANA
                          </option>
                          <option className="font-weight-bold" value="BRAZIL">
                            BRAZIL
                          </option>
                          <option className="font-weight-bold" value="BURUNDI">
                            BURUNDI
                          </option>
                          <option
                            className="font-weight-bold"
                            value="BRUNEI DARUSSALAM"
                          >
                            BRUNEI DARUSSALAM
                          </option>
                          <option
                            className="font-weight-bold"
                            value="BURKINA FASO"
                          >
                            BURKINA FASO
                          </option>
                          <option className="font-weight-bold" value="CAMBODIA">
                            CAMBODIA
                          </option>
                          <option className="font-weight-bold" value="CAMEROON">
                            CAMEROON
                          </option>
                          <option className="font-weight-bold" value="CANADA">
                            CANADA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="CAPE VERDE"
                          >
                            CAPE VERDE
                          </option>
                          <option
                            className="font-weight-bold"
                            value="CENTRAL AFRICAN REPUBLIC"
                          >
                            CENTRAL AFRICAN REPUBLIC
                          </option>
                          <option className="font-weight-bold" value="CHAD">
                            CHAD
                          </option>
                          <option className="font-weight-bold" value="CHILE">
                            CHILE
                          </option>
                          <option className="font-weight-bold" value="CHINA">
                            CHINA
                          </option>
                          <option className="font-weight-bold" value="COLOMBIA">
                            COLOMBIA
                          </option>
                          <option className="font-weight-bold" value="COMOROS">
                            COMOROS
                          </option>
                          <option className="font-weight-bold" value="CONGO">
                            CONGO
                          </option>
                          <option
                            className="font-weight-bold"
                            value="COSTA RICA"
                          >
                            COSTA RICA
                          </option>
                          <option className="font-weight-bold" value="CROATIA">
                            CONGO
                          </option>
                          <option className="font-weight-bold" value="CUBA">
                            CUBA
                          </option>
                          <option className="font-weight-bold" value="CYPRUS">
                            CYPRUS
                          </option>
                          <option
                            className="font-weight-bold"
                            value="CZECH REPUBLIC"
                          >
                            CZECH REPUBLIC
                          </option>
                          <option
                            className="font-weight-bold"
                            value="DEMOCRATIC REPUBLIC OF THE CONGO"
                          >
                            DEMOCRATIC REPUBLIC OF THE CONGO
                          </option>
                          <option className="font-weight-bold" value="DENMARK">
                            DENMARK
                          </option>
                          <option className="font-weight-bold" value="DJIBOUTI">
                            DJIBOUTI
                          </option>
                          <option className="font-weight-bold" value="DOMINICA">
                            DOMINICA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="DOMINICAN REPUBLIC"
                          >
                            DOMINICAN REPUBLIC
                          </option>
                          <option className="font-weight-bold" value="EGYPT">
                            EGYPT
                          </option>
                          <option
                            className="font-weight-bold"
                            value="EL SALVADOR"
                          >
                            EL SALVADOR
                          </option>
                          <option
                            className="font-weight-bold"
                            value="EQUATORIAL GUINEA"
                          >
                            EQUATORIAL GUINEA
                          </option>
                          <option className="font-weight-bold" value="ERITREA">
                            ERITREA
                          </option>
                          <option className="font-weight-bold" value="ESTONIA">
                            ESTONIA
                          </option>
                          <option className="font-weight-bold" value="ETHIOPIA">
                            ETHIOPIA
                          </option>
                          <option className="font-weight-bold" value="FIJI">
                            FIJI
                          </option>
                          <option className="font-weight-bold" value="FINLAND">
                            FINLAND
                          </option>
                          <option className="font-weight-bold" value="FRANCE">
                            FRANCE
                          </option>
                          <option className="font-weight-bold" value="GABON">
                            GABON
                          </option>
                          <option className="font-weight-bold" value="GAMBIA">
                            GAMBIA
                          </option>
                          <option className="font-weight-bold" value="GEORGIA">
                            GEORGIA
                          </option>
                          <option className="font-weight-bold" value="GERMANY">
                            GERMANY
                          </option>
                          <option className="font-weight-bold" value="GHANA">
                            GHANA
                          </option>
                          <option className="font-weight-bold" value="GREECE">
                            GREECE
                          </option>
                          <option className="font-weight-bold" value="GRENADA">
                            GRENADA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="GUATEMALA"
                          >
                            GUATEMALA
                          </option>
                          <option className="font-weight-bold" value="GUINEA">
                            GUINEA
                          </option>
                          <option className="font-weight-bold" value="GUYANA">
                            GUYANA
                          </option>
                          <option className="font-weight-bold" value="HAITI">
                            HAITI
                          </option>
                          <option className="font-weight-bold" value="HONDURAS">
                            HONDURAS
                          </option>
                          <option className="font-weight-bold" value="HUNGARY">
                            HUNGARY
                          </option>
                          <option className="font-weight-bold" value="HOLY SEE">
                            HOLY SEE
                          </option>
                          <option className="font-weight-bold" value="ICELAND">
                            ICELAND
                          </option>
                          <option className="font-weight-bold" value="INDIA">
                            INDIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="INDONESIA"
                          >
                            INDONESIA
                          </option>
                          <option className="font-weight-bold" value="IRAN">
                            IRAN
                          </option>
                          <option className="font-weight-bold" value="IRELAND">
                            IRELAND
                          </option>
                          <option className="font-weight-bold" value="ISRAEL">
                            ISRAEL
                          </option>
                          <option className="font-weight-bold" value="ITALY">
                            ITALY
                          </option>
                          <option className="font-weight-bold" value="JAMAICA">
                            JAMAICA
                          </option>
                          <option className="font-weight-bold" value="JAPAN">
                            JAPAN
                          </option>
                          <option className="font-weight-bold" value="JORDAN">
                            JORDAN
                          </option>
                          <option className="font-weight-bold" value="KENYA">
                            KENYA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="KAZAKHSTAN"
                          >
                            KAZAKHSTAN
                          </option>
                          <option className="font-weight-bold" value="KIRIBATI">
                            KIRIBATI
                          </option>
                          <option className="font-weight-bold" value="KUWAIT">
                            KUWAIT
                          </option>
                          <option
                            className="font-weight-bold"
                            value="KYRGYZSTAN"
                          >
                            KYRGYZSTAN
                          </option>
                          <option className="font-weight-bold" value="LAOS">
                            LAOS
                          </option>
                          <option className="font-weight-bold" value="LATVIA">
                            LATVIA
                          </option>
                          <option className="font-weight-bold" value="LEBANON">
                            LEBANON
                          </option>
                          <option className="font-weight-bold" value="LESOTHO">
                            LESOTHO
                          </option>
                          <option className="font-weight-bold" value="LIBERIA">
                            LIBERIA
                          </option>
                          <option className="font-weight-bold" value="LIBYA">
                            LIBYA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="LIECHTENSTEIN"
                          >
                            LIECHTENSTEIN
                          </option>
                          <option
                            className="font-weight-bold"
                            value="LITHUANIA"
                          >
                            LITHUANIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="LUXEMBOURG"
                          >
                            LUXEMBOURG
                          </option>
                          <option
                            className="font-weight-bold"
                            value="MADAGASCAR"
                          >
                            MADAGASCAR
                          </option>
                          <option className="font-weight-bold" value="MALAWI">
                            MALAWI
                          </option>
                          <option className="font-weight-bold" value="MALAYSIA">
                            MALAYSIA
                          </option>
                          <option className="font-weight-bold" value="MALDIVES">
                            MALDIVES
                          </option>
                          <option className="font-weight-bold" value="MALI">
                            MALI
                          </option>
                          <option className="font-weight-bold" value="MALTA">
                            MALTA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="CONMARSHALL ISLANDSGO"
                          >
                            MARSHALL ISLANDS
                          </option>
                          <option
                            className="font-weight-bold"
                            value="MAURITANIA"
                          >
                            MAURITANIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="MAURITIUS"
                          >
                            MAURITIUS
                          </option>
                          <option
                            className="font-weight-bold"
                            value="CONMEXICOGO"
                          >
                            MEXICO
                          </option>
                          <option
                            className="font-weight-bold"
                            value="MICRONESIA"
                          >
                            MICRONESIA
                          </option>
                          <option className="font-weight-bold" value="MOLDOVA">
                            MOLDOVA
                          </option>
                          <option className="font-weight-bold" value="MONACO">
                            MONACO
                          </option>
                          <option className="font-weight-bold" value="MONGOLIA">
                            MONGOLIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="MONTENEGRO"
                          >
                            MONTENEGRO
                          </option>
                          <option className="font-weight-bold" value="MOROCCO">
                            MOROCCO
                          </option>
                          <option
                            className="font-weight-bold"
                            value="MOZAMBIQUE"
                          >
                            MOZAMBIQUE
                          </option>
                          <option className="font-weight-bold" value="MYANMAR">
                            MYANMAR
                          </option>
                          <option className="font-weight-bold" value="NAMIBIA">
                            NAMIBIA
                          </option>
                          <option className="font-weight-bold" value="NAURU">
                            NAURU
                          </option>
                          <option className="font-weight-bold" value="NEPAL">
                            NEPAL
                          </option>
                          <option
                            className="font-weight-bold"
                            value="NETHERLANDS"
                          >
                            NETHERLANDS
                          </option>
                          <option
                            className="font-weight-bold"
                            value="NEW ZEALAND"
                          >
                            NEW ZEALAND
                          </option>
                          <option
                            className="font-weight-bold"
                            value="NICARAGUA"
                          >
                            NICARAGUA
                          </option>
                          <option className="font-weight-bold" value="NIGER">
                            NIGER
                          </option>
                          <option className="font-weight-bold" value="NIGERIA">
                            NIGERIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="NORTH KOREA"
                          >
                            NORTH KOREA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="NORTH MACEDONIA"
                          >
                            NORTH MACEDONIA
                          </option>
                          <option className="font-weight-bold" value="NORWAY">
                            NORWAY
                          </option>
                          <option className="font-weight-bold" value="OMAN">
                            OMAN
                          </option>
                          <option className="font-weight-bold" value="PAKISTAN">
                            PAKISTAN
                          </option>
                          <option className="font-weight-bold" value="PALAU">
                            PALAU
                          </option>
                          <option
                            className="font-weight-bold"
                            value="PALESTINE STATE"
                          >
                            PALESTINE STATE
                          </option>
                          <option className="font-weight-bold" value="PANAMA">
                            PANAMA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="PAPUA NEW GUINEA"
                          >
                            PAPUA NEW GUINEA
                          </option>
                          <option className="font-weight-bold" value="PARAGUAY">
                            PARAGUAY
                          </option>
                          <option className="font-weight-bold" value="PERU">
                            PERU
                          </option>
                          <option
                            className="font-weight-bold"
                            value="PHILIPPINES"
                          >
                            PHILIPPINES
                          </option>
                          <option className="font-weight-bold" value="POLAND">
                            POLAND
                          </option>
                          <option className="font-weight-bold" value="PORTUGAL">
                            PORTUGAL
                          </option>
                          <option className="font-weight-bold" value="QATAR">
                            QATAR
                          </option>
                          <option className="font-weight-bold" value="ROMANIA">
                            ROMANIA
                          </option>
                          <option className="font-weight-bold" value="RUSSIA">
                            RUSSIA
                          </option>
                          <option className="font-weight-bold" value="RWANDA">
                            RWANDA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SAINT KITTS AND NEVIS"
                          >
                            SAINT KITTS AND NEVIS
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SAINT LUCIA"
                          >
                            SAINT LUCIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="COSAINT VINCENT AND THE GRENADINESNGO"
                          >
                            SAINT VINCENT AND THE GRENADINES
                          </option>
                          <option className="font-weight-bold" value="SAMOA">
                            SAMOA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SAN MARINO"
                          >
                            SAN MARINO
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SAO TOME AND PRINCIPE"
                          >
                            SAO TOME AND PRINCIPE
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SAUDI ARABIA"
                          >
                            SAUDI ARABIA
                          </option>
                          <option className="font-weight-bold" value="SENEGAL">
                            SENEGAL
                          </option>
                          <option className="font-weight-bold" value="SERBIA">
                            SERBIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SEYCHELLES"
                          >
                            SEYCHELLES
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SIERRA LEONE"
                          >
                            SIERRA LEONE
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SINGAPORE"
                          >
                            SINGAPORE
                          </option>
                          <option className="font-weight-bold" value="SLOVAKIA">
                            SLOVAKIA
                          </option>
                          <option className="font-weight-bold" value="SLOVENIA">
                            SLOVENIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SOLOMON ISLANDS"
                          >
                            SOLOMON ISLANDS
                          </option>
                          <option className="font-weight-bold" value="SOMALIA">
                            SOMALIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SOUTH AFRICA"
                          >
                            SOUTH AFRICA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SOUTH KOREA"
                          >
                            SOUTH KOREA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SOUTH SUDAN"
                          >
                            SOUTH SUDAN
                          </option>
                          <option className="font-weight-bold" value="SPAIN">
                            SPAIN
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SRI LANKA"
                          >
                            SRI LANKA
                          </option>
                          <option className="font-weight-bold" value="SUDAN">
                            SUDAN
                          </option>
                          <option className="font-weight-bold" value="SURINAME">
                            SURINAME
                          </option>
                          <option
                            className="font-weight-bold"
                            value="SWITZERLAND"
                          >
                            SWITZERLAND
                          </option>
                          <option className="font-weight-bold" value="SWEDEN">
                            SWEDEN
                          </option>
                          <option className="font-weight-bold" value="SYRIA">
                            SYRIA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="TAJIKISTAN"
                          >
                            TAJIKISTAN
                          </option>
                          <option className="font-weight-bold" value="TANZANIA">
                            TANZANIA
                          </option>
                          <option className="font-weight-bold" value="THAILAND">
                            THAILAND
                          </option>
                          <option
                            className="font-weight-bold"
                            value="TIMOR-LESTE"
                          >
                            TIMOR-LESTE
                          </option>
                          <option className="font-weight-bold" value="TOGO">
                            TOGO
                          </option>
                          <option className="font-weight-bold" value="TONGA">
                            TONGA
                          </option>
                          <option
                            className="font-weight-bold"
                            value="TRINIDAD AND TOBAGO"
                          >
                            TRINIDAD AND TOBAGO
                          </option>
                          <option className="font-weight-bold" value="TUNISIA">
                            TUNISIA
                          </option>
                          <option className="font-weight-bold" value="TURKEY">
                            TURKEY
                          </option>
                          <option
                            className="font-weight-bold"
                            value="TURKMENISTAN"
                          >
                            TURKMENISTAN
                          </option>
                          <option className="font-weight-bold" value="TUVALU">
                            TUVALU
                          </option>
                          <option className="font-weight-bold" value="UKRAINE">
                            UKRAINE
                          </option>
                          <option
                            className="font-weight-bold"
                            value="UNITED ARAB EMIRATES"
                          >
                            UNITED ARAB EMIRATES
                          </option>
                          <option
                            className="font-weight-bold"
                            value="UNITED KINGDOM"
                          >
                            UNITED KINGDOM
                          </option>
                          <option
                            className="font-weight-bold"
                            value="UNITED STATES OF AMERICA"
                          >
                            UNITED STATES OF AMERICA
                          </option>
                          <option className="font-weight-bold" value="URUGUAY">
                            URUGUAY
                          </option>
                          <option
                            className="font-weight-bold"
                            value="UZBEKISTAN"
                          >
                            UZBEKISTAN
                          </option>
                          <option className="font-weight-bold" value="VANUATU">
                            VANUATU
                          </option>
                          <option
                            className="font-weight-bold"
                            value="VENEZUELA"
                          >
                            VENEZUELA
                          </option>
                          <option className="font-weight-bold" value="VIETNAM">
                            VIETNAM
                          </option>
                          <option className="font-weight-bold" value="YEMEN">
                            YEMEN
                          </option>
                          <option className="font-weight-bold" value="ZAMBIA">
                            ZAMBIA
                          </option>
                          <option className="font-weight-bold" value="ZIMBABWE">
                            ZIMBABWE
                          </option>
                        </select>
                      </div>


                      {countryInfo && (
                        <>

                          <div className="col-md-6">
                            <label
                           className="font-weight-bold"  style={{ fontSize: "2vh" }}
                            >
                              Currency <span className="text-danger">*</span>
                            </label>
                            <Input
                              className="form-control"
                              name="currency"
                              style={{fontSize:"2vh" }}
                              value={countryInfo.currency_code}
                              onChange={this.onChangeCurrency}
                              readOnly
                            />
                          </div>
                          
                          <div className="col-md-6">
                                  <label  className="font-weight-bold"  style={{ fontSize: "2vh" }}>Country Code<span className="text-danger">*</span></label>
                                  <Input
                                    className="form-control font-weight-bold"
                                    name="country_code"
                                    style={{fontSize:"2vh" }}
                                    value={countryInfo.country_code}
                                    onChange={this.onChangeCountry_Code}
                                    readOnly
                                  />
                                </div>
                        </>
                      )}
                      
                      {countryInfo &&
                        countryInfo.states &&
                        countryInfo.states.length > 0 && (
                          <div className="col-md-6">
                            <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                              Select State{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              name="state"
                              style={{fontSize: "2vh" }}
                              className="form-select"
                              value={this.state.state}
                              onChange={this.onChangeState}
                            >
                              <option value="">
                                -----Select Your Country State-----
                              </option>
                              {countryInfo.states.map((state) => (
                                <option
                                  key={state.state_id}
                                  value={state.state_name}
                                >
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}


                        <div className="col-md-6">
                        <label className="font-weight-bold" style={{fontSize:"2vh"}}>
                          Store address <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="saddress"
                          style={{fontSize:"2vh"}}
                          value={this.state.saddress}
                          onChange={this.onChangeSaddress}
                          validations={[required]}
                        />
                      </div>
                      <div className="col-md-6" style={{ fontSize: "2vh" }}>
                          <label htmlFor="contact" className="font-weight-bold">Store contact <span className="text-danger">*</span></label>
                          <Input
                            type="tel"
                            className="form-control" pattern="[6789][0-9]{9}"
                            title="Must contain at least 10 digits"
                            name="contact"
                            style={{fontSize:"2vh" }}
                            value={this.state.contact}
                            onChange={this.onChangeContact}
                            placeholder=""
                            validations={[required,vcontact]}
                            maxLength={10}
                          />
                        </div>
                      <div className="col-md-6">
                        <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                          Store GST <span className="text-danger"></span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="gstno"
                          style={{fontSize: "2vh"}}
                          value={this.state.gstno}
                          onChange={this.onChangeGstno}
                          placeholder=""
                          pattern="([0-9]{2}[A-Z]{4}([A-Z]{1}|[0-9]{1}).[0-9]{3}[A-Z]([A-Z]|[0-9]){3})"
                          title="please enter correct gst no"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="font-weight-bold" style={{fontSize: "2vh"}}>
                          Email <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="email"
                          style={{fontSize: "2vh" }}
                          pattern=".+@(gmail\.com|outlook\.com|yahoo\.com)"
                          size="30"
                          title="Valid email addresses include Gmail, Outlook, and Yahoo"
                          value={this.state.email}
                          onChange={this.onChangeEmail}
                          validations={[required, validateEmail]}
                          placeholder=""
                        />
                      </div>
                     
                      <div className="col-md-6">
                        <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                           Password <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type={this.state.showPassword ? "text" : "password"}
                            className="form-control"
                            name="password"
                            style={{fontSize: "2vh" }}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            validations={[required, vpassword]}
                            placeholder=""
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={this.togglePasswordVisibility}
                            >
                              <FontAwesomeIcon
                                icon={
                                  this.state.showPassword ? faEyeSlash : faEye
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                          Confirm Password
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type={
                              this.state.showconfirmPassword
                                ? "text"
                                : "password"
                            }
                            className="form-control"
                            name="comfirmpassword"
                            style={{ fontSize: "2vh"}}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            value={this.state.comfirmpassword}
                            onChange={this.onChangeComfirmpassword}
                            validations={[required, vpassword]}
                            placeholder=""
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
                      <div className="col-md-6">
                        <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                          Created By <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="createdby"
                          style={{fontSize: "2vh" }}
                          value={this.state.createdby}
                          onChange={this.onchangeSubscriptionType}
                          readOnly
                        />
                      </div>{" "}

                      <div className="col-md-6">
                        <label className="font-weight-bold"  style={{ fontSize: "2vh" }}>
                          Updated By <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="updatedby"
                          style={{fontSize: "2vh" }}
                          value={this.state.updatedby}
                          //onChange={this.onChangeSaddress}
                          readOnly
                        />
                      </div>

                      {/* <div className="col-md-6">
                        <label
                         className="font-weight-bold" style={{ fontSize: "2vh" }}
                        >
                          FreeTrial Status<span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          className="form-control"
                          name="freeTrialType"
                          style={{fontSize: "2vh" }}
                          value={this.state.freeTrialRequested}
                          onChange={this.onChangefreeTrialRequested}
                          placeholder="Enter Type"
                          readOnly
                        />
                     </div> */}


                      <div className="col-md-6">
                        <label
                       className="font-weight-bold"  style={{ fontSize: "2vh" }}
                        >
                          Free Trial Days<span className="text-danger">*</span>
                        </label>
                        <Input
                          type="number"
                          className="form-control"
                          name="freeTrialType"
                          style={{fontSize: "2vh" }}
                          value={this.state.freeTrialType}
                          onChange={this.onChangefreeTrialType}
                          placeholder=""
                          validations={[required]}
                        />
                      </div>

                      {/* <div className="col-md-6">
                         <label className="font-weight-bold" style={{fontSize:"2vh" }}>Store subscriptionType <span className="text-danger">*</span></label>
                         <Input
                            type="text"
                            className="form-control"
                            name="subscriptionType"
                            style={{fontSize:"2vh" }}
                            value={this.state.subscriptionType}
                            //onChange={this.onChangeSaddress}
                            readOnly
                     />
                        </div> */}



                      <div className="text-center mt-3">
                        <button
                          className="btn btn-outline-light"
                          style={{ width: "12vw",
                          padding: "4px",
                          color: "white",
                          backgroundColor: "#03989e",
                          borderRadius: "5px",
                          marginTop: "2vh",
                          fontSize: "3vh", }}

                        >
                           Sign up
                        </button>
                 </div>
                
                
                 
                    <CheckButton
                      style={{ display: "none" }}
                      ref={(c) => {
                        this.checkBtn = c;
                      }}
                    />
                  </Form>
                  {this.state.message && (
              <div className="col-md-6">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success text-center font-weight-bold"
                      : "alert alert-danger text-center font-weight-bold"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
                </div>
               
              </div>
            </div>
          </div>
          <ToastContainer
            position="bottom-right"
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
            style={{ marginRight: "10px",marginBottom:"25vh"}}
          />
        </div>
      </>
    );
  }
}
