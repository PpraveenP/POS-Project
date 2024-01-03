import React, { useState, useEffect, useRef ,useCallback  } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Card, Container } from "react-bootstrap";
import storeService from "../services/store.service";
import orderService from "../services/order.service";
import billService from "../services/bill.service";
import ReactPrint from "react-to-print";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./overview.css";
import Button from "react-bootstrap/Button";
import "./style.css";
import foodService from "../services/food.service";
import { Link } from "react-router-dom";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import Modal from "react-bootstrap/Modal";
import authService from "../services/auth.service";
import "./calculator.css";
import QRious from "qrious";
import { PDFDocument, pdf } from "@react-pdf/renderer";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import Calculator from "./calculator";
import { useReactToPrint } from "react-to-print";
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const date = new Date();

const today = date.toLocaleDateString("en-GB", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

export const Overview = () => {
  return <></>;
};

/*{----------------------------    POS Invoice   ----------------------------------------}*/
const currentuser = authService.getCurrentUser();

export const Order = () => {
  const currentuser = authService.getCurrentUser();
  const [alertMessage, setAlertMessage] = useState("");
  const [cartItems, setCartItemss] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [msg, setMsg] = useState();
  const [counter, setCounter] = useState(1);
  const [price, setPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryClicked, setCategoryClicked] = useState(false);
  const [foodList, setFoodList] = useState([]); // Filtered data
  const [filteredData, setFilteredData] = useState([]);
  const [originalFoodList, setOriginalFoodList] = useState([]); // Store the original data
  const [searchInput, setSearchInput] = useState(""); // State variable for search input
  const [loadedData, setLoadedData] = useState([]);
  const [runningOrders, setRunningOrders] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const [latestBillId, setLatestBillId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
  const [showModal, setShowModal] = useState(false); // State variable to manage modal visibility
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);

  
  const handleMinimizeToggle = () => {
    setMinimized(!minimized);
  };

  const [bill, setBill] = useState({
    contact: "",
    upbyname: currentuser.username,
    crtbyname: currentuser.username,
    paymentmode: "",
    tranid: "",
    gst: currentuser.gstno,
    total: "",
    store_id: currentuser.storeid,
    discount: "",
    order: [
      {
        tblno: "",
        ordstatus: "Running",
        crtby: currentuser.username,
        sid: currentuser.storeid,
        ordertype: "",
        orderFoods: [],
      },
    ],
  });


  const [billData, setBilldata] = useState({
    Serial_no: "",
    id: "",
    contact: "",
    upbyname: "",
    crtbyname: "",
    paymentmode: "",
    tranid: "",
    gst: "",
    total: "",
    discount: "",

    store_id: currentuser.storeid,
    order: [
      {
        tblno: "",
        ordstatus: "completed",
        crtby: "",
        sid: "",
        orderFoods: [],
      },
    ],
  });
  const ref = useRef();
  const [logo, setLogo] = useState(null);
  const [data, setData] = useState(null);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const date = new Date();
  // Format the time in AM/PM format
  const timeInAMPM = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const [paymentModeSelected, setPaymentModeSelected] = useState(false);
  const [taxRate, setTaxRate] = useState(0); // Define the tax rate state
  const [taxName, setTaxName] = useState(''); // Define the tax name state
  const [taxNames, setTaxNames] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const { id } = useParams();
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [items, setItems] = useState([]);
  const [KOTModal, setKOTModal] = useState(false);

  const subtotal1 = selectedOrder?.order[0].orderFoods.reduce((prev, orderFood) => {
    return prev + orderFood.quantity * orderFood.price;
  }, 0);
  const taxAmounts1 = taxRates.map((rate) => (rate * subtotal1) / 100);
  const totalTax1 = taxAmounts1.reduce((acc, amount) => acc + amount, 0);
  const discountRate1 = (discount * subtotal1) / 100;
  const total1 = subtotal1 - discountRate1 + totalTax1;
  const [isPrinting, setIsPrinting] = useState(false);


  const subtotal = bill?.order[0].orderFoods.reduce((prev, orderFood) => {
    return prev + orderFood.quantity * orderFood.price;
  }, 0);
  const taxAmounts = taxRates.map((rate) => (rate * subtotal) / 100);
  const totalTax = taxAmounts.reduce((acc, amount) => acc + amount, 0);
  const discountRate = (discount * subtotal) / 100;
  const total = subtotal - discountRate + totalTax;

  // {-----------------------------------RUSHIKESH MADE THIS CHANGES---------------------------}
  // {------------------------for qr code stoerpayment upi------------------------------------ }
  const [upiId, setUpiId] = useState();
  const [error, setError] = useState(null);
  const [upipayment, setUpipayment] = useState();

  const [mobileNoError, setMobileNoError] = useState("");

  const [billId, setBillId] = useState(null);

  const orderId = billData.order[0].serial_no;





  const initialBillState = {
    // Define your initial state for the 'bill' object here
    email: "",
    contact: "",
    upbyname: currentuser.username,
    store_id: currentuser.storeid,
    order: [
      {
        tblno: "",
        ordstatus: "completed",
        crtby: currentuser.username,
        sid: currentuser.storeid,
        ordertype: "",
        orderFoods: [],
      },
    ],
  };

  //calculator code
  const handleCalculatorSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    handleShow(); // Show the calculator modal
  };

  const [buttonColor, setButtonColor] = useState("btn-success"); // Initial color
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [result, setResult] = useState("");

  const handleClick = (e) => {
    e.preventDefault(); // Missing event parameter
    setResult(result.concat(e.target.name));
  };

  const handleBackspace = () => {
    setResult((prevResult) => prevResult.slice(0, -1));
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  // { --------------------------------------Rushikesh Added New Code ----------------------------------}
  //                 {---------------- for qr code genrate--------------------------}
  //const [billtotal,setBillTotal] ;
  //console.log(subtotal - discount + totalTax);

  const billtotal = subtotal1 - discountRate1 + totalTax1;

  const [upi, setText] = useState(upiId);
  const generateQRCode = async () => {
    try {
      if (upipayment === "upi") {
        //const response = await fetch(`http://localhost:8083/sys/api/store-payments/generateQRCode?text=upi://pay?pa=${upi}%26am=${billtotal}%26cu=INR`);//ok
        const response = await fetch(`http://localhost:8083/sys/api/store-payments/generateQRCode?text=upi://pay?pa=${upi}`);//ok
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setQRCodeImage(imageUrl);
          console.log(upi)
          console.log(billtotal)
        } else {
          console.error('Failed to generate QR code.');
        }
      } else {
        // Clear the QR code image when payment mode is not UPI
        setQRCodeImage(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    // Replace 'YOUR_API_ENDPOINT' with the actual URL of your API endpoint.
    const apiUrl = `http://localhost:8083/sys/api/store-payments/getupi/${currentuser.storeid}`; // Replace 'storeId' with the actual store ID you want to fetch.
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        setUpiId(data);
        setText(data)

      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect((upi, billtotal) => {
    generateQRCode(); // Automatically generate QR code when the component mounts
  }, [upi, billtotal, bill.paymentmode]);


  //console.log(bill.paymentmode);

  //   useEffect(() => {
  //     generateQRCode(); // Automatically generate QR code when the component mounts
  //  }, [upi, billtotal, bill.paymentmode]
  //  );

  //----------------------------END  ---------------------------
  // const handleKeyDown = (e) => {
  //   const key = e.key;
  //   if (key.match(/[0-9+\-*/.=]|Enter/)) {
  //     e.preventDefault();
  //     if (key === "Backspace") {
  //       setResult((prevResult) => prevResult.slice(0, -1));
  //     } else if (key === "Enter") {
  //       calculate(); // Perform the calculation when "Enter" key is pressed
  //     } else {
  //       const validKeys = /[0-9+\-*/.]/;
  //       if (validKeys.test(key)) {
  //         setResult((prevResult) => prevResult + key);
  //       }
  //     }
  //   }
  // };
  // Function to check if the cart is empty
  const isCartEmpty = () => {
    return bill.order[0]?.orderFoods?.length === 0;
  };

  const handleDecrement = (index) => {
    // Perform the decrement operation for the specific index
    const updatedBill = { ...bill };
    const currentQuantity = updatedBill.order[0].orderFoods[index].quantity;

    // Make sure the quantity doesn't go below 1
    if (currentQuantity > 1) {
      updatedBill.order[0].orderFoods[index].quantity -= 1;
      setBill(updatedBill);
    } else if (currentQuantity === 1) {
      // If the current quantity is 1, set it to 0 and remove the item from the cart
      updatedBill.order[0].orderFoods.splice(index, 1);
      setBill(updatedBill);
    }

    // Check if the cart is empty after updating the item
    if (isCartEmpty(updatedBill)) {
      // The cart is empty, prevent order placement
      toast.error(
        "Your cart is empty. Add items to your cart before placing an order."
      );
      return;
    }
  };

  const handleIncrement = (index) => {
    // Perform the increment operation for the specific index
    const updatedBill = { ...bill };
    updatedBill.order[0].orderFoods[index].quantity += 1;
    setBill(updatedBill);
  };

  const handleDelete = (event, index) => {
    event.preventDefault();
    const updatedBill = { ...bill };
    const deletedFood = updatedBill.order[0].orderFoods[index];

    if (deletedFood) {
      // Subtract the price of the deleted food from the totalPrice
      const newTotalPrice = price - deletedFood.price * deletedFood.quantity;
      setPrice(newTotalPrice);

      // Remove the food item from the cart
      updatedBill.order[0].orderFoods.splice(index, 1);

      // Check if the cart is empty after deleting the item
      if (isCartEmpty(updatedBill)) {
        // The cart is empty, prevent order placement
        toast.error(
          "Your cart is empty. Add items to your cart before placing an order."
        );
        return;
      }

      // Update the values state with the modified cart
      setBill(updatedBill);
    }
  };

  const calculate = () => {
    try {
      setResult(eval(result).toString());
    } catch (error) {
      setResult("Error");
    }
  };

  const clear = () => {
    setResult("");
  };

  const totall = () => {
    let price = 0;
    if (bill.order && bill.order.length > 0 && bill.order[0].orderFoods) {
      price = bill.order[0].orderFoods.reduce(
        (totalPrice, food) => totalPrice + food.price * food.quantity,
        0
      );
    }
    setPrice(price);
  };

  useEffect(() => {
    // When fetching data, update only the originalFoodList
    const fetchFoodList = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/sys/Food/foods/${currentuser.storeid}`
        );
        const data = await response.json();
        setLoadedData(data);
        setOriginalFoodList(data); // Store the original data
        totall(data); // Calculate the total based on the original data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFoodList();
  }, [totall, selectedCategory, searchInput]);

  useEffect(() => {
    init();
    fetchData();
    fetchOrderList();
  }, []);

  useEffect(() => {
    // Filter the data when FilterVal changes with a debounce
    const filterData = () => {
      // Ensure FilterVal is a string before calling toLowerCase
      if (typeof FilterVal === "string") {
        const filteredResults = searchApiData.filter(
          (item) =>
            item.food_name.toLowerCase().includes(FilterVal.toLowerCase()) ||
            item.foodcode.toLowerCase().includes(FilterVal.toLowerCase())
        );

        // If a category is selected, apply the category filter as well
        if (selectedCategory) {
          const categoryFilteredResults = filteredResults.filter(
            (item) => item.category === selectedCategory
          );
          setFilteredData(categoryFilteredResults);
        } else {
          setFilteredData(filteredResults);
        }
      } else {
        // If no FilterVal, only apply the category filter if selected
        if (selectedCategory) {
          const categoryFilteredResults = searchApiData.filter(
            (item) => item.category === selectedCategory
          );
          setFilteredData(categoryFilteredResults);
        } else {
          setFilteredData(searchApiData);
        }
      }
    };
  }, [FilterVal, searchApiData, selectedCategory]);
 
  const fetchData = useCallback(() => {
    fetch(`http://localhost:8083/sys/Food/foods/${currentuser.storeid}`)
      .then((response) => response.json())
      .then((json) => {
        setFoodList(json);
        setSerachApiData(json);
      });
  }, [currentuser.storeid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const paymentModeContentRef = useRef(null);
  const KOTContentRef = useRef(null);


  const handlePrintKOT = useReactToPrint({
    content: () => KOTContentRef.current,
    onAfterPrint: () => {
      setKOTModal(false);
        // Add a delay before reloading the window (e.g., 1 second)
       setTimeout(() => {
           window.location.reload();
         }, 1000);
    },
    
  });

  const [refreshComponent, setRefreshComponent] = useState(false);
  const handleRefresh = () => {
    setRefreshComponent(true);
  };

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (refreshComponent) {
        await fetchData();
        setRefreshComponent(false);
      }
    };
    fetchDataIfNeeded();
  }, [refreshComponent]);

  const [buttonClicked, setButtonClicked] = useState(false);

  //=======================    handlesubmit    ====================

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event, isKOTButton) => {

    event.preventDefault();
    // Check if the cart is empty
    if (isCartEmpty()) {
      toast.error("Please add at least one item to the cart before placing the order.");
      return;
    }

     // Check if the cart is empty
     if (!bill.paymentmode) {
      toast.error("Please select Payment mode before placing the order");
      return;
    }

    try {


      setIsSubmitting(true);
      if (!bill.order || bill.order.length === 0) {
        console.error("No order data found.");
        return;
      }

      const payload = {
        bill: {
          ...bill,
          total: total, // Update the total property here
          paymentmode: bill.paymentmode,
          discount: discountRate,
          order: [
            {
              ...bill.order[0],
              ordstatus: isKOTButton ? "completed" : "Running",
              orderFoods: bill.order[0]?.orderFoods?.map((food) => ({
                ...food,
                store_id: currentuser.storeid,
              })),
            },
          ],
        },
        orderFood: bill.order[0]?.orderFoods?.map((food) => ({
          ...food,
          store_id: currentuser.storeid,
        })),
      };

      // Include payment mode if available in bill object
      if (bill.paymentmode) {
        payload.bill.paymentmode = bill.paymentmode;
      }

      setUpipayment(bill.paymentmode)

      console.log(payload);
      const response = await fetch("http://localhost:8083/sys/Bill/create-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // ... (your existing code)

        // Fetch the latest bill data using the latest bill ID
        const latestBillDataResponse = await fetch(`http://localhost:8083/sys/Bill/getLastBill/${currentuser.storeid}`);

        if (latestBillDataResponse.ok) {
          const latestBillData = await latestBillDataResponse.json();
          if (isKOTButton) {
            // // Validate ordertype
            // if (!bill.paymentmode) {
            //   toast.error("Please select payment Mode.");
            //   return;
            // }

            // Set the selectedOrder state to the latest bill data
            setSelectedOrder(latestBillData);
            console.log(latestBillData);

            // Set the visibility of the modal to true
            setShowOrderDetailsModal(true);
            handleRefresh();
          }


          if (!isKOTButton) {
             handleRefresh();

          }
          setButtonClicked(true);

        } else {
          // Handle the case where fetching latest bill data failed
          console.error("Failed to fetch latest bill data:", latestBillDataResponse.status);
        }

        setBill({ ...initialBillState }); // Reset your bill state here
        console.log("Bill placed successfully");
        toast.success("Order placed successfully");
        setIsSubmitting(false);
        // ... existing code ...
      } else {
        if (response.status === 400) {
          const errorMessage = await response.text();
          console.error("Error:", errorMessage);
          toast.error(errorMessage);
          setIsSubmitting(false);
          return;
         }
        // Request failed
        console.error("Request failed:", response.status);
        toast.error("Failed To submit the Order");
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setMsg("Error: Failed to submit the order");
      toast.error("Failed To submit the Order");
    }
  };

  //-----------------------------------  handleSubmitOrder  --------------------------
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);
  const handleSubmitOrder = async (event, isKOTButton) => {

    event.preventDefault();

    if (isOrderPlacing) {
      return;
    }
  
    // Check if the cart is empty
    if (isCartEmpty()) {
      toast.error("Please add at least one item to the cart before placing the order.");
      return;
    }

    // Validate ordertype
    if (!bill.order[0]?.ordertype) {
      toast.error("Please select an order type.");
      return;
     }
     // Validate tblno if the ordertype is Dine In
     if (bill.order[0]?.ordertype === "Dine In" && !bill.order[0]?.tblno) {
      toast.error("Please provide table number for Dine In orders.");
      return;
     }
     
 

    try {

      setIsOrderPlacing(true);
      if (!bill.order || bill.order.length === 0) {
        console.error("No order data found.");
        return;
      }

      const payload = {
        bill: {
          ...bill,
          total: total, // Update the total property here
          //paymentmode: bill.paymentmode,
          discount: discountRate,
          order: [
            {
              ...bill.order[0],
              ordstatus: isKOTButton ? "completed" : "Running",
              orderFoods: bill.order[0]?.orderFoods?.map((food) => ({
                ...food,
                store_id: currentuser.storeid,
              })),
            },
          ],
        },
        orderFood: bill.order[0]?.orderFoods?.map((food) => ({
          ...food,
          store_id: currentuser.storeid,
        })),
      };

      // Include payment mode if available in bill object
      if (bill.paymentmode) {
        payload.bill.paymentmode = bill.paymentmode;
      }

   // Include payment mode if available in bill object
   if (bill.paymentmode && !isKOTButton) {
    // If isKOTButton is true and payment mode is selected, show an error message
    console.error("Cannot select payment mode while placing a KOT order.");
    toast.error("Cannot select payment mode while placing Order & a KOT.please select Payment Mode as None.");
    return;
  }

  payload.bill.paymentmode = bill.paymentmode;

      console.log(payload);
      const response = await fetch("http://localhost:8083/sys/Bill/postbillOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // ... (your existing code)

        // Fetch the latest bill data using the latest bill ID
        const latestBillDataResponse = await fetch(`http://localhost:8083/sys/Bill/getLastBill/${currentuser.storeid}`);

        if (latestBillDataResponse.ok) {
          const latestBillData = await latestBillDataResponse.json();
          if (isKOTButton) {
            // Validate ordertype
            if (!bill.paymentmode) {
              toast.error("Please select payment Mode.");
              return;
            }

            // Set the selectedOrder state to the latest bill datab
            setSelectedOrder(latestBillData);
            console.log(latestBillData);

            // Set the visibility of the modal to true
            setShowOrderDetailsModal(true);
            handleRefresh();
          }


          if (!isKOTButton) {
            navigate("/overview/order");
            setTimeout(() => {
              window.location.reload();
            }, 1);

          }

          setButtonClicked(true);
        } else {
          // Handle the case where fetching latest bill data failed
          console.error("Failed to fetch latest bill data:", latestBillDataResponse.status);
        }

        setBill({ ...initialBillState }); // Reset your bill state here
        console.log("Bill placed successfully");
        toast.success("Order placed successfully");

        setIsOrderPlacing(false);

        // ... existing code ...
      } else {
        if (response.status === 400) {
          const errorMessage = await response.text();
          console.error("Error:", errorMessage);
          toast.error(errorMessage);
          return;
         }
        // Request failed
        console.error("Request failed:", response.status);
        toast.error("Failed To submit the Order");
      }
    } catch (error) {
      setIsOrderPlacing(false);
      console.error("Error:", error);
      setMsg("Error: Failed to submit the order");
      toast.error("Failed To submit the Order");
    }
  };



  //=======================    handlesubmit    ====================

  const [isKot, setIsKot] = useState(false);
  const handleSubmit3 = async (event, isKOTButton) => {

    event.preventDefault();


    if (isKot) {
      return;
    }
    // Check if the cart is empty
    if (isCartEmpty()) {
      toast.error("Please add at least one item to the cart before placing the order.");
      return;
    }


    try {

      setIsKot(true);
      if (!bill.order || bill.order.length === 0) {
        console.error("No order data found.");
        return;
      }

      const payload = {
        bill: {
          ...bill,
          order: [
            {
              ...bill.order[0],
              ordstatus: isKOTButton ? "Running" : "completed", // Update ordstatus based on the button clicked
              orderFoods: bill.order[0]?.orderFoods?.map((food) => ({
                ...food,
                store_id: currentuser.storeid,
              })),
            },
          ],
        },
        orderFood: bill.order[0]?.orderFoods?.map((food) => ({
          ...food,
          store_id: currentuser.storeid,
        })),
      };

      console.log(payload);
      const response = await fetch("http://localhost:8083/sys/Bill/postbillOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // Fetch the latest bill data using the latest bill ID
        const latestBillDataResponse = await fetch(`http://localhost:8083/sys/Bill/getLastBill/${currentuser.storeid}`);

        if (latestBillDataResponse.ok) {
          const latestBillData = await latestBillDataResponse.json();

          if (isKOTButton) {

            if(bill.paymentmode){
              toast.error("Cannot select payment mode while placing Order & a KOT.please select Payment Mode as None.");
              return;
            }
            // Set the selectedOrder state to the latest bill data
            setSelectedOrder(latestBillData);


            // console.log(setSerialNo(latestBillData.serial_no));
            console.log(latestBillData);
            // Set the visibility of the modal to true
            setKOTModal(true);
            handleRefresh();

          }
          setButtonClicked(true);

  payload.bill.paymentmode = bill.paymentmode;


        } else {
          // Handle the case where fetching latest bill data failed
          console.error("Failed to fetch latest bill data:", latestBillDataResponse.status);
        }

        setBill({ ...initialBillState }); // Reset your bill state here
        console.log("Bill placed successfully");
        toast.success("Order placed successfully");

        setIsKot(false);

        // ... existing code ...
      } else {
        if (response.status === 400) {
          const errorMessage = await response.text();
          console.error("Error:", errorMessage);
          toast.error(errorMessage);
          setIsKot(false);
          return;
         }
        // Request failed
        console.error("Request failed:", response.status);
        toast.error("Failed To submit the Order");
      }
    } catch (error) {
      setIsKot(false);
      console.error("Error:", error);
      setMsg("Error: Failed to submit the order");
      toast.error("Failed To submit the Order");
    }
  };

  const submithandle = (e) => {
    e.preventDefault();

    const subtotal = bill?.order[0].orderFoods.reduce((prev, orderFood) => {
      return prev + orderFood.quantity * orderFood.price;
    }, 0);
    const taxAmounts = taxRates.map((rate) => (rate * subtotal) / 100);
    const totalTax = taxAmounts.reduce((acc, amount) => acc + amount, 0);
    const discountRate = (discount * subtotal) / 100;
    const total = subtotal - discountRate + totalTax;

    const updatedValues = {
      ...billData,
      total: total,
      discount: discount,
    };
    // Send the updated bill to the server
    axios
      .patch(
        "http://localhost:8083/sys/Bill/updateBillorder/" + orderId,
        updatedValues
      )
      .then((res) => {
        // navigate(`/pendingorder`);
        setBilldata({
          serial_no: id,
          id: "",
          contact: "",
          upbyname: "",
          crtbyname: "",
          paymentmode: "",
          tranid: "",
          gst: "",
          total: "",
          store_id: "",
          discount: "",
          order: [
            {
              orderFoods: [],
              ordstatus: "completed"
            },
          ],
        });

        console.log(billData.paymentmode);

      })
      .catch((err) => console.log(err));
  };


  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    if (
      name === "contact" ||
      name === "upbyname" ||
      name === "crtbyname" ||
      name === "paymentmode" ||
      name === "tranid" ||
      name === "gst" ||
      name === "total" ||
      name === "store_id" ||
      name === "discount"
    ) {
      setBill((prevBill) => ({
        ...prevBill,
        [name]: value,
      }));
    } else if (
      name === "tblno" ||
      name === "ordstatus" ||
      name === "crtby" ||
      name === "ordertype" ||
      name === "sid"
    ) {
      const updatedOrder = { ...bill.order[0] };
      updatedOrder[name] = value;

      setBill((prevBill) => ({
        ...prevBill,
        order: [
          {
            ...prevBill.order[0],
            ...updatedOrder,
          },
        ],
      }));
    } else if (
      name === "food_name" ||
      name === "category" ||
      name === "subcategory" ||
      name === "quantity" ||
      name === "price"
    ) {
      const updatedOrderFoods = bill.order[0]?.orderFoods.map(
        (food, foodIndex) => {
          if (foodIndex === index) {
            return { ...food, [name]: value };
          }
          return food;
        }
      );

      setBill((prevBill) => ({
        ...prevBill,
        order: [
          {
            ...prevBill.order[0],
            orderFoods: updatedOrderFoods,
          },
        ],
      }));
    }
  };

  const handleCartUpdate = (food, index, action) => {
    const updatedOrderFoods = [...(bill.order[0]?.orderFoods || [])];

    if (action === "add") {
      const { image, food_name, category, subcategory, price, sid } = food;
      const existingFoodIndex = updatedOrderFoods.findIndex(
        (item) => item.food_name === food_name && item.sid === sid
      );

      if (existingFoodIndex !== -1) {
        // If the food already exists in the cart, increase its quantity
        updatedOrderFoods[existingFoodIndex].quantity += 1;
      } else {
        // Add a new food to the cart
        updatedOrderFoods.push({
          food_name,
          category,
          subcategory,
          price,
          sid,
          quantity: 1,
          image,
        });
      }
    }

    setBill((prevBill) => ({
      ...prevBill,
      orderFoods: updatedOrderFoods,
    }));

    // Return the updatedOrderFoods directly
    return updatedOrderFoods;
  };

  const addToCart = (food) => {
    const updatedOrderFoods = handleCartUpdate(food, null, "add");

    setBill((prevBill) => ({
      ...prevBill,
      order: [
        {
          ...prevBill.order[0],
          orderFoods: updatedOrderFoods,
        },
      ],
    }));
  };



  const audioRef = useRef(null);

  const handleButtonClick = () => {
    // Play the beep sound when the button is clicked
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const init = () => {
    foodService
      .getFood()
      .then((res) => {
        // console.log(res.data);
        setFoodList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  //applied the search filter by neha
  const handleCategoryClick = (event, subcategory) => {
    event.preventDefault();
    setSelectedCategory(subcategory === selectedCategory ? null : subcategory);

    // Reset the searchInput state to an empty string
    setSearchInput("");

    // Reset the foodList state to the original data when using button filter
    if (subcategory === "All") {
      setFoodList(originalFoodList);
    } else {
      const filteredFoods = originalFoodList.filter(
        (food) => food.subcategory.toLowerCase() === subcategory.toLowerCase()
      );
      setFoodList(filteredFoods);
      setCategoryClicked(true);
    }
  };

  //applied the button filter by neha
  const handleFilterClick = (e) => {
    e.preventDefault();
    // Reset the selectedCategory state to null
    setSelectedCategory(null);

    // Apply filtering based on searchInput
    const filteredResults = originalFoodList.filter(
      (food) =>
        food.food_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        food.foodcode.toLowerCase().includes(searchInput.toLowerCase()) ||
        food.category.toLowerCase().includes(searchInput.toLowerCase()) ||
        food.subcategory.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFoodList(filteredResults);
  };

  //applied the search filter by neha
  const handleSearchInputChange = (e) => {
    const input = e.target.value.toLowerCase();

    // Update the search input state
    setSearchInput(input);

    // Apply filtering based on the updated searchInput
    const filteredResults = originalFoodList.filter(
      (food) =>
        food.food_name.toLowerCase().includes(input) ||
        food.foodcode.toLowerCase().includes(input) ||
        food.category.toLowerCase().includes(input) ||
        food.subcategory.toLowerCase().includes(input)
    );

    // Update the foodList state with the filtered results
    setFoodList(filteredResults);
  }

  const navigate = useNavigate();

  const [orderList, setOrderList] = useState([]);
  const fetchOrderList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      // Assuming you have stored the order list in a state variable called 'orderList'
      setOrderList(data);
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };

  const runningTables = orderList.reduce((acc, order) => {
    if (order.order[0]?.ordstatus === "Running") {
      acc.push(order.order[0].tblno);
    }
    return acc;
  }, []);

  const availableTables = [
    { number: "1", label: "1" },
    { number: "2", label: "2" },
    { number: "3", label: "3" },
    { number: "4", label: "4" },
    { number: "5", label: "5" },
    { number: "6", label: "6" },
    { number: "7", label: "7" },
    { number: "8", label: "8" },
    { number: "9", label: "9" },
    { number: "10", label: "10" },
    { number: "11", label: "11" },
    { number: "12", label: "12" },
    { number: "13", label: "13" },
    { number: "14", label: "14" },
    { number: "15", label: "15" },
    { number: "16", label: "16" },
    { number: "17", label: "17" },
    { number: "18", label: "18" },
    { number: "19", label: "19" },
    { number: "20", label: "20" },
    { number: "21", label: "21" },
    { number: "22", label: "22" },
    { number: "23", label: "23" },
    { number: "24", label: "24" },
    { number: "25", label: "25" },
    { number: "26", label: "26" },
    { number: "27", label: "27" },
    { number: "28", label: "28" },
    { number: "29", label: "29" },
    { number: "30", label: "30" },
    { number: "31", label: "31" },
    { number: "32", label: "32" },
    { number: "33", label: "33" },
    { number: "34", label: "34" },
    { number: "35", label: "35" },
    { number: "36", label: "36" },
    { number: "37", label: "37" },
    { number: "38", label: "38" },
    { number: "39", label: "39" },
    { number: "40", label: "40" },
    { number: "41", label: "41" },
    { number: "42", label: "42" },
    { number: "43", label: "43" },
    { number: "44", label: "44" },
    { number: "45", label: "45" },
  ];

  const filteredTables = availableTables.filter(
    (table) => !runningTables.includes(table.number)
  );

  // Handle Enter key press in the input field
  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFilterClick(e);
    }
  };




  const fetchStoreLogo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8083/api/auth/store/${currentuser.storeid}/logo`, {
        responseType: 'arraybuffer',
      });

      const imageBlob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      const imageUrl = URL.createObjectURL(imageBlob);
      setLogo(imageUrl);
    } catch (error) {
      console.error('Error fetching store logo:', error);
    }
  }, [currentuser.storeid]);

  useEffect(() => {
    fetchStoreLogo();
  }, [fetchStoreLogo]);


//----------------MINIMUM LEVEL ------------------
const [minilevelProducts, setMinilevelProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Make an HTTP GET request to your Spring Boot endpoint
    fetch(
     `http://localhost:8083/sys/Inventory/minilevel/${currentuser.storeid}`
    )
     .then((response) => response.json())
     .then((data) => {
        setMinilevelProducts(data);
        setLoading(false);
     })
     .catch((error) => console.error("Error:", error));
}, []);
  const playBeep = () => {
    const audioRef = new Audio("/sysbeep.mp3");
    audioRef.play();
  };

  // ------------ button code ------------
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    // Add a delay of 2 seconds (2000 milliseconds) before making the GET request
    const delay = 2000;

    const timer = setTimeout(() => {
      fetch(`http://localhost:8083/sys/Button/getbutton/${currentuser.storeid}`)
        .then((response) => response.json())
        .then((data) => setButtons(data))
        .catch((error) => console.error('Error:', error));
    }, delay);

    // Clear the timer when the component unmounts to prevent any potential memory leaks
    return () => clearTimeout(timer);
  }, []);


  const handleQuantityChange1 = (event, index) => {
    const newValue = parseInt(event.target.value, 10);

    if (!isNaN(newValue)) {
      // Update the quantity for the specific food item in the state
      const updatedBill = { ...bill };
      updatedBill.order[0].orderFoods[index].quantity = newValue;
      setBill(updatedBill);
    }
    // If the input is not a valid number, you can display an error message or take other actions as needed.
  };

  const handleQuantityChange = (event) => {
    // Ensure 'quantity' is defined before trying to set its value
    if (quantity !== undefined) {
      setQuantity(event.target.value);
    }
  };

  const foodTableRef = useRef();


  const [showFoodDetailsModal, setShowFoodDetailsModal] = useState(false); // Modal visibility
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  const toggleDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowFoodDetailsModal(false); // Close the modal
  };

  const componentRef = useRef();

  const redirectToPendingOrder = () => {
    setShowOrderDetailsModal(false);
        setKOTModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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

  const componentRefs = useRef();

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onAfterPrint: () => {
  //     console.log(`Selected Payment Mode: ${selectedPaymentMode}`);
  //     setShowOrderDetailsModal(false);
  
  //     //Add a delay before reloading the window (e.g., 1 second)
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 5000);
  //   },
  // });

  const handlePrint = useReactToPrint({
    content: () => document.getElementById('printable-content'),
    onBeforeGetContent: () => {
     const printInitiated = localStorage.getItem('printInitiated');
     if (printInitiated === 'true') {
        localStorage.setItem('printInitiated', 'false');
        return null;
     }
     return document.getElementById('printable-content');
    },
    onAfterPrint: () => {
     localStorage.setItem('printInitiated', 'true');

     // Refresh the main window after the print dialog closes
     const checkPrintWindow = window.setInterval(() => {
        if (window.document.hasFocus()) {
         window.clearInterval(checkPrintWindow);
         handleMainReload(); // Refresh the main window when focus returns to it
        }
     }, 5);
    },
});

const handleMainReload = () => {
  window.location.reload();
};
  

  const handlePaymentModeChange = (selectedMode) => {
    setPaymentModeSelected(true);
    setBilldata({
      ...billData,
      paymentmode: selectedMode,
    });
  };

  const [values, setValues] = useState({
    serial_no: "",
    id: "",
    contact: "",
    upbyname: "",
    crtbyname: "",
    paymentmode: "",
    tranid: "",
    gst: "",
    total: "",
    discount: "",

    store_id: currentuser.storeid,
    order: [
      {
        tblno: "",
        ordstatus: "completed",
        crtby: "",
        sid: "",
        ordertype: "",
        orderFoods: [],
      },
    ],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8083/sys/Tax/stores/${currentuser.storeid}/taxes`)
      .then((res) => {
        const taxData = res.data; // Assuming the API returns an array of tax objects
        const names = taxData.map((tax) => tax.name);
        const rates = taxData.map((tax) => tax.rate);
        setTaxNames(names);
        setTaxRates(rates);
      })
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:8083/sys/Bill/getBillByID/${id}`)
      .then((res) => {

        const billData = res.data;

        setValues({
          ...values,
          contact: billData.contact,
          upbyname: billData.upbyname,
          crtbyname: billData.crtbyname,
          paymentmode: billData.paymentmode,
          tranid: billData.tranid,
          gst: billData.gst,
          total: billData.total, // Update with the appropriate field from the response
          store_id: billData.store_id,
          discount: billData.discount,
          order: [
            {
              ...billData.order[0],
              ordstatus: "completed", // Replace with the desired order status value
            },
          ],
          orderFoods: billData.orderFoods,
        });
      }).catch((err) => console.log(err));
  }, [id, currentuser.storeid]);



  const [floorTables, setFloorTables] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch floor tables data or use your existing logic
    // ...

    // Set initial selected order type
    setSelectedOrderType(bill.order[0]?.ordertype);
  }, [bill.order]);

  const handleOrderTypeChange = (event) => {
    const newOrderType = event.target.value;
    setSelectedOrderType(newOrderType);

    // If Dine In is selected, open the modal
    if (newOrderType === "Dine In") {
      setModalOpen(true);
    }
  };
  const [selectedTableNumber, setSelectedTableNumber] = useState(null);


  // const handleTableSelection = (selectedTable) => {
  //   // Perform any actions needed when a table is selected
  //   // For example, update the state or call a function to handle the selected table
  //   // Update the state or perform actions to set the selected table in the bill
  //   setBill((prevBill) => {
  //     const updatedOrder = [...prevBill.order];
  //     updatedOrder[0].tblno = selectedTable.tablename; // Assuming tablename is the value you want to set
  //     return { ...prevBill, order: updatedOrder };
  //   });

  //   setSelectedTableNo([selectedTable.tablename]); // Initialize as an array

  //   // Close the modal if needed
  //   setModalOpen(false);
  // };



  useEffect(() => {
    const fetchFloorTables = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/sys/floortable/getTablebystoreid/${currentuser.storeid}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const floorTablesData = await response.json();
        setFloorTables(floorTablesData);
      } catch (error) {
        console.error("Error fetching floor tables:", error);
      }
    };

    fetchFloorTables();
  }, []);

  //console.log(floorTables);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      // Handle Enter key press
      handleIncrement(index);
      handleButtonClick();
    } else if (event.key === "Backspace") {
      // Handle Backspace key press
      if (event.target.value === "" || event.target.value === "0") {
        // If input is empty or already 0, clear the quantity
        handleClearQuantity(index);
      }
    }
    // Add more conditions or logic for other keys if necessary
  };
  
  // const handleClearQuantity = (index) => {
  //   // Set quantity to 0 or perform any other logic to clear the quantity
  //   // For example, assuming handleQuantityChange sets the quantity
  //   handleQuantityChange({ target: { value: 0 } }, index);
  // };
  
  const handleClearQuantity = (index) => {
    // Ensure 'quantity' is defined before trying to set its value
    if (quantity !== undefined) {
      setQuantity(0);
     handleQuantityChange({ target: { value: 0 } }, index);
    }
  };
  

  return (
    <div style={{ overflow: "hidden", height: "100vh" }}>
      <div className="formbody overview animation">
        <form onSubmit={handleSubmit}>
          <div>
            <p style={{ margin: "0px" }}></p>
          </div>
          <marquee behvior="scroll" direction="left">
            <ol style={{ display: "inline" }}>
             {minilevelProducts.map((product, index) => (
                <li key={index} style={{ display: "inline", color: "red" }}>
                 {product}
                </li>
             ))}
            </ol>
         </marquee>

          <div class="row22">
            <div class="col">


              <div className="tab1"
                style={{
                  display: "flex",
                  justifyContent: "",
                  marginTop: "1vh",
                  marginLeft: "14vw",
                }}
              >
                <Link to={"/pendingorder"}>
                  <button
                    className="btn btn-warning" style={{ width: "17vh", marginRight: "1vh", color: "white", height: "6vh", fontSize: "1.9vh", fontWeight: "500" }}
                    title="Alt+R"
                  >
                    Running Order
                  </button>

                </Link>

                <Link to={"/overView/order"}>
                  <button
                    className="btn btn-success"
                    style={{ width: "17vh", marginRight: "1vh", color: "white", height: "6vh", fontSize: "1.9vh", fontWeight: "500" }}
                    title="Alt+N"
                  >
                    New Order
                  </button>
                </Link>

                <Link to={"/overView/order_list"}>
                  <button
                    className="btn btn-primary"
                    style={{ width: "17vh", marginRight: "1vh", color: "white", height: "6vh", fontSize: "1.9vh", fontWeight: "500" }}
                    title="Alt+O"
                  >
                    Order List
                  </button>
                </Link>

                <input
                  type="text"
                  placeholder=" &#128269; Search..."
                  style={{
                    border: "2px solid #03989e",
                    fontSize: "1.7vh",
                    width: "25vh",
                    marginRight: "1vh",
                  }}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  
                  
                />
                {/* <button
                  className="btn btn-success "
                  style={{ width: "12vh", marginRight: "2vh", color: "white", height: "6vh", fontSize: "2vh" }}

                  onClick={handleFilterClick}
                >
                  Search
                </button> */}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    marginBottom: "20px",
                    marginTop: "-6vh",
                    marginLeft: "6.5vh",
                    marginRight: "3vw",
                    height: "90vh",
                    overflowY: "auto",
                    scrollbarWidth: "0px",
                    textAlign: "center"
                  }}
                  className="btn2"
                >
                  <button
                    className={`btn ${selectedCategory === "All" ? "btn-success" : "btn-success"
                      } m-1`}
                    onClick={(e) => handleCategoryClick(e, "All")}

                  >
                    All
                  </button>
                  <button
                    className={`btn btndanger1 ${selectedCategory === "Addon" ? "btn-danger" : "btn-outline-danger"
                      } m-1`}
                    onClick={(e) => handleCategoryClick(e, "Addon")}

                  >
                    Addon
                  </button>

                  {buttons.map((button) => (

                    <button
                      key={button.id}
                      className={`btn btnsuccess1 ${selectedCategory === button.butName ? "btn-success" : "btn-outline-success"} m-1`}
                      onClick={(e) => handleCategoryClick(e, button.butName)}
                      title={button.butName}
                    >
                      {button.butName.substring(0, 10)}
                    </button>
                  ))}

                </div>

                <div
                  className="row row77"
                  style={{
                    height: "85vh",
                    marginTop: "1vh",
                    marginleft: "-6vh",
                    overflowY: "auto",
                    scrollbarWidth: "0px",
                    width: "54vw",
                    maxWidth: "54vw",
                  }}
                >
                  {foodList.map((food, index) => (
                    <div
                      className="col-md-3 p-1"
                      key={index}
                      style={{ height: "28vh", marginRight: "-1vw", marginBottom: "-6vh" }}
                      onClick={() => {
                        addToCart(food);
                        playBeep(); // Play beep sound
                      }}
                    >
                      <Card
                        className={`my-2 cardss ${food.category === "veg" ? "veg-border" :
                          food.category === "nonveg" ? "nonveg-border" :
                            food.category === "egg" ? "egg-border" : ""}`}
                        style={{
                          width: "12vw",
                          height: "20vh",
                          borderRadius: "5px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}>
                        <div>
                          {food.image ? (
                            <img
                              variant="top"
                              src={"https://drive.google.com/uc?export=view&id=" + food.image}
                              style={{
                                height: "12vh",
                                width: "11vw",
                                borderRadius: "10px",
                                marginRight: "-10px",
                                marginLeft: "-12px",
                                marginTop: "-17px",
                              }}
                              alt="Food Image"
                            />
                          ) : (
                            <>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "12vh" }}>
                                <h6 className="text-center" style={{ color: "black", fontSize: "2.2vh" }} title={food.food_name}>
                                  {food.food_name.length > 40 ? food.food_name.substring(0, 40) + "..." : food.food_name}
                                </h6>
                              </div>

                              <h6 className="text-center" style={{
                                color: "black",
                                fontSize: "2.2vh",
                                position: "absolute",
                                bottom: "0",
                                left: "50%",
                                transform: "translateX(-50%)", // Center horizontally
                                marginBottom: "5px", // Adjust as needed
                              }}>
                                {currentuser.currency}
                                {food.price}
                              </h6>
                            </>
                          )}
                          {food.image && food.name && <p>{food.name}</p>}
                        </div>

                        {food.image && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              width: "100%",
                              padding: "-2.5vh",
                            }}
                          >
                            <h6
                              className="text-center"
                              style={{ color: "black", fontSize: "2.2vh" }}
                              title={food.food_name}
                            >
                              {food.food_name.length > 15
                                ? food.food_name.substring(0, 15) + "..."
                                : food.food_name}
                            </h6>
                            <h6 className="text-center" style={{ color: "black", fontSize: "2.2vh" }}>
                              {currentuser.currency}
                              {food.price}
                            </h6>
                          </div>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div class="row p-4" style={{ marginTop: "-3.1vh", marginLeft: "-38.5vw" }}>
              <div className="col-md-12" style={{ marginleft: "-50vw" }}>
                <div className="card  mt-3" style={{ marginLeft: "1vw", borderRadius: "2vh", height: "72vh" }}>
                  <table
                    style={{
                      marginTop: "-1vh",
                      marginBottom: "2vh",
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "-0.5vh",
                    }}
                  >
                    {/* Order Type */}
                    <tr>
                      <th
                        className="text-center"
                        style={{ width: "6vw", minWidth: "6vw", fontSize: "1.8vh" }}
                      >
                        Order Type :{" "}
                      </th>
                      <td>
                        <select
                          name="ordertype"
                          className="form-select"
                          style={{
                            width: "6.5vw",
                            minWidth: "6.5vw",

                            fontSize: "1.5vh",
                          }}
                          onChange={handleInputChange}
                          value={bill.order[0]?.ordertype}
                          required
                        >
                          <option className="font-weight-bold text-primary" value="">
                            Select
                          </option>
                          <option className="font-weight-bold text-info" value="Dine In">
                            Dine In
                          </option>
                          <option className="font-weight-bold text-danger" value="Take Away">
                            Take Away
                          </option>
                        </select>
                      </td>
                    </tr>

                    {/* Table No */}
                    {bill.order[0]?.ordertype === "Dine In" && (
                      <tr style={{ marginLeft: "2vh", fontSize: "1.8vh", marginleft: "-2vh" }}>
                        <th className="text-right">Table No :</th>
                        <td>
                          <select
                            name="tblno"
                            style={{
                              width: "6.5vw",
                              fontSize: "1.5vh",
                              minWidth: "6.5vw",
                              marginLeft: "4px",
                            }}
                            className="form-select"
                            onChange={handleInputChange}
                            value={bill.order[0]?.tblno}
                            required
                          >
                            <option className="font-weight-bold text-primary" value="">
                              Select
                            </option>
                            {filteredTables.map((table) => (
                              <option
                                key={table.number}
                                className="font-weight-bold text-success"
                                value={table.number}
                              >
                                {table.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )}

                    
                  </table>
                  {/* Payment Mode */}
                  <tr style={{ marginTop: "-2.5vh", verticalAlign: "middle"  }}>
  <th className="text-left" style={{ fontSize: "1.8vh", verticalAlign: "middle" }}>Payment:</th>
  <td style={{ whiteSpace: 'nowrap' }}>
    <div className="form-check form-check-inline" style={{ marginLeft: "10px" }}>
      <input type="radio" id="cash" name="paymentmode" style={{ marginTop: "1.5vh" }} className="form-check-input" value="cash" onChange={handleInputChange} checked={bill.paymentmode === "cash"} required />
      <label htmlFor="cash" className="form-check-label font-weight-bold text-info">Cash</label>
    </div>

    <div className="form-check form-check-inline" style={{ marginLeft: "10px" }}>
      <input type="radio" id="card" style={{ marginTop: "1.5vh" }} name="paymentmode" className="form-check-input" value="card" onChange={handleInputChange} checked={bill.paymentmode === "card"} required />
      <label htmlFor="card" className="form-check-label font-weight-bold text-dark">Card</label>
    </div>

    <div className="form-check form-check-inline" style={{ marginLeft: "10px" }}>
      <input type="radio" id="upi" style={{ marginTop: "1.5vh" }} name="paymentmode" className="form-check-input" value="upi" onChange={handleInputChange} checked={bill.paymentmode === "upi"} required />
      <label htmlFor="upi" className="form-check-label font-weight-bold text-success">UPI</label>
    </div>

    <div className="form-check form-check-inline" style={{ marginLeft: "10px" }}>
      <input type="radio" id="none" style={{ marginTop: "1.5vh" }} name="paymentmode" className="form-check-input" value="" onChange={handleInputChange} required />
      <label htmlFor="none" className="form-check-label font-weight-bold text-secondary">None</label>
    </div>
  </td>
</tr>


                  <tr>
                  <th className="text-left" style={{ fontSize: "1.8vh", verticalAlign: "middle" }}>
                      Discount Rate :
                  </th> 
                  
                  <td style={{ marginLeft:"5vh"}}>
                 
                        <input
                           className="w-full rounded-r-none bg-white shadow-sm"
                           type="number"
                           name="tax"
                           id="tax"
                           min="0.01"
                           max
                           style={{fontSize:"1.7vh",width:"4vw"}}
                           step="0.01"
                           placeholder="0.0"
                           value={discount}
                           onChange={(event) => setDiscount(event.target.value)}
                        />
                </td>


                  
                  <p></p>

                  </tr>
                  <div className="card-header p-1 text-center d-flex align-items-center justify-content-center" style={{ backgroundColor: "#03989e", borderRadius: "5px" }}>
                    <div className="text-white m-0" style={{ fontSize: "2.5vh", fontWeight: "500" }}>
                      <i className="fa-solid fa-cart-plus"></i> Order Details
                    </div>
                  </div>


                  <div
                    className="card-body card-body2 "
                    style={{
                      height: "50vh",
                      maxHeight: "50vh",
                      overflowX: "hidden",
                      marginleft: "auto",
                      overflowY: "auto",
                    }}
                  >
                    <table class="table table-hover" style={{marginTop:"-3.5vh"}}>
                      <thead className="tbody22" >
                        <tr  style={{color: "black"}}>
                          <th className="text-center px-1 col-1" scope="col">Sr.No</th>
                          <th className="text-center px-2 col-1" scope="col">Item</th>
                          <th className="text-center px-2 col-1" scope="col">Price</th>
                          <th className="text-center px-2 col-1" scope="col">Quantity</th>
                          <th className="text-left  px-2 col-1" scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody className="tbody22" ref={foodTableRef} id="foodTable">

                        {bill.order[0]?.orderFoods &&
                          bill.order[0]?.orderFoods.slice().map((food, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  {/* <th scope="row">1</th> */}
                                  <td className="text-center" style={{ fontSize: "1.8vh" }}>
                                    {" "}
                                    <>{index + 1}</>
                                  </td>
                                  <td
                                    className="text-center"
                                    name="food_name"
                                    value={food.food_name}
                                    style={{ fontSize: "1.8vh" }}
                                    onChange={(event) =>
                                      handleInputChange(event, index)
                                    }
                                  >
                                    <>{food.food_name} </>
                                  </td>
                                  <td className="text-center" style={{ fontSize: "1.8vh" }}>

                                    <>{food.price}</>
                                  </td>

                                  <td className="text-center" style={{ minWidth: "7vw", marginLeft: "-10vw" }}>
                                    <strong style={{ display: "flex", flexDirection: "row" }}>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-success mr-1"
                                        onClick={() => { handleDecrement(index); handleButtonClick(food); }}
                                        style={{width: "1.6vw",height: "1.6vw",display: "flex",alignItems: "center",justifyContent: "center",}}>
                                        <i className="fa-solid fa-minus"></i>
                                      </button>
                                      
                                      <input
                                        type="text"
                                        className="text-center"
                                        value={bill.order[0]?.orderFoods[index].quantity}
                                        min="0"
                                        style={{
                                          width: "3vw",
                                          fontSize: "1.8vh",
                                          textAlign: "center",
                                          verticalAlign: "middle",
                                          lineHeight: "1.2",
                                        }}
                                        onChange={(event) => handleQuantityChange1(event, index)}
                                        onKeyDown={(event) => handleKeyDown(event, index)} // Add this line for keyboard input
                                      />

                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-success ml-1"
                                        onClick={() => { handleIncrement(index); handleButtonClick(food); }}
                                        style={{
                                          width: "1.8vw",
                                          height: "1.6vw",
                                          fontWeight: "bolder",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <i className="fa-solid fa-plus"></i>
                                      </button>
                                    </strong>
                                  </td>

                                  <td
                                    className="text-center"
                                    style={{
                                      color: "red",
                                      fontSize: 20,
                                      cursor: "pointer",
                                    }}>
                                    <button
                                      className="btn btn-sm btn-outline-danger mb-3"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        handleDelete(event, index); // Pass the event object
                                      }}
                                      style={{
                                        fontSize: "2vh",
                                        width: "4vh", // Set the desired width
                                        height: "4vh", // Set the desired height
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "2vh",
                                      }}>
                                      <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <h5 className="text-end text-light p-2"
                    style={{backgroundColor: "#03989e",borderRadius: "5px",fontSize: "2.6vh",marginBottom:"-2vh"}}
                  >
                    <strong className="text-light">
                      Total {currentuser.currency} : {price}
                    </strong>
                  </h5>
                </div>
              </div>

              <div
                className="col"
                style={{ display: "flex", marginLeft: "3vh", marginTop: "-1.8vh" }}
              >
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleCalculatorSubmit}
                  style={{
                    height: "5vh",
                    fontSize: "0.8vw",
                    width: "2.5vw",
                    display: "flex", // Center horizontally
                    alignItems: "center", // Center vertically
                    justifyContent: "center", // Center horizontally
                  }}
                >
                  <i
                    className="fa-solid fa-calculator"
                    style={{ fontSize: "3vh" }}
                  ></i>
                </button>


                <Modal
                  show={show}
                  onHide={handleClose}
                  size={minimized ? "sm" : null}
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '330px' }}
                >
                  {!minimized && <Modal.Title></Modal.Title>}
                  <Calculator />
                </Modal>


                <button
                  className="btn btn-success btn-lg"
                  type="submit"
                  onClick={(event) => {handleSubmit(event, true);
                  handleRefresh()}} // Pass true for KOT button
                  style={{
                    height: "5vh",
                    fontSize: "1.0vw",
                    fontWeight: "bolder",
                    marginLeft: "20px",
                    display: "flex",
                    alignItems: "center",  // Center vertically
                    justifyContent: "center",  // Center horizontally
                  }}
                  disabled={isCartEmpty() || buttonClicked || isSubmitting}  // Disable if cart is empty or payment mode is not selected
                >
                  Quick Bill
                </button>


                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  onClick={(event) => {
                    handleSubmitOrder(event, false);
                    handleRefresh();
                  }}

                  style={{
                    height: "5vh",
                    fontSize: "1.0vw",
                    fontWeight: "bolder",
                    width: "10vw",
                    marginLeft: "20px",
                    display: "flex",
                    alignItems: "center",  // Center vertically
                    justifyContent: "center",  // Center horizontally
                  }}
                  disabled={isCartEmpty()  || buttonClicked}
                >
                  <i className="fa-solid fa-cart-plus"></i> Place Order
                </button>


                <button
                  className="btn btn-success btn-lg"
                  type="submit"
                  onClick={(event) => {handleSubmit3(event, true);
                  handleRefresh()}} // Pass true for KOT button
                  style={{
                    height: "5vh",
                    fontSize: "1.0vw",
                    fontWeight: "bolder",
                    width: "7vw",
                    marginLeft: "20px",
                    display: "flex",
                    alignItems: "center",  // Center vertically
                    justifyContent: "center",  // Center horizontally
                  }}
                  disabled={isCartEmpty()  || buttonClicked || isKot}
                >
                  KOT
                </button>

              </div>
              <div></div>
              <button onClick={() => handleRefresh()} style={{marginLeft:"10vh",marginTop:"-10vh"}}>Refresh Component</button>
            </div>
          </div>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ marginTop: "5vh", marginRight: "7vw" }}
        />
      </div>

      <Modal show={showOrderDetailsModal} onHide={() => setShowOrderDetailsModal(false)} centered style={{ width: '500px', height: '600px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
  <Modal.Header centered>
    {/* Quick Bill */}
  </Modal.Header>
  <Modal.Body>
    <div className="text-center">
    <div class="sa-icon sa-success animate">
          <span class="sa-line sa-tip animateSuccessTip"></span>
          <span class="sa-line sa-long animateSuccessLong"></span>
          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
      <h4 style={{ fontFamily: "sans-serif" }}>Order Placed Successfully !!!</h4>
      <h6 style={{ fontFamily: "sans-serif" }}>Do You Want to Print Bill ?</h6>
    </div>
  </Modal.Body>
  <Modal.Footer style={{ justifyContent: "center" }}>
   
      <Button variant="danger" onClick={() => redirectToPendingOrder()}>NO</Button>
      <button type="submit" className="btn btn-primary" style={{}}
        onClick={(e) => {
          handlePrint();
    }}>
        <i className="fas fa-print"style={{}}></i>Print
      </button>
   

    {billData.paymentmode === "" && <div style={{ fontSize: "1.7vh", textAlign: "center" }}></div>}
  </Modal.Footer>
</Modal>



<Modal show={KOTModal} onHide={() => setKOTModal(false)} centered style={{ width: '500px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
  <Modal.Header>
    KOT
  </Modal.Header>
  <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div>
      <div class="check_mark">
        <div class="sa-icon sa-success animate">
          <span class="sa-line sa-tip animateSuccessTip"></span>
          <span class="sa-line sa-long animateSuccessLong"></span>
          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
      </div>
      <h4 className="text-center" style={{ fontFamily: "sans-serif" }}>
        Order Placed Successfully !!!!
      </h4>
    
      <h6 className="text-center" style={{ fontFamily: "sans-serif" }}>
        Do you Want to Print Token No.???
      </h6>
    </div>
  </Modal.Body>
  <Modal.Footer style={{ justifyContent: "center" }}>
    <Button variant="danger" onClick={() => redirectToPendingOrder()}>
      NO
    </Button>
    <Button variant="primary" onClick={() => handlePrintKOT()}>
      Print KOT
    </Button>
  </Modal.Footer>
</Modal>



      



      <div ref={KOTContentRef} className="content-container">
        <h3 className="text-center" style={{ fontSize: "6vh" }} > KOT </h3>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: "5vh", marginRight: "5vh" }}>
          <p>Order NO : {selectedOrder && selectedOrder.order[0]?.oid}</p>
          <p>table No : {selectedOrder && selectedOrder.order[0]?.tblno}</p>
        </div>

        <p style={{ marginLeft: "5vh" }}>Order Type: {selectedOrder && selectedOrder.order[0]?.ordertype}</p>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedOrder &&
              selectedOrder.order[0]?.orderFoods &&
              selectedOrder.order[0]?.orderFoods.map((fooditem, foodIndex) => (
                <tr key={foodIndex}>
                  <td>{foodIndex + 1}</td>
                  <td>{fooditem.food_name}</td>
                  <td>{fooditem.quantity}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>


      <form onSubmit={(e) => submithandle(e)} style={{ display: "none" }}>
        <div
         class="card text-center "
         id="printable-content"
         style={{ background: "white" }}
         // ref={componentRef}
         ref={componentRefs}
        >
         {selectedOrder && (
            <div class="">
             <div>
             {currentuser.logoUrl && (
    <img
     src={logo}
     className="rounded"
     alt=""
     style={{
        margin: "0px auto",
        display: "block",
        width: "330px",
        minWidth: "330px",
        height: "330px"
     }}
    />
)}
             </div>
             <div class="dark-border" style={{marginTop:"-10px"}}></div>
             <h1
                class="text-center font-weight-bold"
                style={{
                 fontSize: "3vh",
                 fontFamily: "Bitstream Vera Sans Mono, monospace",
                 fontWeight: "800",
                }}
             >
                {currentuser.storeName}{" "}
             </h1>
             <div class="dark-border" style={{marginTop:"-10px"}}></div>
             <h1
                class=" text-center "
                style={{
                 fontSize: "3vh",
                 fontFamily: "Bitstream Vera Sans Mono, monospace",
                 fontWeight: "800",
                }}
             >
                {currentuser.saddress}
             </h1>
             <h1
                class=" text-center "
                style={{
                 fontSize: "3vh",
                 fontFamily: "Bitstream Vera Sans Mono, monospace",
                 fontWeight: "800",
                }}
             >
                Contact No: {currentuser.contact}
             </h1>
             <h1
                class=" text-center "
                style={{
                 fontSize: "3vh",
                 fontFamily: "Bitstream Vera Sans Mono, monospace",
                 fontWeight: "800",
                }}
             >
                GST NO : {billData.gst}
             </h1>
             <div class="dark-border" style={{marginTop:"-10px"}}></div>
             <div style={{ fontSize: "3vh" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                 <h1
                    className="text-start "
                    style={{
                     fontSize: "3vh",
                     fontFamily: "Bitstream Vera Sans Mono, monospace",
                     fontWeight: "800",
                    }}
                 >
                    Bill No:{selectedOrder.id} Date:{today} <br/>{timeInAMPM}{" "}
                 </h1>
                 <h1
                    className="text-end "
                    style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' , fontWeight:"800"}}
                 >
                    Cashier:{currentuser.username}{" "} PaymentMode:{selectedOrder.paymentmode}{" "}<br/>Table No:{selectedOrder?.order.length > 0 ? selectedOrder?.order[0].tblno : " "}

                 </h1>
            </div>
            </div>
                 {/* <h1
                    className="text-end"
                    style={{
                     fontSize: "3vh",
                     fontFamily: "Bitstream Vera Sans Mono, monospace",
                     fontWeight: "800",
                     whiteSpace: "pre-line", // Ensures newlines are rendered
                    }}
                 >
                    Cashier: {currentuser.username}

                    PaymentMode: {selectedOrder.paymentmode}

                    Table No:{" "}
                    {selectedOrder?.order.length > 0
                     ? selectedOrder?.order[0].tblno
                     : ""}
                 </h1>
                </div>
             </div> */}

             <div
                class=""
                style={{ justifyContent: "space-between", margin: "center" }}
             >
                <div class="">
                 <h1 className="text-start " style={{ fontSize: "3vh" }}></h1>
                </div>
                <div class="">
                 <h1 className="text-end " style={{ fontSize: "3vh" }}>
                    {" "}
                 </h1>
                </div>
             </div>
             <div class="" style={{}}>
                <div class="">
                 <h1 className="text-start " style={{ fontSize: "3vh" }}></h1>
                </div>
                <div>
                 <h1
                    className="text-start "
                    style={{ fontSize: "3vh", justifyContent: "space-between" }}
                 ></h1>
                </div>
             </div>
             <div class="dark-border" style={{marginTop:"-10px"}}></div>
             <div
                style={{
                 fontSize: "3vh",
                 width: "105%",
                 display: "flex",
                 flexDirection: "column",
                }}
             >
                <div
                 style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "0.5rem",
                 }}
                >
                 <div
                    style={{
                     flex: "0.3",
                     textAlign: "start",
                     fontSize: "3vh",
                     fontWeight: "800",
                    }}
                 >
                    Sr.
                 </div>
                 <div
                    style={{
                     flex: "1.2",
                     textAlign: "start",
                     fontSize: "3vh",
                     fontWeight: "800",
                    }}
                 >
                    Item
                 </div>
                 <div
                    style={{
                     flex: "0.1",
                     textAlign: "start",
                     fontSize: "3vh",
                     fontWeight: "800",
                    }}
                 >
                    Qty
                 </div>
                 <div
                    style={{
                     flex: "0.6",
                     textAlign: "center",
                     fontSize: "3vh",
                     fontWeight: "800",
                    }}
                 >
                    Rate
                 </div>
                 <div
                    style={{
                     flex: "0.7",
                     textAlign: "center",
                     fontSize: "3vh",
                     fontWeight: "800",
                    }}
                 >
                    Amt
                 </div>
                </div>
                {selectedOrder?.order[0].orderFoods.map((orderFood, num) => (
                 <div
                    style={{
                     display: "flex",
                     flexDirection: "row",
                     marginBottom: "0.5rem",
                     fontWeight: "600"
                    }}
                    key={num}
                 >
                    <div
                     style={{
                        flex: "0.3",
                        textAlign: "start",
                        fontSize: "3vh",
                        fontWeight: "600",
                     }}
                    >
                     {num + 1}.
                    </div>
                    <div
                     style={{
                        flex: "1.2",
                        textAlign: "start",
                        fontSize: "3vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",
                     }}
                    >
                     {orderFood.food_name}
                    </div>
                    <div
                     style={{
                        flex: "0.1",
                        textAlign: "center",
                        fontSize: "3vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",
                     }}
                    >
                     {orderFood.quantity}
                    </div>
                    <div
                     style={{
                        flex: "0.6",
                        textAlign: "right",
                        fontSize: "3vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",
                     }}
                    >
                     {orderFood.price.toFixed(2)}
                    </div>
                    <div
                     style={{
                        flex: "0.7",
                        textAlign: "center",
                        fontSize: "3vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",
                     }}
                    >
                     {(orderFood.quantity * orderFood.price).toFixed(2)}
                    </div>
                 </div>
                ))}
             </div>

        
            <div class="dark-border" style={{marginTop:"-10px"}}></div>
             <div>
                <h4
                 className="font-weight-bold"
                 class="text-left"
                 style={{
                    fontSize: "3vh",
                    fontFamily: "Bitstream Vera Sans Mono, monospace",
                    fontWeight: "800",
                 }}
                >
                 Total Qty:{" "}
                 {selectedOrder?.order[0].orderFoods.reduce(
                    (total, orderFood) => {
                     return total + orderFood.quantity;
                    },
                    0
                 )}
                </h4>
                <div class="dark-border" style={{marginTop:"-10px"}}></div>
                <div>
                 <span>
                    <h1
                     className="text-right"
                     style={{
                        fontSize: "3vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",
                     }}
                    >
                     Sub Total: {currentuser.currency.toUpperCase()}
                     {subtotal1}
                    </h1>
                 </span>
                </div>
             </div>
             <div class="">
                <div class=" text-right ">
                 <span>
                    <h1
                     className=""
                     style={{
                        fontSize: "3vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",
                     }}>
                     Discount ({discount || "0"}%): {currentuser.currency.toUpperCase()}
                 {discountRate1.toFixed(2)}
                    </h1>
                 </span>
                </div>
             </div>
             <div>
                <div
                 class=" text-right "
                 style={{
                    fontSize: "3vh",
                    fontFamily: "Bitstream Vera Sans Mono, monospace",
                    fontWeight: "800",
                 }}
                >
                 <span>
                    {taxNames.map((taxName, index) => (
                     <div key={index}>
                        <span>
                         <h1 className="" style={{ fontSize: "3vh" ,fontFamily: "Bitstream Vera Sans Mono, monospace",
                        fontWeight: "800",}}>
                            {taxName} ({taxRates[index]}% ):{" "}
                            {currentuser.currency}
                            {taxAmounts1[index].toFixed(2)}
                         </h1>
                        </span>
                     </div>
                    ))}
                 </span>
                </div>
             </div>
             <div class="dark-border" style={{marginTop:"-10px"}}></div>
             <div class="">
                <div class=" fs-4 text-right">
                 <h1
                    className="font-weight-bold"
                    style={{
                     fontSize: "3.5vh",
                     fontFamily: "Bitstream Vera Sans Mono, monospace",
                     fontWeight: "1000",
                    }}
                 >
                    {" "}
                    Grand Total: {currentuser.currency.toUpperCase()}
                    {/* {totall % 1 === 0 ? totall : totall} */}
                 {""}{total1.toFixed(2)}
                 </h1>
                </div>
             </div>
             <div class="dark-border" style={{marginTop:"-10px"}}></div>

             <div>
    {qrCodeImage ? (
        <div>
            <h1
                class="card-text text-center "
                style={{ fontSize: "3.2vh", fontWeight: "800" }}
            >
                Scan & pay
            </h1>
            <img src={qrCodeImage} alt="QR Code" style={{ width: "40vw", height: "30vh" }} />
        </div>
    ) : // Display a placeholder or blank image when qrCodeImage is null
    null}
    {/* ------------------ rushikesh made this code end here {or scanner}------------------ */}

    <h1
        class="card-text text-center "
        style={{
            fontSize: "3vh",
            fontFamily: "Bitstream Vera Sans Mono, monospace",
            fontWeight: "800",
        }}
    >
        THANKS!!! VISIT AGAIN
    </h1>
    <h1 class="card-text text-center " style={{ fontSize: "3vh", fontWeight: "800" }}>
        www.ubsbill.com
    </h1>
    <br></br>
    <br></br>
    <br></br>
</div>

            </div>
         )}
        </div>
     </form>

    </div>


  );
};

//Date Filter Applied bY Neha to Order List
/*{----------------------------    Order List   ----------------------------------------}*/

export const Order_list = () => {
  const currentuser = authService.getCurrentUser();
  const [orderList, setOrderList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [retrievedOrders, setRetrievedOrders] = useState([]);
  const ref = useRef();
  const [downloadLink, setDownloadLink] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null);     // State for end date
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange,startDate,endDate]);

  const [msg, setMsg] = useState("");

  {/* ---------------------------------------Neha made this code ---------------------------*/ }

  // Inside your `init` function, make sure to set billList as an array
  const init = () => {
    billService.getAllBill()
      .then((res) => {
        // Check if the response data is an array before setting it as billList
        if (Array.isArray(res.data)) {
          setOrderList(res.data);
        } else {
          setOrderList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



 const fetchData = () => {
    const url = `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`;

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
        const todayBills = json.filter(item => item.billdate === today);
        const sortedTodayBills = todayBills.sort((a, b) => {
          // Convert the date strings to Date objects for comparison
          const dateA = new Date(a.order[0].crtdate);
          const dateB = new Date(b.order[0].crtdate);

          // Sort in descending order
          return dateB - dateA;
        });
        setOrderList(sortedTodayBills);
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

  const fetchDataByDateRange = () => {
    if (!startDate || !endDate) {
      // Display an error message if start date or end date is not selected
      toast.error('Please select both Start Date and End Date.');
      return; // Stop further processing
    }

    // Set the time part of startDate to the beginning of the day (midnight)
    startDate.setHours(0, 0, 0, 0);

    // Set the time part of endDate to the end of the day (just before midnight)
    endDate.setHours(23, 59, 59, 999);

    const url = `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`;

    // You can append the start date and end date as query parameters to the URL
    const startDateParam = `startDate=${startDate.toISOString().split('T')[0]}`;
    const endDateParam = `endDate=${endDate.toISOString().split('T')[0]}`;

    const queryParameters = [startDateParam, endDateParam].join('&');
    const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;

    console.log('Full URL:', fullUrl); // Debugging log

    fetch(fullUrl)
      .then((response) => response.json())
      .then((json) => {
        // Filter the data based on the selected date range
        const filteredData = json.filter((item) => {
          const orderDate = new Date(item.billdate);
          console.log('orderDate:', orderDate);

          // Set the time part of orderDate to the beginning of the day (midnight)
          orderDate.setHours(0, 0, 0, 0);

          // Check if the orderDate is greater than or equal to startDate and less than or equal to endDate
          const isAfterStartDate = orderDate >= startDate;
          const isBeforeEndDate = orderDate <= endDate;
          console.log('isAfterStartDate:', isAfterStartDate);
          console.log('isBeforeEndDate:', isBeforeEndDate);

          return isAfterStartDate && isBeforeEndDate;
        });

        console.log('Filtered Data:', filteredData); // Debugging log

        setOrderList(filteredData);
        setSerachApiData(json);
        setMsg(""); // Change this to setMsg("") to clear the previous error message
      })
      .catch((error) => {
        console.error("Error:", error);
        // Display an error message using toast.error
        toast.error("Error fetching data. Please try again later.");
      });
  };


  {/* ------------------ Neha made this code end here {for Order list}------------------ */ }



 const handleFilter = (e) => {
       if (e.target.value === '') {
        handleTimeRangeChange(selectedTimeRange);
        setErrorShown(false); // Reset the error display flag when the filter is cleared
      } else {
      const filterResult = searchApiData.filter(item => {
        const filteredOrders = item.order.filter(order =>
          order.orderFoods.some(food =>
            food.food_name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        );

        return filteredOrders.length > 0 ||
          (item.paymentmode || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.id || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.order[0]?.crtby || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.order[0]?.tblno || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.order[0]?.oid || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.order[0]?.ordertype || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.order[0]?.orddate || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.order[0]?.ordstatus || '').toLowerCase().includes(e.target.value.toLowerCase())
      });

      if (filterResult.length > 0) {
        handleTimeRangeChange(selectedTimeRange, filterResult);
      } else {

        setOrderList(searchApiData);
        if (!errorShown) {
          toast.error("No matching data found.");
          setErrorShown(true); // Set the error display flag to true after showing the error once
       }
      }
    }

    setFilterVal(e.target.value);
  };


  const handleOrderRemove = (id) => {
    const deletedOrder = orderList.find((order) => order.id === id);
    if (deletedOrder) {
      const updatedOrderList = orderList.filter((order) => order.id !== id);
      setOrderList(updatedOrderList);
      setDeletedOrders([...deletedOrders, deletedOrder]);
      localStorage.setItem("orderList", JSON.stringify(updatedOrderList));
      console.log("Deleted from List");
    }
  };

  const handleOrderRetrieve = (id) => {
    const retrievedOrder = deletedOrders.find((order) => order.id === id);
    if (retrievedOrder) {
      const updatedDeletedOrders = deletedOrders.filter(
        (order) => order.id !== id
      );
      setDeletedOrders(updatedDeletedOrders);
      const updatedOrderList = [...orderList, retrievedOrder];
      setOrderList(updatedOrderList);
      setRetrievedOrders([...retrievedOrders, retrievedOrder]);
      localStorage.setItem("orderList", JSON.stringify(updatedOrderList));
      console.log("Retrieved Order");
    }
  };

  // GENERATE PDF

  const generatePDF = async () => {
    try {
      // Fetch data from the API URL
      const response = await axios.get(`http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`);
      const apiData = response.data;

      // Generate the PDF content using fetched data
      const pdfContent = (
        <Document>
          <Page size="A4">
            <View style={styles.page}>
              {apiData.map((item, index) => (
                <View key={index} style={styles.vendorContainer}>
                  <Text style={styles.vendorName}>bILL ID : {item.id}</Text>
                  {item.order.map((orderitem, orderindex) => (
                    <View key={orderindex}>
                      <Text style={styles.vendorName}>Order ID: {orderitem.oid}</Text>
                      <Text style={styles.vendor}>Table No: {orderitem.tblno}</Text>
                      <Text style={styles.vendor}>Order Date : {orderitem.orddate}</Text>
                      <Text style={styles.vendor}>Order Type: {orderitem.ordertype}</Text>
                      <Text style={styles.vendor}>Order Place by : {orderitem.crtby}</Text>
                      <Text style={styles.vendor}>Order Status : {orderitem.ordstatus}</Text>
                      {orderitem.orderFoods.map((food, foodIndex) => (
                        <View key={foodIndex}>
                          <Text style={styles.vendor}>Food Name: {'\u2022'}{food.food_name} </Text>
                        </View>
                      ))}
                    </View>
                  ))}

                  <Text style={styles.vendor}>Payment Mode: {item.paymentmode}</Text>

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
      link.download = "order_list.pdf";
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

  // Function to toggle between showing all bills and today's bills
  const toggleShowAllOrders = () => {
    setShowAllOrders(!showAllOrders);
    if (!showAllOrders) {
      // Fetch all bills when switching to show all bills
      fetchAllOrders();
    } else {
      // Fetch today's bills when switching back to today's bills
      fetchData();
    }
  };

  const fetchAllOrders = () => {
    // Fetch all bills from the API
    fetch(`http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`)

      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setOrderList(json);
        setSerachApiData(json);
      });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  {/* ------------------ Neha made this changes------------------ */ }

  // Calculate the total number of pages
  const totalPages = Math.ceil(orderList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orderList.slice(indexOfFirstItem, indexOfLastItem);

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

  {/* ------------------ neha made this code end here {for list}------------------ */ }


  const navigate = useNavigate();

  const handleRunningOrderClick = () => {
    navigate("/pendingorder"); // Use the correct path to your pending order page
  };

  const runningOrderStyle = {
    color: '#ffc107',
    fontWeight: "bold"
  };

  const completedOrderStyle = {
    color: '#28a745',
    fontWeight: "bold"
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


  const [expandedRow, setExpandedRow] = useState([]);
  return (
    <>
      <div className="data animation " style={{ marginTop: "15vh" }}>

        <div className="row rowleft6">

          <div style={{ width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Link to={'/pendingorder'}>
                <button className="btn btn-warning" style={{ width: "20vh", marginRight: "2vh", color: "white", height: "6vh", fontSize: "2vh" }} title="Alt+R" >Running Order</button>
              </Link>

              <Link to={'/overView/order'}>
                <button className="btn btn-success" style={{ width: "20vh", marginRight: "2vh", height: "6vh", fontSize: "2vh" }} title="Alt+N">New Order</button>
              </Link>

              <Link to={'/overView/order_list'}>
                <button className="btn btn-primary" style={{ width: "20vh", marginRight: "2vh", height: "6vh", fontSize: "2vh" }} title="Alt+O">Order List</button>
              </Link>

            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>


              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "right" }}>
                <button
                  onClick={toggleShowAllOrders}
                  className="btn btn-outline-primary"
                  title="Show all orders"
                  style={{
                    fontSize: "2vh",
                    height: "6vh",
                    display: "flex",
                    alignItems: "center",


                  }}
                >
                  {showAllOrders ? "Back" : " All Orders"}
                </button>

                <button
                  className="btn btn-outline-primary boton2"
                  title="Add New order"
                  style={{
                    fontSize: "2vh",
                    height: "6vh",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "7px"

                  }}
                >
                  <i class="fas fa-plus"></i>
                  <a href="/overview/order" className="btn-outline-primary">
                    Order
                  </a>
                </button>

                <button
                  onClick={generatePDF}
                  className="btn btn-outline-primary"
                  title="Download PDF"
                  style={{
                    fontSize: "2vh",
                    height: "6vh",
                    marginLeft: "7px",

                  }}
                >
                  {downloadLink && (
                    <a href={downloadLink} download="order_list.pdf"></a>
                  )}
                  PDF
                </button>

              </div>

            </div> </div>

          <div className="col-md-20" >
            <div
              className="card-header fs-3 "
              style={{ width: "80vw", display: "flex", marginBottom: "10px", borderRadius: "5px", flexDirection: "row", justifyContent: "space-between" }}
            >
              <h4
                className="text"
                style={{
                  color: "#000099",
                  fontSize: "4vh",
                  fontWeight: "bold",
                }}
              >
                <i class="fa-solid fa-list"></i> Order
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
                    // marginRight: "10px",
                    height: "3.9vh",
                    width: "3.9vh",
                    fontSize: "2vh",
                    display: "flex",
                    alignitems: "center",
                    justifyContent: "center"
                  }}
                >
                  <i
                    className="fas fa-filter"
                    style={{ fontSize: "2vh" }}
                  ></i>

                </button>
                <Link>
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
                  </button></Link>
                {errorMessage && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}


              </div>
            </div>
          </div>

          <div class="content read" >

            <table >
              <thead style={{ position: "sticky", top: "0" }}>
                <tr >
                  <th scope="col" class="text-center px-2 border" style={{ borderTopLeftRadius: "10px" }}>
                    Sr.No
                  </th>
                  <th scope="col" class="text-center px-4 border">
                    Bill Id
                  </th>
                  <th scope="col" class="text-center px-2 border">
                    Order Date
                  </th>
                  <th scope="col" class="text-center px-2 border">
                    Order Type
                  </th>
                  <th scope="col" class="text-center px-2 border">
                    Order Placed By
                  </th>
                  <th scope="col" class="text-center px-2 border">
                    Table No
                  </th>
                  <th scope="col" class="text-center px-2 border">
                    Food List
                  </th>

                  <th scope="col" class="text-center px-2 border">
                    Order Status
                  </th>
                  <th scope="col" class="text-center px-2 border">
                    Payment Mode
                  </th>
                  <th scope="col" class="text-center px-2 border" style={{ borderTopRightRadius: "10px" }}>
                    Action
                  </th>
                </tr>
              </thead>
              {orderList.length === 0 ? ( // Check if the list is empty
                <div className="no-data-message" style={{ marginLeft: "20vh" }}>No Order data available.</div>
              ) : (
                <tbody className="tbodytr">
                  {Array.isArray(orderList) &&
                    currentItems.map((p, index) => (
                      <React.Fragment key={index}>
                        {p.order &&
                          p.order.map((orderItem, innerIndex) => (
                            <React.Fragment key={innerIndex}>
                              <tr
                                key={innerIndex}
                                onClick={() =>
                                  setExpandedRow((prevRow) =>
                                    prevRow === orderItem.oid ? null : orderItem.oid
                                  )
                                }
                              >
                                {/* <th class="text-center px-2 border">{index + 1}</th> */}
                                <td className="text-center px-2 border">
                                  {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td class="text-center px-2 border">
                                  {typeof FilterVal === "string" &&
                                    FilterVal !== "" &&
                                    p.id
                                      .toString()
                                      .toLowerCase()
                                      .includes(FilterVal.toLowerCase()) ? (
                                    <strong>{p.id}</strong>
                                  ) : (
                                    p.id
                                  )}
                                </td>
                                <td class="text-center px-2 border" >
                                  {" "}
                                  {typeof FilterVal === "string" &&
                                    FilterVal !== "" &&
                                    orderItem.orddate
                                      .toString()
                                      .toLowerCase()
                                      .includes(FilterVal.toLowerCase()) ? (
                                    <strong>{orderItem.orddate}</strong>
                                  ) : (
                                    orderItem.orddate
                                  )}
                                </td>

                                <td class="text-center px-2 border">
                                  {typeof FilterVal === "string" &&
                                    FilterVal !== "" &&
                                    orderItem.ordertype &&
                                    orderItem.ordertype
                                      .toLowerCase()
                                      .includes(FilterVal.toLowerCase()) ? (
                                    <strong>{orderItem.ordertype}</strong>
                                  ) : (
                                    orderItem.ordertype
                                  )}
                                </td>

                                <td class="text-center px-2 border">
                                  {typeof FilterVal === "string" &&
                                    FilterVal !== "" &&
                                    orderItem.crtby
                                      .toLowerCase()
                                      .includes(FilterVal.toLowerCase()) ? (
                                    <strong>{orderItem.crtby}</strong>
                                  ) : (
                                    orderItem.crtby
                                  )}
                                </td>

                                <td class="text-center px-2 border">
                                  {typeof FilterVal === "string" &&
                                    FilterVal !== "" &&
                                    orderItem.tblno
                                      .toString()
                                      .toLowerCase()
                                      .includes(FilterVal.toLowerCase()) ? (
                                    <strong>{orderItem.tblno}</strong>
                                  ) : (
                                    orderItem.tblno
                                  )}
                                </td>
                                <td className="text-center px-2 border">
                                     <a className="text-primary">View</a>
                                  {expandedRow === orderItem.oid
                                   && (
                                    <div>
                                      <ul>
                                        {orderItem.orderFoods.map((food, foodIndex) => (
                                          <li key={foodIndex}>{food.food_name}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </td>
                                <td class="text-center px-2 border" style={{
                                  color:
                                    orderItem.ordstatus.toLowerCase() === "running"
                                      ? runningOrderStyle.color
                                      : orderItem.ordstatus.toLowerCase() === "completed"
                                        ? completedOrderStyle.color
                                        : "inherit",
                                  fontWeight: "800",
                                  fontSize: "3vh"

                                }}>
                                  {typeof FilterVal === "string" && FilterVal !== "" && orderItem.ordstatus.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                                    <strong>{orderItem.ordstatus}</strong>
                                  ) : (
                                    orderItem.ordstatus
                                  )}
                                </td>


                                <td class="text-center px-2 border">
                                  {typeof FilterVal === "string" &&
                                    FilterVal !== "" &&
                                    p.paymentmode
                                      .toLowerCase()
                                      .includes(FilterVal.toLowerCase()) ? (
                                    <strong>{p.paymentmode}</strong>
                                  ) : (
                                    p.paymentmode
                                  )}
                                </td>

                                <td class="actions px-2 my-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                                  <Link
                                    to={p.order[0].ordstatus !== "completed" ? `/overview/update_order/${p.serial_no}` : '#'}
                                    title={p.order[0].ordstatus !== "completed" ? "Edit Order" : "completed"}
                                    style={{ textAlign: "center", marginRight: "2vh" }}
                                  >
                                    {p.order[0].ordstatus !== "completed" ? (
                                      <button
                                        className="btn btn-outline-success"
                                        style={{
                                          fontSize: "2.5vh",
                                          width: "5vh",
                                          height: "5vh",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <i className="fas fa-pen fa-xs" style={{ fontSize: "2vh" }}></i>
                                      </button>
                                    ) : (
                                      <span></span>
                                    )}
                                  </Link>
                                </td>

                              </tr>

                              {/* {expandedRows.includes(innerIndex) && (
                          <tr>
                            <td colSpan={10}>
                              <ul>
                                {orderItem.orderFoods.map((food, foodIndex) => (
                                  <li key={foodIndex}>{food.food_name}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )} */}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
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
          style={{ marginTop: "-3vh" }} />
      </div>
    </>
  );
};

//``````````````````````````````````````    Billling List          ```````````````````````````````````````````
export const Bill_list = () => {
  const currentuser = authService.getCurrentUser();
  const navigate = useNavigate();
  const [billList, setBillList] = useState([]);
  const [searchApiData, setSerachApiData] = useState([]);
  const [FilterVal, setFilterVal] = useState([]);
  const ref = useRef();
  const [downloadLink, setDownloadLink] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [showAllBills, setShowAllBills] = useState(false);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null);     // State for end date
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  useEffect(() => {
    init();
    fetchData();
  }, [selectedTimeRange, startDate, endDate]);

  const [msg, setMsg] = useState("");

  {/* ------------------neha made this code------------------ */ }

  // Inside your `init` function, make sure to set billList as an array
  const init = () => {
    billService
      .getAllBill()
      .then((res) => {
        // Check if the response data is an array before setting it as billList
        if (Array.isArray(res.data)) {
          setBillList(res.data);
        } else {
          setBillList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Neha Made chnages in fetchData function to set the list in descending order
  const fetchData = () => {
    const url = `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`;

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
        const todayBills = json.filter(item => item.billdate === today);
        const sortedTodayBills = todayBills.sort((a, b) => {
          // Convert the date strings to Date objects for comparison
          const dateA = new Date(a.order[0].crtdate);
          const dateB = new Date(b.order[0].crtdate);

          // Sort in descending order
          return dateB - dateA;
        });
        setBillList(sortedTodayBills);
        setSerachApiData(json);
      });
  };

  {/* ------------------ Neha's code ends here------------------ */ }

  const handleFilter = (e) => {
    console.log('Filter value:', e.target.value);
    console.log('Search API Data:', searchApiData);

    if (e.target.value === '') {
     setBillList(searchApiData);
     setErrorShown(false); // Reset the error display flag when the filter is cleared
    } else {
     const filterResult = searchApiData.filter(item => {
        const isTodayBill = item.billdate === today;
        const filteredOrders = item.order.filter(order =>
         order.orderFoods.some(food =>
            food.food_name.toLowerCase().includes(e.target.value.toLowerCase())
         )
        );

        return filteredOrders.length > 0 ||
         (item.paymentmode || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.id || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.total || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.discount || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.order[0]?.tblno || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.order[0]?.oid || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.billdate || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
         // (item.order[0].orddate || '').toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.paymentmode || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.order[0]?.ordertype || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
         (item.order[0]?.ordstatus || '').toLowerCase().includes(e.target.value.toLowerCase())
     });

     if (filterResult.length > 0) {
        setBillList(filterResult);
        setErrorShown(false); // Reset the error display flag when the filter finds matching data
     } else {
        setBillList(searchApiData);
        if (!errorShown) {
         toast.error("No matching data found.");
         setErrorShown(true); // Set the error display flag to true after showing the error once
        }
    }
}
    setFilterVal(e.target.value);
};


  const addToBillList = (orderEntry) => {
    setBillList((prevBillList) => [...prevBillList, orderEntry]);
  };

  // Function to toggle between showing all bills and today's bills
  const toggleShowAllBills = () => {
    setShowAllBills(!showAllBills);
    if (!showAllBills) {
      // Fetch all bills when switching to show all bills
      fetchAllBills();
    } else {
      // Fetch today's bills when switching back to today's bills
      fetchData();
    }
  };

  const fetchAllBills = (startDate, endDate) => {
    // Fetch all bills from the API
    const url = `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`;

    // Construct the URL with start and end date parameters
    const startDateParam = startDate ? `startDate=${startDate.toISOString().split('T')[0]}` : '';
    const endDateParam = endDate ? `endDate=${endDate.toISOString().split('T')[0]}` : '';
    const queryParameters = [startDateParam, endDateParam].filter(param => param).join('&');
    const fullUrl = queryParameters ? `${url}?${queryParameters}` : url;

    fetch(fullUrl)
      .then((response) => response.json())
      .then((json) => {
        setBillList(json);
        setSerachApiData(json);
      });
  };


  // GENERATE PDF
  const handleGeneratePDF = async () => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      const response = await axios.post(`http://localhost:8083/sys/Bill/generate-pdf-bill/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      a.download = 'bill-details.pdf';
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

     // Fetch data based on the selected time range
     if (!showAllBills) {
        fetchAllBills(newStartDate, newEndDate);
     } else {
        fetchData(); // Call the fetchData function here
     }
    }
};


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };





const generateExcel = async () => {
  try {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const response = await axios.post(
      `http://localhost:8083/sys/Bill/generate-excel-bill/?store_id=${currentuser.storeid}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      toast.error('Please select both Start Date and End Date.');
      return; // Stop further processing
    }

    // Set hours, minutes, seconds, and milliseconds to 0 for both startDate and endDate
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const url = `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`;
    const startDateParam = `startDate=${startDate.toISOString().split('T')[0]}`;
    const endDateParam = `endDate=${endDate.toISOString().split('T')[0]}`;
    const fullUrl = `${url}?${startDateParam}&${endDateParam}`;

    fetch(fullUrl)
      .then((response) => response.json())
      .then((json) => {
        const filteredData = json.filter((item) => {
          const orderDate = new Date(item.billdate);
          orderDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the orderDate
          const isAfterStartDate = !startDate || orderDate >= startDate;
          const isBeforeEndDate = !endDate || orderDate <= endDate;
          return isAfterStartDate && isBeforeEndDate;
        });

        setBillList(filteredData);
        setSerachApiData(json);
        setMsg(""); // Change this to setMsg("") to clear the previous error message
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error fetching data. Please try again later.");
      });
  };





  // Calculate the total number of pages
  const totalPages = Math.ceil(billList.length / itemsPerPage);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = billList.slice(indexOfFirstItem, indexOfLastItem);

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


  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  const runningOrderStyle = {
    color: '#ffc107',
    
  };

  const completedOrderStyle = {
    color: '#28a745',
    
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

  return (
    <div className="data animation " >
      <div className="row  rowleft5" style={{ marginTop: "12vh" }}>
        <div style={{ width: "97vw", display: "flex", flexDirection: "row", justifyContent: "right", marginBottom: "2vh" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              onClick={toggleShowAllBills}
              className="btn btn-outline-primary"
              title="Show all Bills"
              style={{
                fontSize: "2vh",
                height: "6vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showAllBills ? "Back" : " All Bills"}
            </button>

            <button onClick={generateExcel} className="btn btn-outline-primary"
              style={{
                fontSize: "2vh",
                height: "6vh",
                marginLeft: "2vh",
              }}>Excel</button>
            {downloadLink && (
              <a href={downloadLink} download="bill.xlsx">
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
                <a href={downloadLink} download="bill_list.pdf"></a>
              )}
              PDF
            </button>




          </div>
        </div>
        <div className="col-md-20" >
          <div
            className="card-header fs-3 "
            style={{ width: "80vw", display: "flex", marginBottom: "10px", borderRadius: "5px", flexDirection: "row", justifyContent: "space-between" }}
          >

            <h4
              className="text"
              style={{
                color: "#000099",
                fontSize: "4vh",
                fontWeight: "bold",
              }}
            > <i class="fa-solid fa-list" style={{ color: "rgb(0, 0, 153" }}></i>
              Bill
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
                fontSize: "1vw"
              }}
              value={FilterVal}
              onInput={(e) => handleFilter(e)}
            />
            <div className="rowleft66" style={{
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
                <i
                  className="fas fa-filter"
                  style={{ fontSize: "2vh" }}
                ></i>
              </button>
              <Link>
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
                </button></Link>
              {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            </div>
          </div>
        </div>
      </div>


      <div class="content read">
        <table>
          <thead style={{ position: "sticky", top: "0", }}>
            <tr>
              <th scope="col" class="text-center px-2 border"  >
                Sr.No
              </th>
              <th scope="col" class="text-center px-2 border">
                Bill Id
              </th>

              <th scope="col" class="text-center px-2 border">
                Billing Date
              </th>
              <th scope="col" class="text-center px-2 border">
                Table No
              </th>
              <th scope="col" class="text-center px-2 border">
                Order Type
              </th>
              <th scope="col" class="text-center px-2 border">
                Payment Mode
              </th>
              <th scope="col" class="text-center px-2 border">
                Total {currentuser.currency}

              </th>

              <th scope="col" class="text-center px-2 border">
                Discount(%)
              </th>
              <th scope="col" class="text-center px-2 border" style={{ borderTopRightRadius: "10px" }} >
                Status
              </th>
            </tr>
          </thead>
          {billList.length === 0 ? ( // Check if the list is empty
            <div className="no-data-message" style={{ marginLeft: "20vh" }}>No Bill data available.</div>
          ) : (
            <tbody className="tbodytr">
              {Array.isArray(billList) &&
                currentItems.map((b, index) => (
                  <tr>
                    <td className="text-center px-2 border">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.id &&
                        b.id
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.id}</strong>
                      ) : (
                        b.id
                      )}
                    </td>


                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.billdate &&
                        b.billdate
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.billdate}</strong>
                      ) : (
                        b.billdate
                      )}
                    </td>

                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.order[0]?.tblno &&
                        b.order[0]?.tblno
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.order[0]?.tblno}</strong>
                      ) : (
                        b.order[0]?.tblno
                      )}
                    </td>

                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.order[0]?.ordertype &&
                        b.order[0]?.ordertype
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.order[0]?.ordertype}</strong>
                      ) : (
                        b.order[0]?.ordertype
                      )}
                    </td>
                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.paymentmode &&
                        b.paymentmode
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.paymentmode}</strong>
                      ) : (
                        b.paymentmode
                      )}
                    </td>

                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.total &&
                        b.total
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.total}</strong>
                      ) : (
                        b.total
                      )}
                    </td>

                    <td class="text-center px-2 border">
                      {typeof FilterVal === "string" &&
                        FilterVal !== "" &&
                        b.discount &&
                        b.discount
                          .toString()
                          .toLowerCase()
                          .includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.discount}</strong>
                      ) : (
                        b.discount
                      )}
                    </td>
                    <td class="text-center px-2 border" style={{
                      color:
                        b.order[0]?.ordstatus.toLowerCase() === "running"
                          ? runningOrderStyle.color
                          : b.order[0]?.ordstatus.toLowerCase() === "completed"
                            ? completedOrderStyle.color
                            : "inherit",
                      fontWeight: "800",
                      fontSize: "3vh"
                    }}>
                      {typeof FilterVal === "string" && FilterVal !== "" && b.order[0]?.ordstatus &&
                        b.order[0]?.ordstatus.toLowerCase().includes(FilterVal.toLowerCase()) ? (
                        <strong>{b.order[0]?.ordstatus}</strong>
                      ) : (
                        b.order[0]?.ordstatus
                      )}
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
        style={{ marginTop: "-3vh" }} />
    </div>
  );
};





/*{----------------------------UPDATE ORDER----------------------------------------}*/

export const Update_Order = () => {
  const [foodList, setFoodList] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [filteredFoodList, setFilteredFoodList] = useState(foodList);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryClicked, setCategoryClicked] = useState(false);
  const currentuser = authService.getCurrentUser();
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalFoodList, setOriginalFoodList] = useState([]); // Store the original data
  const [searchInput, setSearchInput] = useState(""); // State variable for search input
  const [loadedData, setLoadedData] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
  const [latestBillId, setLatestBillId] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const navigate = useNavigate();

  const handleMinimizeToggle = () => {
    setMinimized(!minimized);
  };

  const [values, setValues] = useState({
    serial_no: id,
    id: "",
    email: "",
    contact: "",
    upbyname: currentuser.username,
    crtbyname: "",
    paymentmode: "",
    tranid: "",
    gst: currentuser.gstno,
    total: "",
    store_id: currentuser.storeid,
    address: "",
    order: [
      {
        tblno: "",
        ordstatus: "",
        crtby: "",
        ordertype: "",
        store_id: currentuser.storeid,
        updby: currentuser.username,
        sid: currentuser.storeid,
        orderFoods: [],
      },
    ],
  });


  const initialBillState = {
    // Define your initial state for the 'bill' object here
    id: "",
    email: "",
    contact: "",
    upbyname: currentuser.username,
    store_id: currentuser.storeid,
    // ... other properties ...
    order: [
      {
        tblno: "",
        ordstatus: "Running",
        crtby: currentuser.username,
        sid: currentuser.storeid,
        ordertype: "",
        orderFoods: [],
      },
    ],
  };


  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8083/sys/Bill/getBillByID/" + id)
      .then((res) => {
        setValues({
          ...values,
          id: res.data.id,
          email: res.data.email,
          contact: res.data.contact,
          crtbyname: res.data.crtbyname,
          paymentmode: res.data.paymentmode,
          tranid: res.data.tranid,
          total: res.data.total,
          order: res.data.order,
          // orderFoods:res.data.orderFoods,
        });
      })
      .catch((err) => console.log(err));
    setAlertMessage('Error: Failed to submit the order');
  }, [id]);

  const [price, setPrice] = useState(0);

  const total = () => {
    let calculatedTotal = 0;
    if (values.order && values.order[0]?.orderFoods) {
      calculatedTotal = values.order[0].orderFoods.reduce(
        (totalPrice, food) => totalPrice + food.price * food.quantity,
        0
      );
    }
    console.log('Calculated Total:', calculatedTotal); // Log calculated total
    setTotalPrice(calculatedTotal); // Update the total price state
  };

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/sys/Food/foods/${currentuser.storeid}`
        );
        const data = await response.json();
        setFoodList(data);
        setFilteredFoodList(data); // Initialize the filteredFoodList with the full list
        total();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchFoodList();
  }, [currentuser.storeid, values.order]);


  //=======================   handlesubmit   ===================================
  const handleSubmit = async (event, isKOTButton) => {
    event.preventDefault();

    // Check if the cart is empty
    if (isCartEmpty()) {
      toast.error("Please add at least one item to the cart before placing the order.");
      return;
    }


    try {
      const response = await fetch(
        "http://localhost:8083/sys/Bill/updateBillorder/" + id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: values.id,
            email: values.email,
            contact: values.contact,
            upbyname: values.upbyname,
            crtbyname: values.crtbyname,
            paymentmode: values.paymentmode,
            tranid: values.tranid,
            gst: values.gst,
            total: values.total,
            store_id: values.store_id,
            order: values.order,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle the response data as needed
        console.log("updated succesufully");
        toast.success('Order updated successfully');
        navigate('/pendingorder');

        // Reset the form inputs
        setValues({
          id: id,
          email: "",
          contact: "",
          address: "",
          upbyname: "",
          crtbyname: "",
          paymentmode: "",
          tranid: "",
          gst: "",
          total: "",
          store_id: "",
          order: [
            {
              orderFoods: [],
            },
          ],
        });
        const latestBillDataResponse = await fetch(`http://localhost:8083/sys/Bill/getBillByID/${id}`);

        if (latestBillDataResponse.ok) {
          const latestBillData = await latestBillDataResponse.json();
          console.log('Latest Bill Data:', latestBillData);


          // setShowOrderDetailsModal(true);
          if (isKOTButton) {
            // Set the selectedOrder state to the latest bill data
            setSelectedOrder(latestBillData);
            console.log('Selected Order:', selectedOrder);

            // Set the visibility of the modal to true
            setShowOrderDetailsModal(true);
          }

        } else {
          // Handle the case where fetching latest bill data failed
          console.error("Failed to fetch latest bill data:", latestBillDataResponse.status);
        }
        setValues({ ...initialBillState }); // Reset your bill state here
        console.log("Bill updated successfully");
        toast.success("Order updated successfully");
      } else {
        if (response.status === 400) {
          const errorMessage = await response.text();
          console.error("Error:", errorMessage);
          toast.error(errorMessage);
          return;
         }
        // Request failed
        console.error("Request failed:", response.status);
        toast.error('failed To submit the Order');
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(values);
  };



  const handleInputChange = (event, index) => {
    const { name, value } = event.target;

    if (
      name === "id" ||
      name === "email" ||
      name === "contact" ||
      name === "upbyname" ||
      name === "crtbyname" ||
      name === "paymentmode" ||
      name === "tranid" ||
      name === "gst" ||
      name === "total" ||
      name === "store_id" ||
      name === "address"
    ) {
      setValues((prevBill) => ({
        ...prevBill,
        [name]: value,
      }));
    } else if (
      name === "tblno" ||
      name === "ordstatus" ||
      name === "crtby" ||
      name === "sid" ||
      name === "updby"
    ) {
      setValues((prevBill) => ({
        ...prevBill,
        order: {
          ...prevBill.order,
          [name]: value,
        },
      }));
    } else if (
      name === "food_name" ||
      name === "category" ||
      name === "subcategory" ||
      name === "quantity" ||
      name === "price"
    ) {
      const updatedOrderFoods = values.order.orderFoods.map(
        (food, foodIndex) => {
          if (foodIndex === index) {
            return { ...food, [name]: value };
          }
          return food;
        }
      );

      setValues((prevBill) => ({
        ...prevBill,
        order: {
          ...prevBill.order,
          orderFoods: updatedOrderFoods,
        },
      }));
    }
  };

  const addFoodItem = () => {
    setValues((prevBill) => ({
      ...prevBill,
      orderFoods: [
        ...prevBill.orderFoods,
        {
          food_name: "",
          category: "",
          subcategory: "",
          quantity: "",
          sid: "",
          price: "",
          image: "",
        },
      ],
    }));
  };

  const handleCartUpdate = (food, index, action) => {
    const updatedOrderFoods = [...(values.order[0]?.orderFoods || [])];

    if (action === "add") {
      const { image, food_name, category, subcategory, price, store_id } = food;
      const existingFoodIndex = updatedOrderFoods.findIndex(
        (item) => item.food_name === food_name && item.store_id === store_id
      );

      if (existingFoodIndex !== -1) {
        // If the food already exists in the cart, increase its quantity
        updatedOrderFoods[existingFoodIndex].quantity += 1;
      } else {
        // Add a new food to the cart
        updatedOrderFoods.push({
          food_name,
          category,
          subcategory,
          price,
          store_id,
          quantity: 1,
          image,
        });
      }
    }


    setValues((prevBill) => ({
      ...prevBill,
      orderFoods: updatedOrderFoods,
    }));


    // Call the 'total' function to recalculate the total price
    total();
    // Return the updatedOrderFoods directly
    return updatedOrderFoods;
  };

  const addToCart = (food) => {
    const updatedValues = { ...values }; // Copy existing values

    if (!updatedValues.order[0]) {
      updatedValues.order[0] = {
        tblno: "", // Initialize with the necessary properties
        ordertype: "",
        orderFoods: [],
      };
    }

    // Call your handleCartUpdate function to update the orderFoods array
    const updatedOrderFoods = handleCartUpdate(food, null, "add");

    updatedValues.order[0].orderFoods = updatedOrderFoods; // Update orderFoods

    // Update the state with the new values
    setValues(updatedValues);
    // Call the 'total' function to recalculate the total price
    total();
  };


  const audioRef = useRef(null);

  const handleButtonClick = () => {
    // Play the beep sound when the button is clicked
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  const init = () => {
    foodService
      .getFood()
      .then((res) => {
        // console.log(res.data);
        setFoodList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCalculatorSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    handleShow(); // Show the calculator modal
  };

  const deletefood = (id) => {
    foodService
      .deleteFood(id)
      .then((res) => {
        console.log("Delete Successfully");
        setMsg("Delete Successfully ");
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [result, setResult] = useState('');


  const handleClick = (e) => {
    setResult(result.concat(e.target.name));
  };

  // Function to check if the cart is empty
  const isCartEmpty = () => {
    return values.order[0]?.orderFoods?.length === 0;
  };

  const handleDecrement = (index) => {
    const updatedBill = { ...values };

    if (updatedBill.order && updatedBill.order[0] && updatedBill.order[0].orderFoods) {
      const currentQuantity = updatedBill.order[0].orderFoods[index]?.quantity;

      if (currentQuantity === 1) {
        // If the current quantity is 1, remove the item from the cart
        updatedBill.order[0].orderFoods.splice(index, 1);
      } else if (currentQuantity > 1) {
        // If the current quantity is greater than 1, decrement the quantity
        const updatedQuantity = currentQuantity - 1;
        updatedBill.order[0].orderFoods[index].quantity = updatedQuantity;
      }

      // Calculate the updated total price based on the quantities of all items in the cart
      const updatedTotalPrice = updatedBill.order[0].orderFoods.reduce(
        (total, food) => total + (food.price * food.quantity),
        0
      );

      // Update the total price state
      setTotalPrice(updatedTotalPrice);

      // Update the values state with the modified cart
      setValues(updatedBill);

      // Check if the cart is empty after updating the item
      if (isCartEmpty(updatedBill)) {
        // The cart is empty, prevent order placement
        toast.error("Your cart is empty. Add items to your cart before placing an order.");
        return;
      }
    }
  };


  const handleIncrement = (index) => {
    const updatedBill = { ...values };

    if (updatedBill.order && updatedBill.order[0] && updatedBill.order[0].orderFoods) {
      // Increase the quantity
      const updatedQuantity = (updatedBill.order[0].orderFoods[index]?.quantity || 0) + 1;
      updatedBill.order[0].orderFoods[index].quantity = updatedQuantity;

      // Calculate the updated total price for this item
      const updatedPrice = updatedBill.order[0].orderFoods[index]?.price || 0;
      const newTotalPrice = totalPrice + updatedPrice;

      // Update the total price state
      setTotalPrice(newTotalPrice);

      // Update the values state with the modified cart
      setValues(updatedBill);
    }
  };

  const calculate = () => {
    try {
      setResult(eval(result).toString());
    } catch (error) {
      setResult('Error');
    }
  };

  const clear = () => {
    setResult('');
  };

  const handleDelete = (event, index) => {
    event.preventDefault();
    const updatedBill = { ...values };
    const deletedFood = updatedBill.order[0].orderFoods[index];

    if (deletedFood) {
      // Subtract the price of the deleted food from the totalPrice
      const newTotalPrice = totalPrice - deletedFood.price * deletedFood.quantity;
      setTotalPrice(newTotalPrice);

      // Remove the food item from the cart
      updatedBill.order[0].orderFoods.splice(index, 1);

      // Check if the cart is empty after deleting the item
      if (isCartEmpty(updatedBill)) {
        // The cart is empty, prevent order placement
        toast.error("Your cart is empty. Add items to your cart before placing an order.");
        return;
      }

      // Update the values state with the modified cart
      setValues(updatedBill);
    }
  };


  //applied the search filter by neha
  const handleCategoryClick = (event, category) => {
    event.preventDefault();
    setSelectedCategory(category === selectedCategory ? null : category);


    // Reset the searchInput state to an empty string
    setSearchInput("");

    // Filter food items based on the selected category
    if (category === "All") {
      setFilteredFoodList(foodList);
    } else {
      const filteredFoods = foodList.filter((food) => food.category.toLowerCase() === category.toLowerCase());
      setFilteredFoodList(filteredFoods);
    }
    setCategoryClicked(true);
  };

  //applied the search filter by neha
  const handleFilterClick = () => {
    // Perform filtering based on searchInput
    const filteredResults = foodList.filter((food) =>
      food.food_name.toLowerCase().includes(searchInput.toLowerCase()) ||
      food.foodcode.toLowerCase().includes(searchInput.toLowerCase()) ||
      food.category.toLowerCase().includes(searchInput.toLowerCase()) ||
      food.subcategory.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredFoodList(filteredResults); // Update filteredFoodList
  };

  //applied the search filter by neha
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value); // Update the search input state
    handleFilterClick(); // Call handleFilterClick to perform dynamic filtering
  };


  const handleRunningOrderClick = () => {
    navigate("/pendingorder"); // Use the correct path to your pending order page
  };

  const handleOrderListClick = () => {
    navigate("/overView/order_list"); // Use the correct path to your pending order page
  };


  const handleNewOrderClick = () => {
    navigate("/overView/order"); // Use the correct path to your pending order page
  };

  const [orderList, setOrderList] = useState([]);

  const fetchOrderList = async () => {
    try {
      const response = await fetch(`http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // Assuming you have stored the order list in a state variable called 'orderList'
      setOrderList(data);
    } catch (error) {
      console.error('Error fetching order list:', error);
    }
  };

  const runningTables = orderList.reduce((acc, order) => {
    if (order.order[0]?.ordstatus === 'Running') {
      acc.push(order.order[0].tblno);
    }
    return acc;
  }, []);

  useEffect(() => {
    fetchOrderList();
    fetchTblNo(id); // Fetch and update tblno based on the selected id
  }, [id]);

  // Function to fetch the tblno based on the selected id
  const fetchTblNo = async (selectedId) => {
    try {
      const response = await fetch(`http://localhost:8083/sys/Bill/getTblNoById/${selectedId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data && data.tblno) {
        // Update the state with the fetched tblno
        setValues({
          ...values,
          order: [{ ...values.order[0], tblno: data.tblno }],
        });
      }
    } catch (error) {
      console.error('Error fetching tblno:', error);
    }
  };

  // Handle Enter key press in the input field
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilterClick(e);
    }
  };

  const playBeep = () => {
    const audioRef = new Audio("/sysbeep.mp3");
    audioRef.play();
  };

  // ------------ button code ------------
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    // Add a delay of 2 seconds (2000 milliseconds) before making the GET request
    const delay = 2000;

    const timer = setTimeout(() => {
      fetch(`http://localhost:8083/sys/Button/getbutton/${currentuser.storeid}`)
        .then((response) => response.json())
        .then((data) => setButtons(data))
        .catch((error) => console.error('Error:', error));
    }, delay);

    // Clear the timer when the component unmounts to prevent any potential memory leaks
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (event, index) => {
    const newValue = parseInt(event.target.value, 10);

    if (!isNaN(newValue)) {
      // Update the quantity for the specific food item in the state
      const updatedValues = { ...values };
      updatedValues.order[0].orderFoods[index].quantity = newValue;
      setValues(updatedValues);
    }
    // If the input is not a valid number, you can display an error message or take other actions as needed.
  };

  const foodTableRef = useRef();



  useEffect(() => {
    // Scroll to the bottom of the foodTable when the component mounts or when new food items are added
    if (foodTableRef.current) {
      foodTableRef.current.scrollTop = foodTableRef.current.scrollHeight;
    }
  }, []); // Empty dependency array means it runs on component mount



  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      // Close the modal after printing
      setShowOrderDetailsModal(false);
    },
  });


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


  return (
    <div style={{ overflow: "hidden", height: "100vh" }}>
      <div className="formbody overview animation">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <p style={{ margin: "0px" }}></p>
          </div>
          <div class="row22">
            <div class="col">
              {/*applied the search filter by neha */}
              <div style={{ display: "flex", justifyContent: "", marginTop: "3.5vh", marginLeft: "18vw" }}>

                <Link to={'/pendingorder'}>
                  <button className="btn btn-warning" style={{ width: "17vh", marginRight: "1vh", color: "white", height: "6vh", fontSize: "1.7vh", fontWeight: "500" }} title="Alt+R">Running Order</button>
                </Link>

                <Link to={'/overView/order'}>
                  <button className="btn btn-success" style={{ width: "17vh", marginRight: "1vh", color: "white", height: "6vh", fontSize: "1.7vh", fontWeight: "500" }} title="Alt+N">New Order</button>
                </Link>

                <Link to={'/overView/order_list'}>
                  <button className="btn btn-primary" style={{ width: "17vh", marginRight: "1vh", color: "white", height: "6vh", fontSize: "1.7vh", fontWeight: "500" }} title="Alt+O">Order List</button>
                </Link>

                <input
                  type="text"
                  placeholder=" &#128269; Search..."
                  style={{ border: "2px solid #03989e", fontSize: "2vh", width: "32vh", marginRight: "1vh" }}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />

              </div>

              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

                <div style={{ marginBottom: "20px", marginTop: "-6vh", marginLeft: "8vh", marginRight: "3vw", height: "83vh", overflowY: "auto", scrollbarWidth: "0px", textAlign: "center" }} className="btn2">
                  <button
                    className={`btn ${selectedCategory === "All" ? "btn-success" : "btn-success"
                      } m-1`}
                    onClick={(e) => handleCategoryClick(e, "All")}

                  >
                    All
                  </button>
                  <button
                    className={`btn ${selectedCategory === "Addon" ? "btn-danger" : "btn-outline-danger"
                      } m-1`}
                    onClick={(e) => handleCategoryClick(e, "Addon")}

                  >
                    Addon
                  </button>


                  {buttons.map((button) => (
                    <button
                      key={button.id}
                      className={`btn ${selectedCategory === button.butName ? "btn-success" : "btn-outline-success"} m-1`}
                      onClick={(e) => handleCategoryClick(e, button.butName)}
                      title={button.butName}
                    >
                      {button.butName.substring(0, 8)}
                    </button>
                  ))}

                </div>

                <div className="row row77" style={{ height: "75vh", overflowY: "auto", scrollbarWidth: "0px", marginTop: "1vh", marginLeft: "-6vh", maxWidth: "54vw", width: "54vw" }}>
                  {filteredFoodList.map((food, index) => (
                    <div className="col-md-3 p-1" key={index} style={{ height: "28vh", marginRight: "-1vw", marginBottom: "-6vh" }}
                      onClick={() => {
                        addToCart(food);
                        playBeep(); // Play beep sound
                      }}>
                      <Card className="my-2 cardss" style={{ width: "12vw", height: "20vh", border: "info", borderRadius: "15px" }}>
                        <img
                          variant="top"
                          src={"https://drive.google.com/uc?export=view&id=" + food.image}
                          style={{ height: "12vh", width: "11vw", marginRight: "-10px", marginLeft: "-19px", marginTop: "-17px", borderRadius: "10px" }}
                        />
                        <div className="justify-content-center">
                          <h6 className="text-center"
                            style={{ color: 'black', fontSize: "2.5vh" }}
                            title={food.food_name} >
                            {food.food_name.length > 8 ? food.food_name.substring(0, 8) + "..." : food.food_name}

                          </h6>
                          <h6 className="text-center" style={{ color: 'black', fontSize: "2.5vh" }}>{currentuser.currency}{food.price}</h6>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div class="row p-4" style={{ marginTop: "-0.8vh", marginLeft: "-36.5vw" }}>

              <div className="col-md-12" style={{ marginleft: "-50vw" }}>
                <div className="card  mt-3" style={{ marginLeft: "1vw", borderRadius: "2vh", height: "73vh" }}>
                  <table style={{ marginTop: "-1vh", marginBottom: "2vh", display: "flex", flexDirection: "row" }}>
                    <tr>
                      <th class="text-left" style={{ width: "6vw", minWidth: "6vw", fontSize: "1.8vh" }}>Order Type :</th>
                      <td className=" col-md-6 text-center" style={{ width: "6vw", minWidth: "6vw", fontSize: "1.8vh" }}>
                        <input
                          type="text"
                          className="form-control"

                          name="tblno"
                          value={values.order.length > 0 ? values.order[0]?.ordertype : ''}
                          readOnly // Prevent user input
                          style={{ backgroundColor: "#fff", marginLeft: "-2vh", width: "15vh", fontSize: "1.8vh" }}
                        />
                      </td>
                    </tr>

                    {values.order[0]?.ordertype === "Dine In" && (
                    <tr>
                      <th className="text-right" style={{ width: "6vw", minWidth: "6vw", fontSize: "1.8vh" }}>Table No:</th>
                      <td className=" col-md-6 text-center" style={{}}>
                        <input
                          type="text"
                          className="form-control"
                          name="tblno"

                          value={values.order.length > 0 ? values.order[0]?.tblno : ''}
                          readOnly // Prevent user input
                          style={{ backgroundColor: "#fff", marginLeft: "0", width: "3vw" }}
                        />
                      </td>
                    </tr>
                    )}

                  </table>

                  <div
                    className="card-header p-1 text-center d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "#03989e", borderRadius: "5px" }}
                  >
                    <div className="text-white" style={{ fontSize: "2.5vh", fontWeight: "500" }}>
                      <i class="fa-solid fa-cart-plus"></i> Order Details
                    </div>
                  </div>
                  <div className="card-body card-body2" style={{ height: "50vh", maxHeight: "50vh", marginLeft: "auto", overflowY: "auto", overflowX: "hidden" }}>
                    <table class="table table-hover">
                      <thead className="tbody22">
                        <tr style={{ color: "black", width: "20vw" }}>
                          <th className="text-center" scope="col">
                            Sr.No
                          </th>
                          <th className="text-center px-1 col-1" scope="col">
                            Item
                          </th>
                          <th className="text-center px-2 col-1" scope="col">
                            Price
                          </th>
                          <th className="text-center px-2 col-1" scope="col">
                            Quantity
                          </th>
                          <th className="text-left px-0 col-0" scope="col">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="tbody22" ref={foodTableRef} id="foodTable">
                        {values.order[0]?.orderFoods &&
                          values.order[0]?.orderFoods.map((food, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  {/* <th scope="row">1</th> */}
                                  <td className="text-center" style={{ fontSize: "1.8vh" }}> <>{index + 1}</></td>
                                  <td
                                    className="text-center"
                                    name="food_name"
                                    style={{ fontSize: "1.8vh" }}
                                    value={food.food_name}
                                    onChange={(event) =>
                                      handleInputChange(event, index)
                                    }
                                  >
                                    <>{food.food_name} </>
                                  </td>
                                  <td className="text-center" style={{ fontSize: "1.8vh" }}>
                                    <>{food.price}</>
                                  </td>
                                  <td className="text-center" style={{ minWidth: "7vw", marginLeft: "-10vw", }}>
                                    <strong style={{ display: "flex", flexDirection: "row" }}>
                                      <button type="button" className="btn btn-sm btn-outline-success mr-1" onClick={() => { handleDecrement(index); handleButtonClick(food); }} style={{ width: "1.6vw", height: "1.6vw", display: "flex", alignItems: "center", justifyContent: "center", }}><i class="fa-solid fa-minus"></i></button>
                                      <input
                                        type="number" className="text-center"
                                        value={values.order[0]?.orderFoods[index].quantity}
                                        onChange={(event) => handleQuantityChange(event, index)} // Add an onChange handler
                                        min="1" style={{
                                          width: "3vw",
                                          fontSize: "1.8vh",
                                          textAlign: "center", // Center text horizontally
                                          verticalAlign: "middle", // Center text vertically
                                          lineHeight: "1.2" // Adjust line height for vertical centering
                                        }}
                                      />

                                      <button type="button" className="btn btn-sm btn-outline-success ml-1" onClick={() => { handleIncrement(index); handleButtonClick(food); }} style={{ width: "1.8vw", height: "1.6vw", fontWeight: "bolder", display: "flex", alignItems: "center", justifyContent: "center", }}><i class="fa-solid fa-plus"></i></button>

                                    </strong>
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{

                                      color: "red",
                                      fontSize: 20,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <button
                                      className="btn btn-sm btn-outline-danger mb-3"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        handleDelete(event, index); // Pass the event object
                                      }}
                                      style={{
                                        fontSize: "2vh",
                                        width: "4vh", // Set the desired width
                                        height: "4vh", // Set the desired height
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: "2vh",

                                      }}
                                    >
                                      <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <h5
                    className="text-end text-light p-2"
                    style={{ backgroundColor: "#03989e", borderRadius: "5px", marginBottom: "-3vh", fontSize: "2.6vh" }}
                  >
                    <strong className="text-light">Total {currentuser.currency}:

                      {totalPrice}</strong>
                  </h5>
                </div>
              </div>



              <div className="col" style={{ display: "flex", marginLeft: "2vh", marginTop: "-1vh" }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleCalculatorSubmit}
                  style={{
                    height: "5vh",
                    fontSize: "0.8vw",
                    width: "2.5vw",
                    display: "flex",      // Center horizontally
                    alignItems: "center", // Center vertically
                    justifyContent: "center", // Center horizontally
                  }}
                >
                  <i className="fa-solid fa-calculator" style={{ fontSize: "3vh" }}></i>
                </button>

                <Modal
                  show={show}
                  onHide={handleClose}
                  size={minimized ? "sm" : null}
                  style={{ width: "280px", marginLeft: "600px" }}
                >
                  {!minimized && <Modal.Title></Modal.Title>}
                  <Calculator />
                </Modal>

                <button className="btn btn-success" type="submit"
                  onClick={(event) => handleSubmit(event, false)} // Pass false for place order button
                  style={{
                    height: "5vh",
                    fontSize: "1.0vw",
                    fontWeight: "bolder",
                    width: "12vw",
                    marginLeft: "12px"
                  }}
                  disabled={isCartEmpty()}>
                  <i class="fa-solid fa-cart-plus"></i> Update Order
                </button>
              </div>

            </div>
          </div>
        </form>
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
          style={{ marginTop: "5vh", marginRight: "7vw" }} />
      </div>


    </div>
  );
};