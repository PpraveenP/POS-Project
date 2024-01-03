import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./balance.css";
function BalanceForm() {
  const [openingBalance, setOpeningBalance] = useState("");
  const [previousclosingBalance, setPreviousClosingBalance] = useState("");
  const [addmoreamounts, setAddmoreAmount] = useState("0");
  

  const [store_id, setStoreId] = useState("");
  const [createdby, setCreatedBy] = useState("");
  const [updatedby, setUpdatedBy] = useState("");
  const [remaining_Balance, setremaining_Balance] = useState(""); // Initialize with an empty string or a default value
  const [amount, setamount] = useState("");
  const [finalAmount, setFinalAmount] = useState(0); // Initialize with zero
  const [expense, setexpense] = useState("");
  const currentuser = authService.getCurrentUser();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!addmoreamounts.trim() || addmoreamounts < 1) {
      // Check if "addmoreamounts" is blank or less than 1
      toast.error("Add more amount should not be blank but positive value.");
      return; // Don't proceed further if there's an error
    }
    

     try {
     const formData = {
        addmoreamounts: addmoreamounts,
        store_id: currentuser.storeid,
        createdby: currentuser.username,
        updatedby: currentuser.username,
         };


     // Send a POST request to the backend API
     const response = await axios.patch(
        "http://localhost:8083/sys/api/balance/start-new-day",
        formData
     );

     console.log("Response from API:", response.data);
     toast.success("Balance Added Successfully");
     setTimeout(() => {
        window.location.reload();
     }, 1);
    } catch (error) {
     console.error("Error posting data: ", error);
     toast.error("After closing you dont have access to add amount");
    }
};

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so we add 1
  const day = currentDate.getDate();
  const [cashPayment, setCashPayment] = useState(null);
  const [cardPayment, setCardPayment] = useState(null);
  const [upiPayment, setUpiPayment] = useState(null);

  useEffect(() => {
    //fetch cash payment data
    fetch(
      `http://localhost:8083/sys/Bill/total-cash-amount/${currentuser.storeid}/today`
    )
      .then((cashResponse) => cashResponse.json())
      .then((cashData) => {
        console.log("Cash Payment Data:", cashData);
        setCashPayment(cashData);
      })
      .catch((error) => {
        console.error("Error fetching cash payment data: ", error);
      });

    // Fetch card payment data
    fetch(
      `http://localhost:8083/sys/Bill/total-card-amount/${currentuser.storeid}/today`
    )
      .then((cardResponse) => cardResponse.json())
      .then((cardData) => {
        console.log("Card Payment Data:", cardData);
        setCardPayment(cardData);
      })
      .catch((error) => {
        console.error("Error fetching card payment data: ", error);
      });

    // Fetch UPI payment
    fetch(
      `http://localhost:8083/sys/Bill/total-upi-amount/${currentuser.storeid}/today`
    )
      .then((upiResponse) => upiResponse.json())
      .then((upiData) => {
   
        setUpiPayment(upiData);
      })
      .catch((error) => {
        console.error("Error fetching UPI payment data: ", error);
      });
  }, []);

  const [final_handed_over_to, setFinalHandedOverTo] = useState("");
  const [final_amount, setFinalHandedAmount] = useState("");
  const [final_closing_balance, setFinalClosingBalance] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

  const handleSubmitexpense = (e) => {
    e.preventDefault();

    if (!expense.trim() || !amount.trim()) {
      // Check if either "expense" or "amount" is blank
      setErrorMessage("Please fill in both expense and amount fields.");
      toast.error(
        "Please fill in both expense and amount fields before submitting."
      );
      return; // Don't proceed further if there's an error
    }

    const transactionData = {
      cashier: currentuser.username,
      expense: expense,
      store_id: currentuser.storeid,
      amount: amount,
    };

    // Check if the expense amount is greater than the remaining balance
    if (parseFloat(amount) > parseFloat(remainingBalance)) {
      toast.error("Entered Amount is greater than Remaining Amount.");
      return; // Don't proceed further if the expense exceeds the balance
    }

    fetch("http://localhost:8083/sys/transaction/end-of-day-close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Response status:", response.status);
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Response from server:", data);
        if (data === "Not sufficient balance for end-of-day close.") {
          toast.error("Not Sufficient Balance. Please Check Balance");
        } else if (data === "End of day closing successful!!!") {
          toast.success("Amount given successfully!!!");
          setTimeout(() => {
            window.location.reload();
          }, 1);
        } else {
          toast.error("final is already done for today so you can't do it again  ");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  /*------------------------CHANGES MADE BY Neha--------------------------*/
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!final_handed_over_to.trim() || isNaN(parseFloat(final_amount))) {
      // Check if either "final_handed_over_to" is blank or "final_amount" is not a valid number
      setErrorMessage(
        "Please fill in both final_handed_over_to and final_amount fields."
      );
      toast.error(
        "Please fill in both final_handed_over_to and final_amount fields."
      );
      return;
    }

    // Calculate the final closing balance
    const calculatedFinalClosingBalance =
      parseFloat(remaining_Balance) - parseFloat(final_amount);

    if (calculatedFinalClosingBalance < 0) {
      // Check if the calculated final closing balance is negative (expense exceeds balance)
      toast.error("Entered Amount is greater than Remaining Amount.");
      return;
    }

    // Update the state with the calculated final closing balance
    setFinalClosingBalance(calculatedFinalClosingBalance);

    // Create a formData object with the values from state
    const formData = {
      final_handed_over_to: final_handed_over_to,
      final_amount: final_amount,
      final_closing_balance: calculatedFinalClosingBalance,
      store_id: currentuser.storeid,
      createdby: currentuser.username,
      updatedby: currentuser.username,
      date: currentDate,
    };

    axios
      .post("http://localhost:8083/sys/api/balance/addBalance", formData)
      .then((response) => {
        // Handle the response
        console.log("Response:", response.data); // Use response.data to access the response text
        toast.success("Amount given successfully!");
        // Reset the form or perform any other necessary actions
        // For example, you can clear the input fields
        setFinalHandedOverTo("");
        setFinalHandedAmount("");
        setFinalClosingBalance("");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("You have already done the final closing,Now you are not able to do it again.");
      });
    console.log("Form Data:", formData);
  };

  useEffect(() => {
    //   // Simulate fetching the closing balance from a local source (e.g., a variable or storage)
    const fetchedremaining_Balance = " "; // Replace with your actual closing balance source
    setremaining_Balance(fetchedremaining_Balance);
    fetchClosingBalance();
  }, []);

  const fetchClosingBalance = () => {
    // Define the URL for your closing balance API endpoint
    const apiUrl = `http://localhost:8083/sys/api/balance/total-closing-balance`;

    // Make a GET request to fetch the closing balance
    axios
      .get(apiUrl)
      .then((response) => {
        // Update the closing balance state with the received data
        setremaining_Balance(response.data);

        // Handle the response from your API as needed
        console.log("Closing Balance Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching closing balance:", error);
      });
  };

  useEffect(() => {
    fetchcurrentClosingBalance();
  }, []);
  const fetchcurrentClosingBalance = () => {
    // Define the URL for your closing balance API endpoint
    // const apiUrl = `http://localhost:8083/sys/api/balance/balance/${currentuser.storeid}`;
    const apiUrl = `http://localhost:8083/sys/api/balance/yesterday-closing-balance/${currentuser.storeid}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setFinalAmount(response.data);
        // Update the final amount state with the 'final_amount' from the first item
        if (response.data.length > 0) {
          setFinalAmount(response.data[0].final_closing_balance.toString());
        }
        console.log("Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

 
  const [remainingBalance, setRemainingBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define a function to fetch the remaining balance
    const fetchRemainingBalance = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/sys/api/balance/remaining_balance/${currentuser.storeid}`
        );
        if (response.ok) {
          const data = await response.text();
          setRemainingBalance(data);
          console.log(remainingBalance);
          setError(null);
        } else {
          setError("Error getting remaining balance");
        }
      } catch (error) {
        setError("Error getting remaining balance: " + error.message);
      }
    };

    fetchRemainingBalance();
  }, []);

  const [isRegistered, setIsRegistered] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModals = () => {
    setModalOpen(true);
  };

 

  return (
    <div
      className="container p-5 animation"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        maxWidth: "100vw",
      }}
    >
      <div className="card" style={{ width: "70vw" }}>
        <div
          className="card-header "
          style={{ marginLeft: "auto", marginRight: "auto", color: "#000099" }}
        >
          <h1
            className="text-start font-weight-bold"
            style={{ fontSize: "4vh", width: "60vw" }}
          >
            <i class="fa-solid fa-wallet"></i> Cash Register
          </h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <label
                    className="font-weight-bold text-end"
                    style={{ fontSize: "2vh" }}
                  >
                    Previous Closing Balance :
                  </label>
                </div>
                <div className="col-md-6" style={{ paddingRight: "28px" }}>
                  <input
                    type="number"
                    style={{ fontSize: "2vh" }}
                    name="finalAmount"
                    className="form-control font-weight-bold col-md-7"
                    value={parseFloat(finalAmount).toFixed(2)}
                    onChange={(e) => setFinalAmount(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
  <div className="row align-items-center">
    <div className="col-md-3">
      <label
        className="font-weight-bold text-end"
        style={{ fontSize: "2vh" }}
      >
        Add More Amount:
      </label>
    </div>
    <div className="col-md-6" style={{ paddingRight: "28px" }}>
      <div className="input-group">
        <input
          type="number"
          style={{ fontSize: "2vh" }}
          name="addmoreamounts"
          className="form-control font-weight-bold col-md-7"
          value={addmoreamounts}
          onChange={(e) => setAddmoreAmount(e.target.value)}
          min={1}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="submit"
            style={{ fontSize: "2vh" }}
            disabled={isRegistered}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>



          </form>

          <form onSubmit={handleSubmitexpense}>
            <table
              className=" table-bordered"
              style={{ width: "63vw", marginLeft: "1vh" }}
            >
              <thead className="bg-info text-white text-center">
                <tr style={{height:"6vh" ,fontSize:"2vh"}}>
                  <th>Sales</th>
                  <th>Cashier</th>
                  <th>Expense</th>
                  <th>Amount</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "2vh",
                        }}
                      >
                        <label className="font-weight-bold mr-2 p-1">
                          Cash
                        </label>
                        <input
                          type="text"
                          value={JSON.stringify(cashPayment, null, 2)}
                          readOnly
                          class="form-control font-weight-bold"
                          style={{ width: "200px",fontSize: "2vh" }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "2vh",
                        }}
                      >
                        <label className="font-weight-bold mr-2 p-1">
                          Card
                        </label>
                        <input
                          type="text"
                          value={JSON.stringify(cardPayment, null, 2)}
                          readOnly
                          class="form-control font-weight-bold"
                          style={{ width: "200px",fontSize: "2vh" }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "2vh",
                        }}
                      >
                        <label className="font-weight-bold mr-3 p-1">Upi</label>
                        <input
                          type="text"
                          value={JSON.stringify(upiPayment, null, 2)}
                          readOnly
                          class="form-control font-weight-bold"
                          style={{ width: "200px", fontSize: "2vh" }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <input
                      type="text"
                      name="cashier"
                      class="form-control font-weight-bold text-center"
                      value={currentuser.username}
                      readOnly
                      onChange={(e) => setCreatedBy(e.target.value)}
                      style={{ width: "150px", fontSize: "2vh" }}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      name="expense"
                      class="form-control"
                      value={expense}
                      onChange={(e) => setexpense(e.target.value)}
                      style={{ width: "100px", fontSize: "2vh" }}
                      // disabled={!isRegistered}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      class="form-control"
                      value={amount}
                      min={1}
                      onChange={(e) => setamount(e.target.value)}
                      style={{ width: "100px", fontSize: "2vh" }}
                      // disabled={!isRegistered}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      name="remaining_Balance"
                      value={parseFloat(remainingBalance).toFixed(2)}
                      class="form-control font-weight-bold text-center"
                     
                      onChange={(e) => setremaining_Balance(e.target.value)}
                      readOnly
                      style={{
                        width: "25vh",
                        marginLeft: "20px",
                        fontSize: "2vh",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              className="col-md-2 text-center my-4"
              style={{ fontSize: "2.5vh" }}
            >
              <button className="btn btn-success btn-block" type="submit" style={{}}>
                Submit
              </button>
             
            </div>
          </form>
  
          <button
            className="btn btn-primary" type="submit"
            style={{ width: "9vw", marginTop: "-62px", marginLeft: "25vh" , position:"absolute",}}
            onClick={openModal}
          >
            Final
          </button>
         

          {showModal && (
  <div className="modal-container" >
    <div className="modal-overlay"></div>
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content"style={{marginTop:"50vh"}}>
          <div className="modal-header">
            <h5 className="modal-title font-weight-bold">
              Cash Register
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body" style={{ fontWeight: "500" }}>
            Are you sure you want to close and update today's closing final amount
            <div style={{ color: "red" }}>
              * NOTE: After this process, you won't be able to use or make any modification in the cash register
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                openModals();
                closeModal(); // Add this line to close the modal
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={closeModal}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



          <form onSubmit={handleSubmit}>
            {/* <table className="col-mr-12 table table-bordered"> */}
            <table
              className=" table-bordered"
              style={{ width: "63vw", fontSize: "2vh", marginLeft: "1vh" }}
            >
              <thead className="bg-info text-white text-center">
                <tr>
                  <th colSpan="2" style={{ fontSize: "2vh",height:"5vh" }}>
                    Final Given Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label className="font-weight-bold">Handed Over To</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control col-md-3"
                      name="final_handed_over_to"
                      value={final_handed_over_to}
                      onChange={(e) => setFinalHandedOverTo(e.target.value)}
                      style={{ width: "760px",fontSize:"2vh" }}
                      disabled={!modalOpen} // Disable if modal is not open
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label className="font-weight-bold">Handed Amount</label>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control col-md-3"
                      name="final_amount"
                      style={{fontSize:"2vh"}}
                      value={final_amount}
                      onChange={(e) => setFinalHandedAmount(e.target.value)}
                      disabled={!modalOpen} // Disable if modal is not open
                    />
                  </td>
                </tr>
                
              </tbody>
            </table>
            <div className="col-md-2 text-center my-4">
              <button className="btn btn-success btn-block" type="submit">
                Submit
              </button>
            </div>
          </form>
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
        style={{ marginTop: "85vh", marginRight: "1vh" }}
      />
    </div>
  );
}

export default BalanceForm;
