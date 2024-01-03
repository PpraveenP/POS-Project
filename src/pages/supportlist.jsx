import React, { useEffect, useState } from "react";

import { Link} from "react-router-dom";
import AuthService from "../services/technician.service";
// Path to your StoreService file
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PDFDocument, Page, Text, View, Document, StyleSheet,pdf } from "@react-pdf/renderer";
import technicianService from "../services/technician.service";
import DatePicker from 'react-datepicker'; // Assuming you are using react-datepicker library
import 'react-datepicker/dist/react-datepicker.css';
import "./overview.css";


//Date Filter Applied By Neha to Techninician List
const Supportlist = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlerts, setShowAlerts] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState("");     // End date for filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const [msg, setMsg] = useState("");
  
// Neha Made chnages in fetchStores function to set the list in descending order
  const fetchStores = async () => {
    try {
      const response = await AuthService.getAllStores();
      // Sort the stores by created_date in descending order
      const sortedStores = response.data.sort((a, b) => {
        return new Date(b.created_date) - new Date(a.created_date);
      });

      setStores(sortedStores);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setLoading(false);
    }
  };

  const [editStore, setEditStore] = useState({
    techid: "",
    username: "",
    email: "",
    contact: "",
    gstno: "",
    currency: "",
    address: "",
    country: "",
    state: "",
  });

  const handleEditClick = (store) => {
    setEditStore(store);
    setShowEditModal(true);
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:8083/api/auth/Tech/Tech/${editStore.techid}`
      )
      .then((res) => {
        setEditStore({
          ...editStore,
          username: res.data.username,
          email: res.data.email,
          contact: res.data.contact,
          currency: res.data.currency,
          address: res.data.address,
          country: res.data.country,
          state: res.data.state,
          updatedby: res.data.updatedby,
          createdBy: res.data.createdBy,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", editStore.username);
    formData.append("email", editStore.email);
    formData.append("contact", editStore.contact);
    formData.append("gstno", editStore.gstno);
    formData.append("currency", editStore.currency);
    formData.append("address", editStore.address);
    formData.append("country", editStore.country);
    formData.append("updatedby", editStore.updatedby);
    formData.append("createdBy", editStore.createdBy);

    axios
      .patch(
        `http://localhost:8083/api/auth/Tech/updatetech/${editStore.techid}`,
        formData
      )
      .then((res) => {
        // Handle success
        console.log("Updated successfully:", res.data);
        toast.success("Technician Details Update Successfully..!!");

        // Clear the form fields after successful update
        setEditStore({
          username: "",
          email: "",
          contact: "",
          gstno: "",
          currency: "",
          address: "",
          country: "",
          updatedby: "",
          createdBy: "",
        });
      })
      .catch((err) => {
        console.error("Error updating store:", err);
        // Handle error
      });
  };


  const handleDeleteTech = (techid) => {
    technicianService.deletetech(techid)
      .then((response) => {
        console.log("Tech deleted successfully");
        // Update the stores list to remove the deleted store
        setStores(stores.filter((store) => store.techid !== techid));
        toast.success("Technician Deleted Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log("An error occurred while deleting the store.");
      });
  };

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredStores = searchApiData.filter((item) => {
      return (
        item.techid.toLowerCase().includes(searchValue) ||
        item.username.toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue) ||
        item.contact.toLowerCase().includes(searchValue) ||
        item.comfirmpassword.toLowerCase().includes(searchValue) ||
        item.createdBy.toLowerCase().includes(searchValue) ||
        item.created_date.toLowerCase().includes(searchValue)
      );
    });
  
    setEditStore(filteredStores);
    setFilterVal(e.target.value);
  };
  



  
  const generatePDF = async () => {
    try {
      // Fetch data from the API URL
      const response = await axios.get(`http://localhost:8083/api/auth/Tech/gettech`);
      const apiData = response.data;
  
      // Generate the PDF content using fetched data
      const pdfContent = (
        <Document>
          <Page size="A4">
            <View style={styles.page}>
              {apiData.map((item, index) => (
                <View key={index} style={styles.vendorContainer}>
                  <Text style={styles.vendorName}>Technician ID : {item.techid}</Text>
                  <Text style={styles.vendorName}>Technician Username : {item.username}</Text>
                  <Text style={styles.vendorName}>Email : {item.email}</Text>
                  <Text style={styles.vendorName}>Contact No : {item.contact}</Text>
                  <Text style={styles.vendorName}>Password : {item.comfirmpassword}</Text>   
                   <Text style={styles.vendorName}>Created By : {item.createdBy}</Text>     
                   <Text style={styles.vendorName}>Created Date : {item.created_date}</Text>           
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
      link.download = "technician_list.pdf";
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
  
    subMenuTitle: {
      marginLeft: 10, 
      fontWeight: 'bold', 
      fontSize: 14,
    },
  
    subMenuItem: {
      marginLeft: 20,     },
  };

  // Function to fetch data based on selected date range
const fetchDataByDateRange = () => {
  
  if (!startDate || !endDate) {
    // Display an error message if start date or end date is not selected
    toast.error('Please select both Start Date and End Date.');
    return; // Stop further processing
  }

  const url = `http://localhost:8083/api/auth/Tech/gettech`;

  // You can append the start date and end date as query parameters to the URL
  const startDateParam = startDate ? `startDate=${startDate.toISOString().split('T')[0]}` : '';
  const endDateParam = endDate ? `endDate=${endDate.toISOString().split('T')[0]}` : '';

  const queryParameters = [startDateParam, endDateParam].filter(param => param).join('&');
  const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;

  console.log('Full URL:', fullUrl); // Debugging log

  fetch(fullUrl)
    .then((response) => response.json())
    .then((json) => {
      // Filter the data based on the selected date range
      const filteredData = json.filter((item) => {
        const orderDate = new Date(item.created_date);
        console.log('orderDate:', orderDate);

        // Check if the orderDate is greater than or equal to startDate and less than or equal to endDate
        const isAfterStartDate = !startDate || orderDate >= startDate;
        const isBeforeEndDate = !endDate || orderDate <= endDate;
        console.log('isAfterStartDate:', isAfterStartDate);
        console.log('isBeforeEndDate:', isBeforeEndDate);

        return isAfterStartDate && isBeforeEndDate;
      });

      console.log('Filtered Data:', filteredData); // Debugging log

      setStores(filteredData);
      setSerachApiData(json);
       // Reset the error message when data is successfully fetched
       setMsg(""); // Change this to setMsg("") to clear the previous error message
      })
      .catch((error) => {
        console.error("Error:", error);
        // Display an error message using toast.error
        toast.error("Error fetching data. Please try again later.");
      });
  }; 

const handleReset = () => {
  setStartDate(null);
  setEndDate(null);
  fetchStores();
  };



   // Jay made pagination logic for store list

  // Calculate the total number of pages
  const totalPages = Math.ceil(stores.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stores.slice(indexOfFirstItem, indexOfLastItem);

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


  

  const handleSelectItem = (techid) => {
    if (selectedItems.includes(techid)) {
      setSelectedItems(selectedItems.filter((item) => item !== techid));
    } else {
      setSelectedItems([...selectedItems, techid]);
    }
  };

  const handleMultiDelete = () => {
    // Implement the logic to delete selected items
    // Use the `selectedItems` array to identify which items to delete
    for (const id of selectedItems) {
      handleDeleteTech(id);
    }
    setSelectedItems([]); // Clear the selected items after deletion
  };

  return (
    <>
      <div className="data animation">
      <div className="p-5">
            <div>
             <p></p>
            </div>
        </div>
        <div className="row rowleft11">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
            {selectedItems.length > 0 && (
        <button
          onClick={handleMultiDelete}
          className="btn btn-outline-danger" style={{alignContent:"end",justifyContent:"end",marginLeft:"145vh"}}
        >
          Delete Selected
        </button>
      )}
        <button
                class="btn btn-outline-primary boton2"
                style={{
                  fontSize: "2vh",
                  
                  marginRight: "5px",
                }}>
                      <i class="fas fa-plus" style={{ marginRight: "5px" }}></i>
                <a  href="/technician" className="btn-outline-primary">
              Technician
                </a>
               
              </button>

              
            <button onClick={generatePDF} className="btn btn-outline-primary"  style={{
              fontSize: "2vh",
             
              marginRight: "3vh",}}>
            {downloadLink && (
            <a href={downloadLink} download="technician_list.pdf">
            
            </a>
          )}PDF
          </button>
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
            }}>

             <h4
              className="text"
              style={{
                color: "#000099",
                fontSize: "4vh",
                fontWeight: "bold",
              }}
            > <i class="fa-solid fa-list" style={{ color: "rgb(0, 0, 153" }}></i>
              Technician
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
              width: "30%",
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
          From-
        <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="Select Start Date"
        
      />
      <span style={{ marginLeft: "5px" }}></span>

   
      To-
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="Select End Date"
        />

  
      <button onClick={fetchDataByDateRange} className="btn btn-outline-success"   title="Filter Data"  
     style={{
      marginLeft: "10px",
      height: "3.9vh",
      width: "3.9vh",
      fontSize: "2vh",
      display: "flex",
      alignitems: "center",
      justifyContent: "center"
    }}>
      <i className="fas fa-filter" style={{ fontSize: "2vh"  }}></i></button>

      <button   className="btn btn-outline-danger"
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
                <i className="fas fa-times" style={{ fontSize:"2vh" }}></i>
      </button>
    
  {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
       </div>
             
            </div>
          </div>
        </div>
         
        <div class="content read">
          <table>
          <thead style={{ position: 'sticky', top: '0',}}>
              <tr>
                <th scope="col" class="text-center px-2 border">
                Sr.NO
                </th>
                <th scope="col" class="text-center px-2 border">
                Tech Id
                </th>
                <th scope="col" class="text-center px-2 border">
                Tech Name
                </th>
                <th scope="col" class="text-center px-2 border">
                Email
                </th>
                <th scope="col" class="text-center px-2 border">
                Contact
                </th>
                <th scope="col" class="text-center px-2 border">
               Password
                </th>
                <th scope="col" class="text-center px-2 border">
                Created By
                </th>
                <th scope="col" class="text-center px-2 border">
                Created Date 
                </th>
               <th scope="col" class="text-center px-2 border">
                Action
                </th>
                <th scope="col" className="text-center px-4 border"
               style={{ borderTopRightRadius: "10px" }}>
                Select All{" "}
              <input
                type="checkbox"
                style={{ width: '2vw', height: '2vh' }}
                onChange={() => {
                  // Handle selecting/deselecting all items
                  if (selectedItems.length === stores.length) {
                    setSelectedItems([]);
                  } else {
                    setSelectedItems(stores.map((item) => item.techid));
                  }
                }}
              />
            </th>
               
              </tr>
            </thead>
            <tbody className="tbodytr">
              {/* {stores.map((store, index) => ( */}
              {currentItems.map((store, index) => (
                <tr key={store.techid}>
                  {/* <td class="text-center px-2 border">{index + 1}</td> */}
                  <td className="text-center px-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.techid.toString().toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.techid}</strong>
                    ) : (
                        store.techid
                    )}
                  </td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.username.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.username}</strong>
                    ) : (
                        store.username
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.email.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.email}</strong>
                    ) : (
                        store.email
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.contact.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.contact}</strong>
                    ) : (
                    store.contact
                    )}
                  </td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.comfirmpassword.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.comfirmpassword}</strong>
                    ) : (
                    store.comfirmpassword
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.createdBy.toString().toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.createdBy}</strong>
                    ) : (
                    store.createdBy
                    )}
                  </td>

                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    store.created_date.toString().toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{store.created_date}</strong>
                    ) : (
                    store.created_date
                    )}
                  </td>

                  <td class="actions"style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                    <Link
                    
                    title="edit Tech"
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
                      onClick={() => handleEditClick(store)}
                    >
                      <i
                        className="fa-solid fa-pen-to-square"
                        style={{ fontSize: "2vh" }}
                      ></i>
                    </button>
                  </Link>

                       <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [store.techid]: true,
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
                  {showAlerts[store.techid] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => handleDeleteTech(store.techid)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [store.techid]: false,
                              })
                            }
                          >
                            Cancel <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                
             </td>

             <td className="text-center px-2 border">
                <input
                  type="checkbox"
                  style={{ width: '3vw', height: '3vh' }}
                  onChange={() => handleSelectItem(store.techid)}
                  checked={selectedItems.includes(store.techid)}
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
                    style={{ marginTop: '70px', marginRight: '10px' }} />
         </div>
         {editStore && (
                <Modal size="lg" show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title centered style={{color:"#000099"}} ><i class="fa-solid fa-user-pen"></i> Edit Technician Details </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Username <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.username}
                                onChange={(e) => setEditStore({ ...editStore, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.email}
                                onChange={(e) => setEditStore({ ...editStore, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Contact <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.contact}
                                onChange={(e) => setEditStore({ ...editStore, contact: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.address}
                                onChange={(e) => setEditStore({ ...editStore, address: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Country <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.country}
                                onChange={(e) => setEditStore({ ...editStore, country: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Updated By <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.updatedby}
                                onChange={(e) => setEditStore({ ...editStore, updatedby: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-weight-bold">Created By <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={editStore.createdBy}
                                onChange={(e) => setEditStore({ ...editStore, createdBy: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn  text-white col-md-3 mt-2"
                            type='submit'
                            onClick={handleSaveEdit}
                            style={ { background:"#03989e",margin:"auto"}}

                        >
                            Update
                        </button>

                       
                    </Modal.Footer>
                </Modal>
            )} 

    </>
  );
};

export default Supportlist;