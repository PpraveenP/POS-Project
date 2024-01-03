import React, { useState, useEffect, useRef } from "react";
import billService from "../services/bill.service";
import { Link } from "react-router-dom";
import authService from "../services/auth.service";
import { Modal, Card, Button } from "react-bootstrap";
import "./pendingorder.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { ToastContainer, toast } from "react-toastify";
import customerService from "../services/customer.service";
import ReactPrint from "react-to-print";
import { isEmail } from "validator";

const date = new Date();
const today = date.toLocaleDateString("en-GB", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

export const PendingOrder = () => {
  const [paymentModeSelected, setPaymentModeSelected] = useState(false);
  const currentuser = authService.getCurrentUser();
  const [taxRate, setTaxRate] = useState(0); // Define the tax rate state
  const [taxName, setTaxName] = useState(""); // Define the tax name state
  const [taxNames, setTaxNames] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const { id } = useParams();
  const [price, setPrice] = useState();
  const [msg, setMsg] = useState("");
  const [mobileNoError, setMobileNoError] = useState("");

  const [billId, setBillId] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: async () => {
      // Wait for the printing to complete before updating state and performing actions
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the timeout if needed

      // Update state or perform actions after printing
      setPaymentModeSelected(true);
      setDiscount(discount); // Assuming discount is already set in your state
      handleDoneClick(orderId);
      setShowModal(false);

      // Send the updated data to the server
      const updatedValues = {
        paymentmode: billData.paymentmode,
        discount: discount,
        total: total.toFixed(2),
        contact: billData.contact,
      };

      axios
        .patch(
          `http://localhost:8083/sys/Bill/updateBillorder/${id}`,
          updatedValues
        )
        .then((res) => {
          console.log("Data updated successfully:", res.data);
          // Handle success, if needed
        })
        .catch((err) => {
          console.error("Error updating data:", err);
          // Handle error, if needed
        });

      // After the print dialog closes
      localStorage.setItem("printInitiated", "true");
      setIsButtonDisabled(true);
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

  const required = (value) => {
    if (!value) {
      return (
        <div
          className="alert alert-danger"
          role="alert"
          style={{ height: "5vh", fontSize: "2vh" }}
        >
          This field is required!
        </div>
      );
    }
  };

  const emailValidation = (email) => {
    if (!isEmail(email)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid email.
        </div>
      );
    }
    if (
      !email.endsWith("@gmail.com") &&
      !email.endsWith("@outlook.com") &&
      !email.endsWith("@yahoo.com")
    ) {
      return (
        <div className="alert alert-danger" role="alert">
          This email must be a Gmail, Outlook, or Yahoo address.
        </div>
      );
    }
  };

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
  const [customer, setCustomer] = useState({
    serial_no: "",
    customer_id: "",
    contact: "",
    customername: "",
    email: "",
    dob: "",
    store_id: currentuser.storeid,
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
      .get("http://localhost:8083/sys/Bill/getBillByID/" + id)
      .then((res) => {
        setBilldata({
          ...billData,
          id: res.data.id,
          contact: res.data.contact,
          upbyname: res.data.upbyname,
          crtbyname: res.data.crtbyname,
          paymentmode: res.data.paymentmode,
          tranid: res.data.tranid,
          gst: res.data.gst,
          total: total,
          store_id: res.data.store_id,
          discount: res.data.discount,
          order: [
            {
              ...res.data.order[0],
              ordstatus: "completed", // Replace with the desired order status value
            },
          ],
          orderFoods: res.data.orderFoods,
        });
      })
      .catch((err) => console.log(err));
  }, [id, currentuser.storeid]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    const subtotal = billData?.order[0].orderFoods.reduce((prev, orderFood) => {
      return prev + orderFood.quantity * orderFood.price;
    }, 0);
    const taxAmounts = taxRates.map((rate) => (rate * subtotal) / 100);
    const totalTax = taxAmounts.reduce((acc, amount) => acc + amount, 0);
    const discountRate = (discount * subtotal) / 100;
    const total = subtotal - discountRate + totalTax;

    const updatedValues = {
      ...billData,
      total: total.toFixed(2),
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
              ordstatus: "completed",
            },
          ],
        });
        setIsButtonDisabled(true);
        console.log(billData.paymentmode);
      })
      .catch((err) => console.log(err));
  };

  const [logo, setLogo] = useState(null);
  useEffect(() => {
    // Make an HTTP GET request to fetch the store logo
    axios
      .get(`http://localhost:8083/api/auth/store/${currentuser.storeid}/logo`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const imageBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const imageUrl = URL.createObjectURL(imageBlob);
        setLogo(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching store logo:", error);
      });
  });

  const [discount, setDiscount] = useState("");
  const [items, setItems] = useState([]);
  const totall = () => {
    let price = 0;
    billData?.order[0].orderFoods.map((orderFood, index) => {
      price = orderFood.price * orderFood.quantity + price;
    });
    setPrice(price);
  };
  const subtotal = billData?.order[0].orderFoods.reduce((prev, orderFood) => {
    return prev + orderFood.quantity * orderFood.price;
  }, 0);
  const taxAmounts = taxRates.map((rate) => (rate * subtotal) / 100);
  const totalTax = taxAmounts.reduce((acc, amount) => acc + amount, 0);
  const discountRate = (discount * subtotal) / 100;
  const total = subtotal - discountRate + totalTax;
  const [isPrinting, setIsPrinting] = useState(false);

  // {-----------------------------------RUSHIKESH MADE THIS CHANGES---------------------------}
  // {------------------------for qr code stoerpayment upi------------------------------------ }
  const [upiId, setUpiId] = useState();
  const [error, setError] = useState(null);
  useEffect(() => {
    // Replace 'YOUR_API_ENDPOINT' with the actual URL of your API endpoint.
    const apiUrl = `http://localhost:8083/sys/api/store-payments/getupi/${currentuser.storeid}`; // Replace 'storeId' with the actual store ID you want to fetch.
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        setUpiId(data);
        setText(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  // { --------------------------------------Rushikesh Added New Code ----------------------------------}
  //                 {---------------- for qr code genrate--------------------------}

  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [upi, setText] = useState(upiId);
  const generateQRCode = async () => {
    try {
      if (billData.paymentmode === "upi") {
        const response = await fetch(
          `http://localhost:8083/sys/api/store-payments/generateQRCode?text=upi://pay?pa=${upi}`
        );
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setQRCodeImage(imageUrl);
          console.log(upi);
        } else {
          console.error("Failed to generate QR code.");
        }
      } else {
        // Clear the QR code image when payment mode is not UPI
        setQRCodeImage(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    generateQRCode(); // Automatically generate QR code when the component mounts
  }, [upi, total, billData.paymentmode]);

  // { ------------------------------------------------- End HERE ---------------------------------------}

  const date = new Date();
  // Format the time in AM/PM format
  const timeInAMPM = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const customerRegister = (e) => {
    e.preventDefault();

    if (customer.customername.trim() === "") {
      toast.error("Customer Name is required");
      return;
    }

    if (customer.contact.trim() === "") {
      toast.error("Contact Number is required");
      return;
    }
    customerService
      .saveCustomer(customer)
      .then((res) => {
        toast.success("Customer added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1);
        setCustomer({
          customer_id: "",
          customername: "",
          email: "",
          dob: "",
          store_id: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });

    if (name === "contact" && value.length != 10) {
      setMobileNoError("Mobile No should be exactly 10 digits");
    } else {
      setMobileNoError("");
    }
  };

  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
    let style = { transition: "all 5s ease-in-out" };
    if (!visible) style.display = "none";
  };
  const handleCancel = () => {
    // Close the form by setting visibility to false
    setVisible(false);
  };

  const [orderList, setOrderList] = useState([]);
  const [runningOrders, setRunningOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
  const [showFoodDetailsModal, setShowFoodDetailsModal] = useState(false); // Modal visibility
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [splitBillCount, setSplitBillCount] = useState(1); // Default value is 1 person
  const [totalAmount, setTotalAmount] = useState(0); // To store the total amount
  const [fetchedOrder, setFetchedOrder] = useState(null); // To store the fetched order data
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [splitAmounts, setSplitAmounts] = useState([]); // State to store split amounts
  const [splitPersons, setSplitPersons] = useState(1); // State to store the number of persons
  const [splitBills, setSplitBills] = useState([]);
  const [isBillPrinted, setIsBillPrinted] = useState(false);
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
      })
      .catch((err) => console.log(err));
  }, [id, currentuser.storeid]);

  const [showModal, setShowModal] = useState(false); // State variable to manage modal visibility

  useEffect(() => {
    // Make an HTTP GET request to fetch the store logo
    axios
      .get(`http://localhost:8083/api/auth/store/${currentuser.storeid}/logo`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const imageBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const imageUrl = URL.createObjectURL(imageBlob);
        setLogo(imageUrl);
      })
      .catch((error) => {
        // console.error("Error fetching store logo:", error);
      });
  });
  useEffect(() => {
    init();
    fetchRunningAndPreparedOrders();
  }, []);

  // Inside your `init` function, make sure to set billList as an array
  const init = () => {
    billService
      .getAllBill()
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

  const toggleDetails = (order) => {
    setSelectedOrder(order);
    setShowFoodDetailsModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowFoodDetailsModal(false); // Close the modal
  };

  const componentRef = useRef();

  const fetchRunningAndPreparedOrders = () => {
    const statuses = ["Running", "Prepared"]; // You can add more statuses if needed
    const statusQuery = statuses
      .map((status) => `ordstatus=${status}`)
      .join("&");

    fetch(
      `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}?${statusQuery}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of bill objects
        const runningAndPreparedOrders = data.flatMap((bill) =>
          bill.order.filter((order) => statuses.includes(order.ordstatus))
        );

        setRunningOrders(runningAndPreparedOrders);
      })
      .catch((error) => {
        console.error("Error fetching running and prepared orders: ", error);
      });
  };

  // Add this line in your component function to declare state

  const openModal = async (food) => {
    try {
      const response = await axios.get(
        `http://localhost:8083/sys/Bill/getBillByID/${food.serial_no}`
      );
      const billData = response.data;

      // Extract the ID from the fetched billData
      const billId = billData.id;

      // Do something with the billId, for example, pass it to another component or function
      console.log("Fetched Bill ID:", billData);

      // Now you can proceed with opening the modal or any other action
      setSelectedOrder(billData);
      setBilldata(billData);
      setBillId(billId); // Store the billId in state
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching bill data:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const [data, setData] = useState(null);

  const orderId = billData.order[0].serial_no;

  const [ordstatus, setOrdstatus] = useState([]);

  const handleDoneClick = () => {
    const orderId =
      billData.order && billData.order.length > 0
        ? billData.order[0].serial_no
        : null;

    axios
      .patch(`http://localhost:8083/sys/order/updateorderStatusto/${orderId}`)
      .then((res) => {
        // Handle success, if needed
        console.log("API Response:", res.data);
        data = res.data;

        toast.success(`Order is completed`);
        setTimeout(() => {
          window.location.reload();
        }, 1);
      })
      .catch((err) => {});
  };

  const ref = useRef();

  useEffect(() => {
    const keyMappings = {
      N: "/overview/order",
      R: "/pendingorder",
      B: "/overview/bill_list",
      I: "/inventory",
      1: "/inventory/Inventory_list",
      V: "/vendor",
      P: "/payment",
      T: "/VendorInventory",
      M: "/food/food",
      F: "/Food/Food_list",
      A: "/food/add_ons",
      2: "/addOn/addOn_list",
      E: "/receipe",
      3: "/receipe_list",
      4: "/reports/vendor_list",
      5: "/reports/payment_list",
      6: "/reports/vendor_invoice_list",
      U: "/user/adduser",
      7: "/user/userlist",
      8: "/reports/balance_list",
      X: "/settings/taxsetting",
      S: "/settings",
      Y: "/settings/payment_setting",
      Z: "/category",
      C: "/balanceform",
      O: "/overView/order_list",
      D: "/dashbord",
      K: "/kot",
    };

    const handleKeyPress = (e) => {
      // Check if e.key is defined before calling toUpperCase
      const key = e.key ? e.key.toUpperCase() : null;

      if (e.altKey && keyMappings[key]) {
        navigate(keyMappings[key]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  return (
    <>
      <div className="pendingorder animation">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "15vh",
            marginLeft: "20vh",
            position: "relative",
          }}
        >
          <Link to={"/pendingorder"}>
            <button
              className="btn btn-warning"
              style={{
                width: "20vh",
                marginRight: "2vh",
                color: "white",
                height: "6vh",
                fontSize: "2vh",
              }}
              title="Alt+R"
            >
              Running Order
            </button>
          </Link>
          <Link to={"/overView/order"}>
            <button
              className="btn btn-success"
              style={{
                width: "20vh",
                marginRight: "2vh",
                height: "6vh",
                fontSize: "2vh",
              }}
              title="Alt+N"
            >
              New Order
            </button>
          </Link>
          <Link to={"/overView/order_list"}>
            <button
              className="btn btn-primary"
              style={{
                width: "20vh",
                marginRight: "2vh",
                height: "6vh",
                fontSize: "2vh",
              }}
              title="Alt+O"
            >
              Order List
            </button>
          </Link>
        </div>

        <div className="order-container" style={{ marginLeft: "20vh" }}>
          {runningOrders.length > 0 ? (
            runningOrders
              .slice()
              .reverse()
              .map((food, index) => (
                <div className=" orderrow" key={index}>
                  <Card className="mycard" key={index}>
                    <div className="justify-content-center">
                      <div className="content-container">
                        <h6
                          class="text-start"
                          style={{ color: "black", fontSize: "2.2vh" }}
                        >
                          Table No : {food.tblno}
                        </h6>
                        <h6
                          class="text-start"
                          style={{ color: "black", fontSize: "2.2vh" }}
                        >
                          Order No : {food.oid}
                        </h6>
                        <h6
                          class="text-start"
                          style={{ color: "black", fontSize: "2.2vh" }}
                        >
                          Order Type : {food.ordertype}
                        </h6>
                        <h6
                          class="text-start"
                          style={{ color: "black", fontSize: "2.2vh" }}
                        >
                          Order Date : {food.orddate}
                        </h6>
                      </div>

                      <div
                        className="button_div justify-content-center"
                        style={{
                          position: "absolute",
                          bottom: "1.5vh",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          margin: "auto",
                          justifycontent: "space-evenly",
                        }}
                      >
                        <Link
                          to={`/billing/${food.serial_no}`}
                          title="Print Bill"
                          style={{
                            textAlign: "center",
                            marginRight: "0vh",
                            // Set the desired space between buttons
                          }}
                        ></Link>

                        <Link
                          to={`/overview/update_order/${food.serial_no}`}
                          title="Edit Order"
                          style={{
                            textAlign: "center",
                            marginRight: "0vh", // Set the desired space between buttons
                          }}
                        >
                          <button
                            className="btn btn-outline-success"
                            style={{
                              fontSize: "2vh",
                              width: "4vh", // Set the desired width
                              height: "4vh", // Set the desired height
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i
                              className="fas fa-pen fa-xs"
                              style={{ fontSize: "2vh" }}
                            ></i>
                          </button>
                        </Link>

                        <button
                          className="btn btn-outline-primary"
                          onClick={() => toggleDetails(food)}
                          style={{
                            fontSize: "2vh",
                            width: "4vh", // Set the desired width
                            height: "4vh", // Set the desired height
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="view" // Add the title attribute
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>

                        <button
                          className="btn btn-outline-success btn-lg"
                          type="submit"
                          onClick={() => openModal(food)}
                          style={{
                            fontSize: "2vh",
                            width: "4vh", // Set the desired width
                            height: "4vh", // Set the desired height
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "1.5vh",
                          }}
                          title="Print Bill"
                        >
                          <i
                            className="fas fa-print"
                            style={{ fontSize: "2vh" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
          ) : (
            <div
              style={{
                textAlign: "center",
                marginTop: "20vh",
                fontSize: "15vh",
                fontStyle: "italic",
                color: "rgba(3, 152, 158, 0.5)",
                marginLeft: "25vh",
              }}
            >
              No Current Orders
            </div>
          )}
        </div>
      </div>
      <Modal show={showFoodDetailsModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title className="text-center mx-auto">
            Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={componentRef}>
            {selectedOrder && (
              <div className="content-container">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: "5vh",
                    marginRight: "5vh",
                  }}
                >
                  <h6
                    className="text-start content-container"
                    style={{ color: "black" }}
                  >
                    Table No : {selectedOrder.tblno}
                  </h6>
                  <h6
                    className="text-start content-container"
                    style={{ color: "black" }}
                  >
                    Order No : {selectedOrder.oid}
                  </h6>
                </div>

                <h6
                  class="text-start content-container"
                  style={{ color: "black", marginLeft: "5vh" }}
                >
                  Order Type : {selectedOrder.ordertype}
                </h6>

                <table style={{ marginLeft: "10vh", marginTop: "3vh" }}>
                  <thead>
                    <tr>
                      <th style={{ paddingRight: "2rem" }}></th>
                      <th style={{ paddingRight: "2rem" }}></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderFoods?.map((fooditem, foodIndex) => (
                      <tr key={foodIndex}>
                        <td style={{ paddingRight: "2rem" }}>
                          {foodIndex + 1}
                        </td>
                        <td style={{ paddingRight: "2rem" }}>
                          {fooditem.food_name}
                        </td>
                        <td>{fooditem.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "end" }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <form onSubmit={(e) => handleSubmit(e)} style={{ display: "none" }}>
        <div
          class="card text-center "
          style={{ background: "white" }}
          ref={ref}
        >
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
                    height: "330px",
                  }}
                />
              )}
            </div>
            <div class="dark-border mt-3"></div>
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
            <div class="dark-border" style={{ marginTop: "-10px" }}></div>
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
            <div class="dark-border mt-2"></div>
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
                  Bill No:{billId} Date:{today}
                  <br />
                  {timeInAMPM}{" "}
                </h1>

                <h1
                  className="text-end "
                  style={{
                    fontSize: "3vh",
                    fontFamily: "Bitstream Vera Sans Mono, monospace",
                    fontWeight: "800",
                  }}
                >
                  Cashier:{currentuser.username} PaymentMode:
                  {billData.paymentmode} <br />
                  Table No:
                  {billData?.order.length > 0 ? billData?.order[0].tblno : ""}
                </h1>
              </div>
            </div>

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
            <div class="dark-border mt-3"></div>
            <div style={{ fontSize: "3vh", width: "105%" }}>
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
              {billData?.order[0].orderFoods.map((orderFood, num) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
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
            <div class="dark-border mt-3"></div>
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
                {billData?.order[0].orderFoods.reduce((total, orderFood) => {
                  return total + orderFood.quantity;
                }, 0)}
              </h4>
              <div class="dark-border mt-3"></div>
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
                    Sub Total : {currentuser.currency}
                    {subtotal}
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
                    }}
                  >
                    Discount ({discount || "0"}%) : {currentuser.currency}
                    {discountRate.toFixed(2)}
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
                }}
              >
                <span>
                  {taxNames.map((taxName, index) => (
                    <div key={index}>
                      <span>
                        <h1
                          className=""
                          style={{
                            fontSize: "3vh",
                            fontFamily: "Bitstream Vera Sans Mono, monospace",
                            fontWeight: "800",
                          }}
                        >
                          {taxName} ({taxRates[index]}% ):{" "}
                          {currentuser.currency}
                          {taxAmounts[index].toFixed(2)}
                        </h1>
                      </span>
                    </div>
                  ))}
                </span>
              </div>
            </div>
            <div class="dark-border mt-3"></div>
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
                  Grand Total : {currentuser.currency}
                  {total % 1 === 0 ? total : total.toFixed(2)}
                </h1>
              </div>
            </div>
            <div class="dark-border mt-3"></div>

            <div class="">
              {/* ---------------------------------------rushikesh made this code ---------------------------*/}
              <div>
                {qrCodeImage ? (
                  <div>
                    <h1
                      class="card-text text-center "
                      style={{ fontSize: "3.2vh", fontWeight: "800" }}
                    >
                      Scan & pay
                    </h1>
                    <img src={qrCodeImage} alt="QR Code" width="400vh" />
                  </div>
                ) : // Display a placeholder or blank image when qrCodeImage is null
                null
                // or <img src="" alt="Blank Image" width="400vh" />
                }
              </div>

              {/* ------------------ rushikesh made this code end here {or scanner}------------------ */}

              <h1
                class="card-text text-center "
                style={{
                  fontSize: "3vh",
                  fontFamily: "Bitstream Vera Sans Mono, monospace",
                  fontWeight: "800",
                }}
              >
                {" "}
                THANKS!!! VISIT AGAIN
              </h1>
              <h1
                class="card-text text-center "
                style={{ fontSize: "3vh", fontWeight: "800" }}
              >
                {" "}
                www.ubsbill.com
              </h1>
              <br></br>
              <br></br>
              <br></br>
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "3vh" }}>
              Payment Details
            </Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{ display: "flex", flexDirection: "row", height: "70vh" }}
          >
            <div style={{ display: "flex", marginRight: "10vh" }}>
              <div style={{ flex: 1 }}>
                {selectedOrder && (
                  <div className="content-container">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: "0vh",
                        border: "1px solid #ccc",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        width: "110%",
                      }}
                    >
                      <div
                        style={{
                          borderRight: "1px solid #ccc",
                          paddingRight: "10px",
                        }}
                      >
                        <h6
                          className="text-start content-container"
                          style={{
                            color: "black",
                            margin: 0,
                            fontSize: "1.7vh",
                            fontWeight: "700",
                          }}
                        >
                          Table No: {billData.order[0].tblno}
                        </h6>
                      </div>
                      <div style={{ padding: "0 10px" }}>
                        <h6
                          className="text-start content-container"
                          style={{
                            color: "black",
                            margin: 0,
                            fontSize: "1.7vh",
                            fontWeight: "700",
                          }}
                        >
                          Order No: {billData.order[0].oid}
                        </h6>
                      </div>
                      <div>
                        <h6
                          className="text-start content-container"
                          style={{
                            color: "black",
                            margin: "0",
                            fontSize: "1.7vh",
                            fontWeight: "700",
                          }}
                        >
                          Order Type: {billData.order[0].ordertype}
                        </h6>
                      </div>
                    </div>

                    <div
                      style={{
                        marginLeft: "2vh",
                        marginTop: "0",
                        maxHeight: "64vh",
                        overflowY: "scroll",
                        fontSize: "1.8vh",
                        fontFamily: "Bitstream Vera Sans Mono, monospace",
                      }}
                    >
                      <table style={{ marginLeft: "2vh", marginTop: "0vh" }}>
                        <thead>
                          <tr>
                            <th
                              style={{ paddingRight: "2rem" }}
                              className="text-center"
                            >
                              S.No
                            </th>
                            <th
                              style={{ paddingRight: "2rem" }}
                              className="text-center"
                            >
                              Item
                            </th>
                            <th
                              className="text-center"
                              style={{ paddingRight: "2rem" }}
                            >
                              Qty
                            </th>
                            <th
                              className="text-center"
                              style={{ paddingRight: "2rem" }}
                            >
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {billData.order[0].orderFoods?.map(
                            (fooditem, foodIndex) => (
                              <tr key={foodIndex}>
                                <td
                                  style={{
                                    paddingRight: "2rem",
                                    fontFamily:
                                      "Bitstream Vera Sans Mono, monospace",
                                  }}
                                  className="text-center"
                                >
                                  {foodIndex + 1}
                                </td>
                                <td
                                  style={{
                                    paddingRight: "2rem",
                                    fontFamily:
                                      "Bitstream Vera Sans Mono, monospace",
                                  }}
                                  className="text-left"
                                >
                                  {fooditem.food_name}
                                </td>
                                <td
                                  style={{
                                    paddingRight: "2rem",
                                    fontFamily:
                                      "Bitstream Vera Sans Mono, monospace",
                                  }}
                                  className="text-center"
                                >
                                  {fooditem.quantity}
                                </td>
                                <td>{fooditem.price}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="payment12"
                style={{
                  flex: 1,
                  border: "2px solid #ccc",
                  padding: "20px",
                  backgroundColor: "#f0f0f0",
                  width: "20vw",
                  marginLeft: "5vh",
                }}
              >
                <div className="payment-mode-input">
                  <label style={{ color: "red", fontSize: "1.7vh" }}>
                    <select
                      className="form-select"
                      value={billData.paymentmode}
                      onChange={(e) => {
                        const selectedPaymentMode = e.target.value;

                        setBilldata({
                          ...billData,
                          paymentmode: selectedPaymentMode,
                        });

                        // Set paymentModeSelected to true only if a valid payment mode is selected
                        setPaymentModeSelected(selectedPaymentMode !== "");
                      }}
                      required
                    >
                      <option value="" style={{ fontSize: "1.7vh" }}>
                        Select payment mode
                      </option>
                      <option value="cash" style={{ fontSize: "1.7vh" }}>
                        CASH
                      </option>
                      <option value="upi" style={{ fontSize: "1.7vh" }}>
                        UPI
                      </option>
                      <option value="card" style={{ fontSize: "1.7vh" }}>
                        CARD PAYMENT
                      </option>
                    </select>
                    Please select payment mode
                  </label>
                </div>
                <div className="payment-mode-input">
                  {!isPrinting && (
                    <input
                      type="tel"
                      style={{ fontSize: "1.7vh" }}
                      className="form-control"
                      placeholder="Enter Contact number"
                      maxLength={10}
                      onKeyPress={(e) => {
                        const isNumeric = /^[0-9]*$/;
                        if (!isNumeric.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        setBilldata({ ...billData, contact: e.target.value })
                      }
                      value={billData.contact}
                    />
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "1.7vh" }}>Discount Rate :</label>
                  <input
                    className="w-full rounded-r-none bg-white shadow-sm"
                    type="number"
                    name="tax"
                    id="tax"
                    min="0.01"
                    style={{ fontSize: "1.7vh" }}
                    step="0.01"
                    placeholder="0.0"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer
            style={{ display: "row", justifyContent: "space-between" }}
          >
            <p
              style={{
                fontSize: "2.5vh",
                fontWeight: "bold",
                textAlign: "left",
              }}
              className="text-left"
            >
              Grand Total: {total % 1 === 0 ? total : total.toFixed(2)}
            </p>
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: "1.7vh", marginRight: "2vh" }}
                onClick={(e) => {
                  e.preventDefault();
                  handlePrint();
                  handleSubmit(e);
                }}
                disabled={!paymentModeSelected || isButtonDisabled} // Disable based on conditions
              >
                <i
                  className="fas fa-print"
                  style={{ marginRight: "0.5rem", fontSize: "1.7vh" }}
                ></i>
                Print
              </button>

              <Link
                class="edit btn-success btn"
                to={`/overview/update_order/${orderId}`}
                title="Edit Order"
                style={{ fontSize: "1.7vh" }}
              >
                Edit Order
              </Link>
            </div>
          </Modal.Footer>
        </Modal>
      </form>
      <div
        className="slider_enq"
        style={{ right: "-10vw", transform: "translateY(-50%)" }}
      >
        <button
          className="btn btn-primary"
          style={{
            position: "fixed",
            fontSize: "2.5vh",
            marginTop: "30vh",
            top: "80%",
            right: 0,
            transform: "translateX(-50%) rotate(90deg)",
          }}
          onClick={handleClick}
        >
          Customer Details
        </button>

        <div
          className="header_enq"
          style={{
            display: visible ? "block" : "none",
            transform: "translateY(-40%)",
            zIndex: "999",
          }}
        >
          <form onSubmit={(e) => customerRegister(e)} className="Details">
            <div className style={{}}>
              <div style={{ marginBottom: "10px" }}>
                <label> Customer Name</label>
                <input
                  type="text"
                  placeholder="Name "
                  maxLength="100"
                  className="form-control"
                  name="customername"
                  onChange={(e) => handleChange(e)}
                  value={customer.customername}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Contact Number"
                  name="contact"
                  maxLength="10"
                  minLength="10"
                  className="form-control"
                  onChange={handleChange}
                  value={customer.contact}
                  required="required"
                  onKeyPress={(e) => {
                    const isNumber = /^[0-9]$/;
                    if (!isNumber.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label> Email </label>
                <input
                  type="text"
                  name="email"
                  pattern=".+@(gmail\.com|outlook\.com|yahoo\.com)"
                  className="form-control"
                  style={{ fontstyle: "2vh" }}
                  value={customer.email}
                  placeholder="Email"
                  validations={[required, emailValidation]}
                  title="Please enter a valid gmail/outlook/yahoo address"
                  onChange={(e) => {
                    handleChange(e);
                    emailValidation(customer.email);
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Date Of Birth </label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  onChange={(e) => handleChange(e)}
                  value={customer.dob}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
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
          style={{ marginTop: "-5vh", marginRight: "20vh" }}
        />
      </div>
      ;
    </>
  );
};
