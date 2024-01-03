//////////////////pooja added new list all////////////////
import React, { useEffect, useState, useRef } from "react";
import paymentService from "../services/payment.service";
import billService from "../services/bill.service";
import ReactPrint from "react-to-print";
import invoiceService from "../services/invoice.service";
import vendorService from "../services/vendor.service";
import authService from "../services/auth.service";
import "./list.css";
import { Link, useNavigate, useParams } from "react-router-dom";
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
export const Vendor_list = () => {
  const currentuser = authService.getCurrentUser();
  const [vendorList, setVendorList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ref = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange,startDate,endDate]);
  const [msg, setMsg] = useState("");

  const init = () => {
    vendorService
      .getAllVendor()
      .then((res) => {
        // console.log(res.data);
        setVendorList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

    
  const fetchData = () => {
    const url = `http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`;

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
        //const todayBills = json.filter(item => item.createddate === json);
        setVendorList(json);
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

  const handleDeletedvendor = (serial_no) => {
    vendorService
      .deleteVendor(serial_no)
      .then((res) => {
        toast.success(" vendor Delete Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGeneratePDF = async () => {
    try {

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(`http://localhost:8083/sys/Payment/generate-pdf-payment/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      a.download = 'payment-details.pdf';
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  const handleFilter = (e) => {
    console.log('Filter value:', e.target.value);
    console.log('Search API Data:', searchApiData);
    
    if (e.target.value === '') {
        // No search term, apply only date range filter
        handleTimeRangeChange(selectedTimeRange);
        setErrorShown(false); // Reset the error display flag when the filter is cleared

    } else {
        const filterResult = searchApiData.filter((item) => {
         const searchTermMatches = (
            (item.vendor_name || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.vendor_address || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.bank_name || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.branch || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.upi_id || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.vendor_code || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.ifsc_code || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.account_no || '').toString().toLowerCase().includes(e.target.value.toLowerCase())

         );
    
         const dateRangeMatches = isDateInRange(item.created_date, startDate, endDate);
    
         return searchTermMatches && dateRangeMatches;
        });
    
        if (filterResult.length > 0) {
         // Apply both date range and search filter
         setVendorList(filterResult);
         
        } else {
         // No matching data found for search filter
         if (!errorShown) {
          toast.error("No matching data found.");
          setErrorShown(true); // Set the error display flag to true after showing the error once
       }
        }
    }
    setFilterVal(e.target.value);
    };


    const isDateInRange = (date, startDate, endDate) => {
      if (!date) {
          return false; // If there is no date information, exclude the item
      }
      
      const itemDate = new Date(date);
      
      if (!startDate || !endDate) {
          return true; // If no date range specified, include the item
      }
      
      return itemDate >= startDate && itemDate <= endDate;
      };

      const generateExcel = async () => {
        try {
          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);
      
          const response = await axios.post(
            `http://localhost:8083/sys/Payment/excelpayment/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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

  // Function to fetch data based on selected date range
  const fetchDataByDateRange = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both Start Date and End Date.");
      return;
    }
  
    const url = `http://localhost:8083/sys/Vendor/vendor/${currentuser.storeid}`;
  
    const startDateParam = startDate
      ? `startDate=${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
      : "";
    const endDateParam = endDate
      ? `endDate=${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
      : "";
  
    const queryParameters = [startDateParam, endDateParam]
      .filter((param) => param)
      .join("&");
    const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;
  
    console.log("Full URL:", fullUrl);
  
    fetch(fullUrl)
      .then((response) => response.json())
      .then((json) => {
        const filteredData = json.filter((item) => {
          const orderDate = new Date(item.created_date);
          const itemDate = new Date(
            orderDate.getFullYear(),
            orderDate.getMonth(),
            orderDate.getDate()
          );
  
          const isAfterStartDate = !startDate || itemDate >= startDate;
          const isBeforeEndDate = !endDate || itemDate <= endDate;
  
          return isAfterStartDate && isBeforeEndDate;
        });
  
        console.log("Filtered Data:", filteredData);
  
        setVendorList(filteredData);
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
  const totalPages = Math.ceil(vendorList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vendorList.slice(indexOfFirstItem, indexOfLastItem);

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
  const allItemsSelected = vendorList.length === updatedSelectedItems.length;
  
  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
  };
  
  // Handle "Select All" checkbox state changes
  const handleSelectAll = () => {
  if (selectAllChecked) {
       setSelectedItems([]);
  } else {
       setSelectedItems(vendorList.map((item) => item.serial_no));
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

const handleMultiDeletedvendor = (serialNo) => {
    
    // After deleting the specific item, update selectedItems and showAlerts
    const updatedSelectedItems = selectedItems.filter(item => item.serial_no !== serialNo);
    const updatedShowAlerts = { ...showAlerts, [serialNo]: false };

    // Update state to reflect the changes
    setSelectedItems(updatedSelectedItems);
    setShowAlerts(updatedShowAlerts);

    for (const id of selectedItems) {
         handleDeletedvendor(id);
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
          {selectedItems.length > 0 && (
        <button
          onClick={handleMultiDelete}
          className="btn btn-danger"  style={{ alignContent: "center", justifyContent: "center", fontSize: "2vh", display: "flex", flexDirection: "row", alignItems: "center", height:"6vh",marginRight:"2vh" }}
        >
          Delete Selected
        </button>
      )}

{showAlerts[vendor.serial_no] && (
                     <div className="overlay">
                        <div className="alert alert2 alert-success font-weight-bold center-popup">
                         <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedvendor(vendor.serial_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [vendor.serial_no]: false,
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
              title="Add new vendor"
              style={{
                fontSize: "2vh",
                height: "6vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i class="fas fa-plus"></i>
              <a href="/vendor" className="btn-outline-primary">
                Vendor
              </a>
            </button>

            <button
              onClick={generateExcel}
              className="btn btn-outline-primary"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}
            >
              Excel
            </button>
            {downloadLink && (
              <a href={downloadLink} download="vendor.xlsx">
                <i
                  class="fa-solid fa-download"
                  style={{ fontSize: "4vh", marginTop: "2vh" }}
                ></i>{" "}
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
                <a href={downloadLink} download="vendor_data.pdf"></a>
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
              Vendor
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
                class="text-center px-2 border"
                style={{ fontSize: "2vh", borderTopLeftRadius: "10px" }}
              >
                Sr.No
              </th>
             
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                Vendor Name
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                Vendor Code
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                Vendor Address
              </th>

              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                Bank Name
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                Branch
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                Account No
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                IFSC Code
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh" }}
              >
                UPI ID
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ fontSize: "2vh"}}
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
          {vendorList.length === 0 ? ( // Check if the list is empty
        <div className="no-data-message"  style={{marginLeft:"25vh"}}>No Vendor data available.</div>
      ) : (
          <tbody className="tbodytr">
            {currentItems.map((v, index) => (
              <tr>
                <td className="text-center px-2 border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                <td className="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                    FilterVal.length >= 3 && FilterVal.length <= 50 &&
                    FilterVal !== "" &&
                    v.vendor_name.length >= 3 && v.vendor_name.length <= 50 &&
                    v.vendor_name.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                      <strong>{v.vendor_name}</strong>
                    ) : (
                      v.vendor_name
                    )}
                </td>

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.vendor_code
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.vendor_code}</strong>
                  ) : (
                    v.vendor_code
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.vendor_address
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.vendor_address}</strong>
                  ) : (
                    v.vendor_address
                  )}
                </td>

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.bank_name
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.bank_name}</strong>
                  ) : (
                    v.bank_name
                  )}
                </td>
                <td class="text-center px-2 border">
                  {" "}
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.branch.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.branch}</strong>
                  ) : (
                    v.branch
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.account_no
                    .toString()
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.account_no}</strong>
                  ) : (
                    v.account_no
                  )}
                </td>

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.ifsc_code
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.ifsc_code}</strong>
                  ) : (
                    v.ifsc_code
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  v.upi_id
                    .toString()
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{v.upi_id}</strong>
                  ) : (
                    v.upi_id
                  )}
                </td>

                <td
                  class="actions"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [v.serial_no]: true,
                      })
                    }
                    style={{
                      fontSize: "2vh",
                      width: "4.8vh", // Set the desired width
                      height: "4.8vh", // Set the desired height
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "2vh",
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                  {showAlerts[v.serial_no] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => handleDeletedvendor(v.serial_no)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [v.serial_no]: false,
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
                    to={`/vendor/update_vendor/${v.serial_no}`}
                    title="edit vendor"
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
                  onChange={() => handleSelectItem(v.serial_no)}
                  checked={selectedItems.includes(v.serial_no)}
                />
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

//Date Filter Applied By Neha To Payment List
//payment list
export const Payment_list = () => {
  const currentuser = authService.getCurrentUser();
  const [paymentList, setPaymentList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const ref = useRef();
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [payment, setPayment] = useState([]);
  const [errorShown, setErrorShown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange,startDate,endDate]);

  const [msg, setMsg] = useState("");
  const init = () => {
    paymentService
      .getPayment()
      .then((res) => {
        console.log(res.data);
        setPaymentList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    const url = `http://localhost:8083/sys/Payment/payments/${currentuser.storeid}`;

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
        
        setPaymentList(json);
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


  const deletePayment = (serial_no) => {
    paymentService
      .deletePayment(serial_no)
      .then((res) => {
        toast.success(" Payment Delete Successfully");
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
    console.log('Filter value:', e.target.value);
    console.log('Search API Data:', searchApiData);
    
    if (e.target.value === '') {
        // No search term, apply only date range filter
        handleTimeRangeChange(selectedTimeRange);
        setErrorShown(false); // Reset the error display flag when the filter is cleared

    } else {
        const filterResult = searchApiData.filter((item) => {
         const searchTermMatches = (
            (item.vendor_name || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.payment_mode || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.bank_name || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.branch || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.payment_status || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.ifsc_code || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.account_no || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.payment_date || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.due_date || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.total || '').toString().toLowerCase().includes(e.target.value.toLowerCase())

         );
    
         const dateRangeMatches = isDateInRange(item.create_date, startDate, endDate);
    
         return searchTermMatches && dateRangeMatches;
        });
    
        if (filterResult.length > 0) {
         // Apply both date range and search filter
         setPaymentList(filterResult);
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
      if (!date) {
          return false; // If there is no date information, exclude the item
      }
      
      const itemDate = new Date(date);
      
      if (!startDate || !endDate) {
          return true; // If no date range specified, include the item
      }
      
      return itemDate >= startDate && itemDate <= endDate;
      };

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      };
      

  const [downloadLink, setDownloadLink] = useState(null);

  const generateExcel = async () => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(
        `http://localhost:8083/sys/Payment/excelpayment/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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

  const handleGeneratePDF = async () => {
    try {

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(`http://localhost:8083/sys/Payment/generate-pdf-payment/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      a.download = 'payment-details.pdf';
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


 

  // Function to fetch data based on selected date range
const fetchDataByDateRange = () => {
  if (!startDate || !endDate) {
    // Display an error message if start date or end date is not selected
    toast.error("Please select both Start Date and End Date.");
    return; // Stop further processing
  }

  const url = `http://localhost:8083/sys/Payment/payments/${currentuser.storeid}`;

  // You can append the start date and end date as query parameters to the URL
  const startDateParam = startDate
    ? `startDate=${startDate.toISOString().split("T")[0]}`
    : "";
  const endDateParam = endDate ? `endDate=${endDate.toISOString().split("T")[0]}` : "";

  const queryParameters = [startDateParam, endDateParam].filter((param) => param).join("&");
  const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;

  console.log("Full URL:", fullUrl); // Debugging log

  fetch(fullUrl)
    .then((response) => response.json())
    .then((json) => {
      const filteredData = json.filter((item) => {
       
        const orderPaymentDate = new Date(item.payment_date);
        const createDate = new Date(item.create_date);


        const paymentDate = new Date(
          orderPaymentDate.getFullYear(),
          orderPaymentDate.getMonth(),
          orderPaymentDate.getDate()
        );

        const createdDate = new Date(
          createDate.getFullYear(),
          createDate.getMonth(),
          createDate.getDate()
        );

        const isAfterStartDate = !startDate || paymentDate >= startDate || createdDate >= startDate ;
        const isBeforeEndDate = !endDate || paymentDate <= endDate  || createdDate <= endDate;

        return isAfterStartDate && isBeforeEndDate;
      });

      console.log("Filtered Data:", filteredData);

      setPaymentList(filteredData);
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
  const totalPages = Math.ceil(paymentList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paymentList.slice(indexOfFirstItem, indexOfLastItem);

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
  const [checkboxes, setCheckboxes] = useState(new Array(10).fill(false));

  const runningOrderStyle = {
    color: '#ffc107',
   
  };

  const completedOrderStyle = {
    color: '#28a745',
   
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
  const allItemsSelected = paymentList.length === updatedSelectedItems.length;
  
  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
  };
  
  // Handle "Select All" checkbox state changes
  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedItems([]);
    } else {
      // Select the first 10 items
      const first10Items = paymentList.slice(0, 10).map((item) => item.serial_no);
      setSelectedItems(first10Items);
    }
  
    setSelectAllChecked(!selectAllChecked);
  };
  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];

    // Check if the number of selected checkboxes is more than 10
    if (newCheckboxes.filter((isChecked) => isChecked).length <= 10) {
      setCheckboxes(newCheckboxes);
      setSelectAllChecked(newCheckboxes.every((isChecked) => isChecked));
    }
  };  

 
  const handleMultiDelete = () => {
    // Show confirmation pop-ups for each selected item
    const updatedShowAlerts = {};
    selectedItems.forEach(item => {
     updatedShowAlerts[item.serial_no] = true;
    });
    setShowAlerts(updatedShowAlerts);

};

const handleMultiDeletedpayment = () => {
  // Iterate over selected items and delete each one
  for (const serialNo of selectedItems) {
    deletePayment(serialNo);
  }

  // Clear selected items and hide confirmation pop-ups
  setSelectedItems([]);
  setShowAlerts({});
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
    <div className="data animation" >
      <div className="row rowleft2 ">
        <div
          style={{
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            marginBottom: "2vh",
            marginTop: "12vh",
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
      {showAlerts[payment.serial_no] && (
                     <div className="overlay">
                        <div className="alert alert2 alert-success font-weight-bold center-popup">
                         <h6 className="mb-2" st yle={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedpayment(payment.serial_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [payment.serial_no]: false,
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
              title="Add new payment"
              style={{
                fontSize: "2vh",
                height: "6vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i class="fas fa-plus" style={{ marginRight: "5px" }}></i>
              <a href="/payment" className="btn-outline-primary">
                Payment
              </a>
            </button>

            <button
              onClick={generateExcel}
              className="btn btn-outline-primary"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}
            >
              Excel
            </button>
            {downloadLink && (
              <a href={downloadLink} download="payment.xlsx">
                <i
                  class="fa-solid fa-download"
                  style={{ fontSize: "4vh", marginTop: "2vh" }}
                ></i>
              </a>
            )}

            <button
              onClick={handleGeneratePDF}
              className=" btn btn-outline-primary"
              title="Download PDF"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}
            >
              {downloadLink && (
                <a href={downloadLink} download="payment_data.pdf"></a>
              )}
              PDF
            </button>
          </div>
        </div>

        <div className="rowleft2">
          <div
            className="card-header fs-3 "
            style={{
              width: "",
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
              Payment
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
                marginTop: "7px",
                fontSize: "1vw",
              }}
              value={FilterVal}
              onInput={(e) => handleFilter(e)}
            />

            <div
              className="rowleft66"
              style={{
                fontSize: "2vh",
                display: "flex",
                marginTop: "7px",
              }}
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

      <div class="content read" style={{ width: "50vw" }}>
      
        <table>
          <thead style={{ position: "sticky", top: "0" }}>
            <tr>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ borderTopLeftRadius: "10px" }}
              >
                Sr.No
              </th>
                            <th scope="col" class="text-center px-2 border">
                Vendor Name
              </th>
              <th scope="col" class="text-center px-2 border">
                Payment Mode
              </th>
              <th scope="col" class="text-center px-2 border">
                Payment Status
              </th>
              <th scope="col" class="text-center px-2 border">
                Payment Date
              </th>
              <th scope="col" class="text-center px-2 border">
                Due Date
              </th>
              <th scope="col" class="text-center px-2 border">
                Bank Name
              </th>
              <th scope="col" class="text-center px-2 border">
                Branch
              </th>
              <th scope="col" class="text-center px-2 border">
                Acoount No
              </th>
              <th scope="col" class="text-center px-2 border">
                IFSC Code
              </th>
               <th scope="col" class="text-center px-2 border">
                Total {currentuser.currency}
              </th>
              <th scope="col" class="text-center px-1 border">
                Action
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ borderTopRightRadius: "10px" }}
              >
                Payment
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
          {paymentList.length === 0 ? ( // Check if the list is empty
        <div className="no-data-message"  style={{marginLeft:"15vh"}}>No Payment data available.</div>
      ) : (
          <tbody className="tbodytr">
            {currentItems.map((p, index) => (
              <tr>
                {/* <th class="text-center px-2 border">{index + 1}</th> */}
                <td className="text-center px-2 border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="text-center px-2 border">
  {typeof FilterVal === "string" &&
    FilterVal.length === 3 &&
    p.vendor_name.length === 3 &&
    FilterVal.toLowerCase() === p.vendor_name.toLowerCase() ? (
      <strong>{p.vendor_name}</strong>
    ) : (
      p.vendor_name
    )}
</td>

                 <td class="text-center px-2 border">
                  {" "}
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  p.payment_mode
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{p.payment_mode}</strong>
                  ) : (
                    p.payment_mode
                  )}
                </td>
               
                <td class="text-center px-2 border" style={{
                              color:
                                p.payment_status.toLowerCase() === "pending"
                                  ? runningOrderStyle.color
                                  : p.payment_status.toLowerCase() === "completed"
                                    ? completedOrderStyle.color
                                    : "inherit",
                             
                              fontSize: "3vh"

                            }}>
                  {" "}
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  p.payment_status
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{p.payment_status}</strong>
                  ) : (
                    p.payment_status
                  )}
                </td>
                 

                <td class="text-center px-2 border">
                  {" "}
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  p.payment_date.toString().toLowerCase().includes(FilterVal.toLowerCase()) ? (
                    <strong>{p.payment_date}</strong>
                  ) : (
                    p.payment_date
                  )}
                </td>

                <td class="text-center px-2 border">
                {p.due_date}
                </td>
               
                <td class="text-center px-2 border">
                {p.bank_name}
                </td>
              
                <td class="text-center px-2 border">
                {p.branch}
                </td>
                   
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  p.account_no.toString()
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{p.account_no}</strong>
                  ) : (
                    p.account_no
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  p.ifsc_code.toString().toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{p.ifsc_code}</strong>
                  ) : (
                    p.ifsc_code
                  )}
                </td>
               
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  p.total
                    .toString()
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{p.total}</strong>
                  ) : (
                    p.total
                  )}
                </td>

                <td
                  class="actions"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() =>
                      setShowAlerts({
                        ...showAlerts,
                        [p.serial_no]: true,
                      })
                    }
                    style={{
                      fontSize: "2vh",
                      width: "4.8vh", // Set the desired width
                      height: "4.8vh", // Set the desired height
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "2vh",
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                  {showAlerts[p.serial_no] && (
                    <div className="overlay">
                      <div className="alert alert2 alert-success font-weight-bold center-popup">
                        <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                          Are you sure you want to delete{" "}
                          <i className="fa-solid fa-question"></i>
                        </h6>
                        <div style={{ marginTop: "4vh" }}>
                          <button
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => deletePayment(p.serial_no)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              setShowAlerts({
                                ...showAlerts,
                                [p.serial_no]: false,
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
                    to={`/payment/update_payment/${p.serial_no}`}
                    title="edit payment"
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

                <td
style={{
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: "0px 30px",
}}
>
{p.payment_status !== "completed" ? (
    <Link
     className=""
     to={`/payment/payment_gateway/${p.serial_no}`}
     title="make payment"
     style={{
        textAlign: "center",
        marginRight: "2vh", // Set the desired space between buttons
     }}
    >
     <button
        className="btn btn-outline-primary"
        style={{
         fontSize: "2vh",
         width: "4.8vh", // Set the desired width
         height: "4.8vh", // Set the desired height
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
        }}
     >
        <i class="fa fa-credit-card" style={{ fontSize: "3vh" }}></i>
     </button>
    </Link>
) : (
    <button
     className="btn btn-outline-primary"
     style={{
        fontSize: "2vh",
        width: "4.8vh",
        height: "4.8vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
     }}
     disabled
    >
     <i class="fa fa-credit-card" style={{ fontSize: "3vh" }}></i>
    </button>
)}
</td>

                <td className="text-center px-2 border">
                <input
                  type="checkbox"
                  style={{ width: '3vw', height: '3vh' }}
                  onChange={() => handleSelectItem(p.serial_no)}
                  checked={selectedItems.includes(p.serial_no)}
                />
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
        style={{ marginTop: "20vh" }}
      />
    </div>
  );
};

//Date Filter Applied By Neha To Vendor Invoice List
//Vendor Inventory List
export const Vendor_Invoice_List = () => {
  const currentuser = authService.getCurrentUser();
  const [vendorInvoice, setVendorInvoice] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const ref = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlerts, setShowAlerts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [errorShown, setErrorShown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange,startDate,endDate]);

  const [msg, setMsg] = useState("");

  const init = () => {
    invoiceService
      .getVendorInvoice()
      .then((res) => {
        // console.log(res.data);
        setVendorInvoice(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    const url = `http://localhost:8083/sys/VendorInvoice/invoices/${currentuser.storeid}`;

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
        setVendorInvoice(json);
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


  const deleteVendorInvoice = (invoice_id) => {
    invoiceService
      .deleteVendorInvoice(invoice_id)
      .then((res) => {
        toast.success("Vendor Inventory Delete Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // setMsg("Delete Successfully ");
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleFilter = (e) => {
    console.log('Filter value:', e.target.value);
    console.log('Search API Data:', searchApiData);
    
    if (e.target.value === '') {
        // No search term, apply only date range filter
        handleTimeRangeChange(selectedTimeRange);
        setErrorShown(false); // Reset the error display flag when the filter is cleared

    } else {
        const filterResult = searchApiData.filter((item) => {
         const searchTermMatches = (
            (item.vendor_name || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.inventory_code || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.quantity || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.price || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.total || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.unit || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.discount || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) 

         );
    
         const dateRangeMatches = isDateInRange(item.create_date, startDate, endDate);
    
         return searchTermMatches && dateRangeMatches;
        });
    
        if (filterResult.length > 0) {
         // Apply both date range and search filter
         setVendorInvoice(filterResult);
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
      if (!date) {
          return false; // If there is no date information, exclude the item
      }
      
      const itemDate = new Date(date);
      
      if (!startDate || !endDate) {
          return true; // If no date range specified, include the item
      }
      
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
  
      const response = await axios.post(`http://localhost:8083/sys/VendorInvoice/generate-pdf-invoice/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      a.download = 'payment-details.pdf';
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




  const generateExcel = async () => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(
        `http://localhost:8083/sys/VendorInvoice/excelinvoicedate/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
  // Function to fetch data based on selected date range
  const fetchDataByDateRange = () => {
    if (!startDate || !endDate) {
      // Display an error message if start date or end date is not selected
      toast.error("Please select both Start Date and End Date.");
      return; // Stop further processing
    }

    const url = `http://localhost:8083/sys/VendorInvoice/invoices/${currentuser.storeid}`;

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
          const orderDate = new Date(item.invoice_date);
          const itemDate = new Date(
            orderDate.getFullYear(),
            orderDate.getMonth(),
            orderDate.getDate()
          );
  
          const isAfterStartDate = !startDate || itemDate >= startDate;
          const isBeforeEndDate = !endDate || itemDate <= endDate;
  
          return isAfterStartDate && isBeforeEndDate;
        });
  
        console.log("Filtered Data:", filteredData);
  
        setVendorInvoice(filteredData);
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
  const totalPages = Math.ceil(vendorInvoice.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vendorInvoice.slice(indexOfFirstItem, indexOfLastItem);

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
    const [checkboxes, setCheckboxes] = useState(new Array(10).fill(false));


// Handle checkbox state changes for individual items
const handleSelectItem = (serial_no) => {
  const updatedSelectedItems = [...selectedItems];
  
  if (updatedSelectedItems.includes(serial_no)) {
       updatedSelectedItems.splice(updatedSelectedItems.indexOf(serial_no), 1);
  } else {
       updatedSelectedItems.push(serial_no);
  }
  
  // Check if all items are selected
  const allItemsSelected = vendorInvoice.length === updatedSelectedItems.length;
  
  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
  };
  
  // Handle "Select All" checkbox state changes
  const handleSelectAll = () => {
  if (selectAllChecked) {
       setSelectedItems([]);
  } else {
       setSelectedItems(vendorInvoice.map((item) => item.serial_no));
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

const handleMultiDeletedInvoice = () => {
    // Copy the array of selected items to avoid mutating state directly
    const updatedSelectedItems = [...selectedItems];

    // Iterate through the selected items and update showAlerts
    const updatedShowAlerts = { ...showAlerts };
    for (const serialNo of updatedSelectedItems) {
     // Assuming showAlerts has a property for each serialNo
     updatedShowAlerts[serialNo] = false;

     // Perform deletion logic for the specific item (serialNo)
     // ... Your deletion logic here ...
    }
    for (const id of selectedItems) {
     deleteVendorInvoice(id);
}
    // Update state to reflect the changes
    setSelectedItems([]);
    setShowAlerts(updatedShowAlerts);
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
      <div className="row rowleft3" style={{ marginTop: "8vh" }}>
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
          {selectedItems.length > 0 && (
        <button
          onClick={handleMultiDelete}
          className="btn btn-danger" style={{ alignContent: "center", justifyContent: "center", fontSize: "2vh", display: "flex", flexDirection: "row", alignItems: "center", height:"6vh",marginRight:"2vh" }}
        >
          Delete Selected
        </button>
      )}
      {showAlerts[invoice.serial_no] && (
                     <div className="overlay">
                        <div className="alert alert2 alert-success font-weight-bold center-popup">
                         <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedInvoice(invoice.serial_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [invoice.serial_no]: false,
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
              title="Add new vendor inventory"
              style={{
                height: "6vh",
                display: "flex",
                alignItems: "center",
                fontSize: "2vh",
              }}
            >
              <i class="fas fa-plus"></i>
              <a href="/VendorInventory" className="btn-outline-primary">
                Vendor Inventory
              </a>
            </button>

            <button
              onClick={generateExcel}
              className="btn btn-outline-primary"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}
            >
              Excel
            </button>
            {downloadLink && (
              <a href={downloadLink} download="vendor_inventory.xlsx">
                <i
                  class="fa-solid fa-download"
                  style={{ fontSize: "4vh", marginTop: "2vh" }}
                ></i>
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
                <a href={downloadLink} download="vendor_inventory_data.pdf"></a>
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
              Vendor Inventory
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
              placeholder="&#128269;Search..."
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
              style={{
                fontSize: "2vh",
                display: "flex",
                marginTop: "7px",
              }}
            >
              <span style={{ marginLeft: "5px" }}></span>
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
                class="text-center px-2 border"
                style={{ borderTopLeftRadius: "10px" }}
              >
                Sr.NO
              </th>
             
              <th scope="col" class="text-center px-2 border">
                Vendor Name
              </th>
              <th scope="col" class="text-center px-2 border">
                Inventory Code
              </th>
              <th scope="col" class="text-center px-2 border">
                Item Name
              </th>
             
              <th scope="col" class="text-center px-2 border">
                Quantity
              </th>

              <th scope="col" class="text-center px-2 border">
                Price {currentuser.currency}
              </th>

              <th scope="col" class="text-center px-2 border">
                Unit
              </th>
              <th scope="col" class="text-center px-2 border">
                Discount(%)
              </th>
              <th scope="col" class="text-center px-2 border">
                Total
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
          {vendorInvoice.length === 0 ? ( // Check if the list is empty
        <div className="no-data-message" style={{marginLeft:"20vh"}}>No inventory Inventory data available.</div>
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
                  i.vendor_name
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{i.vendor_name}</strong>
                  ) : (
                    i.vendor_name
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
                  i.item_name
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{i.item_name}</strong>
                  ) : (
                    i.item_name
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
                  i.unit
                    .toString()
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{i.unit}</strong>
                  ) : (
                    i.unit
                  )}
                </td>
                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  i.discount
                    .toString()
                    .toLowerCase()
                    .includes(FilterVal.toLowerCase()) ? (
                    <strong>{i.discount}</strong>
                  ) : (
                    i.discount
                  )}
                </td>

                <td class="text-center px-2 border">
                  {typeof FilterVal === "string" &&
                  FilterVal !== "" &&
                  i.total.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                    <strong>{i.total}</strong>
                  ) : (
                    i.total
                  )}
                </td>
                <td
                  class="actions"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
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
                      marginRight: "2vh",
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
                            onClick={() => deleteVendorInvoice(i.serial_no)}
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
                    to={`/vendorInventory/Update_VendorInventory/${i.serial_no}`}
                    title="edit"
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
                  onChange={() => handleSelectItem(i.serial_no)}
                  checked={selectedItems.includes(i.serial_no)}
                />
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
        style={{ marginTop: "20vh" }}
      />
    </div>
  );
};

/*------------------------CHANGES MADE BY Neha--------------------------*/
/*-------------------------Balance List---------------------------*/

export const Balance_list = () => {
  const currentuser = authService.getCurrentUser();
  const [balanceList, setBalanceList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [cashTotalsByDate, setCashTotalsByDate] = useState({});
  const [cardTotalsByDate, setCardTotalsByDate] = useState({});
  const [upiTotalsByDate, setupiTotalsByDate] = useState({});
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [toggleShowAllBills, settoggleShowAllBills] = useState(1);
  const [showAllBalance, setshowAllBalance] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [generateExcel, setgenerateExcel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cashTotals, setCashTotals] = useState([]); //Neha's code
  const [cardTotals, setCardTotals] = useState([]); //Neha's code
  const [upiTotals, setUpiTotals] = useState([]); //Neha's code
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    // Fetch blance list from the backend API when the component mounts
    fetchBalanceList();
    fetchTransactionData(); // Fetch transaction data
    fetchPaymentData(); // Fetch payment data
  }, [selectedTimeRange,startDate,endDate]);

  const [msg, setMsg] = useState("");
  const fetchBalanceList = () => {
    const url = `http://localhost:8083/sys/api/balance/balance/${currentuser.storeid}`;

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
        setBalanceList(json);
        console.log(json);
        setSerachApiData(json);
      });
  };

  const fetchTransactionData = (date) => {
    const apiUrl = `http://localhost:8083/sys/transaction/transaction/${currentuser.storeid}`;
    //const apiUrl = `http://localhost:8083/sys/transaction/transactions-by-date?date=${date}`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Transaction Data from API:", data); // Debugging
        setTransaction(data);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  };
  console.log("Transaction:", transaction); // Add this line to check the transaction state

  /*------------------------CHANGES MADE BY Neha--------------------------*/
  /*------------------------------THIS METHOD IS USE FOR FETCH CASH TOTAL--------------------------------------------*/
  useEffect(() => {
    // Fetch cash payment data when the component mounts
    fetchPaymentData();
    fetchCashTotalData(); //Neha's code
    fetchCardTotalData(); //Neha's code
    fetchUpiTotalData(); //Neha's code
  }, []);


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
  const fetchPaymentData = () => {
    // Fetch cash payment data
    fetch(`http://localhost:8083/sys/Bill/daily-cash-balance-report`)
      .then((cashResponse) => cashResponse.json())
      .then((cashData) => {
        console.log("Cash Payment Data:", cashData);

        if (Array.isArray(cashData) && cashData.length > 0) {
          // Create an object to store cash totals by date
          const cashTotals = {};

          // Loop through cashData and calculate the total for each date
          cashData.forEach((item) => {
            const date = item.billdate;
            const total = item.total;

            // If the date doesn't exist in cashTotals, initialize it to 0
            if (!cashTotals[date]) {
              cashTotals[date] = 0;
            }
            // Add the total to the corresponding date
            cashTotals[date] += total;
          });
          // Set the cash totals in state
          setCashTotalsByDate(cashTotals);
        }
      })
      .catch((error) => {
        console.error("Error fetching cash payment data: ", error);
      });

    // Fetch card payment data
    fetch(`http://localhost:8083/sys/Bill/daily-card-balance-report`)
      .then((cardResponse) => cardResponse.json())
      .then((cardData) => {
        console.log("Card Payment Data:", cardData);

        if (Array.isArray(cardData) && cardData.length > 0) {
          // Create an object to store cash totals by date
          const cardTotals = {};

          // Loop through cashData and calculate the total for each date
          cardData.forEach((item) => {
            const date = item.billdate;
            const total = item.total;

            // If the date doesn't exist in cashTotals, initialize it to 0
            if (!cardTotals[date]) {
              cardTotals[date] = 0;
            }

            // Add the total to the corresponding date
            cardTotals[date] += total;
          });

          // Set the cash totals in state
          setCardTotalsByDate(cardTotals);
        }
      })
      .catch((error) => {
        console.error("Error fetching card payment data: ", error);
      });

    /*------------------------------THIS METHOD IS USE FOR FETCH UPI TOTAL--------------------------------------------*/

    fetch(`http://localhost:8083/sys/Bill/daily-upi-balance-report`)
      .then((upiResponse) => upiResponse.json())
      .then((upiData) => {
        console.log("upi Payment Data:", upiData);

        if (Array.isArray(upiData) && upiData.length > 0) {
          // Create an object to store cash totals by date
          const upiTotals = {};

          // Loop through cashData and calculate the total for each date
          upiData.forEach((item) => {
            const date = item.billdate;
            const total = item.total;

            // If the date doesn't exist in cashTotals, initialize it to 0
            if (!upiTotals[date]) {
              upiTotals[date] = 0;
            }

            // Add the total to the corresponding date
            upiTotals[date] += total;
          });

          // Set the cash totals in state
          setupiTotalsByDate(upiTotals);
        }
      })
      .catch((error) => {
        console.error("Error fetching upi payment data: ", error);
      });
  };



  const handleFilter = (e) => {
    console.log('Filter value:', e.target.value);
    console.log('Search API Data:', searchApiData);
    
    if (e.target.value === '') {
        // No search term, apply only date range filter
        handleTimeRangeChange(selectedTimeRange);
        setErrorShown(false); // Reset the error display flag when the filter is cleared

    } else {
        const filterResult = searchApiData.filter((item) => {
         const searchTermMatches = (
            (item.remaining_Balance || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.final_handed_over_to || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.price || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.todays_opening_Balance || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.date || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
            (item.final_amount || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) 
           
         );
    
         const dateRangeMatches = isDateInRange(item.date, startDate, endDate);
    
         return searchTermMatches && dateRangeMatches;
        });
    
        if (filterResult.length > 0) {
         // Apply both date range and search filter
         setBalanceList(filterResult);
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
    
  
  const reversedBalanceList = [...balanceList].reverse();

  /*------------------------CHANGES MADE BY Neha--------------------------*/
  const getExpenseAmountForDate = (date) => {
    const filteredTransactions = transaction.filter(
      (trans) => trans.date === date
    );

    const expenseList = filteredTransactions.map((trans, index) => {
      return `${index + 1}. ${trans.expense}`;
    });

    const amountList = filteredTransactions.map((trans, index) => {
      return `${index + 1}. ${trans.amount}`;
    });

    const statusList = filteredTransactions.map((trans, index) => {
      return `${index + 1}. ${trans.status}`;
    });


    const expense = expenseList.join("\n");
    const amount = amountList.join("\n");
    const status = statusList.join("\n");

    return { expense, amount,status };
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(reversedBalanceList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reversedBalanceList.slice(indexOfFirstItem, indexOfLastItem);

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

  // Function to fetch data based on selected date range
  const fetchDataByDateRange = () => {
    if (!startDate || !endDate) {
      // Display an error message if start date or end date is not selected
      toast.error("Please select both Start Date and End Date.");
      return; // Stop further processing
    }

    const url = `http://localhost:8083/sys/api/balance/balance/${currentuser.storeid}`;

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
          const orderDate = new Date(item.date);
          const itemDate = new Date(
            orderDate.getFullYear(),
            orderDate.getMonth(),
            orderDate.getDate()
          );
  
          const isAfterStartDate = !startDate || itemDate >= startDate;
          const isBeforeEndDate = !endDate || itemDate <= endDate;
  
          return isAfterStartDate && isBeforeEndDate;
        });
  
        console.log("Filtered Data:", filteredData);
  
        setBalanceList(filteredData);
         setMsg("");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error fetching data. Please try again later.");
      });
  };

  // ------------------------Neha's code Start-----------------

  const fetchCashTotalData = () => {
    fetch(
      `http://localhost:8083/sys/Bill/daily-cash-balance-report/${currentuser.storeid}`
    )
      .then((response) => response.json())
      .then((json) => {
        setCashTotals(json);
        console.log(json);
      });
  };
  console.log(balanceList);
  console.log(cashTotals);
  console.log(cashTotals);

  const fetchCardTotalData = () => {
    fetch(
      `http://localhost:8083/sys/Bill/daily-card-balance-report/${currentuser.storeid}`
    )
      .then((response) => response.json())
      .then((json) => {
        setCardTotals(json);
        console.log(json);
      });
  };

  const fetchUpiTotalData = () => {
    fetch(
      `http://localhost:8083/sys/Bill/daily-upi-balance-report/${currentuser.storeid}`
    )
      .then((response) => response.json())
      .then((json) => {
        setUpiTotals(json);
        console.log(json);
      });
  };


  // Loop through the cashTotals array and extract total values for each date
  const cashTotalValues = cashTotals.map((item) => ({
    date: item.billdate,
    total: item.total,
  }));

 

  // Loop through the cashTotals array and extract total values for each date
  const cardTotalValues = cardTotals.map((item) => ({
    date: item.billdate,
    total: item.total,
  }));

 
  // Loop through the cashTotals array and extract total values for each date
  const upiTotalValues = upiTotals.map((item) => ({
    date: item.billdate,
    total: item.total,
  }));

 

  // ----------------------------------------Neha's code ends here --------------------------------

  const fetchData = () => {
    fetch(
      `http://localhost:8083/sys/api/balance/balance/${currentuser.storeid}`
    )
      .then((response) => response.json())
      .then((json) => {
        setBalanceList(json);
        setSerachApiData(json);
      });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  const generatePDF = async () => {
    try {
     // Fetch data from the first API URL
     const balanceResponse = await axios.get(
        `http://localhost:8083/sys/api/balance/balance/${currentuser.storeid}`
     );
     const balanceData = balanceResponse.data;

     // Fetch data from the second API URL
     const transactionsResponse = await axios.get(
        `http://localhost:8083/sys/transaction/all-transactions`
     );
     const transactionData = transactionsResponse.data;

     // Fetch data from the third API URL
     const dailyCashBalanceResponse = await axios.get(
        `http://localhost:8083/sys/Bill/daily-cash-balance-report/${currentuser.storeid}`
     );
     const dailyCashBalanceData = dailyCashBalanceResponse.data;

     // Fetch data from the fourth API URL
     const dailyCardBalanceResponse = await axios.get(
        `http://localhost:8083/sys/Bill/daily-card-balance-report/${currentuser.storeid}`
     );
     const dailyCardBalanceData = dailyCardBalanceResponse.data;

     // Fetch data from the fifth API URL
     const dailyUpiBalanceResponse = await axios.get(
        `http://localhost:8083/sys/Bill/daily-upi-balance-report/${currentuser.storeid}`
     );
     const dailyUpiBalanceData = dailyUpiBalanceResponse.data;

     // Generate the PDF content using fetched data
     const pdfContent = (
        <Document>
         <Page size="A4">
            <View style={styles.page}>
             {balanceData.map((balanceItem, index) => {
                const correspondingTransactions = transactionData.filter(
                 (transaction) => transaction.date === balanceItem.date
                );
                const correspondingCashBalance = dailyCashBalanceData.find(
                 (cashBalance) => cashBalance.billdate === balanceItem.date
                );
                const correspondingCardBalance = dailyCardBalanceData.find(
                 (cardBalance) => cardBalance.billdate === balanceItem.date
                );
                const correspondingUpiBalance = dailyUpiBalanceData.find(
                 (upiBalance) => upiBalance.billdate === balanceItem.date
                );

                return (
                 <View key={index} style={styles.vendorContainer}>
                    <Text style={styles.vendorName}>
                     Date: {balanceItem.date}
                    </Text>
                    <Text style={styles.vendorName}>
                     Opening Balance: {balanceItem.todays_opening_Balance}
                    </Text>
                    <Text style={styles.vendorName}>
                     Remaining Balance: {balanceItem.remaining_Balance}
                    </Text>
                    {/* Include corresponding transaction data */}
                    {correspondingTransactions.length > 0 && (
                     <>
                        <Text style={styles.vendorName}>Transactions:</Text>
                        {correspondingTransactions.map((transaction, tIndex) => (
                         <View key={tIndex} style={styles.vendorContainer}>
                            <Text style={styles.vendorName}>
                             Cashier Name: {transaction.cashier}
                            </Text>
                            <Text style={styles.vendorName}>
                             Expense To: {transaction.expense}
                            </Text>
                            <Text style={styles.vendorName}>
                             Expense Amount: {transaction.amount} ({transaction.status})
                            </Text>
                         </View>
                        ))}
                     </>
                    )}
                    {/* Include data from other URLs */}
                    {correspondingCashBalance && (
                     <Text style={styles.vendorName}>
                        Cash Balance: {correspondingCashBalance.total}
                     </Text>
                    )}
                    {correspondingCardBalance && (
                     <Text style={styles.vendorName}>
                        Card Balance: {correspondingCardBalance.total}
                     </Text>
                    )}
                    {correspondingUpiBalance && (
                     <Text style={styles.vendorName}>
                        UPI Balance: {correspondingUpiBalance.total}
                     </Text>
                    )}
                 </View>
                );
             })}
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
     link.download = "cash_register_data.pdf";
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          marginRight: "10vw",
          marginTop: "12vh",
        }}
      >
        {downloadLink && (
          <a
            href={downloadLink}
            download="balance_datas.xlsx"
            style={{ fontSize: "2vh" }}
          ></a>
        )}
        <button
          onClick={generatePDF}
          className="btn btn-outline-primary"
          title="Download PDF"
          style={{
            fontSize: "2vh",
            height: "5vh",
            marginRight: "2vh",
          }}
        >
          {downloadLink && (
            <a href={downloadLink} download="cash_Register_list.pdf"></a>
          )}
          PDF
        </button>
      </div>

      <div className="col-md-20 rowleft87">
        <div
          className="card-header fs-3"
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
            <i class="fa-solid fa-list" style={{ color: "rgb(0, 0, 153" }}></i>
            Cash Register
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
              marginTop: "7px",
              fontSize: "1vw",
            }}
            value={FilterVal}
            onInput={(e) => handleFilter(e)}
          />

          <div
            className="rowleft66"
            style={{
              fontSize: "2vh",
              display: "flex",
              marginTop: "7px",
            }}
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
              <i
                className="fas fa-filter"
                style={{ fontSize: "2vh", paddingTop: "0.3vh" }}
              ></i>
            </button>
            <Link>
              <button
                className="btn btn-outline-danger"
                onClick={handleReset}
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
            </Link>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </div>
        </div>
      </div>

      <div class="content content2 read" style={{ width: "100%" }}>
      {balanceList.length === 0 ? ( // Check if the list is empty
        <div className="no-data-message" style={{marginLeft:"20vh"}}>No Cash Register data available.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ borderTopLeftRadius: "10px" }}
              >
                Sr.no
              </th>
              <th scope="col" class="text-center px-1 border">
                Date
              </th>
              <th scope="col" class="text-center px-2 border">
                Opening Balance
              </th>

              <th scope="col" class="text-center px-3 border">
                Sales
              </th>
              <th scope="col" class="text-center px-2 border">
                cashier
              </th>
              <th scope="col" class="text-center px-4 border">
                Expense
              </th>
              <th scope="col" class="text-center px-2 border">
                Amount {currentuser.currency}
              </th>
              <th scope="col" class="text-center px-2 border">
                Status
              </th>
              <th scope="col" class="text-center px-1 border">
                Remaining Balance
              </th>
              <th scope="col" class="text-center px-2 border">
                Handed Over To
              </th>
              <th scope="col" class="text-center px-2 border">
                Handed Amount
              </th>
              <th
                scope="col"
                class="text-center px-2 border"
                style={{ borderTopRightRadius: "10px" }}
              >
                Closing Balance
              </th>
            </tr>
          </thead>
          {balanceList.length === 0 ? ( // Check if the list is empty
        <div className="no-data-message"  style={{marginLeft:"15vh"}}>No Daily Income data available.</div>
      ) : (
              <tbody className="tbodytr">
               {Array.isArray(reversedBalanceList) && currentItems.map((b, num) => {
                      const { expense, amount,status } = getExpenseAmountForDate(b.date);
                      return (
                      <tr key={num}>
                        <td class="text-center px-2 border">{num + 1}</td>
                       
                        <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.date &&
                        b.date
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.date}</strong>
                      ) : (
                        b.date
                      )}
                    </td>
                       

                        <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        parseFloat(b.todays_opening_Balance).toFixed(2) &&
                        parseFloat(b.todays_opening_Balance).toFixed(2)
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{parseFloat(b.todays_opening_Balance).toFixed(2)}</strong>
                      ) : (
                        parseFloat(b.todays_opening_Balance).toFixed(2)
                      )}
                    </td>

                        <td class="text-center px-2 border">
                          {cashTotalValues.map((item, index) => {
                            if (item.date === b.date) {
                              return <div key={index}>Cash: {item.total}</div>;
                            }
                            return null;
                          })}

                          {cardTotalValues.map((item, index) => {
                            if (item.date === b.date) {
                              return <div key={index}>Card: {item.total}</div>;
                            }
                            return null;
                          })}

                          {upiTotalValues.map((item, index) => {
                            if (item.date === b.date) {
                              return <div key={index}>Upi: {item.total}</div>;
                            }
                            return null;
                          })}
                        </td>

                        <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        currentuser.username &&
                        currentuser.username
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{ currentuser.username}</strong>
                      ) : (
                        currentuser.username
                      )}
                    </td>
                       

                        
                        <td
                          class="text-center px-2 border"
                          style={{ minWidth: "7vw" }}
                        >
                          {expense.split("\n").map((item, index) => (
                            <div key={index}>{item}</div>
                          ))}
                        </td>
                        <td
                          class="text-center px-2 border"
                          style={{ minWidth: "7vw" }}
                        >
                          {amount.split("\n").map((item, index) => (
                            <div key={index}>{item}</div>
                          ))}
                        </td>
                        <td
                          class="text-center px-2 border"
                          style={{ minWidth: "7vw" }}
                        >
                          {status.split("\n").map((item, index) => (
                            <div key={index}>{item}</div>
                          ))}
                        </td>

                       <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        (b.remaining_Balance).toFixed(2) &&
                        (b.remaining_Balance).toFixed(2)
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{(b.remaining_Balance).toFixed(2)}</strong>
                      ) : (
                        (b.remaining_Balance).toFixed(2)
                      )}
                    </td>

                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.final_handed_over_to &&
                        b.final_handed_over_to
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.final_handed_over_to}</strong>
                      ) : (
                        b.final_handed_over_to
                      )}
                    </td>
                        
                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.final_amount &&
                        b.final_amount
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.final_amount}</strong>
                      ) : (
                        b.final_amount
                      )}
                    </td>
                       
                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        parseFloat(b.final_closing_balance).toFixed(2) &&
                        parseFloat(b.final_closing_balance).toFixed(2)
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{parseFloat(b.final_closing_balance).toFixed(2)}</strong>
                      ) : (
                        parseFloat(b.final_closing_balance).toFixed(2)
                      )}
                    </td>
                       
                      </tr>
                    );
                  })}
            </tbody>
         ) }
        </table>
      )}

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
export const Reports = () => {
  return (
    <div className="reports">
      <h1>Reports</h1>
    </div>
  );
};
