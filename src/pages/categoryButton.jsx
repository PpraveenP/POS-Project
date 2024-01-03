import React, { useEffect, useState } from "react";
import categoryService from "../services/category.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./list.css";
import authService from "../services/auth.service";
import "./allform.css";
import axios from "axios";
import { PDFDocument, Page, Text, View, Document, StyleSheet, pdf } from "@react-pdf/renderer";
import DatePicker from 'react-datepicker'; // Assuming you are using react-datepicker library
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

export const CategoryButton = () => {
    const currentuser = authService.getCurrentUser();
    const [existingcategory, setExistingcategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [showAlerts, setShowAlerts] = useState({});

    const [category, setCategory] = useState({
      id: "",
      butName: "",
      store_id: currentuser.storeid,
     });
  
 
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'unit' && value !== category.unit) {
        // Unit is changing, perform the conversion
        let convertedQuantity = parseFloat(category.quantity);
        if (value === 'kg') {
          convertedQuantity *= 1000; // Convert to grams
          toast.success(`Quantity converted to ${convertedQuantity} grams`);
        } else if (value === 'litre') {
          convertedQuantity *= 1000; // Convert to milliliters
          toast.success(`Quantity converted to ${convertedQuantity} milliliters`);
        }
        setCategory({
          ...category,
          [name]: value,
          quantity: convertedQuantity.toString(), // Convert to string
        });
      } else {
        // Unit is not changing, just update the value
        setCategory({ ...category, [name]: value });
      }
    };
  
    // Define an async function to check if food exists
    const checkIfcategoryExists = async (butName) => {
      try {
        const response = await axios.get(`http://localhost:8083/sys/Button/getbutton/${currentuser.store_id}`);
        const categoryList = response.data;
        // Check if the categoryName already exists in the food list
        return categoryList.some((category) => category.butName === butName);
      } catch (error) {
        console.error("Error checking if category exists:", error);
        // Handle the error or return false as a fallback
        return false;
      }
    };
 
  
    const categoryRegister = async (e) => {
      e.preventDefault();
              
      categoryService.saveCategory(category)
        .then((res) => {
          console.log("category Added Successfully");
          toast.success("Category Added Successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1);
          setCategory({
            id: "",
            butName:"",
            store_id:currentuser.storeid,
          
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to add category");
        });
    };


    const handleDeletedCategory = (id) => {
        categoryService.deleteCategory(id)
          .then((res) => {
            toast.success("Category Delete Successfully");
            setTimeout(() => {
              window.location.reload();
            }, 1);
               })
          .catch((error) => {
            console.log(error);
          });
      };

      const [editModalOpen, setEditModalOpen] = useState(false);
      const [editingCategoryId, setEditingCategoryId] = useState(null);
      const handleEdit = (id) => {
        // Find the payment with the specified paymentId
        const categoryToEdit = categoryList.find(
          (category) => category.id === id
        );
        if (categoryToEdit) {
          // Set the editingPaymentId to the selected paymentId
          setEditingCategoryId(id);
          // Set the formData state to the existing payment details
          setCategory(categoryToEdit);
          setEditModalOpen(true);
        }
      };


      const [showSuccessMessage, setShowSuccessMessage] = useState(false);
      const handleEditSubmit = (event) => {
        event.preventDefault();
        axios.patch(`http://localhost:8083/sys/Button/updateButton/${editingCategoryId}`, category)
        .then((response) => {
            console.log("Category updated successfully:", response.data);
            setEditModalOpen(false);
            fetchCategoryDetails();
            //setShowSuccessMessage(true);
            toast.success("Category Updated Successfully");
            // Hide the success message after 3 seconds (3000ms)
            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 3000);
          })
          .catch((error) => {
            console.error("Error updating payment:", error);
          });
      };


      const fetchCategoryDetails = () => {
        // Fetch payment details from the backend API
        axios
          .get(
            `http://localhost:8083/sys/Button/getbutton/${currentuser.storeid}`
          )
          .then((response) => {
            setCategoryList(response.data);
          })
          .catch((error) => {
            console.error("Error fetching payment details:", error);
          });
      };


      const handleCloseModal = () => {
        setEditModalOpen(false);
        setEditingCategoryId(null);
        setCategory({
          butName: "",
                 });
      };
  

      useEffect(() => {
        fetchCategoryDetails(); // Call this function to load category data
      }, []);


      
      
    return (
      <div className="p-1 animation" style={{ marginTop: "3vh",display:"flex",flexDirection:"row" }}>
        <div className="row p-3">
          <div
            className="col-md-10"
            style={{ marginLeft: "auto", marginLeft: "20vh" ,borderRadius:"10px"}}
          >
            <div className="card">
              <h4
                className="text-gray"
                style={{ fontSize: "4vh", color: "#000099" }}
              >
                <i class="fa-solid fa-cart-flatbed"></i>  Add Category
              </h4>
              <div className="card-body" style={{ fontSize: "2vh" }}>
                <form
                  className="row g-1"
                  onSubmit={(e) => categoryRegister(e)}
                  encType="multipart/form-data"
                >
                  <div className="col-md-6">
                    <label >Category Name <span style={{ color: "red" }}>*</span></label>
                    <input
                      type="text"
                      style={{ fontSize: "2vh" }}
                      name="butName"
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      value={category.butName}
                      placeholder=""
                      maxLength={25}
                      required
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
                style={{ marginTop: "120px", marginRight: "10px" }}
              />
            </div>
          </div>
        </div>

        <div className="row" style={{ marginLeft: "-15vh", marginTop: "8vh",width:"30vw" }}>
        <div className="col-md-1" style={{ margin: "auto", width: "30vw" }}>
          <div
            className="card mt-3"
            style={{ margin: "auto", width: "33vw", color: "black",padding:"2px" }}
          >
           <div className="card-header fs-3 text-left">
              <h4
                className="text-gray"
                style={{ fontSize: "4vh", color: "#000099" }}
              >
                <i class="fa-solid fa-square-plus"></i> Category List
              </h4>
            </div>
            <div className="card-body" style={{ padding:"30px" }}>
              <table class="table`1" style={{width:"30vw" }}>
                <thead style={{ fontSize: "1vw" }}>
                  <tr style={{ fontSize: "1vw", color: "black"}}>
                    <th scope="col">Sr.NO</th>
                    <th scope="col">Category Name</th>
                     <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map((category, index) => (
                    <tr key={index} style={{ fontSize: "2vh" }}>
                      <td>{index + 1}</td>
                      <td className="text-dark ">
                        {category.butName}
                      </td>
                       <td style={{ display: "flex" }}>
                         <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [category.id]: true,
                      })
                    }
                    style={{ fontSize: "2vh",
                    width: "3.8vh", // Set the desired width
                    height: "3.8vh", // Set the desired height
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight:"2vh" }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                      
                  {showAlerts[category.id] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => handleDeletedCategory(category.id)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [category.id]: false,
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
                                onClick={() => handleEdit(category.id)}
                                style={{
                                  fontSize: "2vh",
                                  width: "3.8vh", // Set the desired width
                                  height: "3.8vh", // Set the desired height
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
        {editingCategoryId && (
          <div className="row">
            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              show={editModalOpen}
              onHide={handleCloseModal}
            >
              <Modal.Header closeButton>
                <Modal.Title centered style={{color:"#000099"}}>
                
                  <i class="fa-solid fa-pen-to-square fa-lg"></i> Edit Category
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
                <Form.Group className="col-md-12">
  <Form.Label className="">
    Category Name <span style={{ color: "red" }}>*</span>
  </Form.Label>
  <Form.Control
    type="text"
    name="butName" // Change the name attribute to "butName"
    value={category.butName}
    onChange={handleChange}
  />
</Form.Group>

                                                             
              
                  <button
                    className="btn text-white col-md-2 mt-5"
                    type="submit"
                    style={{
                      background: "#03989e",
                      width: "500",
                      marginLeft: "40vh",
                      marginRight: "auto",
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
      </div>
    );
  };
  export default CategoryButton;