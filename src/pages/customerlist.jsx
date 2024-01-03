import customerService from "../services/customer.service";
//////////////////pooja added new list all////////////////
import React, { useEffect, useState, useRef } from "react";
import paymentService from "../services/payment.service";
import billService from "../services/bill.service";
import ReactPrint from "react-to-print";
import invoiceService from "../services/invoice.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { isEmail } from "validator";

import "./list.css";
import axios from "axios";
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



/// Date Filter Applied By Neha
export const Customer_list = () => {
    const currentuser = authService.getCurrentUser();
    const [customerList, setCustomerList] = useState([]);
    const [searchApiData, setSerachApiData] = useState([]);
    const [FilterVal, setFilterVal] = useState([]);
    const [downloadLink, setDownloadLink] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errorShown, setErrorShown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const ref = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlerts, setShowAlerts] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState('');
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

    useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange,startDate,endDate]);
  
    const [msg, setMsg] = useState("");
  
    const init = () => {
      customerService.getAllCustomer()
        .then((res) => {
          // console.log(res.data);
          setCustomerList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
      
    const fetchData = () => {
      const url = `http://localhost:8083/sys/customer/getcustomer/${currentuser.storeid}`;
  
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
          setCustomerList(json);
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

    const generatePDF = async () => {
      try {
        // Fetch data from the API URL
        const response = await axios.get(
          `http://localhost:8083/sys/customer/getcustomer/${currentuser.storeid}`
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
                      {" "}
                      Customer ID :{item.customer_id}
                    </Text>
                    <Text style={styles.vendor}>
                      {" "}
                      Customer Name :{item.customername}
                    </Text>
                    <Text style={styles.vendor}>
                      {" "}
                      Email :{item.email}
                    </Text>
                    <Text style={styles.vendor}>
                      {" "}
                      Date of Birth :{item.dob}
                    </Text>
                    <Text style={styles.vendor}>
                      {" "}
                      Created date:{item.contact}
                    </Text>
                    
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
        link.download = "customer_list.pdf";
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
  
    // const handleFilter = (e) => {
    //     if (e.target.value === "") {
    //       setCustomerList(searchApiData);
    //     } else {
    //       const filterResult = searchApiData.filter((item) => {
    //         const customerName = (item.customername || "").toLowerCase();
    //         const email = (item.email || "").toLowerCase();
    //         const dob = (item.dob || "").toString().toLowerCase();
    //         const contact = (item.contact || "").toString().toLowerCase();
      
    //         return (
    //           customerName.includes(e.target.value.toLowerCase()) ||
    //           email.includes(e.target.value.toLowerCase()) ||
    //           dob.includes(e.target.value.toLowerCase()) ||
    //           contact.includes(e.target.value.toLowerCase())
    //         );
    //       });
      
    //       if (filterResult.length > 0) {
    //         setCustomerList(filterResult);
    //       } else {
    //         setCustomerList(searchApiData);
    //         toast.error("No matching data found.");
    //       }
    //     }
      
    //     setFilterVal(e.target.value);
    //   };
 
    const handleFilter = (e) => {
      if (e.target.value === '') {
          // No search term, apply only date range filter
          handleTimeRangeChange(selectedTimeRange);
          setErrorShown(false); // Reset the error display flag when the filter is cleared

      } else {
          const filterResult = searchApiData.filter((item) => {
           const searchTermMatches = (
              (item.customername || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
              (item.dob || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
              (item.email || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
              (item.contact || '').toString().toLowerCase().includes(e.target.value.toLowerCase())
           );
      
           const dateRangeMatches = isDateInRange(item.dob, startDate, endDate);
      
           return searchTermMatches && dateRangeMatches;
          });
      
          if (filterResult.length > 0) {
           // Apply both date range and search filter
           setCustomerList(filterResult);
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

    // const generateExcel = async () => {
    //   try {
    //     const response = await axios.post(
    //       `http://localhost:8083/sys/Vendor/getvendorlist/${currentuser.storeid}`,
    //       null,
    //       {
    //         responseType: "blob", // Important: Response type as blob
    //       }
    //     );
  
    //     // Create a download link
    //     const blob = new Blob([response.data]);
    //     const url = URL.createObjectURL(blob);
    //     setDownloadLink(url);
    //   } catch (error) {
    //     console.error("Error generating Excel:", error);
    //   }
    // };
  


    const fetchDataByDateRange = () => {
      if (!startDate || !endDate) {
        // Display an error message if start date or end date is not selected
        toast.error("Please select both Start Date and End Date.");
        return; // Stop further processing
      }
  
      const url = `http://localhost:8083/sys/customer/getcustomer/${currentuser.storeid}`;
  
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
            const orderDate = new Date(item.dob);
            const itemDate = new Date(
              orderDate.getFullYear(),
              orderDate.getMonth(),
              orderDate.getDate()
            );
    
            const isAfterStartDate = !startDate || itemDate >= startDate;
            const isBeforeEndDate = !endDate || itemDate <= endDate;
    
            return isAfterStartDate && isBeforeEndDate;
          });
     
          setCustomerList(filteredData);
          setSerachApiData(json);
          setMsg("");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error fetching data. Please try again later.");
        });
    };
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(customerList.length / itemsPerPage);
  
    // Calculate the range of items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = customerList.slice(indexOfFirstItem, indexOfLastItem);
  
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
      };
    
      const handleKeyPress = (e) => {
       const key = e.key.toUpperCase();
       if (e.altKey && keyMappings[key]) {
          navigate(keyMappings[key]);
       }
      };
    
      window.addEventListener('keydown', handleKeyPress);
    
      return () => {
       window.removeEventListener('keydown', handleKeyPress);
      };
    }, [navigate]);


    const handleReset = () => {
      setStartDate(null);
      setEndDate(null);
      fetchData();
    };
      
    return (
      <div className="data animation">
        <div className="row rowleft1 " style={{ marginTop: "12vh" }}>
          <div
            style={{
              width: "97vw",
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
              marginBottom: "2vh",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
           
                       {downloadLink && (
                <a href={downloadLink} download="vendor.xlsx">
                  <i
                    class="fa-solid fa-download"
                    style={{ fontSize: "4vh", marginTop: "2vh" }}
                  ></i>{" "}
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
                  <a href={downloadLink} download="customer_data.pdf"></a>
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
                justifyContent: "space-between",
              }}
            >
              <h4
                className="text"
                style={{
                  color: "#000099",
                  fontSize: "4vh",
                  fontWeight: "bold",
                }}
              >
                {" "}
                <i
                  class="fa-solid fa-list"
                  style={{ color: "rgb(0, 0, 153" }}
                ></i>
                Customer
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
                placeholder=" &#128269; Search..."
                aria-label="Search"
                style={{
                  border: "1px solid #656262",
                  height: "3.9vh",
                  display: "flex",
                  alignItems: "center",
                  width: "30%",
                  marginTop: "7px",
                  fontSize: "1vw",
                }}
                value={FilterVal}
                onInput={(e) => handleFilter(e)}
              />
              <div
                className="rowleft66"
                style={{ fontSize: "2vh", display: "flex", marginTop: "7px" }}
              >
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
                    justifyContent: "center",
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
                  <i className="fas fa-times" style={{ fontSize: "2vh" }}></i>
                </button>
                {errorMessage && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}
              </div>
            </div>
          </div>
        </div>
  
        <div class="content read">
       
          <table>
            <thead style={{ position: "sticky", top: "0" }}>
              <tr>
                <th
                  scope="col"
                  class="text-center border"
                  style={{ fontSize: "2vh", borderTopLeftRadius: "10px" }}
                >
                  Sr.No
                </th>
                 <th
                  scope="col"
                  class="text-center border"
                  style={{ fontSize: "2vh" }}
                >
                  Customer Name
                </th>
                <th
                  scope="col"
                  class="text-center border"
                  style={{ fontSize: "2vh" }}
                >
                 Email
                </th>
                <th
                  scope="col"
                  class="text-center border"
                  style={{ fontSize: "2vh" }}
                >
                  Date Of Birth
                </th>
  
                <th
                  scope="col"
                  class="text-center border"
                  style={{ fontSize: "2vh" }}
                >
                  Contact Number
                </th>
                            
              </tr>
            </thead>
            {customerList.length === 0 ? ( // Check if the list is empty
          <div className="no-data-message"  style={{marginLeft:"25vh"}}>No Vendor data available.</div>
        ) : (
            <tbody className="tbodytr">
              {currentItems.map((v, index) => (
                <tr>
                  <td className="text-center px-2 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    v.customername
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                      <strong>{v.customername}</strong>
                    ) : (
                      v.customername
                    )}
                  </td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    v.email
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                      <strong>{v.email}</strong>
                    ) : (
                      v.email
                    )}
                  </td>
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    v.dob
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                      <strong>{v.dob}</strong>
                    ) : (
                      v.dob
                    )}
                  </td>
  
                  <td class="text-center px-2 border">
                    {typeof FilterVal === "string" &&
                    FilterVal !== "" &&
                    v.contact
                      .toLowerCase()
                      .includes(FilterVal.toLowerCase()) ? (
                      <strong>{v.contact}</strong>
                    ) : (
                      v.contact
                    )}
                  </td>
                    
                </tr>
              ))}
            </tbody>
               )}
          </table>
         
          <div
            className="container d-flex justify-content-end mt-5"
            style={{
              width: "80vw",
              maxWidth: "80vw",
              display: "flex",
              flexDirection: "row",
              alignItems: "end",
              justifyContent: "end",
            }}
          >
            <div className="pagination-container">
              <ul className="pagination">
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
                      fontSize: "1vw",
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
                      className={`page-item ${
                        currentPage === startPage + index ? "active" : ""
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
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
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
        />
      </div>
    );
  };