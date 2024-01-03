import React, { useEffect, useState, useRef } from "react";
import "./allform.css";
import foodService from "../services/food.service";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./list.css";
import authService from "../services/auth.service";
import useDrivePicker from 'react-google-drive-picker'
import {
  PDFDocument,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import DatePicker from "react-datepicker"; // Assuming you are using react-datepicker library
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";

export const Food = () => {
  const currentuser = authService.getCurrentUser();
  const [storeId, setStoreId] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subcategory, setSubCategory] = useState([]);
  const[imgid , setimgid] = useState("");
const[imgname , setimgname] = useState(""); 

  const [foodData, setFoodData] = useState({
    food_name: "",
    description: "",
    category: "",
    subcategory: "",
    foodcode: "",
    update_by: currentuser.username,
    gst_no: currentuser.gstno,
    created_by: currentuser.username,
    store_id: currentuser.storeid,
    price: "",
    image: null,
  });

  const initialFormData = {
    food_name: "",
    description: "",
    category: "",
    subcategory: "",
    foodcode: "",
    update_by: currentuser.username,
    gst_no: currentuser.gstno,
    created_by: currentuser.username,
    store_id: currentuser.storeid,
    price: 0,
    image: null,
  };

  const [msg, setMsg] = useState("");
  const handleChange = (event) => {
    
      setFoodData({
        ...foodData,
        [event.target.name]: event.target.value,
      });
    
  };

  //--- Rushikesh Image Code-------
  // image validation

function isImageFile(file) {
  // Define a list of valid image MIME types
  const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp","image/jfif"];

  // Check if the file's MIME type is in the list of valid image types
  return imageMimeTypes.includes(file.type);
}

// ---end --------

  // Define an async function to check if food exists
  const checkIfFoodExists = async (foodName) => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Food/foods/${currentuser.storeid}`
      );
      const foodList = response.data;
      // Check if the foodName already exists in the food list
      return foodList.some((food) => food.food_name === foodName);
    } catch (error) {
      console.error("Error checking if food exists:", error);
      // Handle the error or return false as a fallback
      return false;
    }
  };

  const performValidations = () => {
    if (foodData.food_name.trim() === "") {
      toast.error("Food Name is required");
      return false;
    }
    if (foodData.foodcode.trim() === "") {
      toast.error("Food Code is required");
      return false;
    }
    if (!foodData.price) {
      toast.error("Price is required");
      return false;
    }
    if (foodData.category === "") {
      toast.error("Please choose a Category");
      return;
    }
    if (foodData.subcategory === "") {
      toast.error("Please choose a Sub Category");
      return;
    }
    if (foodData.image === "") {
      toast.error("Please choose a Image");
      return;
    }
    return true; // All validations passed
  };

  const formData = async (event) => {
    event.preventDefault();
    if (!performValidations()) {
      return;
    }
    const foodExists = await checkIfFoodExists(foodData.food_name);
    if (foodExists) {
      toast.error("Food already exists in the food list");
      return;
    }
    const formData = new FormData();
    formData.append("food_name", foodData.food_name);
    formData.append("description", foodData.description);
    formData.append("category", foodData.category);
    formData.append("subcategory", foodData.subcategory);
    formData.append("foodcode", foodData.foodcode);
    formData.append("update_by", foodData.update_by);
    formData.append("gst_no", foodData.gst_no);
    formData.append("created_by", foodData.created_by);
    formData.append("store_id", foodData.store_id);
    formData.append("price", foodData.price);
    formData.append("image", imgid);
    try {
      const response = await axios.post(
        "http://localhost:8083/sys/Food/addfoods",
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentuser.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check the response status and handle success or failure accordingly
      if (response.status === 200) {
        toast.success("Food created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // Optionally, you can reset the form data here.
        setFoodData(initialFormData);
      } else {
        toast.success("Food created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating Food:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    // Check if a file is selected
    if (!file) {
      toast.error("Please select an Excel file before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("store_id", currentuser.storeid);
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:8083/sys/Food/upload",
        formData
      );
      setMessage(response.data);
      toast.success("Excel File added Successfully");
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("An error occurred while uploading the food list.");
      }
    }
  };

  const handleDownloadTemplate = () => {
    const excelTemplateUrl = process.env.PUBLIC_URL + "/foodlist.xlsx";
    // Create an anchor element and trigger a click event to download the template
    const link = document.createElement("a");
    link.href = excelTemplateUrl;
    link.target = "_blank"; // Open the link in a new tab
    link.download = "foodlist.xlsx"; // Set the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Display a success message
    toast.success("Sample Excel file downloaded successfully.");
  };

  useEffect(() => {
    fetchCategoryList();
   
  }, []);
  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/sys/Button/getbutton/${currentuser.storeid}`); // Replace with your API endpoint
      setSubCategory(response.data.map((item) => item.butName));
    } catch (error) {
      console.error('Error fetching Category names:', error);
    }
  };


//----------------- image code g-drive---------------------------//

const [openPicker, authResponse] = useDrivePicker();
const handleOpenPicker = () => {
openPicker({
 clientId: "408252495180-8k61uckk5lkf023irqo4dd40daid3fmq.apps.googleusercontent.com",
    developerKey: "AIzaSyCouX1CDHfFvRaB0LvL4qyv9m9BvHCvtBw",
    viewId: "DOCS",
    showUploadView: true,
    showUploadFolders: true,
    supportDrives: true,
    multiselect: false, // You can set this to false if you only want to select one file
    callbackFunction: (data) => {
     if (data.action === 'picked') {
        const selectedFile = data.docs[0];
     const fileId = selectedFile.id;
     console.log(selectedFile.name)
     setimgid(fileId);
     setimgname(selectedFile.name);
        if (data.docsView) {
         data.docsView.getPickerInstance().setVisible(false);
        }
     } else if (data.action === 'cancel') {
        console.log('User clicked cancel/close button');
     }
    },
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
    <div className="animation" style={{ position: "relative", }}>
      <div className="p-15 animation" style={{ marginTop: "12vh", position: "relative" }}>
        <div className="row p-1" style={{color: "white",alignContent: "center",borderRadius: "10px",marginLeft: "15vh",width: "30vw",fontSize: "2vh",height: "6vh",position: "relative",}}>
          <form className="row g-1"onSubmit={handleSubmit}enctype="multipart/form-data">
            <div class="col-md-6" style={{ position: "relative" }}>
              <input type="file"className="form-control"accept=".xlsx, .xls"onChange={handleFileChange}
                style={{backgroundColor: "lightgray",width: "40vh",fontSize: "2vh",height: "5vh",borderRadius: "5px",marginLeft: "20vh",}}/>
            </div>

            <div class="col-md-6" style={{ display: "flex" }}>
              <button className="btn"style={{color: "white",backgroundColor: "#05104d",borderRadius: "3px",marginLeft: "32vh",height: "5vh",width: "7vh",fontSize: "2vh",marginRight: "2vh"}}
                type="submit"
                title="upload Excel">
                <i class="fa-solid fa-upload" style={{ fontSize: "2vh" }}></i>
              </button>
              <button className="form-control btn"style={{color: "white",backgroundColor: "#05104d",borderRadius: "3px",width: "7vh",fontSize: "2vh",}}
                onClick={handleDownloadTemplate}
                title="Download the sample Excel file here">
                <i class="fa-solid fa-download" style={{ fontSize: "2vh" }}></i>
              </button>
            </div>
          </form>
          {message && <p>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
      <div className="p-2 " style={{ marginTop: "0vh", position: "relative", height: "70vh" }}>
        <div className="row p-2">
          <div className="card col-md-8" style={{ marginLeft: "auto", marginRight: "auto", position: "relative" }}>
            <h4
              className="text-gray"
              style={{ fontSize: "4vh", color: "#000099" }}
            >
              <i class="fa-solid fa-bowl-food"></i> Add Menu{" "}
            </h4>
            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={formData}>
                <div class="col-md-6">
                  <label>Food Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="food_name"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={foodData.food_name}
                    minLength={3}
                    maxLength={35}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>Food Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="foodcode"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={formData.foodcode}
                    minLength={3}
                    placeholder=""
                    maxLength={10}
                  />
                </div>
                <div class="col-md-6">
                  <label>Price {currentuser.currency} <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    style={{ fontSize: "2vh" }}
                    name="price"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={foodData.price}
                    placeholder=""
                    min="1"
                  />
                </div>
                

                <div class="col-md-6">
                  <label> Category <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="category"
                    className="form-select" // Add form-select class here
                    onChange={handleChange}
                    value={formData.category}
                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option className="font-weight-bold text-black" value="">
                      Select Category
                    </option>
                   
                    <option
                      className="font-weight-bold text-black"
                      value="veg"
                    >
                      Veg
                    </option>
                   
                    <option
                      className="font-weight-bold text-black"
                      value="nonveg"
                    >
                      Nonveg
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="egg"
                    >
                      Egg
                    </option>
                                     
                  </select>
                </div>


                <div class="col-md-6">
                  <label> Sub Category <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="subcategory"
                    className="form-select"
                    value={foodData.subcategory}
                    onChange={(e) => handleChange(e)}

                    style={{ color: "black", fontSize: "2vh" }}
                  >
                    <option value="" className="font-weight-bold text-black">Select Sub Category</option>
                    {subcategory.map((vendor) => (
                      <option key={vendor} value={vendor} style={{ color: "black" }} className="font-weight-bold text-black">
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>
                <div class="col-md-6">
                  <label>Description </label>
                  <input
                    type="text"
                    name="description"
                    style={{ fontSize: "2vh" }}
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={formData.description}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6" style={{ minHeight: "60px" }}>
                  <label>Image <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={imgname}
                    required
                    style={{ fontSize: "2vh" }}
                  />
                </div>
                 {/* //------ google drive -------// */}

                 <div class="col-md-6" style={{ minHeight: "60px" }}>
                <label>Select Image From Drive<span style={{ color: "red" }}>*</span></label>
                 <button className="form-control" style={{width:"8vw"}} onClick={() => handleOpenPicker()}><i class="fab fa-google-drive"></i> {""}Image</button>
                </div>

                 {/* //------ google drive end -------// */}
                

                
               
                <div>
                  <input type="checkbox"
                    required
                    style={{
                      marginLeft: "0vw", marginTop: "2vh",
                      width: "3vw", height: "2vh", textAlign: "center"
                    }}
                  />
                  <span style={{ color: "red" }}>*</span> Please Check This Box To Update Current Changes .
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
              style={{ marginTop: "25vh", marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


//UPDATE FOOD/////////////

export const Update_food = () => {
  const currentuser = authService.getCurrentUser();
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [subcategory, setSubCategory] = useState([]);
  const[imgid , setimgid] = useState("");
const[imgname , setimgname] = useState("");


  const [values, setValues] = useState({
    serial_no: "",
    food_id: "",
    food_name: "",
    description: "",
    category: "",
    subcategory: "",
    update_by: currentuser.username,
    gst_no: currentuser.gstno,
    created_by: "",
    store_id: currentuser.storeid,
    price: "",
    foodcode: "",
    image: "",
  });


  const checkIfFoodExists = async (foodName) => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Food/foods/${currentuser.storeid}`
      );
      const foodList = response.data;
      // Check if the foodName already exists in the food list
      return foodList.some((food) => food.food_name === foodName);
    } catch (error) {
      console.error("Error checking if food exists:", error);
      // Handle the error or return false as a fallback
      return false;
    }
  };


  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/Food/getFoodByID/" + id)
      .then((res) => {
        setValues({
          ...values,
          food_name: res.data.food_name,
          food_id: res.data.food_id,
          description: res.data.description,
          category: res.data.category,
          subcategory: res.data.subcategory,
          created_by: res.data.created_by,
          price: res.data.price,
          quantity: res.data.quantity,
          foodcode: res.data.foodcode,
          image: res.data.image,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.food_name.trim() === "") {
      toast.error("Food Name is required");
      return false;
    }
    if (values.foodcode.trim() === "") {
      toast.error("Food Code is required");
      return false;
    }
    if (!values.price) {
      toast.error("Price is required");
      return false;
    }
    if (values.category === "") {
      toast.error("Please choose a Category");
      return;
    }
    if (values.subcategory === "") {
      toast.error("Please choose a Sub Category");
      return;
    }
    if (values.image === "") {
      toast.error("Please choose a Image");
      return;
    }
    const foodExists = await checkIfFoodExists(values.food_name);
    if (foodExists) {
      toast.error("Food already exists in the food list");
      return;
    }

    const formData = new FormData();
    formData.append("food_name", values.food_name);
    formData.append("foodcode", values.foodcode);
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory);
    formData.append("description", values.description);
    formData.append("image", values.image);


    axios
      .patch(`http://localhost:8083/sys/Food/updatefood/` + id, formData)
      .then((res) => {
        // Handle success
        console.log("Updated successfully:", res.data);
        navigate("/food/update_food/:id");
        toast.success("Food Updated Successfully");
        setValues({
          serial_no: id,
          food_id: "",
          food_name: "",
          description: "",
          category: "",
          subcategory: "",
          update_by: "",
          gst_no: "",
          created_by: "",
          store_id: "",
          price: "",
          foodcode: "",
          image: "",
        });
      })
      .catch((err) => console.log(err));
  };

  //---------Rushikesh Image Code---------------

  const handleImageChange = (e) => {
    const fileInput = e.target; // Get a reference to the file input element
    const file = fileInput.files[0];

    if (file) {
     const fileExtension = file.name.split('.').pop().toLowerCase();
     const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

     if (allowedExtensions.includes(fileExtension)) {
        setSelectedImage(file);
        toast.dismiss(); // Clear any previous error toast
     } else {
        setSelectedImage(null);
        toast.error("Please select a valid image file (JPEG, PNG, GIF, JPG).");
        // Clear the file input by setting its value to an empty string
        fileInput.value = "";
     }
    } else {
     setSelectedImage(null);
     toast.error("Please select an image file.");
    }
};

useEffect(() => {
  fetchCategoryList();
 
}, []);
const fetchCategoryList = async () => {
  try {
    const response = await axios.get(`http://localhost:8083/sys/Button/getbutton/${currentuser.storeid}`); // Replace with your API endpoint
    setSubCategory(response.data.map((item) => item.butName));
  } catch (error) {
    console.error('Error fetching Category names:', error);
  }
};


//----------------- image code g-drive---------------------------
const [openPicker, authResponse] = useDrivePicker();
const handleOpenPicker = () => {
openPicker({
 clientId: "408252495180-8k61uckk5lkf023irqo4dd40daid3fmq.apps.googleusercontent.com",
    developerKey: "AIzaSyCouX1CDHfFvRaB0LvL4qyv9m9BvHCvtBw",
    viewId: "DOCS",
    showUploadView: true,
    showUploadFolders: true,
    supportDrives: true,
    multiselect: false, // You can set this to false if you only want to select one file
    callbackFunction: (data) => {
     if (data.action === 'picked') {
        const selectedFile = data.docs[0];
     const fileId = selectedFile.id;
     console.log(selectedFile.name)
     setimgid(fileId);
     setimgname(selectedFile.name);
     setValues({ ...values, image: fileId });
        if (data.docsView) {
         data.docsView.getPickerInstance().setVisible(false);
        }
     } else if (data.action === 'cancel') {
        console.log('User clicked cancel/close button');
     }
    },
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
          className="col-md-8"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="card">
            <h4
              className="text-gray"
              style={{ fontSize: "4vh", color: "#000099" }}
            >
              <i class="fa-solid fa-bowl-food"></i> Update Food{" "}
            </h4>
            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={(e) => handleSubmit(e)}>
                <div class="col-md-6">
                  <label>Food Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    style={{fontSize:"1.7vh"}}
                    name="food_name"
                    className="form-control"
                
                    onChange={(e) =>
                    setValues({ ...values, food_name: e.target.value })
                    }
                    value={values.food_name}
                    minLength={3}
                    maxLength={35}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label>Food Code <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    name="foodcode"
                    style={{fontSize:"1.7vh"}}
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, foodcode: e.target.value })
                    }
                    value={values.foodcode}
                    minLength={3}
                    placeholder=""
                    maxLength={10}
                  />
                </div>
                <div class="col-md-6">
                  <label>Price {currentuser.currency} <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    style={{fontSize:"1.7vh"}}
                    onChange={(e) =>
                      setValues({ ...values, price: e.target.value })
                    }
                    value={values.price}
                    placeholder=""
                    min="1"
                  />
                </div>
               



              <div class="col-md-6">
                  <label> Category <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="category"
                    className="form-select" // Add form-select class here
                    onChange={(e) =>
                      setValues({ ...values, category: e.target.value })
                    }
                    value={values.category}
                    style={{ color: "black", fontSize: "1.7vh" }}
                  >
                    <option className="font-weight-bold text-black" value="">
                      Select Category
                    </option>
                   
                    <option
                      className="font-weight-bold text-black"
                      value="veg"
                    >
                      Veg
                    </option>
                   
                    <option
                      className="font-weight-bold text-black"
                      value="nonveg"
                    >
                      Nonveg
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="egg"
                    >
                      Egg
                    </option>
                                     
                  </select>
                </div>


 <div class="col-md-6">
                  <label> Sub Category <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="subcategory"
                    className="form-select" // Add form-select class here
                    onChange={(e) =>
                      setValues({ ...values, subcategory: e.target.value })
                    }
                    value={values.subcategory}
                    style={{ color: "black", fontSize: "1.7vh" }}
                  >
                    <option className="font-weight-bold text-black" value="">
                      Select Sub Category
                    </option>
                    {subcategory.map((vendor) => (
                      <option key={vendor} value={vendor} style={{ color: "black" }} className="font-weight-bold text-black">
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>
               

                <div class="col-md-6">
                  <label>Description</label>
                  <input
                    type="text"
                    style={{fontSize:"1.7vh"}}
                    name="description"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                    value={values.description}
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label> Image</label>
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    onChange={(e) =>
                      setValues({ ...values, image: e.target.value })
                     }
                     value={imgname}


                    style={{ height: "39px" }}
                  />
                </div>
                {/* //------ google drive -------// */}

                <div class="col-md-6" style={{ minHeight: "60px",fontSize:"2vh" }}>
                <label>Select Image From Drive<span style={{ color: "red",fontSize:"2vh" }}>*</span></label>
                 <button className="form-control" style={{width:"8vw",fontSize:"2vh"}} onClick={() => handleOpenPicker()}><i class="fab fa-google-drive"></i> {""}Image</button>
                </div>

                 {/* //------ google drive end -------// */}
                
                <div>
                  <input type="checkbox"
                    required
                    style={{
                      marginLeft: "0vw", marginTop: "2vh",
                      width: "3vw", height: "2vh", textAlign: "center"
                    }}
                  />
                  <span style={{ color: "red" }}>*</span> Please Check This Box To Update Current Changes .
                </div>
                <div className="text-center mt-3">
                  <button
                    class="btn btn-outline-light"
                    type="submit"
                    style={{ width: "14vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                  >
                    Update food
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



///////pooja added new list/////////////////////
export const Food_list = () => {
  const currentuser = authService.getCurrentUser();
  const [foodList, setFoodList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // State for selected subcategory
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [food, setFood] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  
  useEffect(() => {
    init();
    fetchData();
  }, []);

  const [msg, setMsg] = useState("");

  const init = () => {
    foodService
      .getFood()
      .then((res) => {
        // console.log(res.data);
        setFoodList(res.data);
        setSerachApiData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchData = () => {
    fetch(`http://localhost:8083/sys/Food/foods/${currentuser.storeid}`)
      .then((response) => response.json())
      .then((json) => {
        setFoodList(json);
        setSerachApiData(json);
      });
  };

  const handleDeletefood = (serial_no) => {
    foodService.deleteFood(serial_no)
      .then((res) => {
        toast.success(" Food Delete Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setFoodList(searchApiData);
      setErrorShown(false); // Reset the error display flag when the filter is cleared

    } else {
      const filterResult = searchApiData.filter(
        (item) =>
          item.food_name
            ?.toLowerCase()
            ?.includes(e.target.value.toLowerCase()) ||
          item.foodcode
            ?.toLowerCase()
            ?.includes(e.target.value.toLowerCase()) ||
          item.category
            ?.toLowerCase()
            ?.includes(e.target.value.toLowerCase()) ||
          item.subcategory
            ?.toLowerCase()
            ?.includes(e.target.value.toLowerCase()) ||
          (item.food_id || "")
            ?.toString()
            ?.toLowerCase()
            ?.includes(e.target.value.toLowerCase()) ||
          (item.price || "")
            ?.toString()
            ?.toLowerCase()
            ?.includes(e.target.value.toLowerCase())
      );
      if (filterResult.length > 0) {
        setFoodList(filterResult);
      } else {
        setFoodList(searchApiData);
        if (!errorShown) {
          toast.error("No matching data found.");
          setErrorShown(true); // Set the error display flag to true after showing the error once
       }
      }
    }
    setFilterVal(e.target.value);
  };
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    filterData(e.target.value, selectedSubcategory);
  };
  const handleSubcategoryFilter = (e) => {
    setSelectedSubcategory(e.target.value);
    filterData(selectedCategory, e.target.value);
  };
  const filterData = (category, subcategory) => {
    const categoryFilteredData = category
      ? searchApiData.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      )
      : searchApiData;

    const subcategoryFilteredData = subcategory
      ? categoryFilteredData.filter(
        (item) => item.subcategory.toLowerCase() === subcategory.toLowerCase()
      )
      : categoryFilteredData;

    if (subcategoryFilteredData.length > 0) {
      setFoodList(subcategoryFilteredData);
    } else {
      setFoodList([{ name: "No Data" }]);
    }
  };

  const generatePDF = async () => {
    try {
      // Fetch data from the API URL
      const response = await axios.get(
        `http://localhost:8083/sys/Food/foods/${currentuser.storeid}`
      );
      const apiData = response.data;
      // Generate the PDF content using fetched data
      const pdfContent = (
        <Document>
          <Page size="A4">
            <View style={styles.page}>
              {apiData.map((item, index) => (
                <View key={index} style={styles.vendorContainer}>
                  <Text style={styles.vendorName}>
                    Food ID : {item.food_id}
                  </Text>
                  <Text style={styles.vendorName}>
                    Food Name : {item.food_name}
                  </Text>
                  <Text style={styles.vendor}>Food Code: {item.foodcode}</Text>
                  <Text style={styles.vendor}>Category: {item.category}</Text>
                  <Text style={styles.vendor}>
                    Sub Category : {item.subcategory}
                  </Text>
                  <Text style={styles.vendor}>Price : {item.price}</Text>
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
      link.download = "food_list.pdf";
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

  const generateExcel = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8083/sys/Food/generateExcel/${currentuser.storeid}`,
        null,
        {
          responseType: "blob", // Important: Response type as blob
        }
      );

      // Create a download link
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };


  // Calculate the total number of pages
  const totalPages = Math.ceil(foodList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodList.slice(indexOfFirstItem, indexOfLastItem);

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


// Handle checkbox state changes for individual items
const handleSelectItem = (serial_no) => {
  const updatedSelectedItems = [...selectedItems];
  
  if (updatedSelectedItems.includes(serial_no)) {
      updatedSelectedItems.splice(updatedSelectedItems.indexOf(serial_no), 1);
  } else {
      updatedSelectedItems.push(serial_no);
  }
  
  // Check if all items are selected
  const allItemsSelected = foodList.length === updatedSelectedItems.length;
  
  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
  };
  
  // Handle "Select All" checkbox state changes
  const handleSelectAll = () => {
  if (selectAllChecked) {
      setSelectedItems([]);
  } else {
      setSelectedItems(foodList.map((item) => item.serial_no));
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

};



  useEffect(() => {
    fetchCategoryList();
   
  }, []);
  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/sys/Button/getbutton/${currentuser.storeid}`); // Replace with your API endpoint
      setCategory(response.data.map((item) => item.butName));
    } catch (error) {
      console.error('Error fetching Category names:', error);
    }
  };

  const handleMultiDeletedfood = (serialNo) => {
    
    // After deleting the specific item, update selectedItems and showAlerts
    const updatedSelectedItems = selectedItems.filter(item => item.serial_no !== serialNo);
    const updatedShowAlerts = { ...showAlerts, [serialNo]: false };

    // Update state to reflect the changes
    setSelectedItems(updatedSelectedItems);
    setShowAlerts(updatedShowAlerts);

    for (const id of selectedItems) {
         handleDeletefood(id);
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
    <div className="data animation" style={{ marginTop: "3vh" }}>

      <div className="row rowleft16" style={{ marginTop: "12vh" }}>
        <div
          style={{ width: "97vw", display: "flex", flexDirection: "row", justifyContent: "right", marginBottom: "2vh" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
          {selectedItems.length > 0 && (
        <button
          onClick={handleMultiDelete}
          className="btn btn-danger"style={{ alignContent: "center", justifyContent: "center", fontSize: "2vh", display: "flex", flexDirection: "row", alignItems: "center", height:"6vh",marginRight:"2vh" }}
        >
          Delete Selected
        </button>
      )}

{showAlerts[food.serial_no] && (
                     <div className="overlay">
                        <div className="alert alert2 alert-success font-weight-bold center-popup">
                         <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedfood(food.serial_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [food.serial_no]: false,
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
  title="Add new food"
  style={{
    fontSize: "2vh",
    height: "6vh",
    display: "flex",
    alignItems: "center",
  }}
  onClick={() => window.location.href = "/food/food"}
>
  <i class="fas fa-plus" style={{}}></i>{" "}
  Food
</button>

            <button onClick={generateExcel} className="btn btn-outline-primary"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}>Excel</button>
            {downloadLink && (
              <a href={downloadLink} download="food_data.xlsx">
                <i class="fa-solid fa-download" style={{ fontSize: "4vh", marginTop: "2vh" }}></i>

              </a>
            )}
            <button
              onClick={generatePDF}
              className="btn btn-outline-primary"
              title="Download PDF"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}
            >
              {downloadLink && (
                <a href={downloadLink} download="food_list.pdf"></a>
              )}
              PDF
            </button>
          </div>
        </div>

        <div className="col-md-20">
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
              Food
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
                height: "5vh",
                display: "flex",
                alignItems: "center",
                width: "30%",
                marginTop: "7px",
                fontSize: "1vw"
              }}
              value={FilterVal}
              onInput={(e) => handleFilter(e)}
            />

            <div className="rowleft66"
              style={{
                fontSize: "2vh",
                display: "flex",
                marginTop: "7px"
              }}
            >
              <select
                className="form-select"
                aria-label="Select category"
                value={selectedCategory}
                onChange={handleCategoryFilter}
                style={{
                  background: "white",
                  color: "black",
                  fontSize: "2vh",
                  height: "5vh",
                  width: "30vh",
                  marginRight: "2vh",
                  textAlign:"center"
                }}
              >
                <option className="font-weight-bold text-black" value="">
                  Select Category
                </option>

                {category.map((vendor) => (
                      <option key={vendor} value={vendor} style={{ color: "black" }} className="font-weight-bold text-black">
                        {vendor}
                      </option>
                    ))}
                              
              </select>

              <select
                className="form-select"
                aria-label="Select subcategory"
                value={selectedSubcategory}
                onChange={handleSubcategoryFilter}
                style={{
                  background: "white",
                  color: "black",
                  fontSize: "2vh",
                  height: "5vh",
                  width: "30vh",
                  textAlign:"center"
                }}
              >
                <option className="font-weight-bold text-black" value="">
                      Select Sub Category
                    </option>
                   
                    <option
                      className="font-weight-bold text-black"
                      value="maincourse"
                    >
                      Main Course
                    </option>
                   
                    <option
                      className="font-weight-bold text-black"
                      value="Cake "
                    >
                      Cake
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="breakfast"
                    >
                      Breakfast
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="colddrinks"
                    >
                      Cold Drinks
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="hotfrink"
                    >
                      Hot Drinks
                    </option>
                     <option
                      className="font-weight-bold text-black"
                      value="South Indian"
                    >
                      South Indian
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="starter"
                    >
                      Starter
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="sweet"
                    >
                      Dessert
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="salad"
                    >
                      Salad
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Bread"
                    >
                      Bread
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="mocktail"
                    >
                      Mocktails
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="smoothies"
                    >
                      Smoothies and Shakes
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="juices"
                    >
                      Juices
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Fast Food"
                    >
                      Fast Food
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Rice"
                    >
                      Rice
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Sandwiches"
                    >
                      Sandwiches
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Combos"
                    >
                      Combos
                    </option>
                    <option
                      className="font-weight-bold text-black"
                      value="Combos"
                    >
                      Chinese
                    </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="content read" style={{ width: "100%" }}>
        <table>
          <thead>
            <tr style={{ fontSize: "2vh" }}>
              <td
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2.5vh", borderTopLeftRadius: "10px" }}
              >
                Sr.No{" "}
              </td>
            
              <th scope="col" class="text-center px-2 border">
                Food Name
              </th>
              <th scope="col" class="text-center px-2 border">
                Food Code
              </th>
              <th scope="col" class="text-center px-2 border">
                Category
              </th>
              <th scope="col" class="text-center px-2 border">
                Sub Category
              </th>
              <th scope="col" class="text-center px-2 border">
                Price {currentuser.currency}
              </th>
              <th scope="col" class="text-center px-2 border">
                Image
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
         Select {" "}
        
        </th>
            </tr>
          </thead>
          <tbody className="tbodytr">
            {currentItems.map((f, num) => (
              <tr>
                <td class="text-center px-2">{num + 1}</td>
               

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    f.food_name
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                    <strong>{f.food_name}</strong>
                  ) : (
                    f.food_name
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    f.foodcode
                      ?.toLowerCase()
                      ?.includes(FilterVal.toLowerCase()) ? (
                    <strong>{f.foodcode}</strong>
                  ) : (
                    f.foodcode
                  )}
                </td>

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    f.category.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                    <strong>{f.category}</strong>
                  ) : (
                    f.category
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    f.subcategory
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                    <strong>{f.subcategory}</strong>
                  ) : (
                    f.subcategory
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    f.price
                      .toString()
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                    <strong>{f.price}</strong>
                  ) : (
                    f.price
                  )}
                </td>

                <td class="text-center px-2 border">
                  <img
                    height="60px"
                    width="60px"
                    src={"https://drive.google.com/uc?export=view&id="+f.image}
                    alt=""
                  />
                </td>
                <td class="actions px-2" style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                  <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [f.serial_no]: true,
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

                  {showAlerts[f.serial_no] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => handleDeletefood(f.serial_no)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [f.serial_no]: false,
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
                    to={`/food/update_food/${f.serial_no}`}
                    title="edit food"
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
                  onChange={() => handleSelectItem(f.serial_no)}
                  checked={selectedItems.includes(f.serial_no)}
                />
              </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
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
                  width: "8vw",
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

export default Food_list;
