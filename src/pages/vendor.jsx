import React, { useState, useEffect } from "react";
import vendorService from "../services/vendor.service";
import "./allform.css";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";

export const Vendor = () => {
  const currentuser = authService.getCurrentUser();
  const [vendor, setVendor] = useState({
    vendor_id: "",
    vendor_name: "",
    vendor_address: "",
    mobile_no: currentuser.country_code,
    gst_no: currentuser.gstno,
    update_by: currentuser.username,
    created_by: currentuser.username,
    store_id: currentuser.storeid,
    bank_name: "",
    branch: "",
    account_no: "",
    ifsc_code: "",
    upi_id: "",
    vendor_code: "",
  });

  const [mobileNoError, setMobileNoError] = useState("");
  const [msg, setMsg] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });

    if (name === "mobile_no" && value.length != 13) {
      setMobileNoError("Mobile No should be exactly 10 digits with country code");
    } else {
      setMobileNoError("");
    }
  };

  const vendorRegister = (e) => {
    e.preventDefault();

    if (vendor.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (vendor.vendor_code.trim() === "") {
      toast.error("Vendor Code is required");
      return;
    }

    if (vendor.vendor_address.trim() === "") {
      toast.error("Vendor Address is required");
      return;
    }

    if (vendor.mobile_no.trim() === "") {
      toast.error("Vendor Mobile No is required");
      return;
    }

    if (vendor.mobile_no.length !== 13) {
      toast.error("Mobile No should be exactly 10 digits with country code");
      return;
    }

    if (vendor.bank_name.trim() === "") {
      toast.error("Bank Name  is required");
      return;
    }

    if (vendor.branch.trim() === "") {
      toast.error("Branch Name is required");
      return;
    }

    if (vendor.account_no.trim() === "") {
      toast.error("Account No is required");
      return;
    }

    // Log the account number and the test result
    console.log("Account No:", vendor.account_no);
    console.log("Validation Result:", /^\d{9,15}$/.test(vendor.account_no));

    if (!/^\d{9,15}$/.test(vendor.account_no)) {
      toast.error("Account No must be between 9 to 15 digits");
      return;
    }

    if (vendor.ifsc_code.trim() === "") {
      toast.error("IFSC code is required");
      return;
    }

    if (vendor.upi_id.trim() === "") {
      toast.error("UPI ID is required");
      return;
    }

    vendorService
      .saveVendor(vendor)
      .then((res) => {
        console.log("Vendor Placed Successfully");
        // setMsg("Vendor Placed Successfully");
        toast.success("Vendor Placed Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setVendor({
          vendor_id: "",
          vendor_name: "",
          vendor_address: "",
          mobile_no: "",
          gst_no: "",
          update_by: "",
          created_by: "",
          store_id: "",
          bank_name: "",
          branch: "",
          account_no: "",
          ifsc_code: "",
          upi_id: "",
          vendor_code: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
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
    <div className="p-15 animation" style={{ marginTop: "2vh" }}>
      <div className="row p-3">
        <div
          className="col-md-8"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="card">
            <h4
              className="text-gray"
              style={{ fontSize: "4vh", color: "#000099" }}
            >
              {" "}
              <i class="fa-solid fa-user-plus"></i> Add Vendor{" "}
            </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => vendorRegister(e)}>
                <div class="col-md-6">
                  <label>Vendor Name <span style={{ color: "red" }}>*</span></label>
                  <input
        type="text"
        className="form-control"
        name="vendor_name"
        onChange={(e) => handleChange(e)}
        value={vendor.vendor_name}
        style={{ fontSize: "2.5vh" }}
        InputProps={{
          style: { textTransform: "uppercase", fontSize: "2.5vh" },
        }}
        placeholder=""
        minLength={3}
        maxLength={50}
      />
                </div>

                <div className="col-md-6">
                  <label>Vendor Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                    name="vendor_code"
                    minLength={3}
                    maxLength={10}
                
                  onChange={(e) => handleChange(e)}
                    value={vendor.vendor_code}
                    placeholder=""
                  />
                </div>
                <div className="col-md-6">
                  <label>Vendor Address <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="vendor_address"
                    style={{ fontSize: "2.5vh" }}
                    onChange={(e) => handleChange(e)}
                    value={vendor.vendor_address}
                    placeholder=""
                  />
                </div>

                <div className="col-md-6">
                  <label>Mobile No <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile_no" // maxLength={13}
                                       onChange={(e) => handleChange(e)}
                    style={{ fontSize: "2.5vh" }}
                    value={vendor.mobile_no}
                    maxLength={13}
                  />
                </div>
                {mobileNoError && (
                  <div
                    className="error user-box form-control"
                    style={{
                      color: "red",
                      background: "#d9d9d9",
                      fontSize: "2vh",
                      height: "4vh",
                      marginLeft: "65vh",
                      width: "55vh",
                    }}
                  >
                    {mobileNoError}
                  </div>
                )}

                <div className="col-md-6">
                  <label>Bank Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="bank_name"
                    style={{ fontSize: "2.5vh" }}
                    onChange={(e) => handleChange(e)}
                    value={vendor.bank_name}
                    placeholder=""
                  />
                </div>

                <div className="col-md-6">
                  <label>Branch <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="branch"
                    style={{ fontSize: "2.5vh" }}
                    onChange={(e) => handleChange(e)}
                    value={vendor.branch}
                    placeholder=""
                  />
                </div>

                <div className="col-md-6">
                  <label>Account No <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="account_no"
                    pattern="[0-9]{9,15}"
                    maxLength={15}
                    minLength={9}
                    style={{ fontSize: "2.5vh" }}
                    title="Please enter valid account number"
                    onChange={(e) => handleChange(e)}
                    value={vendor.account_no}
                    placeholder=""
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label>IFSC Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="ifsc_code"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={vendor.ifsc_code}

                    style={{ textTransform: "uppercase", fontSize: "2vh" }}
                    placeholder=""
                  />
                </div>

                <div className="col-md-6">
                  <label>UPI ID <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="upi_id"
                    className="form-control"
                    style={{ fontSize: "2.5vh" }}
                    title="Please enter valid UPI ID"
                    onChange={(e) => handleChange(e)}
                    value={vendor.upi_id}
                    placeholder=""
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

///////////UPDATE VENDOR////////////////////////////////
export const Update_vendor = () => {
  const currentuser = authService.getCurrentUser();
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    vendor_id: "",
    vendor_name: "",
    vendor_address: "",
    mobile_no: "",
    gst_no: currentuser.gstno,
    update_by: currentuser.username,
    created_by: "",
    store_id: currentuser.storeid,
    bank_name: "",
    branch: "",
    account_no: "",
    ifsc_code: "",
    upi_id: "",
    vendor_code: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/Vendor/" + id)
      .then((res) => {
        setValues({
          ...values,
          vendor_name: res.data.vendor_name,
          vendor_address: res.data.vendor_address,
          mobile_no: res.data.mobile_no,
          gst_no: res.data.gst_no,
          update_by: res.data.update_by,
          created_by: res.data.created_by,
          store_id: res.data.store_id,
          bank_name: res.data.bank_name,
          branch: res.data.branch,
          account_no: res.data.account_no,
          ifsc_code: res.data.ifsc_code,
          upi_id: res.data.upi_id,
          vendor_code: res.data.vendor_code,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (values.vendor_code.trim() === "") {
      toast.error("Vendor Code is required");
      return;
    }

    if (values.vendor_address.trim() === "") {
      toast.error("Vendor Address is required");
      return;
    }

    if (values.mobile_no.toString().trim() === "") {
      toast.error("Vendor Mobile No is required with country code");
      return;
    }
    if (values.bank_name.trim() === "") {
      toast.error("Bank Name  is required");
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

    if (values.upi_id.trim() === "") {
      toast.error("UPI ID is required");
      return;
    }

    axios
      .patch("http://localhost:8083/sys/Vendor/updatevendor/" + id, values)
      .then((res) => {
        navigate("/vendor/update_vendor/:id");
        console.log("updated succesufully");
        //  setMsg("updated succesufully");

        toast.success("Vendor payment deatils  Updated Successfully");
        setValues({
          vendor_id: id,
          vendor_name: "",
          vendor_address: "",
          mobile_no: "",
          gst_no: "",
          update_by: "",
          created_by: "",
          store_id: "",
          bank_name: "",
          branch: "",
          account_no: "",
          ifsc_code: "",
          upi_id: "",
          vendor_code: "",
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
    <div className="p-15 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
        <div
          className="col-md-8"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="card">
            <h4
              className="text-gray"
              style={{ fontSize: "4vh", color: "#000099" }}
            >
              {" "}
              <i class="fa-solid fa-user"></i> Update Vendor{" "}
            </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => handleSubmit(e)}>
                <div class="col-md-6">
                  <label>Vendor Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="vendor_name"
                    min={3}
                    max={50}
                    value={values.vendor_name}
                    onChange={(e) =>
                      setValues({ ...values, vendor_name: e.target.value })
                    }
                    InputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </div>

                <div className="col-md-6">
                  <label>Vendor Code<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="vendor_code"
                    value={values.vendor_code}
                    minLength={3}
                    maxLength={10}
                    onChange={(e) =>
                      setValues({ ...values, vendor_code: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label>Vendor Address<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="vendor_address"
                    value={values.vendor_address}
                    onChange={(e) =>
                      setValues({ ...values, vendor_address: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label>Mobile No<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile_no" // maxLength={13}
                    title="Must contain at least 13 digits"
                    value={values.mobile_no}
                    onChange={(e) =>
                      setValues({ ...values, mobile_no: e.target.value })
                    }
                    maxLength={13}
                  />
                </div>
                <div className="col-md-6">
                  <label>Bank Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="bank_name"
                    value={values.bank_name}
                    onChange={(e) =>
                      setValues({ ...values, bank_name: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label>Branch<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="branch"
                    value={values.branch}
                    onChange={(e) =>
                      setValues({ ...values, branch: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label>Account No<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="account_no"
                    pattern="[0-9]{9,15}"
                    maxLength={15}
                    minLength={9}
                    min="1"
                    title="Please enter valid account number"
                    value={values.account_no}
                    onChange={(e) =>
                      setValues({ ...values, account_no: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label>IFSC Code<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="ifsc_code"
                    className="form-control"
                    value={values.ifsc_code}
                    onChange={(e) =>
                      setValues({ ...values, ifsc_code: e.target.value })
                    }
                    style={{ textTransform: "uppercase" }}
                  />
                </div>

                <div className="col-md-6">
                  <label>UPI ID<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="upi_id"
                    className="form-control"
                    title="Please enter valid UPI ID"
                    value={values.upi_id}
                    onChange={(e) =>
                      setValues({ ...values, upi_id: e.target.value })
                    }
                  />
                </div>
                <div className="text-center mt-3">
                  <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "12vw", padding: "6px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "25px" }}
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
