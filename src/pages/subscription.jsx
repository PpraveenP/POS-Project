
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    subscriptionType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your registration API endpoint with the form data
      const response = await fetch(
        "http://localhost:8083/api/auth/store/storeSubscribePaid",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      console.log(formData);

      if (response.ok) {
        // Registration was successful
        console.log("Registration successful");
        toast.success("Paid Subscription successful ..... ");
      } else {
        // Registration failed, handle the error
        toast.error("Subscription  failed .... ");
        console.error("Registration failed");
      }
    } catch (error) {
      // Handle any network or unexpected errors
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="p-15 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
        <div className="col-md-8" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div className="card">
            <h4 className="text-gray" style={{ fontSize: "3.5vh", color: "#000099" }}>
            <i class="fa-solid fa-money-bill"></i> Paid Subscription
            </h4>

            <div className="card-body" style={{ fontSize: "3vh" }}>
              <form className="row g-1" onSubmit={handleSubmit}>
                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Store Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    style={{ fontSize: "2vh" }}
                    onChange={handleChange}
                    value={formData.username}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Store Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    style={{ fontSize: "2vh" }}
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" style={{ fontSize: "2vh" }}>
                    Store Subscription Year
                  </label>
                  <input
                    type="text"
                    name="subscriptionType"
                    className="form-control"
                    style={{ fontSize: "2vh" }}
                    onChange={handleChange}
                    value={formData.subscriptionType}
                    required
                  />
                </div>
                <div className="col-12 text-center mt-3">
                  <button
                    className="btn btn-outline-light"
                    style={{
                      width: "13vw",
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
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        style={{marginTop:"10vh"}}
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
}

export default RegistrationForm;
