import React, { useState, useEffect } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./allform.css";
import paymentService from "../services/payment.service";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";

const Payment = () => {
  const currentuser = authService.getCurrentUser();
  const [itemNames, setItemNames] = useState([]);
  const [vendorname, setVendorname] = useState([]);
  const [payment, setPayment] = useState({
    payment_id: "",
    store_id: currentuser.storeid,
    vendor_name: "",
    gst: currentuser.gstno,
    payment_mode: "",
    due_date: "",
    bank_name: "",
    branch: "",
    account_no: "",
    ifsc_code: "",
    upi_id: "",
    total: "",
    creatby: currentuser.username,
    updateby: currentuser.username,
    payment_status: "pending"
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchVendorList();
    fetchItemNames();
  }, []);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in the "yyyy-mm-dd" format

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`); // Replace with your API endpoint
      setVendorname(response.data.map((item) => item.vendor_name));
    } catch (error) {
      console.error('Error fetching Vendor names:', error);
    }
  };

  const fetchItemNames = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/sys/Inventory/inventory/${currentuser.storeid}`); // Replace with your API endpoint for fetching item names
      setItemNames(response.data.map((item) => item.name));
    } catch (error) {
      console.error('Error fetching Item names:', error);
    }
  };

  const paymentRegister = (e) => {
    e.preventDefault();

    if (payment.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (payment.due_date === "") {
      toast.error("Please choose a Due Date");
      return;
    }

    // Parse the selected expiry date
    const selectedExpiryDate = new Date(payment.due_date);
    const today = new Date().toISOString().split("T")[0]; // Get today's date in the "yyyy-mm-dd" format

    if (selectedExpiryDate < today) {
      toast.error("Due date must be greater than or equal to today's date");
      return;
    }

    if (payment.bank_name.trim() === "") {
      toast.error("Bank Name is required");
      return;
    }

    if (payment.branch.trim() === "") {
      toast.error("Branch Name is required");
      return;
    }

    if (payment.account_no.trim() === "") {
      toast.error("Account No is required");
      return;
    }

    // Log the account number and the test result
    console.log("Account No:", payment.account_no);
    console.log("Validation Result:", /^\d{9,15}$/.test(payment.account_no));

    if (!/^\d{9,15}$/.test(payment.account_no)) {
      toast.error("Account No must be between 9 to 15 digits");
      return;
    }
    if (payment.ifsc_code.trim() === "") {
      toast.error("IFSC code is required");
      return;
    }

    if (payment.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (payment.upi_id.trim() === "") {
      toast.error("Upi Id is required");
      return;
    }
    if (payment.total.trim() === "") {
      toast.error("Total is required");
      return;
    }

    paymentService.savePayment(payment)
      .then((res) => {
        console.log("Payment Added Successfully");
        toast.success("Payment Added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setPayment({
          payment_id: "",
          store_id: "",
          //logo:"",
          vendor_name: "",
          gst: "",
          due_date: "",
          bank_name: "",
          branch: "",
          account_no: "",
          ifsc_code: "",
          upi_id: "",
          total: "",
          creatby: "",
          updateby: "",
          payment_status: "pending"
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went Wrong");
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
    <div className="p-15 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
        <div className="col-md-8" style={{ marginLeft: "auto", marginRight: "auto" }} >
          <div className="card">
            <h4 className="text-gray" style={{ fontSize: "4vh", color: "#000099" }} > <i class="fa-solid fa-money-bill-transfer"></i>   Vendor Payment  </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => paymentRegister(e)}>

                <div className="col-md-6" style={{ marginBottom: "-4vh" }}>
                  <label>Vendor Name  <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="vendor_name"
                    className="form-select"
                    value={payment.vendor_name}
                    onChange={(e) => handleChange(e)}

                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option value="">Select Vendor</option>
                    {vendorname.map((vendor) => (
                      <option key={vendor} value={vendor} style={{ color: "black" }}>
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>
                <div class="col-md-6">
                  <label>Due Date <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="date"
                    name="due_date"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    style={{ color: "black", fontSize: "2vh" }}
                    value={payment.due_date}
                    min={today} // Set the minimum date to today
                  />
                </div>
                <div class="col-md-6">
                  <label>Bank Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="bank_name"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={payment.bank_name}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>Branch Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="branch"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={payment.branch}
                    placeholder=""
                  />
                </div>

                <div class="col-md-6">
                  <label>Account Number <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number" pattern="[0-9]{9,15}" alert="Please match the Requested Format"
                    maxLength="15" minLength={9}
                    className="form-control"
                    style={{ fontSize: "2vh" }}
                    name="account_no"
                    onChange={(e) => handleChange(e)}
                    value={payment.account_no}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div class="col-md-6">
                  <label>IFSC Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="ifsc_code"
                    pattern="^[^\s]{4}\d{7}$"
                    className="form-control"
                    title="Please enter valid IFSC Code"
                    onChange={(e) => handleChange(e)}
                    value={payment.ifsc_code}

                    style={{ textTransform: "uppercase", fontSize: "2vh" }}
                    maxLength={11}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>UPI ID <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="upi_id"
                    className="form-control"
                    title="Please enter valid UPI ID"
                    style={{ fontSize: "2vh" }}
                    onChange={(e) => handleChange(e)}
                    value={payment.upi_id}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>Total  <span style={{ color: "red" }}>*</span>{currentuser.currency}</label>
                  <input
                    type="number"
                    name="total"
                    className="form-control"
                    style={{ fontSize: "2vh" }}
                    onChange={(e) => handleChange(e)}
                    value={payment.total}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div className="text-center mt-3">
                  <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "14vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                  >
                    Submit
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
              style={{ marginTop: "20vh", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payment;

//////////////////////Update Payment/////////////////////
export const Update_payment = () => {
  const currentuser = authService.getCurrentUser();
  const [vendorname, setVendorname] = useState([]);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    payment_id: "",
    store_id: currentuser.storeid,
    vendor_name: "",
    gst: currentuser.gstno,
    payment_mode: "",
    due_date: "",
    bank_name: "",
    branch: "",
    account_no: "",
    ifsc_code: "",
    upi_id: "",
    total: "",
    updateby: currentuser.username,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/Payment/" + id)
      .then((res) => {
        setValues({
          ...values,
          store_id: res.data.store_id,
          vendor_name: res.data.vendor_name,
          gst: res.data.gst,
          payment_mode: res.data.payment_mode,
          due_date: res.data.due_date,
          bank_name: res.data.bank_name,
          branch: res.data.branch,
          account_no: res.data.account_no,
          ifsc_code: res.data.ifsc_code,
          upi_id: res.data.upi_id,
          total: res.data.total,
        });
        fetchVendorList();
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Get today's date in the "yyyy-mm-dd" format

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`); // Replace with your API endpoint
      setVendorname(response.data.map((item) => item.vendor_name));
    } catch (error) {
      console.error('Error fetching Vendor names:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (values.due_date === "") {
      toast.error("Please choose a Due Date");
      return;
    }

    const selectedExpiryDate = new Date(Update_payment.due_date);
    const today = new Date().toISOString().split("T")[0]; // Get today's date in the "yyyy-mm-dd" format
    if (selectedExpiryDate < today) {
     toast.error("Due date must be greater than or equal to today's date");
     return;
    }
    if (values.bank_name.trim() === "") {
      toast.error("Bank Name is required");
      return;
    }

    if (values.branch.trim() === "") {
      toast.error("Branch Name is required");
      return;
    }

    if (values.account_no.toString().trim() === "") {
      toast.error("Account No is required");
      return;
    }

    // Log the account number and the test result
    console.log("Account No:", values.account_no);
    console.log("Validation Result:", /^\d{9,15}$/.test(values.account_no));

    if (!/^\d{9,15}$/.test(values.account_no)) {
      toast.error("Account No must be between 9 to 15 digits");
      return;
    }
    if (values.ifsc_code.trim() === "") {
      toast.error("IFSC code is required");
      return;
    }

    if (values.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (values.upi_id.trim() === "") {
      toast.error("Upi Id is required");
      return;
    }
    if (values.total.trim() === "") {
      toast.error("Total is required");
      return;
    }

    axios
      .patch("http://localhost:8083/sys/Payment/updatePayment/" + id, values)
      .then((res) => {
        navigate("/payment/update_payment/:id");
        toast.success("updated succesufully");

        setValues({
          payment_id: "",
          store_id: currentuser.storeid,
          vendor_name: "",
          gst: currentuser.gstno,
          payment_mode: "",
          due_date: "",
          bank_name: "",
          branch: "",
          account_no: "",
          ifsc_code: "",
          upi_id: "",
          total: "",
          updateby: currentuser.username,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, vendor_name: value });  // Set the selected value to 'vendor_name'
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
    <div className="p-15 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
        <div className="col-md-8" style={{ marginLeft: "auto", marginRight: "auto" }} >
          <div className="card">
            <h4 className="text-gray" style={{ fontSize: "4vh", color: "#000099" }} > <i class="fa-solid fa-money-bill-transfer"></i> Update  Vendor Payment  </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => handleSubmit(e)}>
                <div className="col-md-6" style={{ marginBottom: "-4vh" }}>
                  <label>Vendor Name<span style={{ color: "red" }}>*</span></label>
                  <select
                    name="vendor_name"
                    className="form-select"
                    value={values.vendor_name}
                    onChange={(e) => handleChange(e)}

                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black">Select Vendor</option>
                    {vendorname.map((vendor) => (
                      <option key={vendor} value={vendor} style={{ color: "black" }}className="font-weight-bold text-black">
                        {vendor}
                      </option>
                    ))}
                  </select>

                </div>
                <div class="col-md-6">
                 <label>
                    Due Date{" "}
                    <span st yle={{ color: "red" }}>
                     *
                    </span>
                 </label>
                 <input
                    type="date"
                    name="due_date"
                    className="form-control"
                    onCha nge={(e) => handleChange(e)}
                    style={{ color: "black", fontSize: "2vh" }}
                    value={Update_payment.due_date}
                    min={today} // Set the minimum date to today
                 />
                </div>

                <div class="col-md-6">
                  <label>Bank Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="bank_name"
                    className="form-control"
                    onChange={e => setValues({ ...values, bank_name: e.target.value })}
                    value={values.bank_name}
                    placeholder=""
                  />
                </div>

                <div class="col-md-6">
                  <label>Branch Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="branch"
                    className="form-control"
                    onChange={(e) => setValues({ ...values, branch: e.target.value })}
                    value={values.branch}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>Account Number<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number" pattern="[0-9]{9,15}" alert="Please match the Requested Format"
                    maxLength="15" minLength={9}
                    className="form-control"
                    name="account_no"
                    min="1"
                    onChange={(e) =>
                      setValues({ ...values, account_no: e.target.value })
                    }
                    value={values.account_no}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>IFSC Code<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="ifsc_code"
                    pattern="^[^\s]{4}\d{7}$"
                    className="form-control"
                    title="Please enter valid IFSC Code"
                    onChange={(e) =>
                      setValues({ ...values, ifsc_code: e.target.value })
                    }
                    value={values.ifsc_code}
                    style={{ textTransform: "uppercase" }}
                    maxLength={11}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>UPI ID<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="upi_id"
                    className="form-control"
                    title="Please enter valid UPI ID"
                    onChange={(e) => setValues({ ...values, upi_id: e.target.value })}
                    value={values.upi_id}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>Total<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    min="1"
                    name="total"
                    className="form-control"
                    onChange={(e) => setValues({ ...values, total: e.target.value })}
                    value={values.total}
                    placeholder=""
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
              style={{ marginTop: "20vh", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>

  );
};

export const Payment_Gateway = () => {
  const currentuser = authService.getCurrentUser();
  const [vendorname, setVendorname] = useState([]);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    payment_id: "",
    store_id: currentuser.storeid,
    vendor_name: "",
    gst: currentuser.gstno,
    payment_mode: "",
    due_date: new Date().toLocaleDateString(),
    bank_name: "",
    branch: "",
    account_no: "",
    ifsc_code: "",
    upi_id: "",
    total: "",
    updateby: currentuser.username,
    payment_status: "completed",
    payment_date: new Date().toLocaleDateString(), // Add this line
  });

  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/Payment/" + id)
      .then((res) => {
        setValues({
          ...values,
          store_id: res.data.store_id,
          vendor_name: res.data.vendor_name,
          gst: res.data.gst,
          payment_mode: res.data.payment_mode,
          due_date: res.data.due_date,
          bank_name: res.data.bank_name,
          branch: res.data.branch,
          account_no: res.data.account_no,
          ifsc_code: res.data.ifsc_code,
          upi_id: res.data.upi_id,
          total: res.data.total,
        });
        fetchVendorList();
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`); // Replace with your API endpoint
      setVendorname(response.data.map((item) => item.vendor_name));
    } catch (error) {
      console.error('Error fetching Vendor names:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Set the "payment_date" to the current date just before making the Axios request
    const currentDate = new Date().toLocaleDateString();
    setValues({ ...values, payment_date: currentDate });
  
    axios
      .patch("http://localhost:8083/sys/Payment/updatePayment/" + id, values)
      .then((res) => {
        toast.success("Payment Done successfully");
  
        // Reset the form fields after successful submission
        setValues({
          payment_id: id,
          store_id: currentuser.storeid,
          vendor_name: "",
          gst: "",
          payment_mode: "",
          due_date: "",
          bank_name: "",
          branch: "",
          account_no: "",
          ifsc_code: "",
          upi_id: "",
          total: "",
          payment_status: "completed",
          payment_date: currentDate, // Set the "payment_date" again here
        });
      })
      .catch((err) => console.log(err));
  };
  

  const handleChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, vendor_name: value });  // Set the selected value to 'vendor_name'
  };

  const [qrCodeImage, setQRCodeImage] = useState(null);

  const generateQRCode = async () => {
    try {
      const response = await fetch(`http://localhost:8083/sys/Payment/generateQRCode/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setQRCodeImage(imageUrl);
      } else {
        console.error('Failed to generate QR code.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    generateQRCode(); // Automatically generate QR code when the component mounts
  }, []);


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

    <div className="p-5 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-2">
        <div className="col-md-8" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div className="card">
            <h4 className="text-gray" style={{ fontSize: "4vh", color: "#000099" }} ><i class="fa-solid fa-indian-rupee-sign"></i> Make Payment </h4>
            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-3" onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
                <div className="col-md-6">
                  <label className="">Vendor Name*</label>
                  <input
                    className="form-control"
                    name="vendor_name"
                    value={values.vendor_name}
                    onChange={(e) =>
                      setValues({ ...values, vendor_name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Due Date :</label>
                  <input
                    type="date"
                    name="due_date"
                    className="form-control"
                    value={values.due_date}
                    onChange={(e) =>
                      setValues({ ...values, due_date: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Bank Name :</label>
                  <input
                    type="text"
                    name="bank_name"
                    className="form-control"
                    value={values.bank_name}
                    onChange={(e) =>
                      setValues({ ...values, bank_name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Branch Name:</label>
                  <input
                    type="text"
                    name="branch"
                    className="form-control"
                    value={values.branch}
                    onChange={(e) =>
                      setValues({ ...values, branch: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="">IFSC Code :</label>
                  <input
                    type="text"
                    name="ifsc_code"
                    className="form-control"
                    value={values.ifsc_code}
                    onChange={(e) =>
                      setValues({ ...values, ifsc_code: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="">UPI Id :</label>
                  <input
                    type="text"
                    name="upi_id"
                    className="form-control"
                     value={values.upi_id}
                    readOnly
                  />

                </div>
                <div className="col-md-6">
                  <label className="">Total :</label>
                  <input type="number" name="total" className="form-control"
                    value={values.total}
                    min={1}
                    onChange={(e) =>
                      setValues({ ...values, total: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="">Payment Mode:</label>
                   <select className="col-md-6"
                    value={values.payment_mode}
                    onChange={(e) => setValues({ ...values, payment_mode: e.target.value })}
                    required>
                    <option value="">Select payment mode</option>
                    <option value="cash">Cash</option>
                    <option value="upi">Upi</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="">Store id :</label>
                  <input type="number" name="store_id" className="form-control"
                  readOnly
                    value={values.store_id}
                    onChange={(e) =>
                      setValues({ ...values, store_id: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <img src={qrCodeImage} alt="QR Code" width="200vh" />
                </div>
                <div className="text-center mt-3">
                  <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "12vw", padding: "6px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "25px" }}
                  >
                    Submit
                  </button>
                </div>
              </form>
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
              style={{ marginRight: '10px',marginBottom:"20vh" }} />
          </div>
        </div>
      </div>
    </div>
  );
};