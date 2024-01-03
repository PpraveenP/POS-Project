import React, { useState, useEffect, useRef } from "react";
import billService from "../services/bill.service";
import { Link } from "react-router-dom";
import authService from '../services/auth.service';
import { Modal, Card, Button } from "react-bootstrap";
import "./kot.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


export const Kot = () => {
const currentuser = authService.getCurrentUser();
const [runningOrders, setRunningOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
const { id } = useParams();
const navigate = useNavigate();

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
    if (id) {
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
    }
}, [id, currentuser.storeid]);
const [selectedCategory, setSelectedCategory] = useState(null);

const handleSubmit = (e) => {
    e.preventDefault();
         // Send the updated values to the server
    axios
     .patch(
        "http://localhost:8083/sys/Bill/updateBillorder/" + id,
    
     )
     .then((res) => {
        navigate(`/overview/order`);
        console.log("updated successfully");
        setMsg("updated successfully");
        setValues({
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
                ordstatus:"Prepared",
             orderFoods: [],
            },
         ],
        });
        console.log("prepared...")
     })
     .catch((err) => console.log(err));
};


useEffect(() => {
    fetchRunningOrders();
}, []);

const [msg, setMsg] = useState("");



const fetchRunningOrders = () => {

    fetch(`http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}?ordstatus=Running`)
     .then((response) => response.json())
     .then((data) => {
        // Assuming data is an array of bill objects
        const runningOrders = data.flatMap((bill) =>
         bill.order.filter((order) => order.ordstatus === "Running")
        );

        setRunningOrders(runningOrders);
        setSelectedOrder();
     })
     .catch((error) => {
        console.error("Error fetching running orders: ", error);
     });
};

useEffect(() => {
    fetchRunningOrders();
}, []);


const handleDoneClick = (orderId) => {
axios
    .patch(`http://localhost:8083/sys/order/updateorderStatus/${orderId}`, { status: 'Prepared' })
    .then((res) => {
     // Handle success, if needed
     toast.success(`Order is prepared`);
     setTimeout(() => {
        window.location.reload();
     }, 1);
    })
    .catch((err) => {
     // Handle error, if needed
     toast.error(`Error marking order :`, err);
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
<div className="pendingorder2 animation" style={{ marginTop: "10vh" }}>
     <div style={{ display: "flex", flexDirection: "row", marginTop: "15vh", marginLeft: "17vh", position: "relative" }}>
         <Link to={'/pendingorder'}>
            <button className="btn btn-warning" style={{ width: "20vh", marginRight: "2vh", color: "white", height: "6vh", fontSize: "2vh" }}>Running Order</button>
         </Link>
         <Link to={'/overView/order'}>
            <button className="btn btn-success" style={{ width: "20vh", marginRight: "2vh", height: "6vh", fontSize: "2vh" }}>New Order</button>
         </Link>
         <Link to={'/overView/order_list'}>
            <button className="btn btn-primary" style={{ width: "20vh", marginRight: "2vh", height: "6vh", fontSize: "2vh" }}>Order List</button>
         </Link>
        </div>



        <div className="order-container2">
{runningOrders.length > 0 ? (
    runningOrders
     .slice()
     .reverse()
     .map((selectedOrder, index) => (
        <div className="orderrow2" key={index}>
         <Card className="mycard4" key={index}>
            <div className="content-container2">
             <div
                className="left-content"
                style={{
                 marginTop: "-2.5vh",
                 marginLeft: "-2vh",
                 borderRight: '1.5px solid #333',
                 paddingRight: '-2vh'
                }}
             >
                <h6>Table No: {selectedOrder.tblno}</h6>
                <h6>Order No: {selectedOrder.oid}</h6>
                <h6>Order Type: {selectedOrder.ordertype}</h6>
             </div>

             <div className="right-content " style={{ paddingLeft: '-2vh' }}>
                {selectedOrder.orderFoods && (
                 <ul>
                    {selectedOrder.orderFoods.map((fooditem, foodIndex) => (
                     <li
                        key={foodIndex}
                        style={{
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'flex-start'
                        }}
                     >
                        <span>&bull; {fooditem.food_name}</span>
                        <span>{fooditem.quantity}</span>
                     </li>
                    ))}
                 </ul>
                )}
             </div>
            </div>
         </Card>
         <button
            className="button button77868"
            style={{ marginTop: "5vh" }}
            onClick={() => handleDoneClick(selectedOrder.serial_no)}
         >
            Prepared
         </button>
        </div>
     ))
) : (
    <div
     style={{
        textAlign: "center",
        marginTop: "20vh",
        fontSize: "15vh",
        fontStyle: "italic",
        color: "rgba(3, 152, 158, 0.5)"
     }}
    >
     No Current Orders
    </div>
)}
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
         style={{ marginTop: "5vh", marginRight: "0vw" }} />
</div>

);
};
