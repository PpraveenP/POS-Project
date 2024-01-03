import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

 // rushikesh added  this new file .....................

function NotificationForm() {  
  const [notificationMessage, setNotificationMessage] = useState({
    datetime: '',
   // email: '',
    message: '',
    subject: '',
    startDatetime: '',
    endDatetime: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNotificationMessage({
      ...notificationMessage,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to your Spring Boot endpoint
      const response = await axios.post('http://localhost:8083/sys/notification/create', notificationMessage);

      // Check if the request was successful
      if (response.status === 200) {
        console.log('Notification created successfully and email sent.');
        toast.success('Notification created successfully.');

      } else {
        console.error('Error creating Notification:', response.data);
        toast.error('Error creating Notification. Please check the data and try again.');

      }
    } catch (error) {
      console.error('Error creating Notification:', error.message);
      toast.error('Error creating Notification. Please try again later.');

    }
  };

  return (
    <div className="p-15 animation" style={{ marginTop: "3vh" }}>
      <div className="row p-3">
        <div className="col-md-8" style={{ marginLeft: "auto", marginRight: "auto" }} >
          <div className="card">
            <h4 className="text-gray" style={{ fontSize: "4vh", color: "#000099" }} > <i class="fa-solid fa-bell"></i> Notification Form</h4>
            <div className="card-body" style={{ fontSize: "2vh" }}>
              <form className="row g-1" onSubmit={handleSubmit}>
              <div class="col-md-6">
            <label htmlFor="">Start Datetime :</label>
            <input
            type="datetime-local"
            name="startDatetime"
            className="form-control"
            value={notificationMessage.startDatetime}
            onChange={handleInputChange}
          />
        </div>
        <div class="col-md-6">
            <label htmlFor="">End Datetime :</label>
            <input
            type="datetime-local"
            name="endDatetime"
            className="form-control"
            value={notificationMessage.endDatetime}
            onChange={handleInputChange}
          />
        </div>
                <div class="col-md-6">
          <label>message:</label>
          <input
            type="text"
            name="message"
            className="form-control"
            value={notificationMessage.message}
            onChange={handleInputChange}
            style={{height:"20vh" , width:"36vw"}}
          />
        </div>
              <div>
              <button
                 className="btn text-white col-md-4"
                 type="submit"
                 style={{
                    background: "#03989e",
                    fontSize: "2.5vh",
                    marginTop:"10vh",
                    marginLeft:"40vh"
                
                 }}
                >
                 UPDATE
                </button>
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
              style={{ marginTop: "70px", marginRight: "10px" }}
            />
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
          style={{ marginTop: '70px', marginRight: '10px' }} />
    </div>
  );
}
export default NotificationForm;
