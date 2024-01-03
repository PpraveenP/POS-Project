import React, { Component } from "react";
import bgImage from '../assets/banner.png';
import "./home.component.css";


export default class Home extends Component {

render() {
    return (
     <>
        <div className="container-fluid animation" style={{ overflow: "hidden", height: "100vh" }}>
         <div className="jumbotron mt-5" style={{background:"white"}}>
            <h1 className="text-center" style={{color:"#03989e",fontSize:"5vh",marginTop:"2vh"}}><i class="fa-regular fa-handshake"></i> Welcome, To UBS BILLING SYSTEM <i class="fa-regular fa-handshake"></i></h1>
         </div>
         <div className="homeimg">
            <img src={bgImage} alt="Sidebar background" style={{ width: "60vw", height: "60vh",marginTop:"0vh",marginRight:"auto",marginLeft:"35vh" }} className="image-animation"></img>
         </div>
        </div>
     </>
    );
}
}