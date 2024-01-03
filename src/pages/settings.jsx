import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import authService from "../services/auth.service";
import payment from "../assets/payments1.png";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import taxService from "../services/tax.service";
import { isEmail } from "validator";
import "./list.css";


export const Settings = () => {
const currentuser = authService.getCurrentUser();

// State to track the validity of the username
const [isUsernameValid, setIsUsernameValid] = useState(true);

// State to track the validity of the username
const [isStorenameValid, setIsStorenameValid] = useState(true);

const[isGstValid,setIsGstValid] = useState(true);
const [isEmailValid, setIsEmailValid] = useState(true);

const required = (value) => {
    if (!value) {
        return (
         <div className="alert alert-danger" role="alert" style={{height:"5vh",fontSize:"2vh"}}>
            This field is required!
         </div>
        );
    }
    };
    
    const emailValidation = (email) => {
    if (!isEmail(email)) {
        return (
         <div className="alert alert-danger" role="alert">
            This is not a valid email.
         </div>
        );
    }
    if (!email.endsWith("@gmail.com") && !email.endsWith("@outlook.com") && !email.endsWith("@yahoo.com")) {
        return (
         <div className="alert alert-danger" role="alert">
            This email must be a Gmail, Outlook, or Yahoo address.
         </div>
        );
    }
    };



const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setValues((prevValues) => ({
     ...prevValues,
     email: newEmail,
    }));
};
const [values, setValues] = useState({
    Storeid: currentuser.storeid,
    store_name: "",
    username: "",
    email: "",
    contact: "",
    gstno: "",
    currency: "",
    saddress: "",
    country: "",
    state: "",
    logo: null,
});


useEffect(() => {
    axios
     .get(
        `http://localhost:8083/api/auth/store/getstore/${currentuser.storeid}`
     )
     .then((res) => {
        setValues({
         ...values,
         store_name: res.data.store_name,
         username: res.data.username,
         email: res.data.email,
         contact: res.data.contact,
         gstno: res.data.gstno,
         currency: res.data.currency,
         saddress: res.data.saddress,
         country: res.data.country,
         state: res.data.state,
         logo: res.data.logo,
         Storeid: res.data.Storeid,
        });
     })
     .catch((err) => console.log(err));
}, []);

const navigate = useNavigate();

// const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("store_name", values.store_name);
//     formData.append("username", values.username);
//     formData.append("email", values.email);
//     formData.append("contact", values.contact);
//     formData.append("gstno", values.gstno);
//     formData.append("currency", values.currency);
//     formData.append("saddress", values.saddress);
//     formData.append("country", values.country);
//     formData.append("state", values.state);
//     formData.append("logo", values.logo);

//     axios
//      .patch(
//         `http://localhost:8083/api/auth/store/updatestore/${currentuser.storeid}`,
//         formData
//      )
//      .then((res) => {
//         // Handle success
//         console.log("Updated successfully:", res.data);
//         toast.success("Updated Successfully");
//        setTimeout(() => {
//          window.location.reload();
//         }, 1000);
//         //navigate("/settings"); // Replace with your navigation logic

//         // Clear the form fields after successful update
//         setValues({
//          store_name: "",
//          address: "",
//          email: "",
//          contact: "",
//          gstno: "",
//          currency: "",
//          saddress: "",
//          country: "",
//          state: "",
//          logo: "",
//         });
//      })
//      .catch((err) => {
//         console.error("Error updating store:", err);
//         // Handle error
//      });
// };


const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("store_name", values.store_name);
  formData.append("username", values.username);
  formData.append("email", values.email);
  formData.append("contact", values.contact);
  formData.append("gstno", values.gstno);
  formData.append("currency", values.currency);
  formData.append("saddress", values.saddress);
  formData.append("country", values.country);
  formData.append("state", values.state);
  formData.append("logo", values.logo);

  try {
    const response = await axios.patch(
      `http://localhost:8083/api/auth/store/updatestore/${currentuser.storeid}`,
      formData
    );

    // Handle success
    console.log(" Store Updated successfully:", response.data);
    toast.success("Store Updated Successfully");
    setTimeout(() => {
      window.location.reload();
    }, 1000);

    // Clear the form fields after successful update
    setValues({
      store_name: "",
      address: "",
      email: "",
      contact: "",
      gstno: "",
      currency: "",
      saddress: "",
      country: "",
      state: "",
      logo: "",
    });
  } catch (error) {
    console.error("Error updating store:", error);
    // Handle error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Server responded with status code:", error.response.status);
      console.log("Error message from server:", error.response.data.message);
      toast.error(`Error: ${error.response.data.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received from the server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
    }
  }
};


    return (
    <div className="p-15 animation" style={{ marginTop: "3vh" }}>
     <div className="row p-3">
        <div
         className="col-md-8"
         style={{ marginLeft: "auto", marginRight: "auto" }}
        >
         <div className="card">
            {/* <div
             className="card-header fs-3 text-left"
             style={ { color: "gray" }}
            > */}

            <h4
             className="text-black"
             style={{ fontSize: "4vh", color: "#000099" }}
            >
             <i class="fa-solid fa-gear"></i> Store Setting
            </h4>
            {/* </div> */}
            <div className="card-body" style={{ fontSize: "2vh" }}>
             <form
                className="row g-1"
                onSubmit={(e) => handleSubmit(e)}
                encType="multipart/form-data"
             >
                <div className="col-md-6">
                 <label className="">Store Name<span style={{color:"red"}}>*</span></label>
                 <input
                    className="form-control"
                    style={{ fontstyle: "2vh" }}
                    name="store_name"
                    value={values.store_name}
                    onChange={(e) => {
                     const newValue = e.target.value;
                     setValues({ ...values, store_name: newValue });
                     // Check the length of the input and update the validity state
                     if (newValue.length > 50) {
                        setIsStorenameValid(false);
                     } else {
                        setIsStorenameValid(true);
                     }
                    }}
                 />
                 {/* Display an alert message if the username is invalid */}
                 {!isStorenameValid && (
                    <div
                     className="alert alert-danger"
                     role="alert"
                     style={{ fontSize: "2vh" }}
                    >
                     Store Name must be 50 characters or less.
                    </div>
                 )}
                </div>

                <div className="col-md-6">
                 <label className="">Username <span style={{color:"red"}}>*</span></label>
                 <input
                    type="text"
                    name="username"
                    style={{ fontstyle: "2vh" }}
                    className="form-control"
                    value={values.username}
                    minLength={3}
                    title="length must be between 3 to 20"
                    onChange={(e) => {
                     const newValue = e.target.value;
                     setValues({ ...values, username: newValue });
                     // Check the length of the input and update the validity state
                     if (newValue.length > 20) {
                        setIsUsernameValid(false);
                     } else {
                        setIsUsernameValid(true);
                     }
                    }}
                 />
                 {/* Display an alert message if the username is invalid */}
                 {!isUsernameValid && (
                    <div
                     className="alert alert-danger"
                     role="alert"
                     style={{ fontSize: "2vh" }}
                    >
                     Username must be 20 characters or less.
                    </div>
                 )}
                </div>
                <div className="col-md-6">
                 <label className="">
                    Store Email <span style={{ color: "red" }}>*</span>
                 </label>
                 <input
                    type="text"
                    name="email"
                    pattern=".+@(gmail\.com|outlook\.com|yahoo\.com)"
                    className="form-control"
                    style={{ fontstyle: "2vh" }}
                    value={values.email}
                    validations={[required, emailValidation]}
                    title="Please enter a valid gmail/outlook/yahoo address"
                    onChange={(e) => {
                     handleEmailChange(e);
                     emailValidation(e.target.value);
                    }}
                 />
                 {!isEmailValid && (
                    <div
                     className="alert alert-danger"
                     role="alert"
                     style={{ fontSize: "2vh" }}
                    >
                     This is not a valid email.
                    </div>
                 )}
                </div>
                {/* Address Field Added By Neha */}
                <div className="col-md-6">
                 <label className="">Store Address <span style={{color:"red"}}>*</span></label>
                 <input
                    type="text"
                    name="saddress"
                    style={{ fontstyle: "2vh" }}
                    className="form-control"
                    value={values.saddress}
                    onChange={(e) =>
                     setValues({ ...values, saddress: e.target.value })
                    }
                 />
                </div>

                <div className="col-md-6">
                 <label className="">Store Contact<span style={{color:"red"}}>*</span> </label>
                 <input
                    type="text"
                    name="contact"
                    className="form-control"
                    value={values.contact}
                    pattern="[0-9]{10}"
                    // maxLength={10}
                    minLength={10}
                    style={{ fontstyle: "2vh" }}
                    maxLength={10}
                    title="Plesae enter 10 digit contact number"
    onChange={(e) => {
                     const inputValue = e.target.value;
                     // Check if the input is a valid float number
                     if (/^\d+(\.\d*)?$/.test(inputValue) || inputValue === '') {
                         setValues({ ...values, contact: e.target.value })
                     }
                     }}
                 />
                 </div>
                <div className="col-md-6">
<label className="">Image <span style={{ color: "red" }}>*</span></label>
<input
    type="file"
    name="logo"
    style={{ fontstyle: "2vh" }}
    className="form-control"
    onChange={(e) => {
     const file = e.target.files[0];
     const messageElement = document.getElementById("file-validation-message");

     if (file) {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (allowedTypes.includes(file.type)) {
         // Valid image file type, you can set it to state or perform other actions.
         setValues({ ...values, logo: file });
         messageElement.textContent = ""; // Clear the message
        } else {
         messageElement.textContent = "Please select a valid image file (JPEG or PNG).";
         // Clear the input field
         e.target.value = null;
        }
     }
    }}
/>
<p id="file-validation-message" style={{ color: "red" }}></p>
</div>
                <div className="col-md-6">
                 <label className="">GST No </label>
                 <input
                    type="text"
                    name="gstno"
                    className="form-control"
                    value={values.gstno}
                    mixLength={15}
                    minLength={15}
                    style={{ textTransform: "uppercase", fontstyle: "2vh" }}
                     onChange={(e) => {
                     const newValue = e.target.value;
                     setValues({ ...values, gstno: newValue });
                     // Check the length of the input and update the validity state
                     if (newValue.length != 15) {
                        setIsGstValid(false);
                     } else {
                        setIsGstValid(true);
                     }
                    }}
                 />
                 {/* Display an alert message if the username is invalid */}
                 {!isGstValid && (
                    <div
                     className="alert alert-danger"
                     role="alert"
                     style={{ fontSize: "2vh", fontstyle: "normal" }}
                    >
                     GST No must be 15 characters.
                    </div>
                 )}
                </div>

                <div className="col-md-6">
                 <label className="">Store ID </label>

                 <input
                    type="number"
                    name="Storeid"
                    className="form-control"
                    value={values.Storeid}
                    style={{ fontSize: "2vh" }}
                    onChange={(e) =>
                     setValues({ ...values, Storeid: e.target.value })
                    }
                    disabled
                 />
                </div>

                <div className="text-center mt-3">
                 <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "14vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                 >
                    Update Store
                 </button>
                </div>
             </form>
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
     </div>
    </div>
);
};

export const Super_setting = () => {
  const currentuser = authService.getCurrentUser();
  // State to track the validity of the username
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [values, setValues] = useState({
      superid: currentuser.superid,
      storename: "",
      username: "",
      email: "",
      contact: "",
      gstno: "",
      currency: "",
      saddress: "",
      country: "",
      state: "",
      logo: null,
  });
  
  useEffect(() => {
      axios
       .get(
          `http://localhost:8083/api/auth/SuperAdmin/updatesuperadmin/${currentuser.superid}`
       )
       .then((res) => {
          setValues({
           ...values,
           storename: res.data.storename,
           username: res.data.username,
           email: res.data.email,
           contact: res.data.contact,
           gstno: res.data.gstno,
           currency: res.data.currency,
           saddress: res.data.saddress,
           country: res.data.country,
           state: res.data.state,
           logo: res.data.logo,
           Storeid: res.data.Storeid,
          });
       })
       .catch((err) => console.log(err));
  }, []);
  
  const navigate = useNavigate();
  const handleSubmit = (e) => {
      e.preventDefault();
  
      if (values.username.length <= 3 && values.username.length >= 20) {
       toast.error("Username should be between 3 to 20 characters");
       return;
      }
  
      if (values.contact.length !== 10) {
       toast.error("Mobile No should be exactly 10 digits");
       return;
      }
  
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("gstno", values.gstno);
      formData.append("currency", values.currency);
      formData.append("address", values.saddress);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("logo", values.logo);
  
      axios
       .patch(
          `http://localhost:8083/api/auth/SuperAdmin/updatetsuper/${currentuser.superid}`,
          formData
       )
       .then((res) => {
          // Handle success
          console.log("Updated successfully:", res.data);
          toast.success("Super admin upadated successfully ✔");
       })
       .catch((err) => {
          console.error("Error updating super admin:", err);
          alert("Error updating super admin");
          // Handle error
       });
  };
  
  return (
      <div className="p-15 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
       <div className="col-md-8" style={{ marginLeft: "auto", marginRight: "auto" }} >
          <div className="card">
           <h4 className="text-gray" style={{ fontSize: "4vh", color: "#000099" }} > <i class="fa-solid fa-money-bill-transfer"></i> Update Super Admin </h4>
  
           <div className="card-body" style={{ fontSize: "2vh" }}>
               <form
                  className="row g-1"
                  onSubmit={(e) => handleSubmit(e)}
                  encType="multipart/form-data"
               >
                  <div className="col-md-6">
                   <label className="">
                      Username <span className="text-danger">*</span>
                   </label>
                   <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={values.username}
                      maxLength={20}
                      minLength={3}
                      onChange={(e) => {
                       const newValue = e.target.value;
                       setValues({ ...values, username: newValue });
                       // Check the length of the input and update the validity state
                       if (newValue.length > 20) {
                          setIsUsernameValid(false);
                       } else {
                          setIsUsernameValid(true);
                       }
                      }}
                   />
                   {/* Display an alert message if the username is invalid */}
                   {!isUsernameValid && (
                      <div
                       className="alert alert-danger"
                       role="alert"
                       style={{ fontSize: "2vh" }}
                      >
                       Username must be 20 characters or less.
                      </div>
                   )}
                  </div>
                  <div className="col-md-6">
                   <label className="">
                      Email <span className="text-danger">*</span>
                   </label>
                   <input
                      type="text"
                      name="email"
                      className="form-control"
                      value={values.email}
                      pattern=".+@gmail\.com"
                      size="30"
                      title="valid only for @gmail.com"
                      onChange={(e) =>
                       setValues({ ...values, email: e.target.value })
                      }
                   />
                  </div>
                  <div className="col-md-6">
                   <label className="">
                      Contact <span className="text-danger">*</span>
                   </label>
                   <input
                      type="tel"
                      name="contact"
                      className="form-control"
                      value={values.contact}
                      onChange={(e) =>
                       setValues({ ...values, contact: e.target.value })
                      }
                      maxLength={10}
                   />
                  </div>
                  <div className="col-md-6">
                   <label className="">
                      Address <span className="text-danger">*</span>
                   </label>
                   <input
                      type="text"
                      name="saddress"
                      className="form-control"
                      value={values.saddress}
                      onChange={(e) =>
                       setValues({ ...values, saddress: e.target.value })
                      }
                   />
                  </div>
  
                  <div className="col-md-6">
                   <label className="">
                      SuperAdmin id <span className="text-danger">*</span>
                   </label>
                   <input
                      type="number"
                      name="superid"
                      className="form-control"
                      value={values.superid}
                      onChange={(e) =>
                       setValues({ ...values, superid: e.target.value })
                      }
                      disabled
                   />
                  </div>
  
                  <div className="text-center mt-3">
                   <button
                      class="btn btn-outline-light"
                      type="submit"
                      style={{ width: "12vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                   >
                    Update
                   </button>
                  </div>
               </form>
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
       </div>
      </div>
  );
  };
  
///////////////////////////////////////////////  TECHNICIAN SETTING   /////////////////////////////////////
export const Tech_setting = () => {
  const currentuser = authService.getCurrentUser();
  const [values, setValues] = useState({
    techid: currentuser.techid,
    regiNum: "",
    username: "",
    email: "",
    contact: "",
    address: "",
    country: "",
    state: "",
    createdBy: "",
    updatedby: "",
  });

  useEffect(() => {
    axios
      .get(
        `http://localhost:8083/api/auth/Tech/stores/${currentuser.techid}`
      )
      .then((res) => {
        setValues({
          ...values,
          regiNum: res.data.regiNum,
          username: res.data.username,
          email: res.data.email,
          contact: res.data.contact,
          address: res.data.address,
          country: res.data.country,
          state: res.data.state,
          createdBy: res.data.createdBy,
          updatedby: res.data.updatedby,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("regiNum", values.regiNum);
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("contact", values.contact);
    formData.append("address", values.address);
    formData.append("country", values.country);
    formData.append("state", values.state);
    formData.append("createdBy", values.createdBy);
    formData.append("updatedby", values.updatedby);

    axios
      .patch(
        `http://localhost:8083/api/auth/Tech/updatetech/${currentuser.techid}`,
        formData
      )
      .then((res) => {
        // Handle success
        console.log("Updated successfully:", res.data);
        toast.success("Technician upadated successfully ✔");
      })
      .catch((err) => {
        console.error("Error updating store:", err);
        // Handle error
      });
  };

  return (
    <div className="p-5 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
        <div
          className="col-md-8"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="card">
           
              <h4 className="text-gray" style={{ fontSize: "3.5vh",color:"#000099" }}>
                <i class="fa-solid fa-user-gear"></i> Update Profile
              </h4>
        
            <div className="card-body" style={{ fontSize: "3vh" }}>
              <form
                className="row g-1"
                onSubmit={(e) => handleSubmit(e)}
                encType="multipart/form-data"
              >
                <div className="col-md-6">
                  <label className="font-weight-bold"   style={{ fontSize: "2vh" }}>
                    Username <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    value={values.username}
                    onChange={(e) =>
                      setValues({ ...values, username: e.target.value })
                      
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Support Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    style={{ fontSize: "2vh" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Support Contact <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    className="form-control"
                    value={values.contact}
                    onChange={(e) =>
                      setValues({ ...values, contact: e.target.value })
                    }
                    style={{ fontSize: "2vh" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Support Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={values.address}
                    onChange={(e) =>
                      setValues({ ...values, address: e.target.value })
                    }
                    style={{ fontSize: "2vh" }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Support id <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    name="techid"
                    className="form-control"
                    value={values.techid}
                    onChange={(e) =>
                      setValues({ ...values, techid: e.target.value })
                    }
                    disabled
                    style={{ fontSize: "2vh" }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Created By <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="createdBy"
                    className="form-control"
                    value={values.createdBy}
                    onChange={(e) =>
                      setValues({ ...values, createdBy: e.target.value })
                    }
                    disabled
                    style={{ fontSize: "2vh" }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Updated By <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="updatedby"
                    className="form-control"
                    value={values.updatedby}
                    onChange={(e) =>
                      setValues({ ...values, updatedby: e.target.value })
                    }
                    disabled
                    style={{ fontSize: "2vh" }}
                  />
                </div>

                <div className="text-center mt-3">
                <button
                  className="btn btn-outline-light"
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
                  Update
                </button>
                </div>
              </form>
            </div>
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
  );
};

////////////////////////////////////////////////               PAYMENT SETTING                     ////////////////////////////////////
export const Payment_setting = () => {
  const currentuser = authService.getCurrentUser();

  const [accountNoError, setAccountNoError] = useState(false);
  const [IFSCError, setIFSCError] = useState(false);
  const [showAlerts, setShowAlerts] = useState({});
  const [formData, setFormData] = useState({
    store_name: currentuser.storeName,
    bankName: "",
    branchName: "",
    accountNo: "",
    ifscCode: "",
    upiId: "",
    updatedBy: currentuser.username,
    createdBy: currentuser.username,
    storeId: currentuser.storeid,
    storeid_fk: currentuser.storeid,
    // Add more fields as needed.
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check account number length
    if (formData.accountNo.length < 9 || formData.accountNo.length > 15) {
      setAccountNoError(true);
      return; // Prevent form submission if account number is invalid
    } else {
      setAccountNoError(false);
    }

    // Check account number length
    if (formData.ifscCode.length != 11) {
      setIFSCError(true);
      return; // Prevent form submission if account number is invalid
    } else {
      setIFSCError(false);
    }

    // Make an HTTP POST request to the backend API endpoint.
    axios
      .post("http://localhost:8083/sys/api/store-payments/save", formData)
      .then((response) => {
        console.log("Payment Details Add successfully:", response.data);  
        setTimeout(() => {
          window.location.reload();
         }, 1000);

        // Handle success if needed, such as showing a success message or redirecting.
        setFormData({
          store_name: "",
          bankName: "",
          branchName: "",
          accountNo: "",
          ifscCode: "",
          upiId: "",
          updatedBy: "",
          createdBy: "",
          storeId: "",
          storeid_fk: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        // Handle error if needed, such as showing an error message.
      });

    if (!formSubmitted) {
      // Show the toast only if the form hasn't been submitted before
      toast.success("Payment Details submitted successfully",
      
      
      {
        position: toast.POSITION.TOP_RIGHT,
        
      });
      setFormSubmitted(true);
    }
  };

  const [paymentList, setPaymentList] = useState([]);

  useEffect(() => {
    // Fetch payment details from the backend API
    // URL is changed by Neha
    axios
      .get(
        `http://localhost:8083/sys/api/store-payments/storepayment/${currentuser.storeid}`
      )
      .then((response) => {
        setPaymentList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
      });
  }, []);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = () => {
    // Fetch payment details from the backend API
    axios
      .get(
        `http://localhost:8083/sys/api/store-payments/storepayment/${currentuser.storeid}`
      )
      .then((response) => {
        setPaymentList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
      });
  };

  const handleDelete = (paymentId) => {
    // Make an HTTP DELETE request to delete the payment
    axios
      .delete(
        `http://localhost:8083/sys/api/store-payments/deletestorepayment/${paymentId}`
      )
      .then((response) => {
        console.log("Payment deleted successfully:", response.data);

        // Show a success toast when payment is deleted
        toast.success("Payment deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
       }, 1);
        fetchPaymentDetails();
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
      });
  };

  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = (serial_no) => {
    // Find the payment with the specified paymentId
    const paymentToEdit = paymentList.find(
      (payment) => payment.serial_no === serial_no
    );
    if (paymentToEdit) {
      // Set the editingPaymentId to the selected paymentId
      setEditingPaymentId(serial_no);
      // Set the formData state to the existing payment details
      setFormData(paymentToEdit);
      setEditModalOpen(true);
    }
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleEditSubmit = (event) => {
    event.preventDefault();
    axios
      .patch(
        `http://localhost:8083/sys/api/store-payments/updatestorepayment/${editingPaymentId}`,
        formData
      )
      .then((response) => {
        console.log("Payment updated successfully:", response.data);
        setEditModalOpen(false);
        fetchPaymentDetails();
        //setShowSuccessMessage(true);
        toast.success("Payment Details Updated Successfully");
        // Hide the success message after 3 seconds (3000ms)
       setTimeout(() => {
         window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error updating payment:", error);
      });
  };
  
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingPaymentId(null);
    setFormData({
      store_name: "",
      bankName: "",
      branchName: "",
      accountNo: "",
      ifscCode: "",
      upiId: "",
      updatedBy: "",
      createdBy: "",
    });
  };
  const resetHandler = () => {
    setFormData({
      store_name: "",
      bankName: "",
      branchName: "",
      accountNo: "",
      ifscCode: "",
      upiId: "",
      updatedBy: "",
      createdBy: "",
    });
  };

const navigate = useNavigate();
useEffect(() => {


   const keyMappings = {
    'N': '/overview/order',
    'R': '/pendingorder',
    'B': '/overview/bill_list',
    'I': '/inventory',
    '1': '/inventory/Inventory_list',
    'V': '/vendor',
    'P': '/payment',
    'T': '/VendorInventory',
    'M': '/food/food',
    'F': '/Food/Food_list',
    'A': '/food/add_ons',
    '2': '/addOn/addOn_list',
    'E': '/receipe',
    '3': '/receipe_list',
    '4': '/reports/vendor_list',
    '5': '/reports/payment_list',
    '6': '/reports/vendor_invoice_list',
    'U': '/user/adduser',
    '7': '/user/userlist',
    '8': '/reports/balance_list',
    'X': '/settings/taxsetting',
    'S': '/settings',
    'Y': '/settings/payment_setting',
    'Z': '/category',
    'C': '/balanceform',
    'O': '/overView/order_list',
    'D': '/dashbord',
    'K': '/kot',
   };
 
  const handleKeyPress = (e) => {
    // Check if e.key is defined before calling toUpperCase
    const key = e.key ? e.key.toUpperCase() : null;
  
    if (e.altKey && keyMappings[key]) {
      navigate(keyMappings[key]);
    }
  };

   window.addEventListener('keydown', handleKeyPress);
 
   return () => {
    window.removeEventListener('keydown', handleKeyPress);
   };
 }, [navigate]);

  return (
    <div className="p-5 animation" style={{marginTop:"5vh"}}>
      <div className="row" style={{ marginLeft: "-65vh", marginTop: "5vh" }}>
        <div className="col-md-3" style={{ margin: "auto", width: "50vw" }}>
          <div
            className="card mt-3"
            style={{ margin: "auto", width: "60vw", color: "black" }}
          >
           <div className="card-header fs-3 text-left">
              <h4
                className="text-gray"
                style={{ fontSize: "4vh", color: "#000099" }}
              >
                <i class="fa-solid fa-square-plus"></i> Saved Account Details
              </h4>
            </div>
            <div className="card-body" style={{ width: "50vw" }}>
              <table class="table`1" style={{ width: "55vw" }}>
                <thead style={{ fontSize: "1vw" }}>
                  <tr style={{ fontSize: "1vw", color: "black" }}>
                    <th scope="col">Sr.No</th>
                    <th scope="col">Store Name</th>
                    <th scope="col">Bank Name</th>
                    <th scope="col">Account No</th>
                    <th scope="col">IFSC Code</th>
                    <th scope="col">UPI ID</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentList.map((payment, index) => (
                    <tr key={index} style={{ fontSize: "2vh" }}>
                      <td>{index + 1}</td>
                      <td className="text-dark ">
                        {payment.store_name}
                      </td>
                      <td>{payment.bankName}</td>
                      <td>{payment.accountNo}</td>
                      <td>{payment.ifscCode}</td>
                      <td>{payment.upiId}</td>
                      <td style={{ display: "flex" }}>
                        {/* <button
                          className="btn btn-sm btn-success mr-2"
                          onClick={() => handleEdit(payment.serial_no)}
                          style={{ fontSize: "2vh" }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button> */}

                        <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [payment.serial_no]: true,
                      })
                    }
                    style={{ fontSize: "2vh",
                    width: "4.8vh", // Set the desired width
                    height: "4.8vh", // Set the desired height
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight:"2vh" }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                      
                  {showAlerts[payment.serial_no] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => handleDelete(payment.serial_no)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [payment.serial_no]: false,
                              })
                            }
                          >
                            Cancel <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

			
                        <Link
                            
                             title="edit payment"
                              style={{
                                textAlign: "center",
                                marginRight: "2vh", // Set the desired space between buttons
                              }}
                            >
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleEdit(payment.serial_no)}
                                style={{
                                  fontSize: "2vh",
                                  width: "4.8vh", // Set the desired width
                                  height: "4.8vh", // Set the desired height
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  style={{ fontSize: "2vh" }}
                                ></i>
                              </button>
                            </Link>


                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {editingPaymentId && (
          <div className="row">
            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              show={editModalOpen}
              onHide={handleCloseModal}
            >
              <Modal.Header closeButton>
                <Modal.Title centered style={{color:"#000099"}}>
                
                  <i class="fa-solid fa-pen-to-square fa-lg"></i> Edit Payment
                  Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                      Store Name <span style={{color:"red"}}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="store_name"
                      value={formData.store_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                      Select Bank Name <span style={{color:"red"}}>*</span>
                    </Form.Label>
                    <Form.Control
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                       Branch Name <span style={{color:"red"}}>*</span>
                    </Form.Label>
                    <Form.Control
                      name="branchName"
                      className="form-control"

                     
                      value={formData.branchName}
                      onChange={handleChange}
                      required
                    />
                    {/* Account No Validation Applied by Neha */}
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                       Account Number{" "}
                      <span style={{color:"red"}}>*</span>
                    </Form.Label>
                    <Form.Control
                      name="accountNo"
                      className="form-control"
                      
                      value={formData.accountNo}
                      pattern="[0-9]{9,15}"
                      maxLength={15}
                      minLength={9}
                      min={1}
                      onChange={handleChange}
                      required
                    />
                    {accountNoError && (
                      <div className="alert alert-danger mt-2" role="alert">
                        Account number must be between 9 and 15 digits.
                      </div>
                    )}
                    {/* IFSC code Validation Applied by Neha */}
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                      IFSC code No <span style={{color:"red"}}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="ifscCode"
                      className="form-control"
                     
                      pattern="^[^\s]{4}\d{7}$"
                      title="Please enter valid IFSC Code"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      required
                    />
                    {IFSCError && (
                      <div className="alert alert-danger mt-2" role="alert">
                        IFSC No must be 11 characters only.
                      </div>
                    )}
                    {/* UPI Id Validation Applied by Neha */}
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                       UPI ID<span style={{color:"red"}}>*</span>
                    </Form.Label>
                    <Form.Control
                      name="upiId"
                      className="form-control"
                     
                      value={formData.upiId}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                      Update by :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="updatedBy"
                      className="form-control"
                  
                      value={formData.updatedBy}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="col-md-12">
                    <Form.Label className="">
                      Created By:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="createdBy"
                      className="form-control"
                     
                      value={formData.createdBy}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>
                  <button
className="btn text-white mt-5"
type="submit"
style={{
    background: "#03989e",
    width: "200px", // Adding 'px' unit
    margin: "auto",
    display: "block", // This helps center vertically
}}
>
Update
</button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        )}
      </div>
      <div className="p-15">
        <div className="col-md-8" style={{ margin: "auto" }}>
          <div className="card">
            <div className="card-header fs-3 text-left">
              <h4
                className="text-gray"
                style={{ fontSize: "4vh", color: "#000099" }}
              >
                <i class="fa-solid fa-square-plus"></i> Add New Payment:
              </h4>
            </div>
            <div className="card-body">
              <div className="text-center p-2">
                <img
                  src={payment}
                  alt="Sidebar background"
                  style={{ width: "40vw", height: "10rem" }}
                ></img>
              </div>
              <form
                className="row g-3"
                onSubmit={handleSubmit}
                style={{ fontSize: "2.5vh" }}
              >
                <div className="mb-3">
                  <label className="">
                  Store Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    name="store_name"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                   
                    value={formData.store_name}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="">
                    Select Bank Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="">
                     Branch Name : <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    name="branchName"
                    className="form-control"
        
                    style={{ fontSize: "2.5vh" }}
                    value={formData.branchName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Account No Validation Applied by Neha */}
                <div className="mb-3">
                  <label className="">
                   Account Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="accountNo"
                    className="form-control"
                    min={1}
      
                    style={{ fontSize: "2.5vh" }}
                    value={formData.accountNo}
                    onChange={handleChange}
                    pattern="[0-9]{9,15}"
                    maxLength={15}
                    minLength={9}
                    alert="Please match the Requested Format"
                    required
                  />
                  {accountNoError && (
                    <div className="alert alert-danger mt-2" role="alert">
                      Account number must be between 9 and 15 digits.
                    </div>
                  )}
                </div>
                {/* IFSC Code Validation Applied by Neha */}
                <div className="col-md-6">
                  <label className="">
                    IFSC Code No <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    className="form-control"
                    value={formData.ifscCode}
                    style={{ fontSize: "2.5vh" }}
                    pattern="^[^\s]{4}\d{7}$"
                    title="Please enter valid IFSC Code"
                    onChange={handleChange}
                    required
                  />
                  {IFSCError && (
                    <div className="alert alert-danger mt-2" role="alert">
                      IFSC No must be 15 characters only.
                    </div>
                  )}
                </div>
                {/* UPI id Validation Applied by Neha */}
                <div className="col-md-6">
                  <label className="">
                  UPI ID <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    name="upiId"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                   
                    value={formData.upiId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Update By :</label>
                  <input
                    type="text"
                    name="updatedBy"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                  
                    value={formData.updatedBy}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Created By:</label>
                  <input
                    type="text"
                    name="createdBy"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                    
                    value={formData.createdBy}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="text-center mt-3">
                  <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "24vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                  >
                    Add Payment Details
                  </button>
                </div>
              </form>
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
                style={{ marginTop: "80vh", marginRight: "10px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//{---------------------- TAX SETTING--------------------------------------}

const Taxsetting = () => {
  const currentuser = authService.getCurrentUser();
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taxlist, setTaxlist] = useState([]);
  const [msg, setMsg] = useState("");
  const [showAlerts, setShowAlerts] = useState({});


  //Function to show the modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    init();
    fetchData();
  }, []);

  const isRequired = true;

  const init = () => {
    taxService
      .getTax()
      .then((res) => {
        // console.log(res.data);
        setTaxlist(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Tax/stores/${currentuser.storeid}/taxes`
      );
      console.log("API Response:", response.data);

      setTaxlist(response.data);
      setSerachApiData(response.data);
    } catch (error) {
      console.log("Error fetching tax settings:", error);
    }
  };

  const deleteTax = (serial_no) => {
    const apiUrl = "http://localhost:8083/sys/Tax/taxes/" + serial_no;

    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        //No need to parse response as JSON if it's not in JSON format
        return response.text(); // Or response.blob(), response.text(), etc. based on the expected response format
      })
      .then((data) => {
        toast.success(" Tax Delete Successfully");
       setTimeout(() => {
        window.location.reload();
     }, 1);
        init();
      })
      .catch((error) => {
        console.error("Error deleting tax:", error);
      });
  };

  // Function to hide the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    status: "",
    updatedby: currentuser.username,
    createdby: currentuser.username,
    storeid_fk: currentuser.storeid,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate tax name and rate before submitting
    if (!formData.name) {
      toast.error("Tax Name is required");
      return;
    }

    if (!formData.rate) {
      toast.error("Tax rate is required");
      return;
    }
    axios
      .post("http://localhost:8083/sys/Tax/save", formData)
      .then((response) => {
        console.log("Tax Details submitted successfully:", response.data);
        toast.success("Tax Details submitted successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          window.location.reload();
       }, 1);
        setFormData({
          name: "",
          rate: "",
          updatedby: "",
          createdby: "",
          storeid_fk: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        // Handle error if needed, such as showing an error message.
      });
  };


  const navigate = useNavigate();
useEffect(() => {
   const keyMappings = {
    'N': '/overview/order',
    'R': '/pendingorder',
    'B': '/overview/bill_list',
    'I': '/inventory',
    '1': '/inventory/Inventory_list',
    'V': '/vendor',
    'P': '/payment',
    'T': '/VendorInventory',
    'M': '/food/food',
    'F': '/Food/Food_list',
    'A': '/food/add_ons',
    '2': '/addOn/addOn_list',
    'E': '/receipe',
    '3': '/receipe_list',
    '4': '/reports/vendor_list',
    '5': '/reports/payment_list',
    '6': '/reports/vendor_invoice_list',
    'U': '/user/adduser',
    '7': '/user/userlist',
    '8': '/reports/balance_list',
    'X': '/settings/taxsetting',
    'S': '/settings',
    'Y': '/settings/payment_setting',
    'Z': '/category',
    'C': '/balanceform',
    'O': '/overView/order_list',
    'D': '/dashbord',
    'K': '/kot',
   };
 
  const handleKeyPress = (e) => {
    // Check if e.key is defined before calling toUpperCase
    const key = e.key ? e.key.toUpperCase() : null;
  
    if (e.altKey && keyMappings[key]) {
      navigate(keyMappings[key]);
    }
  };
 
   window.addEventListener('keydown', handleKeyPress);
 
   return () => {
    window.removeEventListener('keydown', handleKeyPress);
   };
 }, [navigate]);

  return (
    <div className="p-5 animation" style={{marginTop:"7vh"}}>
      <div
        style={{ marginLeft: "82%", marginRight: "auto", marginTop: "0" }}
      >
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={handleShowModal} style={{fontSize:"2.5vh"}}
       
        >
          <i class="fa-solid fa-square-plus"></i> Add Tax
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Tax</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center"> {/* Added text-center class */}
    <Form onSubmit={handleSubmit}>
      <Form.Group className="col-md-12">
        <Form.Label className="">
          Tax Type <span className="text-primary">*</span>
        </Form.Label>
        <Form.Control
          name="name"
          placeholder="Ex. CGST, SGST"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="col-md-12">
        <Form.Label className="">
          Tax Rate <span className="text-primary">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          min={1}
          name="rate"
          placeholder="Ex. 18%"
          value={formData.rate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <button
        className="btn btn-primary" // Use Bootstrap button class
        style={{
          marginTop: "3vh",
          borderRadius: "5px",
          height: "5vh",
          width: "15vh"
        }}
        type="submit"
      >
        Submit
      </button>
    </Form>
  </Modal.Body>
</Modal>


      <div className="rowleft90">
    <div
     className="card-header fs-3"
     style={{
        display: "flex",
        marginBottom: "10px",
        borderRadius: "15px",
     }}
    >
     <i
        class="fa-solid fa-list"
        style={{
         fontSize: "3vh",
         marginTop: "5px",
         color: "rgb(0, 0, 153)",
         marginTop: "11px",
        }}
     ></i>
     <h4
        className=""
        style={{
         color: "#000099",
         fontSize: "3vh",
         fontWeight: "bold",
         width: "12vw",
         minWidth: "11vw",
         marginLeft: "10px",
         marginTop: "10px",
        }}
     >
        Tax 
     </h4>
     {msg && (
        <h4 className="fs-4 text-center text-white">
         {msg} <i class="fa-solid fa-square-check"></i>
        </h4>
     )}
</div>
</div>
    
      <div className="data body1">
        <div className="row rowleft90"></div>
        <div>
          <p></p>
        </div>
        <div class="content2 read">
          <table style={{ fontSize: "2vh" }}>
            <thead>
              <tr style={{ fontSize: "2vh" }}>
                <td
                  scope="col"
                  class="text-center border"
                  style={{ fontSize: "2vh" }}
                >
                  Sr.NO
                </td>
                <th
                  scope="col"
                  class="text-center  border"
                  style={{ fontSize: "2vh" }}
                >
                  Tax id
                </th>
                <th
                  scope="col"
                  class="text-center  border"
                  style={{ fontSize: "2vh" }}
                >
                  Tax Name
                </th>
                <th
                  scope="col"
                  class="text-center  border"
                  style={{ fontSize: "2vh" }}
                >
                  Rate (%)
                </th>
                <th
                  scope="col"
                  class="text-center  border"
                  style={{ fontSize: "2vh", width: "10vw" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="tbodytr">
              {taxlist.map((i, num) => (
                <tr key={i.taxid}>
                  <td class="text-center px-2 border">{num + 1}</td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    i.taxid
                      .toString()
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.taxid}</strong>
                    ) : (
                      i.taxid
                    )}
                  </td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    i.name.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.name}</strong>
                    ) : (
                      i.name
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    i.rate
                      .toString()
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.rate}</strong>
                    ) : (
                      i.rate
                    )}
                  </td>

                  <td class="actions" style={{ display: "flex",justifyContent:"center"}}>
                   

                    <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [i.serial_no]: true,
                      })
                    }
                    style={{ fontSize: "2vh",
                    width: "4.8vh", // Set the desired width
                    height: "4.8vh", // Set the desired height
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight:"2vh" }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                  {showAlerts[i.serial_no] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => deleteTax(i.serial_no)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [i.serial_no]: false,
                              })
                            }
                          >
                            Cancel <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                        <Link
                              to={`/settings/update_tax/${i.serial_no}`}
                              title="edit tax"
                              style={{
                                textAlign: "center",
                                marginRight: "2vh", // Set the desired space between buttons
                              }}
                            >
                              <button
                                className="btn btn-outline-success"
                                style={{
                                  fontSize: "2vh",
                                  width: "4.8vh", // Set the desired width
                                  height: "4.8vh", // Set the desired height
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  style={{ fontSize: "2vh" }}
                                ></i>
                              </button>
                            </Link>


                   </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        style={{marginLeft:"80vh"}}
      />
    </div>
  );
};

export default Taxsetting;

// {------------------------- TAX UPDATE-----------------------------}

export const Update_Tax = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const currentuser = authService.getCurrentUser();
  const [values, setValues] = useState({
    serial_no: id,
    taxid: "",
    name: "",
    rate: "",
    status: "",
    updatedby: currentuser.username,
    createdby: currentuser.username,
    storeid_fk: currentuser.storeid,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/Tax/gettaxbyid/" + id)
      .then((res) => {
        setValues({
          ...values,
          taxid: res.data.taxid,
          name: res.data.name,
          rate: res.data.rate,
          status: res.data.status,
          updatedby: res.data.updateby,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch("http://localhost:8083/sys/Tax/update/" + id, values) // rushikesh made this changes accepet
      .then((res) => {
        navigate(`/settings/update_tax/${id}`);

        toast.success("Tax Updated Successfully");
        setValues({
          serial_no: id,
          taxid: "",
          name: "",
          rate: "",
          status: "",
          updatedby: "",
          createdby: "",
          storeid_fk: currentuser.storeid,
        });
      })
      .catch((err) => console.log(err));
  };



useEffect(() => {
   const keyMappings = {
    'N': '/overview/order',
    'R': '/pendingorder',
    'B': '/overview/bill_list',
    'I': '/inventory',
    '1': '/inventory/Inventory_list',
    'V': '/vendor',
    'P': '/payment',
    'T': '/VendorInventory',
    'M': '/food/food',
    'F': '/Food/Food_list',
    'A': '/food/add_ons',
    '2': '/addOn/addOn_list',
    'E': '/receipe',
    '3': '/receipe_list',
    '4': '/reports/vendor_list',
    '5': '/reports/payment_list',
    '6': '/reports/vendor_invoice_list',
    'U': '/user/adduser',
    '7': '/user/userlist',
    '8': '/reports/balance_list',
    'X': '/settings/taxsetting',
    'S': '/settings',
    'Y': '/settings/payment_setting',
    'Z': '/category',
    'C': '/balanceform',
    'O': '/overView/order_list',
    'D': '/dashbord',
    'K': '/kot',
   };
 
  const handleKeyPress = (e) => {
    // Check if e.key is defined before calling toUpperCase
    const key = e.key ? e.key.toUpperCase() : null;
  
    if (e.altKey && keyMappings[key]) {
      navigate(keyMappings[key]);
    }
  };
 
   window.addEventListener('keydown', handleKeyPress);
 
   return () => {
    window.removeEventListener('keydown', handleKeyPress);
   };
 }, [navigate]);
  return (
    <div className="adduser animation">
      <div class="login-box">
        <h2 style={{ color: "#03989e", fontWeight: "400" }}>UPDATE TAX</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div style={{ color: "black" }} class="user-box">
            <input
              type="text"
              name="name"
              value={values.name}
              style={{ color: "black" }}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
            <label style={{ color: "black" }}>Tax Name<span style={{color:"red"}}>*</span></label>
          </div>

          <div style={{ color: "black" }} class="user-box">
            <input
              type="number"
              min={1}
              name="rate"
              style={{ color: "black" }}
              value={values.rate}
              onChange={(e) => setValues({ ...values, rate: e.target.value })}
            />
            <label style={{ color: "black" }}>Tax Rate<span style={{color:"red"}}>*</span></label>
          </div>

          <button
                    style={{
                      marginLeft: "18vh",
                      width: "8vw",
                      marginTop: "20px",
                      backgroundColor: "#03989e",
                      borderRadius: "5px",
                      color: "white",
                      marginRight:"auto"
                    }}
                    variant="primary"
                  >
                   Update
                  </button>
        </form>
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
      />
    </div>
  );
};
