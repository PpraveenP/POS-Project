
import axios from "axios";
import Chart from "react-apexcharts";
import "./dashboard.css";
import authService from "../services/auth.service";
import React, { useState, useEffect, useRef } from "react";
import billService from "../services/bill.service";
import { Link } from "react-router-dom";
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Modal, Card, Button } from "react-bootstrap";
import "./list.css";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// ----------------Neha made changes in this whole code--------------------
function GraphComponent() {
   const navigate = useNavigate();
   const currentuser = authService.getCurrentUser();
   // Create a state variable to store today's sell data
   const [todaysSellData, setTodaysSellData] = useState(null);
   const [mostSellingFood, setMostSellingFood] = useState([]);
   const [chartData1, setChartData1] = useState({
      options: {
         colors: ["#03989e", "#1F618D"],
         labels: ["", ""],
         title: {
            text: "Today's Sale",
            align: "center",
            style: {
               fontSize: "17px",
            },
         },
         xaxis: {
            categories: [
               "1",
               "2",
               "3",
               "4",
               "5",
               "6",
               "7",
            ],
         },
         yaxis: {
            title: {
               text: "Amount",
               style: {
                  fontSize: "17px",
               },
            },
         },
      },
      series: [

         {
            name: "Total",
            data: [], // Placeholder for data
         },
      ],
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

   useEffect(() => {
      // Fetch inventory data from the API
      axios
         .get(
            `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`
         )
         .then((response) => {
            const inventoryData = response.data;
            // Reverse the order of the data and then slice the last 7 items
            const reversedData = inventoryData.reverse();
            const last7OrdersData = reversedData
               .slice(0, 7)
               .map((item) => ({
                  //id: item.id || 0,
                  total: item.total || 0,
               }));
            // Extract online and offline orders data
            //const onlineOrdersData = last7OrdersData.map((item) => item.id);
            const offlineOrdersData = last7OrdersData.map((item) => item.total);
            // Update the state with fetched data
            setChartData1({
               ...chartData1,
               series: [

                  {
                     ...chartData1.series[1],
                     data: offlineOrdersData,
                  },
               ],
            });
         })
         .catch((error) => {
            console.error("Error fetching data:", error);
         });
   }, []);

   useEffect(() => {
      // Fetch today's sell data from the API
      axios
         .get(
            `http://localhost:8083/sys/Bill/total-payments/${currentuser.storeid}/today`
         )
         .then((response) => {
            // Assuming the API response contains the today's sell data as a number
            const todaySell = response.data;

            // Update the state with fetched data
            setTodaysSellData(todaySell);
         })
         .catch((error) => {
            console.error("Error fetching today's sell data:", error);
         });
   }, []);


   useEffect(() => {
      // Fetch inventory data from the API
      axios
         .get(
            `http://localhost:8083/sys/Bill/billorder/${currentuser.storeid}`
         )
         .then((response) => {
            const inventoryData = response.data;


            // Reverse the order of the data and then slice the last 7 items
            const reversedData = inventoryData.reverse();
            const last7OrdersData = reversedData
               .slice(0, 7)
               .map((item) => ({
                  total: item.total || 0,
               }));
            // Extract online and offline orders data

         })
         .catch((error) => {
            console.error("Error fetching data:", error);
         });
   });


   useEffect(() => {
      axios
         .get(`http://localhost:8083/sys/OrderFood/food-quantity/${currentuser.storeid}`)
         .then((response) => {
            const mostSellingFoodData = response.data;
            setMostSellingFood(mostSellingFoodData);

            // Extract food names and quantities
            const foodNames = mostSellingFoodData.map((item) => item.food_name);
            const foodQuantities = mostSellingFoodData.map((item) => item.quantity);

         })
         .catch((error) => {
            console.error("Error fetching most selling food data:", error);
         });
   }, []);
   const [contVisible, setContVisible] = useState(true);

   const hideCont = () => {
      setContVisible(false);
   };

   ///// ------------------------------ NOTIFICATION CODE BY RUSHIKESH ACCEPT ------------------------

   const [notifications, setNotifications] = useState([]); // Use an array to store multiple notifications
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      async function fetchData() {
         try {
            const response = await fetch('http://localhost:8083/sys/notification/last24');
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setNotifications(data); // Update the notifications state with the received data array
            setLoading(false);
         } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
         }
      }
      fetchData();
   }, []);
   return (
      <div className="newdashboard animation" style={{ overflow: "hidden" }}>




         <div className="container2" >
            <div className="row2">
               <h5 style={{ marginLeft: "8vw", fontWeight: "600", fontSize: "5vh" }} className="mb-3"> Dashboard</h5>
            </div>





            <div className="dashrow " style={{marginLeft:"3vh"}}>
            <div className="row2" style={{ marginLeft: "6vw", display: "inline-flex", marginRight: "10vw" }}>
            <i class="fa-regular fa-user mr-4" style={{ color: "white", fontSize: "3vw", fontWeight: "100", marginRight: "0.6vw", marginTop: "1vh" }}></i>
            <h5 style={{ fontSize: "1.5vw" }}>Hello, <br />{currentuser.username}</h5>
           </div>




            <div className="row2" style={{ marginLeft: "-1vw", display: "inline-flex" }}>
            <h4 style={{ color: "white", fontSize: "3vw", marginTop: "2vh", width: "8vw", height: "8vw", padding: "1.5vw", paddingLeft: "2.3vw",fontWeight:"600" }}> {currentuser.currency}</h4>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "2vw" }}>
           <h5 style={{ fontSize: "1.5vw",marginTop:"5.5vh",marginLeft:"-8vh" }}>Today's Income</h5>
           <h3 style={{ fontSize: "1.5vw",marginLeft:"-8vh",marginTop:"-0.5vh" }}>{todaysSellData}</h3>
           </div>
           </div>





         <div className="row2" style={{ marginLeft: "5vw", display: "inline-flex" }}>
         <FontAwesomeIcon icon={faStar} style={{ color: "#ffffff", fontSize: "3vw", marginTop: "2vh" }} />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: "2vw" }}>
          <h5 style={{  fontSize: "1.5vw",marginTop:"1vh",marginLeft:"-1vh" }}>Most Selling Food</h5>
         <div class="weight-300 font-20">{mostSellingFood ? (
          <div><h4 style={{ fontSize: "2.5vh" }}>{mostSellingFood.food_name} = {mostSellingFood.quantity}</h4>
          </div>
        ) : (
          <div>No most selling food available.</div>
        )}




      </div>
    </div>
  </div>
</div>

         </div>
         <div className="container33" style={{ marginTop: "3vh" }} >
            <h3 style={{ marginLeft: "8vw", fontWeight: "600", fontSize: "5vh" }}>Quick Menu</h3>
            <hr style={{ height: "2px" }} />
         </div>
         <div className="menurow" style={{ margin: "auto", fontSize: "2vh" }}>
            <div class="card2" style={{}}>
               <Link to="/overview/order" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv1" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/tray.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>New Order</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/pendingorder" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv2" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/pendingorder.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Pending Order</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/overview/order_list" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv3" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/payment.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Order List</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/food/food" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv4" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/menu.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Add Food</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/overview/bill_list" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv5" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/report.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Bill Report</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/user/adduser" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv6" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/group.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Add User</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/inventory" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv7" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/inventory.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Add Inventory</p>
                  </div>
               </Link>
            </div>
            <div class="card2" style={{}}>
               <Link to="/settings" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv8" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/profile.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Profile Setting</p>
                  </div>
               </Link>
            </div>
         </div>
         <div className={contVisible ? "cont" : "cont hidden"}>
            <div className="cont33" style={{ height: "5vh", fontSize: "2vh" }}>
               Notification

            </div>
            {/* ------------------RUSHIKESH MAKE THIS CHANGES START HERE ---------------------- */}
            <marquee style={{ width: "21vw", maxWidth: "21vw", margin: "10px", wordWrap: "break-word", fontSize: "2vh", color: "red" }}>
               <ul>
                  {notifications.map((notification, index) => (
                     <li key={index}>{notification.message}</li> // Assuming each notification has a 'message' property
                  ))}
               </ul>
            </marquee>
            {/* ------------------RUSHIKESH MAKE THIS CHANGES END HERE ---------------------- */}
         </div>
      </div>
   );
}

export default GraphComponent;