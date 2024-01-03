import React, { useState, useEffect } from "react";
import axios from "axios";
import authService from "../services/auth.service";
import foodService from "../services/food.service";
import receipeService from "../services/receipe.service";
import DatePicker from "react-datepicker"; // Assuming you are using react-datepicker library
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  PDFDocument,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Receipt } from "@mui/icons-material";

export const ProductForm = () => {
  const currentuser = authService.getCurrentUser();
  const initialProductData = {
    name: "",
    storeid: currentuser.storeid,
    createdby: currentuser.username,
    updatedby: currentuser.username,
    ingredients: [
      {
        name: "",
        quantity: "",
        unit: "",
        storeid: currentuser.storeid,
      },
    ],
  };

  const [productData, setProductData] = useState({ ...initialProductData }); // Initialize with initialProductData
  const [foodList, setFoodList] = useState([]);
  const [inventoryProductNames, setInventoryProductNames] = useState([]);
  useEffect(() => {
    fetchFoodList();
    fetchInventoryList();
  }, []);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.156:8083/sys/Food/foods/${currentuser.storeid}`
      ); // Replace with your API endpoint
      setFoodList(response.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const fetchInventoryList = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.156:8083/sys/Inventory/inventory/${currentuser.storeid}`
      ); // Replace with your API endpoint
      setInventoryProductNames(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching inventory product names:", error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIngredients = [...productData.ingredients];
    updatedIngredients[index][name] = value;
    updatedIngredients[index].storeid = currentuser.storeid; // Set storeid

    setProductData({
      ...productData,
      ingredients: updatedIngredients,
    });
  };

  const addIngredient = () => {
    setProductData({
      ...productData,
      ingredients: [
        ...productData.ingredients,
        { name: "", quantity: "", unit: "" },
      ],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...productData.ingredients];
    updatedIngredients.splice(index, 1);

    setProductData({
      ...productData,
      ingredients: updatedIngredients,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
    if (!productData.name) {
      toast.error("Please select a Food Item");
      return;
    }

    for (const ingredient of productData.ingredients) {
      if (!ingredient.name) {
        toast.error("Ingredient name required");
        return;
      }

      if (!ingredient.quantity) {
        toast.error("Ingredient Quantity is required");
        return;
      }

      if (!ingredient.unit) {
        toast.error("Ingredient unit is required");
        return;
      }
    }

    try {
      // Check if a recipe with the same food name already exists
      const response = await axios.get(
        `http://192.168.0.156:8083/sys/fooditems/getfood/${currentuser.storeid}`
      );
      const existingRecipe = response.data.find(
        (recipe) => recipe.name === productData.name
      );

      if (existingRecipe) {
        toast.error("A recipe with this food name already exists.");
        return;
      }

      const postResponse = await axios.post(
        "http://192.168.0.156:8083/sys/fooditems/addfood",
        productData
      );
      console.log("Response:", postResponse.data);
      setProductData({ ...initialProductData });
      console.log("Recipe Added Successfully");
      toast.success("Recipe Added Successfully");
      // Reload the page after a short delay (1 millisecond)
      setTimeout(() => {
        window.location.reload();
      }, 1);
    } catch (error) {
      console.error("Error:", error);
    }
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
          className="col-md-9"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="card">
            <h4
              className="text-gray"
              style={{ fontSize: "4vh", color: "#000099" }}
            >
              {" "}
              <i class="fa-solid fa-utensils"></i> Add Recipe{" "}
            </h4>
            <div className="card-body" style={{ fontSize: "3vh" }}>
              <form className="row g-1" onSubmit={handleSubmit}>
                <div class="col-md-6" style={{ marginBottom: "-20px",fontSize:"2vh",}}>
                  <label>Product Name<span style={{color:"red"}}>*</span></label>

                  <select
                    name="name"
              
                    className="form-select"
                    value={productData.name}
                    onChange={(e) =>
                      setProductData({ ...productData, name: e.target.value })
                    }
                    style={{ color: "black", width: "45vw",fontSize:"2vh"}}
                  >
                    <option value="">Select a Food Item</option>
                    {foodList.map((foodItem) => (
                      <option
                        key={foodItem.id}
                        value={foodItem.name}
                        style={{ color: "black", fontSize: "2vh" }}
                      >
                        {" "}
                        {foodItem.food_name}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div>
                    <a
                      type="button"
                      className="btn text-white col-md-4  btn-success btn-sm"
                      href="/food/food"
                      role="button"
                      style={{
                        marginTop: "-6vh",
                        marginLeft: "47vw",
                        height: "5vh",
                        width: "5vw",
                        fontSize: "2vh",
                       
                      }}
                      
                    >
                      <i class="fa-solid fa-plus" style={{marginTop:"0.8vh"}}></i> Food
                    </a>
                  </div>

                  <div
                    class="col-md-4 "
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <table>
                      <thead>
                        <tr style={{color:"black"}}>
                          <th> Ingredient Name<span style={{color:"red"}}>*</span></th>
                          <th>Quantity<span style={{color:"red"}}>*</span></th>
                          <th>Unit<span style={{color:"red"}}>*</span></th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.ingredients.map((ingredient, index) => (
                          <tr key={index}>
                            <td>
                               <select
                                name="name"
                                className="form-select"
                                value={ingredient.name}
                                onChange={(e) => handleInputChange(e, index)}
                                style={{
                                  color: "black",
                                  width: "20.5vw",
                                  fontSize: "2vh",
                                }}
                              >
                                <option value="">Select an Ingredient</option>
                                {inventoryProductNames.map(
                                  (inventoryProductName) => (
                                    <option
                                      key={inventoryProductName}
                                      value={inventoryProductName}
                                      style={{ color: "black" }}
                                    >
                                      {inventoryProductName}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td>
                              <input
                                type="number"
                                min={1}
                                name="quantity"
                                className="form-control"
                                value={ingredient.quantity}
                                style={{ width: "200px", marginLeft: "5px",fontSize:"2vh" }}
                                onChange={(e) =>
                                  handleInputChange(e, index, "quantity")
                                }
                                placeholder="Quantity"
                              />
                            </td>

                            <td>
                              <select
                                name="unit"
                                className="form-select"
                                value={ingredient.unit}
                                onChange={(e) => handleInputChange(e, index)}
                                style={{
                                  color: "black",
                                  width: "20.5vw",
                                  marginLeft: "6px",
                                  fontSize: "2vh",
                                }}
                              >
                                <option
                                  className="font-weight-bold text-info"
                                  value=""
                                >
                                  Select Unit
                                </option>
                             
                                <option
                                  className="font-weight-bold text-danger"
                                  value="Gram"
                                >
                                  Gram
                                </option>
                                <option
                                  className="font-weight-bold text-primary"
                                  value="Miligrams"
                                >
                                  Miligrams
                                </option>
                              
                                <option
                                  className="font-weight-bold text-info"
                                  value="Mililitre"
                                >
                                  Mililitre
                                </option>
                                <option
                                  className="font-weight-bold text-dark"
                                  value="per"
                                >
                                  Per Unit
                                </option>
                              </select>
                            </td>
                            <td class="col-md-1">
                              <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                disabled={productData.ingredients.length <= 1} // Disable if only one or zero ingredients
                              >
                                <i
                                  style={{ color: "red" }}
                                  class="fa-solid fa-xmark"
                                ></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div class="col-md-6">
                    <button
                      type="button"
                      className="btn text-white  btn-success btn-sm"
                      onClick={addIngredient}
                      style={{
                        height: "5vh",
                        width: "5vw",
                        marginTop: "3vh",
                        marginLeft: "53vw",
                        fontSize: "2vh",
                      }}
                      disabled={
                        productData.ingredients.length === 0 || // Disable if no ingredients
                        productData.ingredients.some(
                          (ingredient) =>
                            !ingredient.name ||
                            !ingredient.quantity ||
                            !ingredient.unit
                        ) 
                      }
                    >
                      <i class="fa-solid fa-plus" ></i>More
                    </button>
                  </div>
                  <div class="col-md-4">
                    <a
                      type="button"
                      className="btn text-white  btn-success btn-sm"
                      href="/inventory"
                      role="button"
                      style={{
                        height: "5vh",
                        width: "10vw",
                        marginTop: "10px",
                        marginLeft: "3vw",
                        fontSize: "2vh",
                      }}
                      disabled={
                        productData.ingredients.length === 0 || // Disable if no ingredients
                        productData.ingredients.some(
                          (ingredient) =>
                            !ingredient.name ||
                            !ingredient.quantity ||
                            !ingredient.unit
                        ) // Disable if any ingredient is incomplete
                      }
                    >
                      <i class="fa-solid fa-plus" style={{marginTop:"0.8vh"}}></i> Ingredient
                    </a>
                  </div>
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
              style={{ marginTop: "20vh", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
//----------------------  Update Recipe -------------------------
export const Update_Recipe = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const currentuser = authService.getCurrentUser();
  const [foodList, setFoodList] = useState([]);
  const [inventoryProductNames, setInventoryProductNames] = useState([]);

  const [values, setValues] = useState({
    ser_no: id,
    name: "",
    storeid: currentuser.storeid,
    createdby: currentuser.username,
    updatedby: currentuser.username,
    id: "",
    ingredients: [
      {
        name: "",
        quantity: "",
        unit: "",
        storeid: currentuser.storeid,
      },
    ],
  });

  useEffect(() => {
    axios
      .get("http://192.168.0.156:8083/sys/fooditems/getbyid/" + id)
      .then((res) => {
        setValues({
          ...values,
          id: res.data.id,
          name: res.data.name,
          createdby: res.data.createdby,
          ingredients: res.data.ingredients,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch("http://192.168.0.156:8083/sys/fooditems/updatefood/" + id, values)
      .then((res) => {
        navigate(`/receipe/update_recipe/${id}`);
        toast.success(" Recipe Updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setValues({
          id: "",
          name: "",
          storeid: "",
          createdby: "",
          updatedby: "",
          ingredients: [],
        });
      })
      .catch((err) => console.log(err));
  };

  const addIngredient = () => {
    setValues({
      ...values,
      ingredients: [
        ...values.ingredients,
        { name: "", quantity: "", unit: "" },
      ],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...values.ingredients];
    updatedIngredients.splice(index, 1);

    setValues({
      ...values,
      ingredients: updatedIngredients,
    });
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.156:8083/sys/Food/foods/${currentuser.storeid}`
      ); // Replace with your API endpoint
      setFoodList(response.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Function to fetch existing inventory product names
  const fetchInventoryProductNames = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.156:8083/sys/Inventory/inventory/${currentuser.storeid}`
      );
      const productNames = response.data.map((item) => item.name);
      setInventoryProductNames(productNames);
    } catch (error) {
      console.error("Error fetching inventory product names:", error);
    }
  };

  useEffect(() => {
    // Fetch food list from the backend when the component mounts
    fetchFoodList();
    fetchInventoryProductNames();
  }, []);

  // Separate handleChange functions for vendor name and item name
  const handleVendorNameChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, name: value }); // Set the selected value to 'vendor_name'
  };

  const handleItemNameChange = (e, index) => {
    const value = e.target.value;
    const updatedIngredients = [...values.ingredients];
    updatedIngredients[index].name = value; // Update the ingredient name
    updatedIngredients[index].storeid = currentuser.storeid; // Set storeid

    setValues({
      ...values,
      ingredients: updatedIngredients,
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIngredients = [...values.ingredients];
    updatedIngredients[index][name] = value;
    updatedIngredients[index].storeid = currentuser.storeid; // Set storeid

    setValues({
      ...values,
      ingredients: updatedIngredients,
    });
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
          className="col-md-7"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="card">
            <h4
              className="text-gray"
              style={{ fontSize: "4vh", color: "#000099" }}
            >
              {" "}
              <i class="fa-solid fa-utensils"></i> Edit Recipe{" "}
            </h4>
            <div className="card-body" style={{ fontSize: "3vh" }}>
              <form className="row g-1" onSubmit={handleSubmit}>
                <div class="col-md-6" style={{ marginBottom: "-20px",fontSize:"2vh",fontWeight:"700" }}>
                  <label>Product Name<span style={{color:"red"}}>*</span></label>

                  <select
                    name="name"
                    className="form-control"
                    value={values.name}
                    onChange={handleVendorNameChange}
                    style={{ color: "black", width: "30vw",fontSize:"2vh" }}
                  >
                    <option value="">Select a Food Item</option>
                    {foodList.map((foodItem) => (
                      <option
                        key={foodItem.id}
                        value={foodItem.name}
                        style={{ color: "black", fontSize: "2vh" }}
                      >
                        {" "}
                        {foodItem.food_name}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div>
                    <a
                      type="button"
                      className="btn text-white col-md-4  btn-success btn-sm"
                      href="/food/food"
                      role="button"
                    
                      style={{
                        height: "5vh",
                        width: "6vw",
                        marginTop: "-3vw",
                        marginLeft: "32vw",
                        fontSize: "2vh",
                      }}
                    
                    >
                      <i class="fa-solid fa-plus" style={{marginTop:"0.8vh"}}></i> Food
                    </a>
                  </div>

                  <div
                    class="col-md-4 "
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <table>
                      <thead>
                        <tr style={{color:"black"}}>
                          <th> Ingredient Name<span style={{color:"red"}}>*</span></th>
                          <th>Quantity<span style={{color:"red"}}>*</span></th>
                          <th>Unit<span style={{color:"red"}}>*</span></th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.ingredients.map((ingredient, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                name="name"
                                className="form-control"
                                value={ingredient.name}
                                onChange={(e) => handleInputChange(e, index)}
                                style={{
                                  color: "black",
                                  width: "15.5vw",
                                  fontSize: "2vh",
                                }}
                              >
                                <option value="">Select an Ingredient</option>
                                {inventoryProductNames.map(
                                  (inventoryProductName) => (
                                    <option
                                      key={inventoryProductName}
                                      value={inventoryProductName}
                                      style={{ color: "black" }}
                                    >
                                      {inventoryProductName}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td>
                              <input
                                type="number"
                                min={1}
                                name="quantity"
                                className="form-control"
                                value={ingredient.quantity}
                                style={{ width: "150px", marginLeft: "5px",fontSize: "2vh", }}
                                onChange={(e) =>
                                  handleInputChange(e, index, "quantity")
                                }
                              />
                            </td>
                            <td>
                              <select
                                name="unit"
                                className="form-control"
                                value={ingredient.unit}
                                onChange={(e) => handleInputChange(e, index)}
                                style={{
                                  color: "black",
                                  width: "15.5vw",
                                  marginLeft: "6px",
                                  fontSize: "2vh",
                                }}
                              >
                                <option
                                  className="font-weight-bold text-info"
                                  value=""
                                >
                                  Select Unit
                                </option>
                              
                                <option
                                  className="font-weight-bold text-danger"
                                  value="Gram"
                                >
                                  Gram
                                </option>
                                <option
                                  className="font-weight-bold text-primary"
                                  value="Miligrams"
                                >
                                  Miligrams
                                </option>
                               
                                <option
                                  className="font-weight-bold text-info"
                                  value="Mililitre"
                                >
                                  Mililitre
                                </option>
                                <option
                                  className="font-weight-bold text-dark"
                                  value="per"
                                >
                                  Per Unit
                                </option>
                              </select>
                            </td>

                            <td class="col-md-1">
                              <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                disabled={values.ingredients.length <= 1} // Disable if only one or zero ingredients
                              >
                                <i
                                  style={{ color: "red" }}
                                  class="fa-solid fa-xmark"
                                ></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div class="col-md-6">
                    <button
                      type="button"
                      className="btn text-white  btn-success btn-sm"
                      onClick={addIngredient}
                      style={{
                        height: "5vh",
                        width: "5vw",
                        marginTop: "3vh",
                        marginLeft: "40vw",
                        fontSize: "2vh",
                      }}
                      disabled={
                        values.ingredients.length === 0 || // Disable if no ingredients
                        values.ingredients.some(
                          (ingredient) =>
                            !ingredient.name ||
                            !ingredient.quantity ||
                            !ingredient.unit
                        ) // Disable if any ingredient is incomplete
                      }
                    >
                      <i class="fa-solid fa-plus"></i>More
                    </button>
                  </div>
                  <div class="col-md-4">
                    <a
                      type="button"
                      className="btn text-white  btn-success btn-sm"
                      href="/inventory"
                      role="button"
                      style={{
                        height: "5vh",
                        width: "9vw",
                        marginTop: "10px",
                        marginLeft: "3vw",
                        fontSize: "2vh",
                      }}
                      disabled={
                        values.ingredients.length === 0 || // Disable if no ingredients
                        values.ingredients.some(
                          (ingredient) =>
                            !ingredient.name ||
                            !ingredient.quantity ||
                            !ingredient.unit
                        ) // Disable if any ingredient is incomplete
                      }
                    >
                      <i class="fa-solid fa-plus" style={{marginTop:"0.8vh"}}></i> Ingredient
                    </a>
                  </div>
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
              style={{ marginTop: "30vh", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


//Date Filter Applied By Neha
/////////////////////////////////////////////////////       RECEIPE LIST          /////////////////////////////////////////////////////////////
export const Receipe_list = () => {
  const currentuser = authService.getCurrentUser();
  const [receipeList, setReceipeList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [recipe, setRecipe] = useState([]);
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    init();
    fetchData();
  }, []);

  const [msg, setMsg] = useState("");

  const init = () => {
    receipeService
      .getReceipe()
      .then((res) => {
        console.log(res.data);
        setReceipeList(res.data);
        setSerachApiData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    fetch(`http://192.168.0.156:8083/sys/fooditems/getfood/${currentuser.storeid}`)
      .then((response) => response.json())
      .then((json) => {
        setReceipeList(json);
        setSerachApiData(json);
      });
  };

  const deletereceipe = (ser_no) => {
    receipeService
      .deletereceipe(ser_no)
      .then((res) => {
        toast.success("Delete Successfully");
       setTimeout(() => {
        window.location.reload();
     }, 1);
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (e) => {
    console.log("Filter value:", e.target.value);
    console.log("Search API Data:", searchApiData);

    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "") {
      setReceipeList(searchApiData);
      setErrorShown(false); // Reset the error display flag when the filter is cleared
      return;
    }

    const filterResult = searchApiData.filter((item) => {
      const matchesIngredient = item.ingredients.some(
        (ingredient) =>
          ingredient.name.toLowerCase().includes(searchTerm) ||
          (ingredient.unit || "").toLowerCase().includes(searchTerm) ||
          (ingredient.quantity || "")
            .toString()
            .toLowerCase()
            .includes(searchTerm)
      );

      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.id.toString().includes(searchTerm) ||
        matchesIngredient
      );
    });

    if (filterResult.length > 0) {
      setReceipeList(filterResult);
    } else {
      setReceipeList(searchApiData);
      if (!errorShown) {
        toast.error("No matching data found.");
        setErrorShown(true); // Set the error display flag to true after showing the error once
     }
    }

    setFilterVal(e.target.value);
  };

  // GENERATE PDF
  const generatePDF = async () => {
    try {
      // Fetch data from the API URL
      const response = await axios.get(
        `http://192.168.0.156:8083/sys/fooditems/getfood/${currentuser.storeid}`
      );
      const apiData = response.data;

      // Generate the PDF content using fetched data
      const pdfContent = (
        <Document>
          <Page size="A4">
            <View style={styles.page}>
              {apiData.map((item, index) => (
                <View key={index} style={styles.vendorContainer}>
                  <Text style={styles.vendorName}>Receipe ID : {item.id}</Text>
                  <Text style={styles.vendorName}>
                    Recipe Name : {item.name}
                  </Text>
                  {item.ingredients.map((ingredientitem, ingredientindex) => (
                    <View key={ingredientindex}>
                      <Text style={styles.vendor}>
                        Ingredient Name : {ingredientitem.name}
                      </Text>
                      <Text style={styles.vendor}>
                        Ingredient Quantity: {ingredientitem.quantity}
                      </Text>
                      <Text style={styles.vendor}>
                        Unit: {ingredientitem.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </Page>
        </Document>
      );

      // Convert PDF content to blob
      const pdfBlob = await pdf(pdfContent).toBlob();

      // Create a download link
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "recipe_list.pdf";
      link.click();

      // Clean up URL object after download
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const styles = {
    page: {
      padding: 20,
    },
    vendorContainer: {
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
    },
    vendorName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    vendor: {
      fontSize: 14,
    },
  };

  // Function to fetch data based on selected date range
  const fetchDataByDateRange = () => {
    if (!startDate || !endDate) {
      // Display an error message if start date or end date is not selected
      setErrorMessage("Please select both Start Date and End Date.");
      return; // Stop further processing
    }

    const url = `http://192.168.0.156:8083/sys/fooditems/getfood/${currentuser.storeid}`;

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
        // Filter the data based on the selected date range
        const filteredData = json.filter((item) => {
          const orderDate = new Date(item.created_date);
          console.log("orderDate:", orderDate);

          // Check if the orderDate is greater than or equal to startDate and less than or equal to endDate
          const isAfterStartDate = !startDate || orderDate >= startDate;
          const isBeforeEndDate = !endDate || orderDate <= endDate;
          console.log("isAfterStartDate:", isAfterStartDate);
          console.log("isBeforeEndDate:", isBeforeEndDate);

          return isAfterStartDate && isBeforeEndDate;
        });

        console.log("Filtered Data:", filteredData); // Debugging log

        setReceipeList(filteredData);
        setSerachApiData(json);
        setErrorMessage("");
      });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

   // Calculate the total number of pages
   const totalPages = Math.ceil(receipeList.length / itemsPerPage);

   // Calculate the range of items to display on the current page
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = receipeList.slice(indexOfFirstItem, indexOfLastItem);
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
   const [selectAllChecked, setSelectAllChecked] = useState(false);

// Handle checkbox state changes for individual items
const handleSelectItem = (ser_no) => {
  const updatedSelectedItems = [...selectedItems];
  
  if (updatedSelectedItems.includes(ser_no)) {
       updatedSelectedItems.splice(updatedSelectedItems.indexOf(ser_no), 1);
  } else {
       updatedSelectedItems.push(ser_no);
  }
  
  // Check if all items are selected
  const allItemsSelected = receipeList.length === updatedSelectedItems.length;
  
  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
  };
  
  // Handle "Select All" checkbox state changes
  const handleSelectAll = () => {
  if (selectAllChecked) {
       setSelectedItems([]);
  } else {
       setSelectedItems(receipeList.map((item) => item.ser_no));
  }
  
  setSelectAllChecked(!selectAllChecked);
  };


  
  const handleMultiDelete = () => {
    // Show confirmation pop-ups for each selected item
    const updatedShowAlerts = {};
    selectedItems.forEach(item => {
     updatedShowAlerts[item.ser_no] = true;
    });
    setShowAlerts(updatedShowAlerts);

};
 
  const handleMultiDeletedrecipe = (serialNo) => {
    
    // After deleting the specific item, update selectedItems and showAlerts
    const updatedSelectedItems = selectedItems.filter(item => item.ser_no !== serialNo);
    const updatedShowAlerts = { ...showAlerts, [serialNo]: false };

    // Update state to reflect the changes
    setSelectedItems(updatedSelectedItems);
    setShowAlerts(updatedShowAlerts);

    for (const id of selectedItems) {
         deletereceipe(id);
     }
     setSelectedItems([]);
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
    <div className="data animation">
     
      <div className="row rowleft36"  style={{marginTop:"12vh"}}>
        <div className="col-md-20">
          <div
            className="card-header fs-3 "
            style={{
              width: "80vw",
              display: "flex",
               marginBottom: "10px",
                borderRadius: "15px",
                flexDirection:"row",
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
             Recipe 
            </h4>
                {msg && (
              <h4 className="fs-4 text-center text-white">
                {msg} <i class="fa-solid fa-square-check"></i>
              </h4>
            )}

<div style={{ position: 'relative', width: '30%' }}>
  <input
    type="search"
    id="form1"
    className="form-control"
    placeholder="&#128269; Search..."
    aria-label="Search"
    style={{
      border: "1px solid #656262",
      height: "5vh",
      display: "flex",
      alignItems: "center",
      width: "100%", // Adjusted to take the full width of the container
      fontSize: "1vw"
    }}
    value={FilterVal}
    onClick={() => setFilterVal('')}
    onInput={(e) => handleFilter(e)}
  />

</div>

            <div className="rowleft66"
             style={{
              fontSize: "2vh",
              display: "flex",
              marginTop: "7px"
            }}
            >
          {selectedItems.length > 0 && (
        <button
          onClick={handleMultiDelete}
          className="btn btn-danger"style={{ alignContent: "center", justifyContent: "center", fontSize: "2vh", display: "flex", flexDirection: "row", alignItems: "center", height:"6vh",marginRight:"2vh" }}
        >
          Delete Selected
        </button>
      )}

{showAlerts[recipe.ser_no] && (
                     <div className="overlay">
                        <div className="alert alert2 alert-success font-weight-bold center-popup">
                         <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedrecipe(recipe.ser_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [recipe.ser_no]: false,
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
                style={{
                  fontSize: "2vh",
                  height: "5vh",
                  marginRight: "5px",
                }}
              >
                <i class="fas fa-plus" style={{ marginRight: "5px" }}></i>
                <a href="/receipe" className="btn-outline-primary">
                  Recipe
                </a>
              </button>

              <button
                onClick={generatePDF}
                className="btn btn-outline-primary"
                style={{
                  fontSize: "2vh",
                  height: "5vh",
                 
                  marginRight: "5vh",
                }}
              >
                {downloadLink && (
                  <a href={downloadLink} download="recipe_list.pdf">
                  </a>
                )}
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="content read rowleft36" style={{ width: "100%" }}>
        <table>
          <thead>
            <tr>
              <td
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2.5vh", borderTopLeftRadius: "10px" }}
              >
                Sr.No
              </td>
             
              <th scope="col" class="text-center px-2 border">
                Recipe Name
              </th>
              <th scope="col" class="text-center px-2 border">
                Ingredient Name
              </th>
              <th scope="col" class="text-center px-2 border">
                Ingredient Quantity
              </th>
              <th scope="col" class="text-center px-2 border">
                Ingredient Unit
              </th>

              <th
                scope="col"
                class="text-center px-2 border"
                >
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
          <tbody className="tbodytr">
            {receipeList.map((f, num) => (
              <tr>
                <td class="text-center px-2">{num + 1}</td>
                {/* <td class="text-center px-4">{f.store_id}</td> */}
             

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  f.name.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                    <strong>{f.name}</strong>
                  ) : (
                    f.name
                  )}
                </td>

                <td class="px-2 border">
                  {f.ingredients.map((food, foodIndex) => (
                    <li key={foodIndex}>
                      {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      food.name
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                        <strong>{food.name}</strong>
                      ) : (
                        food.name
                      )}
                    </li>
                  ))}
                </td>

                <td class="px-2 border">
                  {f.ingredients.map((food, foodIndex) => (
                    <li key={foodIndex}>
                      {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      food.quantity
                        .toString()
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                        <strong>{food.quantity}</strong>
                      ) : (
                        food.quantity
                      )}
                    </li>
                  ))}
                </td>

                <td class="px-2 border">
                  {f.ingredients.map((food, foodIndex) => (
                    <li key={foodIndex}>
                      {typeof FilterVal === "string" &&
                      FilterVal !== "" &&
                      food.unit
                        .toLowerCase()
                        .includes(FilterVal.toLowerCase()) ? (
                        <strong>{food.unit}</strong>
                      ) : (
                        food.unit
                      )}
                    </li>
                  ))}
                </td>

                <td class="actions px-2 " style={{ display: "flex",justifyContent:"center",alignContent:"center" }}	>
                <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [f.ser_no]: true,
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

                  {showAlerts[f.ser_no] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => deletereceipe(f.ser_no)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [f.ser_no]: false,
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
                            to={`/receipe/update_recipe/${f.ser_no}`}
                            title="edit recipe"
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
style={{ width: '3vw', height: '3vh' }}
onChange={() => handleSelectItem(f.ser_no)}
checked={selectedItems.includes(f.ser_no)}
/>

             </td>
              </tr>
            ))}
          </tbody>
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
                 theme="dark" />
    </div>
  );
};

export default Receipe_list;
