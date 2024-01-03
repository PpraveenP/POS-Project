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



export const Income_list = () => {
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
     
    //   setdailytotal(cashTotalValues[0].total + cardTotalValues[0].total + upiTotalValues[0].total)
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
              (item.date || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) 
              
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
        if (!date) {
            return false; // If there is no date information, exclude the item
        }
        
        const itemDate = new Date(date);
        
        if (!startDate || !endDate) {
            return true; // If no date range specified, include the item
        }
        
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
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  
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
    const [dailytotal, setDailyTotal] = useState([]);

   
// Combine all totals for each date
const combinedTotals = cashTotalValues.concat(cardTotalValues, upiTotalValues);

// Calculate daily total by summing the totals for each date
const calculateDailyTotal = () => {
  const dailyTotalMap = combinedTotals.reduce((accumulator, item) => {
    const { date, total } = item;
    accumulator[date] = (accumulator[date] || 0) + total;
    return accumulator;
  }, {});

  // Convert the map to an array of objects
  const result = Object.entries(dailyTotalMap).map(([date, total]) => ({
    date,
    total,
  }));

  setDailyTotal(result);
};

// Call the function to calculate the daily total
useEffect(() => {
  calculateDailyTotal();
}, [cashTotals, cardTotals, upiTotals]);

console.log(dailytotal);
    
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

       //console.log(cashTotalValues[0].total + cardTotalValues[0].total + upiTotalValues[0].total);

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
       link.download = "Daily_income_data.pdf";
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
  

     const [expandedRow, setExpandedRow] = useState([]);

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
              Daily Income 
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
  
        <div class="content content2 read" style={{ width: "30%" }}>
        {balanceList.length === 0 ? ( // Check if the list is empty
          <div className="no-data-message" style={{marginLeft:"20vh"}}>No Daily Income data available.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th
                  scope="col"
                  class="text-center px-2 border"
                  style={{ borderTopLeftRadius: "10px",width:"10vw" }}
                >
                  Sr.no
                </th>
                <th scope="col" class="text-center px-1 border">
                  Date
                </th>
                   <th scope="col" 
                class="text-center px-3 border"
                style={{ width:"10vw"}}
                >
                  Sales
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
                        <tr
                          key={num}
                          onClick={() =>
                            setExpandedRow((prevRow) =>
                              prevRow === num ? null : num
                            )
                          }
                        >
                          <td class="text-center px-2 border">{num + 1}</td>
                          <td
                            style={{ width: "7vw" }}
                            class="text-center px-2 border"
                          >
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
                        

                          <td className="text-center px-2 border">
                          {dailytotal.map((item, index) => {
                              if (item.date === b.date) {
                                return <div key={index}>Total : {item.total.toFixed(2)}{" "}<a className="text-primary">View</a></div>;
                              }
                              return null;
                            })}
                              {expandedRow === num && (
                              <div>
                                <ul>
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
                                </ul>
                              </div>
                            )}
                          </td>


                        </tr>
                      );
                    })}
              </tbody>
            )}
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