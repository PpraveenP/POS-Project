import React, { useEffect, useState } from "react";
import inventoryService from "../services/inventory.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./list.css";
import authService from "../services/auth.service";
import "./allform.css";
import axios from "axios";
import { PDFDocument, Page, Text, View, Document, StyleSheet, pdf } from "@react-pdf/renderer";
import DatePicker from 'react-datepicker'; // Assuming you are using react-datepicker library
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from "react-toastify";

export const Inventory = () => {
  const currentuser = authService.getCurrentUser();
  const [existingInventory, setExistingInventory] = useState([]);
  const [inventory, setInventory] = useState({
    id: "",
    quantity: "",
    name: "",
    category: "",
    price: "",
    gstno: currentuser.gstno,
    updatedby: currentuser.username,
    expirydate: "",
    minlevel: "",
    createdby: currentuser.username,
    storeid: currentuser.storeid,
    unit: "",
    inventory_code: "",
    total: "",
    minlevelunit: ""
  });

  const [msg, setMsg] = useState("");

  const [unitConversion, setUnitConversion] = useState({
    kg: 1000, // 1 kg = 1000 grams
    litre: 1000, // 1 litre = 1000 millilitres
    // Add more conversions as needed
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'unit' && value !== inventory.unit) {
      // Unit is changing, perform the conversion
      let convertedQuantity = parseFloat(inventory.quantity);
      if (value === 'kg') {
        convertedQuantity *= 1000; // Convert to grams
        toast.success(`Quantity converted to ${convertedQuantity} grams`);
      } else if (value === 'litre') {
        convertedQuantity *= 1000; // Convert to milliliters
        toast.success(`Quantity converted to ${convertedQuantity} milliliters`);
      }
      setInventory({
        ...inventory,
        [name]: value,
        quantity: convertedQuantity.toString(), // Convert to string
      });
    } else {
      // Unit is not changing, just update the value
      setInventory({ ...inventory, [name]: value });
    }
  };

  // Define an async function to check if food exists
  const checkIfInventoryExists = async (inventoryName) => {
    try {
      const response = await axios.get(`http://192.168.0.156/sys/Inventory/inventory/${currentuser.storeid}`);
      const inventoryList = response.data;
      // Check if the inventoryName already exists in the food list
      return inventoryList.some((inventory) => inventory.name === inventoryName);
    } catch (error) {
      console.error("Error checking if Inventory exists:", error);
      // Handle the error or return false as a fallback
      return false;
    }
  };
  const today = new Date().toISOString().split("T")[0]; // Get today's date in the "yyyy-mm-dd" format

  const inventoryRegister = async (e) => {
    e.preventDefault();
    const foodExists = await checkIfInventoryExists(inventory.name);
    if (foodExists) {
      toast.error("Product is already exists in the Inventory list");
      return;
    }
    if (inventory.name.trim() === "") {
      toast.error("Product Name is required");
      return;
    }
    if (inventory.inventory_code.trim() === "") {
      toast.error("Product Code is required");
      return;
    }
    if (inventory.category === "") {
      toast.error("Please choose a Category");
      return;
    }
    if (inventory.quantity === "" || isNaN(inventory.quantity)) {
      toast.error("Please enter a valid Quantity");
      return;
    }
    if (inventory.unit === "") {
      toast.error("Please choose a unit");
      return;
    }
    if (inventory.expirydate === "") {
      toast.error("Please choose a expiry date");
      return;
    }
    const selectedExpiryDate = new Date(inventory.expirydate);
    const today = new Date().toISOString().split("T")[0]; // Get today's date in the "yyyy-mm-dd" format
    if (selectedExpiryDate < today) {
      toast.error("Expiry date must be greater than or equal to today's date");
      return;
    }
    if (inventory.price === "" || isNaN(inventory.price)) {
      toast.error("Product price is required");
      return;
    }
    if (inventory.minlevel === "" || isNaN(inventory.minlevel)) {
      toast.error("Product minimum level is required");
      return;
    }
    if (inventory.minlevelunit === "") {
      toast.error("Please choose a Minimum Level");
      return;
    }
    let calculatedTotal = 0;

    if (inventory.unit === 'kg' || inventory.unit === 'litre') {
      calculatedTotal = inventory.price * (inventory.quantity / 1000);
    } else if (inventory.unit === 'gram' || inventory.unit === 'Mililitre') {
      calculatedTotal = inventory.price * (inventory.quantity / 100);
    } else {
      calculatedTotal = inventory.price * inventory.quantity;
    }
    // Set the calculated unit value
    let calculatedUnit = inventory.unit;
    if (inventory.unit === 'kg') {
      calculatedUnit = 'gram';
    } else if (inventory.unit === 'litre') {
      calculatedUnit = 'Mililitre';
    }
    // Create a copy of the inventory data with the calculated total and unit
    const updatedInventory = {
      ...inventory,
      total: calculatedTotal.toString(),
      unit: calculatedUnit,
    };

    inventoryService.saveInventory(updatedInventory)
      .then((res) => {
        console.log("Inventory Added Successfully");
        toast.success("Inventory Added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 100);
        setInventory({
          id: "",
          quantity: "",
          name: "",
          category: "",
          price: "",
          expirydate: "",
          minlevel: "",
          createdby: "",
          storeid: "",
          unit: "",
          gstno: "",
          updatedby: "",
          inventory_code: "",
          total: "",
          minlevelunit: ""
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to add Inventory");
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
    <div className="p-1 animation" style={{ marginTop: "3vh" }}>
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
              <i class="fa-solid fa-cart-flatbed"></i>  Add Inventory
            </h4>
            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form
                className="row g-1"
                onSubmit={(e) => inventoryRegister(e)}
                encType="multipart/form-data"
              >
                <div className="col-md-6">
                  <label >Product Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    style={{ fontSize: "2vh" }}
                    name="name"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={inventory.name}
                    placeholder=""
                    maxLength={35}
                    minLength={3}
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Product Code  <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="inventory_code"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={inventory.inventory_code}
                    placeholder=""
                    minLength={3}
                    maxLength={10}
                  />
                </div>
                <div class="col-md-6">
                  <label>Choose Category  <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="category"
                    className="form-select"
                    onChange={(e) => handleChange(e)}
                    value={inventory.category}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black" value=""  >
                      Select Category
                    </option>
                    <option
                      className="font-weight-bold text-black`"
                      value="vegetable"
                    >
                      Vegetable
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="fruits"
                    >
                      Fruits
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Nonveg"
                    >
                      Nonveg
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="grocery"
                    >
                      Grocery
                    </option>
                    <option
                      className="font-weight-bold text-black`"
                      value="dairy prouduct"
                    >
                      Dairy Product
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="bakery product"
                    >
                      Bakery Products
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="packing"
                    >
                      Packing MaterialList
                    </option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="">Price Per Unit  <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="price"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={inventory.price}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div className="col-md-6">
                  <label>Quantity <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={inventory.quantity}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div class="col-md-6">
                  <label>Choose Unit <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="unit"
                    className="form-select" // Add form-select class here
                    onChange={(e) => handleChange(e)}
                    value={inventory.unit} style={{ color: 'black', fontSize: "2vh" }}>
                    <option className="font-weight-bold text-black" value="">Select Unit</option>
                    <option className="font-weight-bold text-black`" value="kg">KG</option>
                    <option className="font-weight-bold text-black" value="gram">Gram</option>
                    <option className="font-weight-bold text-black`" value="litre">Litre</option>
                    <option className="font-weight-bold text-black" value="Mililitre"> Millilitre</option>
                    <option className="font-weight-bold text-black" value="per">Per Unit</option>
                    <option className="font-weight-bold text-black" value="Dozen">Dozen</option>
                    <option className="font-weight-bold text-black" value="Carat">Carat</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Expiry Date <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="date"
                    style={{ fontSize: "2vh" }}
                    name="expirydate"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={inventory.expirydate}
                    min={today} // Set the minimum date to today
                  />
                </div>
                <div className="col-md-6">
                  <label>Minimum Level <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    style={{ fontSize: "2vh" }}
                    name="minlevel"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={inventory.minlevel}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div class="col-md-6">
                  <label>Minimum Level Unit <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="minlevelunit"
                    className="form-select" // Add form-select class here
                    onChange={(e) => handleChange(e)}
                    value={inventory.minlevelunit} style={{ color: 'black', fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black" value="">Select Unit</option>
                    <option className="font-weight-bold text-black" value="gram">Gram</option>
                    <option className="font-weight-bold text-black" value="Millilitre"> Millilitre</option>
                    <option className="font-weight-bold text-black" value="per">Per Unit</option>
                    <option className="font-weight-bold text-black" value="Dozon">Dozon</option>
                    <option className="font-weight-bold text-black" value="curate">curate</option>
                  </select>
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
              autoClose={1000}
              limit={1}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              style={{ marginTop: "120px", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Inventory;

//////Update Inventory//////////////////////
export const Update_Inventory = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const currentuser = authService.getCurrentUser();
  const [values, setValues] = useState({
    id: id,
    quantity: "",
    name: "",
    category: "",
    price: "",
    expirydate: "",
    minlevel: "",
    createdby: "",
    storeid: currentuser.storeid,
    unit: "",
    gstno: currentuser.gstno,
    updatedby: currentuser.username,
    inventory_code: "",
    minlevelunit: "",
  });

  useEffect(() => {
    axios
      .get("http://192.168.0.156/sys/Inventory/getInventoryByID/" + id)
      .then((res) => {
        setValues({
          ...values,
          quantity: res.data.quantity,
          name: res.data.name,
          category: res.data.category,
          price: res.data.price,
          expirydate: res.data.expirydate,
          minlevel: res.data.minlevel,
          createdby: res.data.createdby,
          unit: res.data.unit,
          inventory_code: res.data.inventory_code,
          minlevelunit: res.data.minlevelunit,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform unit conversion if needed
    let convertedQuantity = values.quantity; // Start with the current quantity value

    if (values.unit === 'kg') {
      convertedQuantity *= 1000; // Convert to grams
    } else if (values.unit === 'litre') {
      convertedQuantity *= 1000; // Convert to milliliters
    }

    // Create a new payload with the converted quantity
    const updatedInventory = {
      id: id,
      quantity: convertedQuantity,
      name: values.name,
      category: values.category,
      price: values.price,
      expirydate: values.expirydate,
      minlevel: values.minlevel,
      createdby: values.createdby,
      storeid: values.storeid,
      unit: values.unit,
      gstno: values.gstno,
      updateby: values.updateby,
      inventory_code: values.inventory_code,
      minlevelunit: values.minlevelunit
    };

    axios
      .patch("http://192.168.0.156/sys/Inventory/updateinventory/" + id, updatedInventory)
      .then((res) => {
        navigate("/inventory/update_inventory/:id");
        toast.success("Updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setValues({
          id: id,
          quantity: "",
          name: "",
          category: "",
          price: "",
          expirydate: "",
          minlevel: "",
          createdby: "",
          storeid: "",
          unit: "",
          gstno: "",
          updateby: "",
          inventory_code: "",
          minlevelunit: ""
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
              <i class="fa-solid fa-cart-flatbed"> </i> Update Inventory
            </h4>

            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form
                className="row g-1"
                onSubmit={(e) => handleSubmit(e)}
                encType="multipart/form-data"
              >
                <div className="col-md-6">
                  <label >Product Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    style={{fontSize:"1.8vh"}}
                    className="form-control"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    placeholder=""
                    maxLength={50}
                    minLength={3}
                  />
                </div>
                <div className="col-md-6">
                  <label className="">Product Code  <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="inventory_code"
                    className="form-control"
                    style={{fontSize:"1.8vh"}}
                    value={values.inventory_code}
                    onChange={(e) => setValues({ ...values, inventory_code: e.target.value })}
                    placeholder=""
                    minLength={3}
                    maxLength={10}
                  />
                </div>
                <div class="col-md-6">
                  <label>Choose Category  <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="category"
                    className="form-select"
                    value={values.category}
                    onChange={(e) => setValues({ ...values, category: e.target.value })}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black" value=""  >
                      Select Category
                    </option>
                    <option
                      className="font-weight-bold text-black`"
                      value="vegetable"
                    >
                      Vegetable
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="fruits"
                    >
                      Fruits
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Nonveg"
                    >
                      Nonveg
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="grocery"
                    >
                      Grocery
                    </option>
                    <option
                      className="font-weight-bold text-black`"
                      value="dairy prouduct"
                    >
                      Dairy Product
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="bakery product"
                    >
                      Bakery Products
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="packing"
                    >
                      Packing MaterialList
                    </option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="">Price Per Unit <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="price"
                    style={{fontSize:"1.8vh"}}
                    className="form-control"
                    value={values.price}
                    onChange={(e) => setValues({ ...values, price: e.target.value })}
                    placeholder=""
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label>Quantity <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    style={{fontSize:"1.8vh"}}
                    className="form-control"
                    value={values.quantity}
                    onChange={(e) => setValues({ ...values, quantity: e.target.value })}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div class="col-md-6">
                  <label>Choose Unit <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="unit"
                    className="form-select" // Add form-select class here
                    value={values.unit}
                    onChange={(e) => setValues({ ...values, unit: e.target.value })}
                    style={{ color: 'black', fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black" value="">Select Unit</option>
                    <option className="font-weight-bold text-black`" value="kg">KG</option>
                    <option className="font-weight-bold text-black" value="gram">Gram</option>
                    <option className="font-weight-bold text-black`" value="litre">Litre</option>
                    <option className="font-weight-bold text-black" value="Mililitre"> Millilitre</option>
                    <option className="font-weight-bold text-black" value="per">Per Unit</option>
                    <option className="font-weight-bold text-black" value="Dozen">Dozen</option>
                    <option className="font-weight-bold text-black" value="Carat">Carat</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Expiry Date <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="date"
                    name="expirydate"
                    style={{fontSize:"1.8vh"}}
                    className="form-control"
                    value={values.expirydate}
                    onChange={(e) => setValues({ ...values, expirydate: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label>Minimum Level <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="minlevel"
                    style={{fontSize:"1.8vh"}}
                    className="form-control"
                    value={values.minlevel}
                    onChange={(e) => setValues({ ...values, minlevel: e.target.value })}
                    placeholder=""
                    min="1"
                  />
                </div>
                <div class="col-md-6">
                  <label>Minimum Level Unit <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="minlevelunit"
                    className="form-select" // Add form-select class here
                    value={values.minlevelunit}
                    onChange={(e) => setValues({ ...values, minlevelunit: e.target.value })}
                    style={{ color: 'black', fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black" value="">Select Unit</option>
                    <option className="font-weight-bold text-black`" value="kg">KG</option>
                    <option className="font-weight-bold text-black" value="gram">Gram</option>
                    <option className="font-weight-bold text-black`" value="litre">Litre</option>
                    <option className="font-weight-bold text-black" value="Millilitre"> Millilitre</option>
                    <option className="font-weight-bold text-black" value="per">Per Unit</option>
                    <option className="font-weight-bold text-black" value="Dozon">Dozon</option>
                    <option className="font-weight-bold text-black" value="curate">curate</option>
                  </select>
                </div>
                <div className="text-center mt-3">
                  <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "14vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={1000}
              limit={1}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              style={{ marginTop: "150px", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>


  );
};


///////pooja added new list//////////
export const Inventory_list = () => {
  const currentuser = authService.getCurrentUser();
  const [inventryList, setInventoryList] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange,startDate,endDate]);



  const [msg, setMsg] = useState("");
  // Inside your `init` function, make sure to set billList as an array
  const init = () => {
    inventoryService
      .getAllInventory()
      .then((res) => {
        // Check if the response data is an array before setting it as billList
        if (Array.isArray(res.data)) {
          setInventoryList(res.data);
        } else {
          setInventoryList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    const url = `http://192.168.0.156/sys/Inventory/inventory/${currentuser.storeid}`;

    // You can append the start date and end date as query parameters to the URL
    const startDateParam = startDate ? `startDate=${startDate.toISOString().split('T')[0]}` : '';
    const endDateParam = endDate ? `endDate=${endDate.toISOString().split('T')[0]}` : '';

    const queryParameters = [startDateParam, endDateParam].filter(param => param).join('&');
    const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;

    let apiEndpoint;

    switch (selectedTimeRange) {
      case 'daily':
        apiEndpoint = `${url}/daily`;
        break;
      case 'monthly':
        apiEndpoint = `${url}/monthly`;
        break;
      case 'yearly':
        apiEndpoint = `${url}/yearly`;
        break;
      default:
        apiEndpoint = url;
    }
    fetch(fullUrl)
      .then((response) => response.json())
      .then((json) => {
        setInventoryList(json);
        console.log(json);
        setSerachApiData(json);
      });
  };


  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  
    if (timeRange === 'custom') {
      // Display your date picker component or toggle a state to show it
      setShowCustomDatePicker(true);
    } else {
      // Calculate start and end dates based on the selected time range
      const currentDate = new Date();
      let newStartDate, newEndDate;
  
      switch (timeRange) {

        case 'select':
          newStartDate = null;
          newEndDate = null;
         break;
        case 'daily':
          newStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
          newEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
          break;
        case 'monthly':
          newStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          newEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          break;
        case 'yearly':
          newStartDate = new Date(currentDate.getFullYear(), 0, 1);
          newEndDate = new Date(currentDate.getFullYear(), 11, 31);
          break;
        case 'custom':
          newStartDate = startDate;
          newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
          break;
        default:
          newStartDate = null;
          newEndDate = null;
      }
  
      // Set the calculated start and end dates
      setStartDate(newStartDate);
      setEndDate(newEndDate);
  
    }
  };


   const handleFilter = (e) => {
if (e.target.value === '') {
    // No search term, apply only date range filter
    handleTimeRangeChange(selectedTimeRange);
    setErrorShown(false); // Reset the error display flag when the filter is cleared

} else {
    const filterResult = searchApiData.filter((item) => {
     const searchTermMatches = (
        (item.name || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.id || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.category || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.quantity || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.expirydate || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.createddate || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.inventory_code || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.unit || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.price || '').toString().toLowerCase().includes(e.target.value.toLowerCase())
     );

     const dateRangeMatches = isDateInRange(item.createddate, startDate, endDate);

     return searchTermMatches && dateRangeMatches;
    });

    if (filterResult.length > 0) {
     // Apply both date range and search filter
     setInventoryList(filterResult);
     if (!errorShown) {
      toast.error("No matching data found.");
      setErrorShown(true); // Set the error display flag to true after showing the error once
     }
    } else {
      if (!errorShown) {
        toast.error("No matching data found.");
        setErrorShown(true); // Set the error display flag to true after showing the error once
     }
    }
}
setFilterVal(e.target.value);
};




const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) {
      return false;
  }
  
  const itemDate = new Date(date);
  
  return itemDate >= startDate && itemDate <= endDate;
  };
  


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const handleGeneratePDF = async () => {
    try {

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(`http://192.168.0.156/sys/Inventory/generate-pdf-inventory/?storeid=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      null,
      {
               responseType: 'blob', // Receive the response as a blob
      });

      // Create a Blob object from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger a click to download the PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory-details.pdf';
      a.click();

      // Revoke the URL to release resources
      window.URL.revokeObjectURL(url);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

 

  //GENERATE EXCEL
  //GENERATE EXCEL
  const generateExcel = async () => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(
        `http://192.168.0.156/sys/Inventory/excelInventory/?storeid=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        null,
        {
          responseType: "blob",
        }
      );
  
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
  
      // Trigger page refresh after a delay (e.g., 2 seconds)
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  const fetchDataByDateRange = () => {
    if (!startDate || !endDate) {
      // Display an error message if start date or end date is not selected
      toast.error("Please select both Start Date and End Date.");
      return; // Stop further processing
    }

    const url = `http://192.168.0.156/sys/Inventory/inventory/${currentuser.storeid}`;

    // You can append the start date and end date as query parameters to the URL
    const startDateParam = startDate
      ? `startDate=${startDate.toISOString().split("T")[0]}`
      : "";
    const endDateParam = endDate
      ? `endDate=${endDate.toISOString().split("T")[0]}`
      : "";

    const queryParameters = [startDateParam, endDateParam]
      .filter((param) => param)
      .join("&");
    const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;

    console.log("Full URL:", fullUrl); // Debugging log

    fetch(fullUrl)
      .then((response) => response.json())
      .then((json) => {
        const filteredData = json.filter((item) => {
          const orderDate = new Date(item.createddate);
          const itemDate = new Date(
            orderDate.getFullYear(),
            orderDate.getMonth(),
            orderDate.getDate()
          );
  
          const isAfterStartDate = !startDate || itemDate >= startDate;
          const isBeforeEndDate = !endDate || itemDate <= endDate;
  
          return isAfterStartDate && isBeforeEndDate;
        });
   
        setInventoryList(filteredData);
        setSerachApiData(json);
        setMsg("");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error fetching data. Please try again later.");
      });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(inventryList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventryList.slice(indexOfFirstItem, indexOfLastItem);
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Function to handle "Previous" button click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle "Next" button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Define a variable to control the maximum number of page buttons to display
  const maxPageButtons = 10; // Change this to the desired number of buttons to display

  // Calculate the range of page numbers to display
  const startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  const handleDeletedinventory = (serial_no) => {
    inventoryService
      .deleteInventory(serial_no)
      .then((res) => {
        toast.success(" inventory Delete Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };

 // Handle checkbox state changes for individual items
const handleSelectItem = (serial_no) => {
  const updatedSelectedItems = [...selectedItems];

  if (updatedSelectedItems.includes(serial_no)) {
   updatedSelectedItems.splice(updatedSelectedItems.indexOf(serial_no), 1);
  } else {
   updatedSelectedItems.push(serial_no);
  }

  // Check if all items are selected
  const allItemsSelected = inventryList.length === updatedSelectedItems.length;

  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
};

// Handle "Select All" checkbox state changes
const handleSelectAll = () => {
  if (selectAllChecked) {
   setSelectedItems([]);
  } else {
   setSelectedItems(inventryList.map((item) => item.serial_no));
  }

  setSelectAllChecked(!selectAllChecked);
};


  const handleMultiDelete = () => {
    // Show confirmation pop-ups for each selected item
    const updatedShowAlerts = {};
    selectedItems.forEach(item => {
     updatedShowAlerts[item.serial_no] = true;
    });
    setShowAlerts(updatedShowAlerts);

    // Perform the deletion logic here if needed
    // handleDeletion(selectedItems);
};


  const handleMultiDeletedinventory = (serialNo) => {
    // Perform deletion logic for the specific item (serialNo)
    // ...

    // After deleting the specific item, update selectedItems and showAlerts
    const updatedSelectedItems = selectedItems.filter(item => item.serial_no !== serialNo);
    const updatedShowAlerts = { ...showAlerts, [serialNo]: false };

    // Update state to reflect the changes
    setSelectedItems(updatedSelectedItems);
    setShowAlerts(updatedShowAlerts);

    for (const id of selectedItems) {
         handleDeletedinventory(id);
     }
     setSelectedItems([]); // Clear the selected items after deletion
    // Optionally, you can perform additional deletion logic here if needed
    // handleDeletion(updatedSelectedItems);
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
    <div className="data p-5 animation">

      <div className="row rowleft6 ">
        <div
          style={{
            width: "97vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            marginBottom: "2vh",
            marginTop: "8vh"
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
          {selectedItems.length > 0 && (
        <button
          onClick={handleMultiDelete}
          className="btn btn-danger"style={{ alignContent: "center", justifyContent: "center", fontSize: "2vh", display: "flex", flexDirection: "row", alignItems: "center", height:"6vh",marginRight:"2vh" }}
        >
          Delete Selected
        </button>
      )}
      {showAlerts[inventory.serial_no] && (
                     <div className="overlay">
                        <div className="alert alert2 alert-success font-weight-bold popup">
                         <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedinventory(inventory.serial_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [inventory.serial_no]: false,
                                })
                             }
                            >
                             Cancel <i className="fa-solid fa-xmark"></i>
                            </button>
                         </div>
                        </div>
                     </div>
                    )}
            <button
              class="btn btn-outline-primary boton"
              title="Add new inventory"
              style={{
                fontSize: "2vh",
                height: "6vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i class="fas fa-plus"></i>
              <a href="/inventory" className="btn-outline-primary">
                Inventory
              </a>
            </button>

            <button onClick={generateExcel} className="btn btn-outline-primary"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}>Excel</button>
            {downloadLink && (
              <a href={downloadLink} download="inventory.xlsx">
                <i class="fa-solid fa-download" style={{ fontSize: "4vh", marginTop: "2vh" }}></i>
              </a>
            )}

            <button
              onClick={handleGeneratePDF}
              className="btn btn-outline-primary"
              title="Download PDF"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}
            >
              {downloadLink && (
                <a href={downloadLink} download="order_list.pdf"></a>
              )}
              PDF
            </button>
          </div>
        </div>

        <div className="col-md-20" >
          <div
            className="card-header fs-3 "
            style={{
              width: "80vw",
              display: "flex",
              marginBottom: "10px",
              borderRadius: "15px",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >

            <h4
              className="text"
              style={{
                color: "#000099",
                fontSize: "4vh",
                fontWeight: "bold",
              }}
            > <i class="fa-solid fa-list" style={{ color: "rgb(0, 0, 153" }}></i>
              Inventory
            </h4>
            {msg && (
              <h4 className="fs-4 text-center text-white">
                {msg} <i class="fa-solid fa-square-check"></i>
              </h4>
            )}

            <input
              type="search"
              id="form1"
              className="form-control"
              placeholder="&#128269; Search..."
              aria-label="Search"
              style={{
                border: "1px solid #656262",
                height: "3.9vh",
                display: "flex",
                alignItems: "center",
                width: "20%",
                marginTop: "7px"
                , fontSize: "1vw"
              }}
              value={FilterVal}
              onInput={(e) => handleFilter(e)}
            />

            <div className="rowleft66"
              style={{
                fontSize: "2vh",
                display: "flex",
                marginTop: "7px"
              }}>
              {showCustomDatePicker && (
                <div style={{ marginRight: "1vh", fontSize: "2vh", display: "flex" }}>
                  From -{" "}
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Select Start Date"
                  />
                  {" "}To -{" "}
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="Select End Date"
                  />
                </div>
              )}

              <select
                value={selectedTimeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                style={{ height: "3.9vh", }}
                className="btn-outline-primary">
                  <option value="">Select</option>
                  <option value="daily">Daily</option> 
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
               </select>
              <button
                onClick={fetchDataByDateRange}
                className="btn btn-outline-success"
                title="Filter Data"
                style={{
                  marginLeft: "10px",
                  height: "3.9vh",
                  width: "3.9vh",
                  fontSize: "2vh",
                  display: "flex",
                  alignitems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="fas fa-filter" style={{ fontSize: "2vh" }}></i>
              </button>

              <button
                className="btn btn-outline-danger"
                onClick={handleReset}
                title="Reset Filter"
                style={{
                  height: "3.9vh",
                  width: "3.9vh",
                  fontSize: "2vh",
                  marginLeft: "1vh",
                  display: "flex",
                  alignitems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-times"
                  style={{ fontSize: "2vh" }}
                ></i>
              </button>
              {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            </div>
          </div>
        </div>
      </div>
      <div class="content read rowleft6">
        <table>
          <thead style={{ position: "sticky", top: "0" }}>
            <tr>
              <th scope="col" class="text-center px-2 border" style={{ borderTopLeftRadius: "10px" }} >
                Sr.No
              </th>
             
              <th scope="col" class="text-center px-2 border">
                Product Name
              </th>
              <th scope="col" class="text-center px-2 border">
                issued Date
              </th>
              <th scope="col" class="text-center px-2 border">
                Product Code
              </th>
              <th scope="col" class="text-center px-2 border">
                Quantity
              </th>
              <th scope="col" class="text-center px-2 border">
                Unit
              </th>
              <th scope="col" class="text-center px-2 border">
                Category
              </th>
              <th scope="col" class="text-center px-2 border">
                Price {currentuser.currency}
              </th>
              <th scope="col" class="text-center px-2 border">
                Expiry Date
              </th>
              <th scope="col" class="text-center px-2 border">
                Action
              </th>
              <th
         scope="col"
         className="text-center px-4 border"
         style={{ borderTopRightRadius: "10px" }}
        >
         Select All{" "}
         <input
            type="checkbox"
            style={{ width: '2vw', height: '2vh' }}
            onChange={handleSelectAll}
            checked={selectAllChecked}
         />
        </th>
            </tr>
          </thead>
          {inventryList.length === 0 ? ( // Check if the list is empty
            <div className="no-data-message">No inventory data available.</div>
          ) : (
            <tbody className="tbodytr">
              {currentItems.map((i, index) => (
                <tr>
                  {/* <th class="text-center px-2 border">{index + 1}</th> */}
                  <td className="text-center px-2 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
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
                      i.createddate
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.createddate}</strong>
                    ) : (
                      i.createddate
                    )}
                  </td>
                
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      i.inventory_code
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.inventory_code}</strong>
                    ) : (
                      i.inventory_code
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      i.quantity
                        .toString()
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.quantity}</strong>
                    ) : (
                      i.quantity
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      i.unit.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.unit}</strong>
                    ) : (
                      i.unit
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      i.category.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.category}</strong>
                    ) : (
                      i.category
                    )}
                  </td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      i.price
                        .toString()
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.price}</strong>
                    ) : (
                      i.price
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      i.expirydate
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                      <strong>{i.expirydate}</strong>
                    ) : (
                      i.expirydate
                    )}
                  </td>

                  <td class="actions " style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                    <button
                      className="btn btn-sm btn-outline-danger mb-3"
                      onClick={() =>
                        setShowAlerts({
                          ...showAlerts,
                          [i.serial_no]: true,
                        })
                      }
                      style={{
                        fontSize: "2vh",
                        width: "4.8vh", // Set the desired width
                        height: "4.8vh", // Set the desired height
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "2vh"
                      }}
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
                              onClick={() => handleDeletedinventory(i.serial_no)}
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
                      to={`/inventory/Update_Inventory/${i.serial_no}`}
                      title="edit inventory"
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
                  <td className="text-center px-2 border">
                    <input
                      type="checkbox"
                      style={{ width: '3vw', height: '3vh' }} // Adjust the width and height as needed
                      onChange={() => handleSelectItem(i.serial_no)}
                      checked={selectedItems.includes(i.serial_no)}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          )}

        </table>

       
        <div className="container d-flex justify-content-end mt-5" style={{ width: "80vw", maxWidth: "80vw", display: "flex", flexDirection: "row", alignItems: "end", justifyContent: "end" }}>
          <div className="pagination-container" >
            <ul className="pagination" >
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={handlePreviousPage}
                  style={{
                    width: "5.5vw",
                    height: "6vh",
                    color: "black", // Change to your desired color
                    borderColor: "#03989e", // Change to your desired color
                    backgroundColor: "transparent", // Change to your desired background color
                    transition: "background-color 0.3s ease", // Add a transition effect
                    fontSize: "1vw"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "green"; // Change background color on hover
                    e.target.style.color = "white"; // Change text color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"; // Restore background color on hover out
                    e.target.style.color = "green"; // Restore text color on hover out
                  }}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: endPage - startPage + 1 }).map(
                (_, index) => (
                  <li
                    key={startPage + index}
                    className={`page-item ${currentPage === startPage + index ? "active" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(startPage + index)}
                      style={{
                        color:
                          currentPage === startPage + index ? "white" : "black",
                        borderColor: "#03989e",
                        width: "3vw",
                        height: "6vh",
                        fontSize: "1vw",
                        backgroundColor:
                          currentPage === startPage + index
                            ? "#03989e"
                            : "transparent",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor =
                          currentPage === startPage + index
                            ? "#03989e"
                            : "#03989e";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor =
                          currentPage === startPage + index
                            ? "#03989e"
                            : "transparent";
                        e.target.style.color =
                          currentPage === startPage + index ? "white" : "black";
                      }}
                    >
                      {startPage + index}
                    </button>
                  </li>
                )
              )}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={handleNextPage}
                  style={{
                    width: "4vw",
                    height: "6vh",
                    fontSize: "1vw",
                    color: "black", // Change to your desired color
                    borderColor: "#03989e", // Change to your desired color
                    backgroundColor: "transparent", // Change to your desired background color
                    transition: "background-color 0.3s ease", // Add a transition effect
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "green"; // Change background color on hover
                    e.target.style.color = "white"; // Change text color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"; // Restore background color on hover out
                    e.target.style.color = "green"; // Restore text color on hover out
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ marginTop: "10vh", marginRight: "1vh" }} />
    </div>
  );
};
