/////////////////////pooja added new list///////////////
import React, { useEffect, useState, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Card } from "react-bootstrap";
import inventoryService from '../services/inventory.service';
import ReactPrint from 'react-to-print'
import userService from "../services/adduser.service";
import { Link, useNavigate, useParams } from 'react-router-dom';
import roleuserService from '../services/roleuser.service';
import authService from '../services/auth.service';
import axios from 'axios';
import { PDFDocument, Page, Text, View, Document, StyleSheet, pdf } from "@react-pdf/renderer";
import DatePicker from 'react-datepicker'; // Assuming you are using react-datepicker library
import 'react-datepicker/dist/react-datepicker.css';
import "./overview.css";
import { ToastContainer, toast } from "react-toastify";
import "./list.css"

//Date Filter Applied By Neha to Role List
export const RoleList = () => {
  const currentuser = authService.getCurrentUser();
  const [rolelist, setRolelist] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);   const [FilterVal, setFilterVal] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState("");     // End date for filtering
  const ref = useRef()
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAlerts, setShowAlerts] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [role, setRole] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [errorShown, setErrorShown] = useState(false);


  useEffect(() => {
    init();
    fetchData();

  }, []);

  const [msg, setMsg] = useState("");
  const init = () => {
    roleuserService.getAllUser().then((res) => {
      // console.log(res.data);
      setRolelist(res.data);

    }).catch((error) => {
      console.log(error);
    });
  };

  const fetchData = () => {
    fetch(`http://localhost:8083/
sys/UserSidebar/store/${currentuser.storeid}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setRolelist(json);
        setSerachApiData(json);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  
  const deleteRole = (id) => {

    roleuserService.deleteRole(id).then((res) => {
      console.log("Role Delete Successfully");
      toast.success("Role Deleted Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1);
      init();
    }).catch((error) => {
      console.log(error);
    });

  };

  const handleFilter = (e) => {
    const filterValue = e.target.value.trim().toLowerCase();
    console.log('Filter Value:', filterValue);
  
    if (Array.isArray(searchApiData) && searchApiData.length > 0) {
      if (filterValue === "") {
        setRolelist(searchApiData);
        setErrorShown(false); // Reset the error display flag when the filter is cleared

      } else {
        const filterResult = searchApiData.filter((item) => {
          // Filter menuitem titles
          const menuItemTitles = item.menuitem?.map((menuItem) => menuItem.title.toLowerCase()) || [];
          const submenuItemTitles = item.menuitem
            ?.flatMap((menuItem) => menuItem.submenuitem?.map((submenuItem) => submenuItem.title.toLowerCase()) || [])
            || [];
  
          const usernameMatch = item.username.toLowerCase().includes(filterValue);
          const titleMatch = menuItemTitles.some((title) => title.includes(filterValue));
          const submenuTitleMatch = submenuItemTitles.some((title) => title.includes(filterValue));
          const idMatch = (item.id || "").toString().toLowerCase().includes(filterValue);
  
          return usernameMatch || titleMatch || submenuTitleMatch || idMatch;
        });
  
        console.log('Filter Result:', filterResult);
  
        if (filterResult.length > 0) {
          setRolelist(filterResult);
        } else {
          setRolelist(searchApiData);
          if (!errorShown) {
            toast.error("No matching data found.");
            setErrorShown(true); // Set the error display flag to true after showing the error once
         }
        }
      }
    }
  
    setFilterVal(filterValue);
  };
  
  

  const generatePDF = async () => {
    try {
      // Fetch data from the API URL
      const response = await axios.get(`http://localhost:8083/sys/UserSidebar/store/${currentuser.storeid}/users`);
      const apiData = response.data;

      // Generate the PDF content using fetched data
      const pdfContent = (
        <Document>
          <Page size="A4">
            <View style={styles.page}>
              {apiData.map((item, index) => (
                <View key={index} style={styles.vendorContainer}>F
                  <Text style={styles.vendorName}>User ID: {item.id}</Text>
                  <Text style={styles.vendorName}>User Name: {item.username}</Text>
                  <Text style={styles.vendor}>Menus:</Text>
                  <View style={styles.menuList}>
                    {item.menu.map((menuItem, menuIndex) => (
                      <View key={menuIndex}>
                        <Text style={styles.vendor}>{menuItem.title}</Text>
                        <View style={styles.submenuList}>
                          <Text style={styles.subMenuTitle}>Sub Menus:

                            {menuItem.subMenu.map((subMenuItem) => (
                              <Text key={subMenuItem.id} style={styles.subMenuItem}>
                                {'\u2022'} {subMenuItem.title}
                              </Text>
                            ))}

                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
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
      link.download = "Role_list.pdf";
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
      marginLeft: 10, // This creates an indentation
      fontWeight: 'bold', // You can adjust the styling as needed
      fontSize: 14,
    },

    subMenuItem: {
      marginLeft: 20, // This creates a deeper indentation
    },
  };

  // Function to fetch data based on selected date range
  const fetchDataByDateRange = () => {
    const url = `http://localhost:8083/sys/UserSidebar/store/${currentuser.storeid}/users`;

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
          const orderDate = new Date(item.crtDate);
          console.log('orderDate:', orderDate);

          // Check if the orderDate is greater than or equal to startDate and less than or equal to endDate
          const isAfterStartDate = !startDate || orderDate >= startDate;
          const isBeforeEndDate = !endDate || orderDate <= endDate;
          console.log('isAfterStartDate:', isAfterStartDate);
          console.log('isBeforeEndDate:', isBeforeEndDate);

          return isAfterStartDate && isBeforeEndDate;
        });

        console.log('Filtered Data:', filteredData); // Debugging log

        setRolelist(filteredData);
        setSerachApiData(json);
      });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };


  // Calculate the total number of pages
  const totalPages = Math.ceil(rolelist.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rolelist.slice(indexOfFirstItem, indexOfLastItem);

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
  const allItemsSelected = rolelist.length === updatedSelectedItems.length;
  
  setSelectedItems(updatedSelectedItems);
  setSelectAllChecked(allItemsSelected);
  };
  
  // Handle "Select All" checkbox state changes
  const handleSelectAll = () => {
  if (selectAllChecked) {
       setSelectedItems([]);
  } else {
       setSelectedItems(rolelist.map((item) => item.id));
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


const handleMultiDeletedrole = (serialNo) => {
    
    // After deleting the specific item, update selectedItems and showAlerts
    const updatedSelectedItems = selectedItems.filter(item => item.serial_no !== serialNo);
    const updatedShowAlerts = { ...showAlerts, [serialNo]: false };

    // Update state to reflect the changes
    setSelectedItems(updatedSelectedItems);
    setShowAlerts(updatedShowAlerts);

    for (const id of selectedItems) {
         deleteRole(id);
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

      <div className="row rowleft8" style={{ marginTop: "12vh" }}>
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
          className="btn btn-danger" style={{ alignContent: "center", justifyContent: "center", fontSize: "2vh", display: "flex", flexDirection: "row", alignItems: "center", height:"5vh",marginRight:"1vh" }}
        >
          Delete Selected
        </button>
      )}
      {showAlerts[role.serial_no] && (
                     <div className="overlay12">
                        <div className="alert alert2 alert-success font-weight-bold center-popup">
                         <h6 className="mb-2" style={{ fontSize: "1.5vw" }}>
                            Are you sure you want to delete{" "}
                            <i className="fa-solid fa-question"></i>
                         </h6>
                         <div style={{ marginTop: "4vh" }}>
                            <button
                             className="btn btn-sm btn-danger mx-2"
                             onClick={() => handleMultiDeletedrole(role.serial_no)}
                            >
                             Delete <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                             className="btn btn-sm btn-primary"
                             onClick={() =>
                                setShowAlerts({
                                 ...showAlerts,
                                 [role.serial_no]: false,
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
            className="btn btn-outline-primary boton2"
            title="Add new role"
            style={{
              fontSize: "2vh",
              height: "5vh",
              marginRight: "5px",
            }}
          >
            <i class="fas fa-plus" style={{ marginRight: "5px" }}></i>
            <a href="/role/roleaccess" className="btn-outline-primary" >
              Role
            </a>
          </button>

          <button onClick={generatePDF} className="btn btn-outline-primary"
            title="Download PDF"
            style={{
              fontSize: "2vh", height: "5vh",

              marginRight: "5vh",
            }}>
            {downloadLink && (
              <a href={downloadLink} download="role_list.pdf">
                {/* Download PDF */}
              </a>
            )}PDF
          </button>
        </div>
        <div className="col-md-50">
          <div
            className="card-header fs-3 "
            // style={{ backgroundColor: "#03989e" }}
            style={{ display: "flex", borderRadius: "15px" }}
          >

            <h4 className="text" style={{ color: "#000099", fontSize: "3.5vh", fontWeight: "bold", }} >
              <i class="fa-solid fa-list"></i> Role
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
                fontSize: "2.6vh",
                display: "flex",
                alignItems: "center",
                width: "30vh",
                marginLeft: "30vh",
                marginTop: "8px"
                , fontSize: "1vw"
              }}
              value={FilterVal}
              onInput={(e) => handleFilter(e)}
            />

          </div>
        </div>
      </div>
      <p>
      </p>
      <div class="content read">
     
        <table>
          <thead>
            <tr>
              <th scope="col" class="text-center px-2 border" style={{ borderTopLeftRadius: "10px" }} >
                Sr.No
              </th>
              <th scope="col" class="text-center px-2 border">
                Username
              </th>
              <th scope="col" class="text-center px-2 border">
                Menu
              </th>
              <th scope="col" class="text-center px-2 border">
                Submenu
              </th>
              <th scope="col" class="text-center px-2 border" >
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
          {rolelist.length === 0 ? ( // Check if the list is empty
        <div className="no-data-message" style={{marginLeft:"20vh"}}>No Role data available.</div>
      ) : (

          <tbody className="tbodytr">
            {Array.isArray(rolelist) && rolelist.length > 0 ? (
              currentItems.map((p, num) => (
                <React.Fragment key={num}>
                  {p.menu &&
                    p.menu.map((menuItem, index) => (
                      <tr key={index}>
                        <td className="text-center px-2 border">{num + 1}</td>
                         <td className="text-center px-2 border">
                          {typeof FilterVal === "string" &&
                            FilterVal !== "" &&
                            p.username.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                            <strong>{p.username}</strong>
                          ) : (
                            p.username
                          )}
                        </td>
                        <td className="text-center px-2 border">
                          {typeof FilterVal === "string" &&
                            FilterVal !== "" &&
                            menuItem.title.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                            <strong>{menuItem.title}</strong>
                          ) : (
                            menuItem.title
                          )}
                        </td>

                        <td className="text-center px-2 border">
                          <ol>
                            {menuItem.subMenu.map((subMenuItem) => (
                              <li key={subMenuItem.id}>
                                {typeof FilterVal === "string" &&
                                  FilterVal !== "" &&
                                  subMenuItem.title &&
                                  subMenuItem.title.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                                  <strong style={{ textAlign: "center" }}>
                                    {subMenuItem.title}
                                  </strong>
                                ) : (
                                  subMenuItem.title
                                )}
                              </li>
                            ))}
                          </ol>
                        </td>
                        <td className="actions" style={{ display: "flex", justifyContent: "center", alignContent: "center" }}	>
                      
                          <Link
                            to={`/roleaccess/updateroleaccess/`}
                            title="edit role"
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
                  onChange={() => handleSelectItem(p.id)}
                  checked={selectedItems.includes(p.id)}
                />
              </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
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
        theme="dark" />
    </div>
  );
};

export default RoleList;