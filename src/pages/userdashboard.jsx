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
function UserDashboard() {
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
   const [chartData2, setChartData2] = useState({
      options: {
         colors: ["#03989e", "#1F618D"],
         yaxis: {
            title: {
               text: "ORDERS",
               style: {
                  fontSize: "17px",
               },
            },
         },
         title: {
            text: "Online / Offline Orders",
            align: "center",
            style: {
               fontSize: "17px",
            },
         },
      },
      series: [
         {
            name: "OFFLINE ORDERS",
            data: [], // Placeholder for data
         },
      ],
   });

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
            const offlineOrdersData = last7OrdersData.map((item) => item.total);

            setChartData2({
               ...chartData2,
               series: [

                  {
                     ...chartData2.series[1],
                     data: offlineOrdersData,
                  },
               ],
            });
         })
         .catch((error) => {
            console.error("Error fetching data:", error);
         });
   });

   const [pieChartData, setPieChartData] = useState({
      options: {
         colors: ["#03989e", "#1F618D"],
         labels: ["Food-1", "Food-2", "Food-3", "Food-4", "Food-5"],
         title: {
            text: "Most Food Sale",
            align: "center",
            style: {
               fontSize: "18px",
            },
         },
      },
      series: [1, 2, 3, 4, 5], // Placeholder for data
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

            // Update the state with fetched data
            setPieChartData({
               ...pieChartData,
               options: {
                  ...pieChartData.options,
                  labels: foodNames, // Update labels with food names
               },
               series: foodQuantities, // Update series with food quantities
            });
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
               <h5 style={{ marginLeft: "6vw", fontWeight: "600", fontSize: "4vh" }} className="mb-3"><i class="fa-solid fa-house"></i> Dashboard</h5>
            </div>
            <div className="dashrow" style={{}}>
               <div className="row2" style={{ marginLeft: "6vw", display: "inline-flex", marginRight: "10vw" }}>
                  <i class="fa-regular fa-user mr-4" style={{ color: "white", fontSize: "5vh", fontWeight: "100", marginRight: "0.6vw", marginTop: "10px" }}></i>
                  <h5 style={{ fontSize: "2.8vh" }}>Hello, <br />{currentuser.username}</h5>
               </div>
               <div className="row2" style={{ marginLeft: "5vw", display: "inline-flex" }}>
                  <i class="fa-solid fa-indian-rupee-sign" style={{ color: "white", fontSize: "5vh", marginTop: "10px", width: "60px", height: "60px", padding: "12px", paddingLeft: "14px" }}></i>
                  <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                     <h5 style={{ marginTop: "10px", marginBottom: "-5px", fontSize: "2.8vh" }}>Today's Income</h5>
                     <h3 style={{ fontSize: "3.5vh" }}>{todaysSellData}</h3></div>
               </div>
               <div className="row2" style={{ marginLeft: "8vw", display: "inline-flex" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#ffffff", fontSize: "5vh", marginTop: "10px" }} />
                  <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                     <h5 style={{ marginTop: "10px", marginBottom: "-5px", fontSize: "2.8vh" }}>Most Selling Food</h5>
                     <div class="weight-300 font-20">
                        {mostSellingFood ? (
                           <div>
                              <h4 style={{ fontSize: "3.2vh" }}>{mostSellingFood.food_name} = {mostSellingFood.quantity}</h4>

                           </div>
                        ) : (
                           <div>No most selling food available.</div>
                        )}
                     </div></div>
               </div>
            </div>
         </div>

         <div className="container33" style={{ marginTop: "3vh" }} >
            <h5 style={{ marginLeft: "6vw", fontWeight: "600", fontSize: "4vh" }}>Quick Access</h5>
         </div>

         <div className="menurow mt-4 ml-auto" style={{ margin: "auto", fontSize: "2vh" }}>

            <div class="card2" style={{}}>
               <Link to="/overview/order" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv1" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/tray.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div className="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p style={{ marginTop: "2vh", fontSize: "2.4vh" }}>New Order</p>
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
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}> Bill Report</p>
                  </div>
               </Link>
            </div>



            <div class="card2" style={{}}>
               <Link to="/reports/vendor_list" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv6" style={{}}>
                     <img src={process.env.PUBLIC_URL + '/contact-list.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Vendor List</p>
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
               <Link to="/Food/Food_list" style={{ textDecoration: "none" }}>
                  <div className="topdiv topdiv8" style={{}}>
                     <img src={process.env.PUBLIC_URL + 'preparation.png'} class="card-img-top" alt="..." style={{}} />
                  </div>
                  <div class="bottomdiv" style={{ backgroundColor: "#03989e", height: "6vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                     <p class="" style={{ marginTop: "2vh", fontSize: "2.4vh" }}>Food List</p>
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

export default UserDashboard;










