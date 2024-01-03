/*{----------------------------    Billing   ----------------------------------------}*/

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import authService from '../services/auth.service';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import ReactPrint from "react-to-print";
import { Link } from "react-router-dom";

const date = new Date();
const today = date.toLocaleDateString("en-GB", {
   month: "numeric",
   day: "numeric",
   year: "numeric",
});
export const Billing = () => {
   const [paymentModeSelected, setPaymentModeSelected] = useState(false);
   const currentuser = authService.getCurrentUser();
   const [taxRate, setTaxRate] = useState(0); // Define the tax rate state
   const [taxName, setTaxName] = useState(''); // Define the tax name state
   const [taxNames, setTaxNames] = useState([]);
   const [taxRates, setTaxRates] = useState([]);
   const { id } = useParams();
   const [price, setPrice] = useState();
   const [msg, setMsg] = useState("");
   const invoiceRef = useRef();
   const handlePrint = () => {
      window.print();
   };
   const [values, setValues] = useState({
      Serial_no:"",
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
            setValues({
               ...values,
               id: res.data.id,
               contact: res.data.contact,
               upbyname: res.data.upbyname,
               crtbyname: res.data.crtbyname,
               paymentmode: res.data.paymentmode,
               tranid: res.data.tranid,
               gst: res.data.gst,
               total: total,
               store_id: res.data.store_id,
               discount: res.data.store_id,
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
   const [selectedCategory, setSelectedCategory] = useState(null);

   const navigate = useNavigate();
   const handleSubmit = (e) => {
      e.preventDefault();
      const subtotal = values.order[0].orderFoods.reduce((prev, orderFood) => {
         return prev + orderFood.quantity * orderFood.price;
      }, 0);
      const taxAmounts = taxRates.map((rate) => (rate * subtotal) / 100);
      const totalTax = taxAmounts.reduce((acc, amount) => acc + amount, 0);
      const discountRate = (discount * subtotal) / 100;
      const total = subtotal - discountRate + totalTax;
      const updatedValues = {
         ...values,
         total: total.toFixed(2),
         discount: discount,
      };
      // Send the updated values to the server
      axios
         .patch(
            "http://localhost:8083/sys/Bill/updateBillorder/" + id,
            updatedValues
         )
         .then((res) => {
            navigate(`/overview/order`);
         
            setMsg("updated successfully");
            setValues({
               Serial_no : id,
               id:"",
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
                  },
               ],
            });
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
      values.order[0].orderFoods.map((orderFood, index) => {
         price = orderFood.price * orderFood.quantity + price;
      });
      setPrice(price);
   };
   const subtotal = values.order[0].orderFoods.reduce((prev, orderFood) => {
      return prev + orderFood.quantity * orderFood.price;
   }, 0);
   const taxAmounts = taxRates.map((rate) => (rate * subtotal) / 100);
   const totalTax = taxAmounts.reduce((acc, amount) => acc + amount, 0);
   const discountRate = (discount * subtotal) / 100;
   const total = subtotal - discountRate + totalTax;
   const [isPrinting, setIsPrinting] = useState(false);
   const handlePrintBill = () => {
      setIsPrinting(true);
   };

   const ref = useRef();
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
               throw new Error('Network response was not ok');
            }
            return response.text();
         })
         .then((data) => {
            setUpiId(data);
            setText(data)
            console.log(data)
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
         // const response = await fetch(`http://localhost:8083/sys/api/store-payments/generateQRCode?text=${upiId}`);
         const response = await fetch(`http://localhost:8083/sys/api/store-payments/generateQRCode?text=${upi}`);
         if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setQRCodeImage(imageUrl);
            console.log(upi)
         } else {
            console.error('Failed to generate QR code.');
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   useEffect((upiId , total) => {
      generateQRCode(); // Automatically generate QR code when the component mounts
 }, [upiId , total]);

   // { ---------------------------------- End HERE ---------------------------------------} //

   const date = new Date();
   // Format the time in AM/PM format
   const timeInAMPM = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
   console.log(timeInAMPM); // Output will be something like "02:30 PM"
     return (
      //  ----------------------------Neha made changes in this code   -------------------------- //
      <Document class="animation">
         <Page size="A4">
            <View>
               <form onSubmit={(e) => handleSubmit(e)} style={{ marginTop: "0vh" }}>
                  <div style={{ fontFamily: 'Bitstream Vera Sans Mono, monospace', margin: "auto", width: "50%", height: "50%", justifyContent: "center", contain: "50%" }}>
                     <div
                        class="card text-center "
                        ref={ref}
                        style={{ background: "white" }}
                     >
                        <div class="">
                           <div>
                              {currentuser.logoUrl && (
                                 <img
                                    src={logo}
                                    className="rounded"
                                    width="240vh"
                                    height="240vh"
                                    alt=""
                                    style={{ margin: "auto", display: "block" }}
                                 />
                              )}
                           </div>
                           <div class="dark-border mt-3"></div>
                           <h1
                              class="text-center font-weight-bold"
                              style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                           >
                              {currentuser.storeName}{" "}
                           </h1>
                           <div class="dark-border mt-3"></div>
                           <h1
                              class=" text-center "
                              style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                           >
                              {currentuser.saddress}
                           </h1>
                           <h1
                              class=" text-center  "
                              style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                           >
                              Contact No: {currentuser.contact}
                           </h1>
                           <h1
                              class=" text-center "
                              style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                           >
                              GST NO : {values.gst}
                           </h1>
                           <div class="dark-border mt-2"></div>
                           <div style={{ fontSize: "3vh" }}>

                              <div style={{ display: "flex", flexDirection: "row" }}>
                                 <h1
                                    className="text-start "
                                    style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                                 >

                                    Bill No:{values.id}{" "}Date:{today} {" "}{timeInAMPM}{" "}Table No:{values.order.length > 0 ? values.order[0].tblno:""}
                                    
                                 </h1>

                                 <h1
                                    className="text-end "
                                    style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                                 >
                                    Cashier:{currentuser.username}{" "} Contact:{values.contact}{"  "}PaymentMode:{values.paymentmode}{"  "}
                                 </h1>
                              </div>
                             </div>

                           <div class="" style={{ justifyContent: "space-between", margin: "center" }}>
                              <div class="">
                                 <h1
                                    className="text-start "
                                    style={{ fontSize: "3vh" }}
                                 >
                                 </h1>
                              </div>
                              <div class="">
                                 <h1
                                    className="text-end "
                                    style={{ fontSize: "3vh" }}
                                 >
                                    {" "}
                                 </h1>
                              </div>
                           </div>
                           <div class="" style={{ }}>
                              <div class="">
                                 <h1
                                    className="text-start "
                                    style={{ fontSize: "3vh" }}
                                 >
                                 </h1>
                               
                              </div>
                              <div >
                                 <h1
                                    className="text-start "
                                    style={{ fontSize: "3vh"  , justifyContent: "space-between"}}
                                 >
                                 </h1>
                              
                              </div>
                           </div>
                           <div class="dark-border mt-3"></div>
                           <div style={{ fontSize: "3vh", width:"105%" }} >
                              <table>
                                 <tr >
                                    <td  >
                                       <h1
                                          className="text-start"
                                          style={{ fontSize: "3vh"}}
                                       >
                                          {" "}
                                          Sr.
                                       </h1>
                                    </td>
                                    <td >
                                       <h1
                                          className="text-center"
                                          style={{ fontSize: "3vh" , marginLeft:"4vw"}}
                                       >
                                          {" "}
                                          Item
                                       </h1>
                                    </td >
                                    <td >
                                       <h1
                                          className="text-center"
                                          style={{ fontSize: "3vh" , marginLeft:"6vw"}}
                                       >
                                       Qty
                                         
                                       </h1>
                                    </td>
                                    <td >
                                       <h1
                                          className="text-center"
                                          style={{ fontSize: "3vh", marginLeft:"6vw"  }}
                                       >
                                          {" "}
                                          Rate
                                       </h1>
                                    </td>
                                    <td >
                                       <h1
                                          className="text-center"
                                          style={{ fontSize: "3vh" , marginLeft:"5vw" ,marginRight:"5vw" }}
                                       >
                                          {" "}
                                          Amt
                                       </h1>
                                    </td>
                                 </tr>
                                 {values.order[0].orderFoods.map((orderFood, num) => (
                                    <tr >
                                       <td>
                                          <h2
                                             className="text-start"
                                             style={{ fontSize: "3vh"}}
                                          >
                                             {num + 1}.
                                          </h2>
                                       </td>
                                       <td>
                                          <h2
                                             className=" text-start "
                                             style={{ fontSize: "3vh",fontFamily: 'Bitstream Vera Sans Mono, monospace' , marginLeft:"4vw" }}
                                          >
                                             {orderFood.food_name}
                                          </h2>
                                       </td>
                                       <td>
                                          <h2
                                             className="text-center"
                                             style={{ fontSize: "3vh" ,fontFamily: 'Bitstream Vera Sans Mono, monospace' , marginLeft:"6vw" }}
                                          >
                                             {orderFood.quantity}
                                          </h2>
                                       </td>
                                       <td>
                                          <h2
                                             className="text-right"
                                             style={{ fontSize: "3vh" , marginLeft:"6vw" ,fontFamily: 'Bitstream Vera Sans Mono, monospace'   }}
                                          >
                                             {orderFood.price.toFixed(2)}
                                          </h2>
                                       </td>
                                       <td >
                                          <h2
                                             className="text-center"
                                             style={{ fontSize: "3vh"  ,fontFamily: 'Bitstream Vera Sans Mono, monospace' ,marginRight:"5vw" , marginLeft:"6vw"  }}
                                          >
                                             {(orderFood.quantity * orderFood.price).toFixed(2)}
                                          </h2>
                                       </td>
                                    </tr>
                                 ))}
                              </table>
                           </div>
                           <div class="dark-border mt-3"></div>
                           <div  >
                              <h4
                                 className="font-weight-bold"
                                 class="text-left"
                                 style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace', fontWeight: "bold" }}
                              >
                                 Total Qty:{" "}
                                 {values.order[0].orderFoods.reduce((total, orderFood) => {
                                    return total + orderFood.quantity;
                                 }, 0)}
                              </h4>
                              <div class="dark-border mt-3"></div>
                              <div >
                                 <span>
                                    <h1
                                       className="text-right"
                                       style={{ fontSize: "3vh" ,fontFamily: 'Bitstream Vera Sans Mono, monospace'  }}
                                    >
                                       Sub Total : {currentuser.currency}{subtotal.toFixed(2)}
                                    </h1>
                                 </span>
                              </div>
                           </div>
                           <div class="">
                              <div class=" text-right " >
                                 <span>
                                    <h1
                                       className=""
                                       style={{ fontSize: "3vh",fontFamily: 'Bitstream Vera Sans Mono, monospace'  }}
                                    >
                                       Discount ({discount || "0"}%) : {currentuser.currency}
                                       {discountRate.toFixed(2)}
                                    </h1>
                                 </span>
                              </div>
                           </div>
                           <div >
                              <div
                                 class=" text-right "
                                 style={{ fontSize: "3vh" , fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                              >
                                 <span>
                                    {taxNames.map((taxName, index) => (
                                       <div key={index}>
                                          <span>
                                             <h1
                                                className=""
                                                style={{ fontSize: "3vh" }}
                                             >
                                                {taxName} ({taxRates[index]}% ): {currentuser.currency}
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
                                    style={{ fontSize: "3vh", fontWeight: "bold" ,fontFamily: 'Bitstream Vera Sans Mono, monospace' }}
                                 >
                                    {" "}
                                    Grand Total : {currentuser.currency}
                                    {total % 1 === 0 ? total : total.toFixed(2)}
                                 </h1>

                              </div>
                           </div>
                           <div class="dark-border mt-3"></div>

                           <div class="">
                              <h1 class="card-text text-center " style={{ fontSize: "3vh" }}>
                                 Scan & pay
                              </h1>
                              {/* ---------------------------------------rushikesh made this code ---------------------------*/}
                              <div>
                                 <img src={qrCodeImage} alt="QR Code" width="400vh" />
                              </div>
                              {/* ------------------ rushikesh made this code end here {or scanner}------------------ */}

                              <h1 class="card-text text-center " style={{ fontSize: "3vh", fontFamily: 'Bitstream Vera Sans Mono, monospace' }}>
                                 THANKS!!! VISIT AGAIN
                              </h1>
                              <h1 class="card-text text-center " style={{ fontSize: "3vh" }}>
                              www.syntiaro.com
                              </h1>
                              <br></br>
                              <br></br>
                              <br></br>
                           </div>
                        </div>
                     </div>
                     <div class="card w-50 text-cente container p-5">
                     <div class="payment-mode-input">
                                    {" "}
                                    {
                                        
                                          <label style={{ color: "red" }}>
                                             <select
                                                className="form-select "
                                                value={values.paymentmode}
                                                onChange={(e) => {
                                                   setValues({
                                                      ...values,
                                                      paymentmode: e.target.value,
                                                   });
                                                   setPaymentModeSelected(true); // Set paymentModeSelected to true when a payment mode is selected.
                                                }}
                                                required
                                             >
                                                <option value="">Select payment mode</option>
                                                <option value="cash">CASH</option>
                                                <option value="upi">UPI</option>
                                                <option value="card">CARD PAYMENT</option>
                                             </select>
                                             Please select payment mode
                                          </label>
                                      
                                    }
                                 </div>

                                 <div class="payment-mode-input">
                                    {" "}
                                    {!isPrinting && (
                                       <input type='text'
                                          className="form-control "
                                          placeholder="Enter Contact number"
                                          maxLength={10}
                                             onChange={(e) => {
                                             const inputValue = e.target.value;
                                             // Check if the input is a valid float number
                                             if (/^\d+(\.\d*)?$/.test(inputValue) || inputValue === '') {
                                                setValues({ ...values, contact: e.target.value })
                                             }
                                            }}
                                          value={values.contact}
                                       />
                                    )}
                                 </div>
                                 
                        <div>
                           <label>Discount Rate :</label>
                           <input
                              className="w-full rounded-r-none bg-white shadow-sm "
                              type="number"
                              name="tax"
                              id="tax"
                              min="0.01"
                              step="0.01"
                              placeholder="0.0"
                              value={discount}
                              onChange={(event) => setDiscount(event.target.value)}
                           />
                        </div>
                        <div>
                           <p></p>
                        </div>
                        <div
                           class="d-grid gap-2 mx-auto d-flex justify-content-between align-items-center"
                           style={{ display: "flex" }}
                        >
                           <ReactPrint
                              trigger={() => (
                                 <button
                                    type="submit"
                                    class="btn btn-primary"
                                    onClick={handlePrint}
                                    disabled={!paymentModeSelected}
                                 >
                                    Print
                                 </button>
                              )}
                              content={() => ref.current}
                           />
                           <Link
                              class="edit btn-success btn"
                              to={`/overview/update_order/${id}`}
                              title="Edit Order"
                              style={{ width: "18vh", fontSize: "2vh" }}
                           >
                              Edit Order
                           </Link>
                        </div>
                     </div>
                   </div>
               </form>
            </View>
         </Page>
      </Document>
   );
};
