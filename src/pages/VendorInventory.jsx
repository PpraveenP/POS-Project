import React, { useState, useEffect } from "react";
import "./allform.css";
import invoiceService from "../services/invoice.service";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";

const VendorInventory = () => {
  const [vendorname, setVendorname] = useState([]);
  const currentuser = authService.getCurrentUser();
  const [itemNames, setItemNames] = useState([]);
  const [invoice, setInvoice] = useState({
    invoice_id: "",
    store_id: currentuser.storeid,
    vendor_name: "",
    item_name: "",
    price: "",
    quantity: "",
    discount: "",
    createby: currentuser.username,
    updateby: currentuser.username,
    gstno: currentuser.gstno,
    total: "",
    inventory_code: "",
    unit: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchVendorList();
    fetchItemNames();
  }, []);

  const checkDuplicateAssociation = (vendorName, itemName) => {
    return axios
      .get(
        `http://localhost:8083/sys/VendorInventory/checkDuplicate?vendor_name=${vendorName}&item_name=${itemName}`
      )
      .then((response) => response.data.exists)
      .catch((error) => {
        console.error("Error checking for duplicate association:", error);
        return false;
      });
  };

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`
      ); // Replace with your API endpoint
      setVendorname(response.data.map((item) => item.vendor_name));
    } catch (error) {
      console.error("Error fetching Vendor names:", error);
    }
  };

  const fetchItemNames = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Inventory/inventory/${currentuser.storeid}`
      ); // Replace with your API endpoint for fetching item names
      setItemNames(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching Item names:", error);
    }
  };

  const invoiceRegister = async (e) => {
    // <-- Add async here
    e.preventDefault();

    if (invoice.vendor_name === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (invoice.item_name === "") {
      toast.error("Item Name is required");
      return;
    }

    if (invoice.inventory_code.trim() === "") {
      toast.error("Inventory Code is required");
      return;
    }

    if (invoice.quantity.trim() === "") {
      toast.error("Quantity is required");
      return;
    }

    if (invoice.unit === "") {
      toast.error("Please Choose Unit");
      return;
    }

    if (invoice.price.trim() === "") {
      toast.error("Price is required");
      return;
    }

    // Check for duplicate association
    const isDuplicate = await checkDuplicateAssociation(
      invoice.vendor_name,
      invoice.item_name
    );

    if (isDuplicate) {
      toast.error(
        "Duplicate association: This vendor is already associated with this item."
      );
      return;
    }

    // Calculate the total based on your business logic
    const calculatedTotal = calculateTotal(invoice); // Implement this function

    // Update the invoice state with the calculated total
    setInvoice({ ...invoice, total: calculatedTotal });

    // Now, you can send the invoice data to your API, including the total field
    const dataToSend = {
      ...invoice,
      total: calculatedTotal, // Include the calculated total in the data to be sent
    };

    invoiceService
      .saveInvoice(dataToSend)
      .then((res) => {
        console.log("Vendor Inventory Added Successfully");
        toast.success("Vendor Inventory Added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // Reset the form
        setInvoice({
          invoice_id: "",
          store_id: currentuser.storeid,
          vendor_name: "",
          item_name: "",
          price: "",
          quantity: "",
          discount: "",
          gstno: currentuser.gstno,
          updateby: "",
          createby: "",
          total: "", // Reset total to an empty string
          inventory_code: "",
          unit: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Implement the calculateTotal function based on your business logic
  const calculateTotal = (invoice) => {
    // Replace this with your calculation logic
    return (
      invoice.price * invoice.quantity -
      ((invoice.price * invoice.quantity) / 100) * invoice.discount
    );
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
              <i class="fa-solid fa-boxes-stacked"> </i> Vendor Inventory{" "}
            </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => invoiceRegister(e)}>
                <div class="col-md-6" style={{ marginBottom: "-20px" }}>
                  <label>Vendor Name <span style={{ color: "red" }}>*</span></label>

                  <select
                    name="vendor_name"
                    className="form-select"
                    value={invoice.vendor_name}
                    onChange={(e) => handleChange(e)}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option value="">Select Vendor</option>
                    {vendorname.map((vendor) => (
                      <option
                        key={vendor}
                        value={vendor}
                        style={{ color: "black" }}
                      >
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Item Name <span style={{ color: "red" }}>*</span></label>

                  <select
                    name="item_name"
                    className="form-select"
                    value={invoice.item_name}
                    onChange={(e) => handleChange(e)}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option value="">Select Item</option>
                    {itemNames.map((item) => (
                      <option
                        key={item}
                        value={item}
                        style={{ color: "black" }}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Inventory Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="inventory_code"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={invoice.inventory_code}
                    minLength={3}
                    maxLength={10}
                    
                  />
                </div>
                <div class="col-md-6">
                  <label>Quantity <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    style={{ fontSize: "2vh" }}
                    onChange={(e) => handleChange(e)}
                    value={invoice.quantity}
                    
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label> Unit <span style={{ color: "red" }}>*</span></label>

                  <select
                    name="unit"
                    className="form-select" // Add form-select class here
                    onChange={handleChange}
                    value={invoice.unit}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-info" value="">
                      Select Unit
                    </option>
                    <option
                      className="font-weight-bold text-success"
                      value="kg"
                    >
                      KG
                    </option>
                    <option
                      className="font-weight-bold text-danger"
                      value="gram"
                    >
                      Gram
                    </option>
                    <option
                      className="font-weight-bold text-primary"
                      value="mg"
                    >
                      miligrams
                    </option>
                    <option
                      className="font-weight-bold text-success"
                      value="litre"
                    >
                      Litre
                    </option>
                    <option
                      className="font-weight-bold text-info"
                      value="mililitre"
                    >
                      Mililitre
                    </option>
                    <option className="font-weight-bold text-dark" value="per">
                      Per Unit
                    </option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Price Per Unit <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="price"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={invoice.price}
                    
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={invoice.discount}
                    
                    min="0"
                  />
                </div>

                <div className="col-md-6">
                  <label>Total {currentuser.currency}</label>
                  <input
                    type="number"
                    name="total"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={invoice.total}
                    
                    readOnly
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
              style={{ marginTop: "70px", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default VendorInventory;

const calculateTotal = (values) => {
  // Replace this with your calculation logic
  return (
    values.price * values.quantity -
    (values.price * values.quantity * values.discount) / 100
  );
};

////////UPDATE VENDORINVENTORY///////////////////
export const Update_Vendor_Inventory = () => {
  const currentuser = authService.getCurrentUser();
  const [vendorname, setVendorname] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    invoice_id: "",
    store_id: currentuser.storeid,
    vendor_name: "",
    item_name: "",
    price: "",
    quantity: "",
    discount: "",
    invoice_status: "",
    payment_status: "",
    account_no: "",
    createby: "",
    updateby: currentuser.username,
    gstno: currentuser.gstno,
    total: "",
    inventory_code: "",
    unit: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/VendorInvoice/getInvoiceByID/" + id)
      .then((res) => {
        setValues({
          ...values,
          store_id: res.data.store_id,
          vendor_name: res.data.vendor_name,
          item_name: res.data.item_name,
          price: res.data.price,
          quantity: res.data.quantity,
          discount: res.data.discount,
          invoice_status: res.data.invoice_status,
          payment_status: res.data.payment_status,
          account_no: res.data.account_no,
          totall: res.data.total,
          inventory_code: res.data.inventory_code,
          unit: res.data.unit,
        });
        fetchVendorList();
        fetchItemNames();
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`
      ); // Replace with your API endpoint
      setVendorname(response.data.map((item) => item.vendor_name));
    } catch (error) {
      console.error("Error fetching Vendor names:", error);
    }
  };

  const fetchItemNames = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Inventory/inventory/${currentuser.storeid}`
      ); // Replace with your API endpoint for fetching item names
      setItemNames(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching Item names:", error);
    }
  };

  // Separate handleChange functions for vendor name and item name
  const handleVendorNameChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, vendor_name: value }); // Set the selected value to 'vendor_name'
  };

  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, item_name: value }); // Set the selected value to 'item_name'
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (values.vendor_name.trim() === "") {
      toast.error("Vendor Name is required");
      return;
    }

    if (values.item_name.trim() === "") {
      toast.error("Item Name is required");
      return;
    }

    if (values.inventory_code.trim() === "") {
      toast.error("Inventory Code is required");
      return;
    }

    if (values.quantity.trim() === "") {
      toast.error("Quantity is required");
      return;
    }

    if (values.unit === "") {
      toast.error("Please choose a Unit");
      return;
    }

    if (values.price.trim() === "") {
      toast.error("Price is required");
      return;
    }

    if (values.payment_status === "") {
      toast.error("Please choose a Payment Status");
      return;
    }

    // Calculate the total
    const calculatedTotal = calculateTotal(values);

    axios
      .patch("http://localhost:8083/sys/VendorInvoice/updateinvoice/" + id, {
        ...values,
        total: calculatedTotal,
      })
      .then((res) => {
        navigate("/vendorInventory/update_vendorinventory/:id");
        toast.success("Vendor Inventory Updated Successfully");
        setValues({
          invoice_id: id,
          store_id: currentuser.storeid,
          vendor_name: "",
          item_name: "",
          price: "",
          quantity: "",
          discount: "",
          invoice_status: "",
          payment_status: "",
          account_no: "",
          total: "",
          gstno: currentuser.gstno,
          updateby: currentuser.username,
          createby: "",
          inventory_code: "",
          unit: "",
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
              <i class="fa-solid fa-list-check"></i>Update Vendor Inventory:{" "}
            </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => handleSubmit(e)}>
                <div class="col-md-6" style={{ marginBottom: "-20px" }}>
                  <label>Vendor Name <span style={{ color: "red" }}>*</span></label>

                  <select
                    name="vendor_name"
                    className="form-select"
                    value={values.vendor_name}
                    onChange={handleVendorNameChange}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option value="">Select Vendor</option>
                    {vendorname.map((vendor) => (
                      <option
                        key={vendor}
                        value={vendor}
                        style={{ color: "black" }}
                      >
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Item Name <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="item_name"
                    className="form-select"
                    value={values.item_name}
                    onChange={handleItemNameChange}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option value="">Select Item</option>
                    {itemNames.map((item) => (
                      <option
                        key={item}
                        value={item}
                        style={{ color: "black" }}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Inventory Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="inventory_code"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, inventory_code: e.target.value })
                    }
                    value={values.inventory_code}
                    minLength={3}
                    maxLength={10}
                    placeholder="Inventory Code"
                  />
                </div>
                <div class="col-md-6">
                  <label>Quantity <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, quantity: e.target.value })
                    }
                    value={values.quantity}
                    placeholder="Quantity"
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label> Unit <span style={{ color: "red" }}>*</span></label>

                  <select
                    name="unit"
                    className="form-select" // Add form-select class here
                    onChange={(e) =>
                      setValues({ ...values, unit: e.target.value })
                    }
                    value={values.unit}
                    style={{ color: "black" }}
                  >
                    <option className="font-weight-bold text-info" value="">
                      Select Unit <span style={{ color: "red" }}>*</span>
                    </option>
                    <option
                      className="font-weight-bold text-success"
                      value="kg"
                    >
                      KG
                    </option>
                    <option
                      className="font-weight-bold text-danger"
                      value="gram"
                    >
                      Gram
                    </option>
                    <option
                      className="font-weight-bold text-primary"
                      value="mg"
                    >
                      miligrams
                    </option>
                    <option
                      className="font-weight-bold text-success"
                      value="litre"
                    >
                      Litre
                    </option>
                    <option
                      className="font-weight-bold text-info"
                      value="mililitre"
                    >
                      Mililitre
                    </option>
                    <option className="font-weight-bold text-dark" value="per">
                      Per Unit
                    </option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Price per unit <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, price: e.target.value })
                    }
                    value={values.price}
                    placeholder="price"
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label>Discount  (%)</label>
                  <input
                    type="number"
                    name="discount"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, discount: e.target.value })
                    }
                    value={values.discount}
                    placeholder="Discount(%)"
                    min="0"
                  />
                </div>

                <div className="col-md-6">
                  <label>Total {currentuser.currency}</label>
                  <input
                    type="number"
                    name="total"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, total: e.target.value })
                    }
                    value={values.total}
                
                    disabled
                    min={1}
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
