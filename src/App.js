import React, { Component , createRef } from "react";
import { Routes, Route, Link , Navigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Superadminlogin from "./components/superadminlogin.component";
import Userlogin from "./components/userlogin.component";
import Technicianlogin from "./components/technicianlogin.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import Sidebar from "./components/sidebar.component";
import Dashbord from "./pages/dashboard";
import UserDashboard from "./pages/userdashboard";
import {Overview,Order_list,Order,Update_Order,Bill_list,} from "./pages/overview";
import { Billing } from "./pages/billing";
import Adduser from "./pages/adduser.component";
import { Update_User } from "./pages/adduser.component";
import UserSidebar from "./components/usersidebar.component";
import { Roleaccess, Updateroleaccess } from "./pages/roleaccess";
import RoleList from "./pages/rolelist";
import UserList from "./pages/userlist";
import EventBus from "./common/EventBus";
import Header from "./pages/header";
import VendorService from "./services/vendor.service";
import { Update_vendor, Vendor } from "./pages/vendor";
import Payment, { Update_payment, Payment_Gateway } from "./pages/payment";
import VendorInventory, {Update_Vendor_Inventory,} from "./pages/VendorInventory";
import Inventory, { Inventory_list, Update_Inventory } from "./pages/Inventory";
import { Food, Food_list, Update_food } from "./pages/food";
import AddOn, { AddOn_list, Update_addon } from "./pages/add_ons";
import {Payment_list,Reports,Vendor_list,Vendor_Invoice_List,Balance_list,} from "./pages/Reports";
import Taxsetting, {Settings,Payment_setting,Super_setting,Tech_setting,Update_Tax,} from "./pages/settings";
import StoreSignup from "./pages/storeSignup";
import Storelist from "./pages/storelist";
import Technician from "./components/technician.component";
import AdminSidebar from "./components/adminsidebar.component";
import SupportSidebar from "./components/supportsidebar.component";
import Supportlist from "./pages/supportlist";
import BoardTechnician from "./components/board-technician.component";
import {ProductForm,Receipe,Receipe_list,Update_Recipe,} from "./pages/receipe";
import ForgotPassword from "./pages/forgotpassword";
import TechForgotUserPassword from "./pages/techforgotpassword";
import SuperForgotUserPassword from "./pages/superforgotpassword";
import ForgotUserPassword from "./pages/forgotuserpassword";
import Resetpassword from "./pages/resetpassword";
import Resetuserpassword from "./pages/resetuserpassword";
import SuperResetpassword from "./pages/superresetpassword";
import TechResetpassword from "./pages/techresetpassword";
import LoginById from "./components/loginbyid.component";
import Freetrial from "./components/freetrial.component";
import BalanceForm from "./components/balanceform.component";
import Subscription from "./pages/subscription";
import { PendingOrder } from "./pages/pendingorder";
import NotificationForm from "./pages/NotificationForm";
import CategoryButton from "./pages/categoryButton";
import { Kot } from "./pages/kot";
import { Shortcut } from "./pages/shortcut";
import { Customer_list } from "./pages/customerlist";
import {Income_list} from "./pages/incomelist";

class App extends Component {
  constructor(props) {
      super(props);
  
      this.state = {
       showSupportBoard: false,
       showSuperAdminBoard: false,
       showAdminBoard: false,
       showUserBoard: false,
       currentUser: undefined
      };
      this.navigateRef = createRef();
  }
  componentDidMount() {
      const user = AuthService.getCurrentUser();
      if (user && typeof user === 'object' && Array.isArray(user.roles)) {
       this.setState({
          currentUser: user,
          showSupportBoard: user.roles.includes("ROLE_SUPPORT"),
          showSuperAdminBoard: user.roles.includes("ROLE_SUPER_ADMIN"),
          showAdminBoard: user.roles.includes("ROLE_ADMIN"),
          showUserBoard: user.roles.includes("ROLE_USER"),
       });
      }
      EventBus.on("logout", this.handleLogout);
  }
  
  componentWillUnmount() {
      EventBus.remove("logout", this.handleLogout);
  }
  
  
  handleLogout = async () => {
  const { currentUser } = this.state;
  
  if (currentUser) {
  try {
       let logoutEndpoint = "";
  
       if (currentUser.roles.includes("ROLE_ADMIN")) {
       logoutEndpoint = "http://localhost:8083/api/auth/store/Logout";
       } else if (currentUser.roles.includes("ROLE_SUPER_ADMIN")) {
       logoutEndpoint = "http://localhost:8083/api/auth/SuperAdmin/Logout";
       } else if (currentUser.roles.includes("ROLE_SUPPORT")) {
       logoutEndpoint = "http://localhost:8083/api/auth/Tech/Logout";
       } else if (currentUser.roles.includes("ROLE_USER")) {
       logoutEndpoint = "http://localhost:8083/api/auth/user/Logout";
       }
  
       const response = await fetch(logoutEndpoint, {
       method: "POST",
       headers: {
           "Content-Type": "application/x-www-form-urlencoded",
       },
       body: `sessionToken=${currentUser.accessToken}`,
       });
  
       if (response.ok) {
       AuthService.logout();
       localStorage.clear();
       console.log("okayyyyyyyyyy");
  
       // Update state after successful logout
       this.setState({
           showSupportBoard: false,
           showSuperAdminBoard: false,
           showAdminBoard: false,
           showUserBoard: false,
      
       });
  
       // Redirect to the login page
       this.navigateRef.current('/login');
       } else if (response.status === 401) {
       AuthService.logout();
       localStorage.clear();
       console.log("not okayyyyyyyyyy");
  
       // Update state after unsuccessful logout
       this.setState({
           showSupportBoard: false,
           showSuperAdminBoard: false,
           showAdminBoard: false,
           showUserBoard: false,
          
       });
  
       // Redirect to the login page
       this.navigateRef.current('/login');
       } else {
       AuthService.logout();
       localStorage.clear();
       console.log("not y okayyyyyyyyyy");
  
       // Update state after unsuccessful logout
       this.setState({
           showSupportBoard: false,
           showSuperAdminBoard: false,
           showAdminBoard: false,
           showUserBoard: false,
          
       });
  
       // Redirect to the login page
       this.navigateRef.current('/login');
       }
  } catch (error) {
       console.error("Error:", error);
  }
  }
  };
  // logOut() {
  // AuthService.logout();
  // this.setState({
  //     showSupportBoard: false,
  //     showSuperAdminBoard: false,
  //     showAdminBoard: false,
  //     showUserBoard: false,
  //     currentUser: ,
  // });
  // }
  
  

  /*-------------SUNDER------ sidebar height: and width: ------*/
  
  render() {
   const isLoggedIn = AuthService.isLoggedIn();
    const {
      currentUser,
      showSupportBoard,
      showAdminBoard,
      showUserBoard,
      showSuperAdminBoard,
    } = this.state;
    const navbar = { background: "#03989e", height: "10vh" };

    //---------------for store logout ----------------

    return (
      <div>
         <nav className="navbar navbar-expand navbar-dark fixed-top" style={navbar}>
          <a class="navbar-brand p-0 logo12" href="#">
             <img src={process.env.PUBLIC_URL + "/SYS1.jpg"} className=""style={{width: "9vw",height: "6.5vh",marginLeft: "10vh",borderRadius: "40px",}}alt=""/></a>
 
          {currentUser && <></>}
 
          <div className="navbar-nav mr-auto">
             <li className="nav-item">
              <Link to={"/home"} className="nav-link active"></Link>
             </li>
 
             {showSupportBoard && (
              <>
                 <SupportSidebar />
                 <li className="nav-item">
                  <Link to={"/tech"} className="nav-link active"></Link>
                 </li>
                 <li className="nav-item ml-5 mt-2">
                  <div className="p-2" style={{ marginTop: "-0.6vh" }}>
                     <h6
                      className="mt-2 text-white text-center mx-2"
                      style={{ fontSize: "2.2vh" }}
                     >
                      <i class="fa-solid fa-id-card-clip fa-lg mr-1"></i>{" "}
                      Technician Support Id : {currentUser.techid}
                     </h6>
                  </div>
                 </li>
              </>
             )}
 
             {showSuperAdminBoard && (
              <>
                 <Sidebar />
                 <li className="nav-item"></li>
                 <li className="nav-item ml-5 mt-2">
                  <div className="p-2" style={{ marginTop: "-0.6vh" }}>
                     <h6
                      className="mt-2 text-white text-center mx-2"
                      style={{ fontSize: "2.2vh" }}
                     >
                      <i
                         class="fa-solid fa-id-card-clip fa-lg mr-1"
                         style={{ fontSize: "2.4vh" }}
                      ></i>{" "}
                      Super Admin Id : {currentUser.superid}
                     </h6>
                  </div>
                 </li>
              </>
             )}
             {showAdminBoard && (
              <>
                 <AdminSidebar />
                 <li className="nav-item"></li>
                 <li className="nav-item ml-5 mt-2">
                  <div className="p-2" style={{ marginTop: "-0.6vh" }}>
                     <h6
                      className="mt-2 text-white text-center mx-2"
                      style={{ fontSize: "2.2vh" }}
                     >
                      <i
                         class="fa-solid fa-id-card-clip fa-lg mr-1"
                         style={{ fontSize: "2.4vh" }}
                      ></i>{" "}
                      Store Registration No : {currentUser.regiNum}
                     </h6>
                  </div>
                 </li>
              </>
             )}
             {showUserBoard && (
              <>
                 <UserSidebar />
                 <li className="nav-item">
                  <Link to={"/user"} className="nav-link active"></Link>
                 </li>
                 <li className="nav-item ml-5 mt-1">
                  <div className="p-2" style={{ marginTop: "-0.4vh" }}>
                     <h6
                      className="mt-2 text-white text-center mx-2"
                      style={{ fontSize: "2.2vh" }}
                     >
                      <i
                         class="fa-solid fa-id-card-clip fa-lg mr-1"
                         style={{ fontSize: "2.4vh" }}
                      ></i>{" "}
                      User Id : {currentUser.id}
                     </h6>
                  </div>
                 </li>
              </>
             )}
             {currentUser && <></>}
          </div>
          {currentUser ? (
             <div className="navbar-nav ml-auto">
              <Header />
              <li className="nav-item mr-5" style={{ marginRight: "-40vh" }}>
                 <ul
                  className="navbar-nav me-1 mb-2 mb-lg-0"
                  style={{ fontSize: "2.4vh", marginTop: "0.5vh" }}
                 >
                  <li className="nav-item dropdown p-1">
                     <a
                      className="nav-link active dropdown-toggle fw-bold ml-4"
                      href="/"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                     >
                      <i
                         className="fa-solid fa-circle-user fa-lg mr-1"
                         style={{ marginLeft: "-10vh" }}
                      ></i>{" "}
                      {currentUser.username}
                     </a>
                     <ul
                      className="dropdown-menu text-white"
                      aria-labelledby="navbarDropdown"
                     >
                      {showAdminBoard && (
                         <>
                          <li>
                             <a className="dropdown-item " href="/settings">
                              <i class="fa-solid fa-gear"></i> Edit Profile
                             </a>
                          </li>
                          <li>
                             <a
                              className="dropdown-item "
                              onClick={this.handleLogout}
                              href="/login"
                             >
                              <i class="fa-solid fa-right-from-bracket"></i>
                              Logout here
                             </a>
                          </li>{" "}
                         </>
                      )}
                      {showSuperAdminBoard && (
                         <>
                          <li>
                             <a
                              className="dropdown-item "
                              href="/settings/super_setting"
                             >
                              <i class="fa-solid fa-gear"></i> Edit Profile
                             </a>
                          </li>
                          <li>
                             <a
                              className="dropdown-item "
                              onClick={this.handleLogout}
                              href="/login"
                             >
                              <i class="fa-solid fa-right-from-bracket"></i>
                              Logout here
                             </a>
                          </li>
                         </>
                      )}
                      {showSupportBoard && (
                         <>
                          <li>
                             <a
                              className="dropdown-item "
                              href="/settings/tech_setting"
                             >
                              <i class="fa-solid fa-gear"></i> Edit Profile
                             </a>
                          </li>
                          <li>
                             <a
                              className="dropdown-item "
                              onClick={this.handleLogout}
                              href="/login"
                             >
                              <i class="fa-solid fa-right-from-bracket"></i>
                              Logout here
                             </a>
                          </li>
                         </>
                      )}
                      {showUserBoard && (
                         <>
                          <li>
                             <a
                              className="dropdown-item "
                              onClick={this.handleLogout}
                              href="/login"
                             >
                              <i class="fa-solid fa-right-from-bracket"></i>
                              Logout here
                             </a>
                          </li>
                         </>
                      )}
                      <li>
                         <hr className="dropdown-divider " />
                      </li>
                     </ul>
                  </li>
                 </ul>
              </li>
              <div
                 id="google_translate_element"
                 className="btn"
                 style={{
                  transform: "scale(0.8)",
                  width: "15vw",
                  height: "34px",
                  overflow: "hidden",
                  marginTop: "1vh",
                  marginRight: "-7vh",
                 }}
              ></div>
             </div>
          ) : (
             <div className="navbar-nav ml" style={{ marginRight: "95px" }}>
             
                     {/* <button
                      className="btn btn-lg dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      style={{
                         fontSize: "3vh",
                         marginLeft: "9vh",
                         backgroundColor: "#d9d9d9",
                      }}
                      aria-expanded="false"
                     >
                      <Link className="dropdown-item" to="/login">
                      <i
                         className="fa-solid fa-user"
                         style={{ fontSize: "3vh" }}
                      ></i></Link>
                      Login
                     </button> */}
                                     
                     <Link to="/login">
                     <button className="custom12" style={{fontWeight:"500",textcolor:"#03989e"}}>
                     
                     <i className="fa-lg fa-solid fa-users"></i> Login
                     
                     </button>
                     </Link>
                     
                     
                     
                     
                 
             
              <div className="fixed-bottom p-4 text-center" style={navbar}>
                 <div className="text-white footertext" style={{ fontSize: "2.5vh" }}>
                  @Copyright 2023 Design & Developed By SYNTIARO
                 </div>
              </div>
             </div>
          )}
         </nav>
         <Routes>
        
        <Route
    path="/userdashbord"
    element={isLoggedIn ? <UserDashboard /> : <Navigate to="/login" replace />}
/>

<Route
    path="/overview"
    element={isLoggedIn ? <Overview /> : <Navigate to="/login" replace />}
/>

<Route
    path="/overview/order_list"
    element={isLoggedIn ? <Order_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/billing/:id"
    element={isLoggedIn ? <Billing /> : <Navigate to="/login" replace />}
/>

<Route
    path="/overview/order"
    element={isLoggedIn ? <Order /> : <Navigate to="/login" replace />}
/>

<Route
    path="/home"
    element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
/>
    
        
        
        
         <Route
         path="/"
         element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
         path="/dashbord"
         element={isLoggedIn ? <Dashbord /> : <Navigate to="/login" replace />}
        />
        {/* ... Other routes */}
        <Route
         path="/login"
         element={!isLoggedIn ? <Login /> : <Navigate to="/dashbord" replace />}
        />

         <Route path="/login/:id" element={<LoginById />} />

         <Route
            path="/balanceform"
            element={isLoggedIn ? <BalanceForm /> : <Navigate to="/login" replace />}
         />

         <Route
            path="/superadminlogin"
            element={isLoggedIn ? <Superadminlogin /> : <Navigate to="/login" replace />}
         />

         <Route
            path="/userlogin"
            element={isLoggedIn ? <Userlogin /> : <Navigate to="/login" replace />}
         />
        
         <Route
    path="/register"
    element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
/>

<Route
    path="/freetrial"
    element={!isLoggedIn ? <Freetrial /> : <Navigate to="/" replace />}
/>

<Route
    path="/technicianlogin"
    element={isLoggedIn ? <Technicianlogin /> : <Navigate to="/login" replace />}
/>


        <Route
    path="/profile"
    element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
/>

<Route
    path="/user"
    element={isLoggedIn ? <BoardUser /> : <Navigate to="/login" replace />}
/>

<Route
    path="/mod"
    element={isLoggedIn ? <BoardModerator /> : <Navigate to="/login" replace />}
/>v <Route
    path="/profile"
    element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
/>

<Route
    path="/user"
    element={isLoggedIn ? <BoardUser /> : <Navigate to="/login" replace />}
/>

<Route
    path="/mod"
    element={isLoggedIn ? <BoardModerator /> : <Navigate to="/login" replace />}
/>
     <Route
    path="/tech"
    element={isLoggedIn ? <BoardTechnician /> : <Navigate to="/login" replace />}
/>

<Route
    path="/admin"
    element={isLoggedIn ? <BoardAdmin /> : <Navigate to="/login" replace />}
/>

<Route
    path="/user/adduser"
    element={isLoggedIn ? <Adduser /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/user/update_user/:id"
    element={isLoggedIn ? <Update_User /> : <Navigate to="/login" replace />}
/>

<Route
    path="/user/userlist"
    element={isLoggedIn ? <UserList /> : <Navigate to="/login" replace />}
/>

<Route
    path="/role/roleaccess"
    element={isLoggedIn ? <Roleaccess /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/role/rolelist"
    element={isLoggedIn ? <RoleList /> : <Navigate to="/login" replace />}
/>

<Route
    path="/food/food"
    element={isLoggedIn ? <Food /> : <Navigate to="/login" replace />}
/>

<Route
    path="/Food/Food_list"
    element={isLoggedIn ? <Food_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/vendor"
    element={isLoggedIn ? <Vendor /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/vendor/update_vendor/:id"
    element={isLoggedIn ? <Update_vendor /> : <Navigate to="/login" replace />}
/>

<Route
    path="/payment"
    element={isLoggedIn ? <Payment /> : <Navigate to="/login" replace />}
/>

<Route
    path="/payment/update_payment/:id"
    element={isLoggedIn ? <Update_payment /> : <Navigate to="/login" replace />}
/>

<Route
    path="/payment/payment_gateway/:id"
    element={isLoggedIn ? <Payment_Gateway /> : <Navigate to="/login" replace />}
/>

<Route
    path="/vendorinventory"
    element={isLoggedIn ? <VendorInventory /> : <Navigate to="/login" replace />}
/>

<Route
    path="/vendorinventory/update_vendorinventory/:id"
    element={isLoggedIn ? <Update_Vendor_Inventory /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/inventory"
    element={isLoggedIn ? <Inventory /> : <Navigate to="/login" replace />}
/>

<Route
    path="/inventory/inventory_list"
    element={isLoggedIn ? <Inventory_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/inventory/update_inventory/:id"
    element={isLoggedIn ? <Update_Inventory /> : <Navigate to="/login" replace />}
/>

<Route
    path="/food/update_food/:id"
    element={isLoggedIn ? <Update_food /> : <Navigate to="/login" replace />}
/>

<Route
    path="/addon/update_addon/:id"
    element={isLoggedIn ? <Update_addon /> : <Navigate to="/login" replace />}
/>

<Route
    path="/food/add_ons"
    element={isLoggedIn ? <AddOn /> : <Navigate to="/login" replace />}
/>

<Route
    path="/AddOn/Addon_list"
    element={isLoggedIn ? <AddOn_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/reports"
    element={isLoggedIn ? <Reports /> : <Navigate to="/login" replace />}
/>

<Route
    path="/reports/vendor_list"
    element={isLoggedIn ? <Vendor_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/balanceform/balance_list"
    element={isLoggedIn ? <Balance_list /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/reports/payment_list"
    element={isLoggedIn ? <Payment_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/overview/bill_list"
    element={isLoggedIn ? <Bill_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/reports/vendor_invoice_list"
    element={isLoggedIn ? <Vendor_Invoice_List /> : <Navigate to="/login" replace />}
/>

<Route
    path="/overview/update_order/:id"
    element={isLoggedIn ? <Update_Order /> : <Navigate to="/login" replace />}
/>

<Route
    path="/settings"
    element={isLoggedIn ? <Settings /> : <Navigate to="/login" replace />}
/>
        <Route
    path="/settings/super_setting"
    element={isLoggedIn ? <Super_setting /> : <Navigate to="/login" replace />}
/>

<Route
    path="/settings/tech_setting"
    element={isLoggedIn ? <Tech_setting /> : <Navigate to="/login" replace />}
/>

<Route
    path="/settings/payment_setting"
    element={isLoggedIn ? <Payment_setting /> : <Navigate to="/login" replace />}
/>

<Route
    path="/settings/taxsetting"
    element={isLoggedIn ? <Taxsetting /> : <Navigate to="/login" replace />}
/>

<Route
    path="/technician"
    element={isLoggedIn ? <Technician /> : <Navigate to="/login" replace />}
/>

<Route
    path="/storeSignup"
    element={isLoggedIn ? <StoreSignup /> : <Navigate to="/login" replace />}
/>

<Route
    path="/storelist"
    element={isLoggedIn ? <Storelist /> : <Navigate to="/login" replace />}
/>

<Route
    path="/supportlist"
    element={isLoggedIn ? <Supportlist /> : <Navigate to="/login" replace />}
/>

<Route
    path="/settings/update_tax/:id"
    element={isLoggedIn ? <Update_Tax /> : <Navigate to="/login" replace />}
/>

<Route
    path="/receipe"
    element={isLoggedIn ? <ProductForm /> : <Navigate to="/login" replace />}
/>

<Route
    path="/receipe_list"
    element={isLoggedIn ? <Receipe_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/receipe/update_recipe/:id"
    element={isLoggedIn ? <Update_Recipe /> : <Navigate to="/login" replace />}
/>

<Route
    path="/forgotpassword"
    element={isLoggedIn ? <ForgotPassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/techforgotpassword"
    element={isLoggedIn ? <TechForgotUserPassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/superforgotpassword"
    element={isLoggedIn ? <SuperForgotUserPassword /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/userforgotpassword"
    element={isLoggedIn ? <ForgotUserPassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/resetpassword"
    element={isLoggedIn ? <Resetpassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/resetuserpassword"
    element={isLoggedIn ? <Resetuserpassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/forgotuserpassword"
    element={isLoggedIn ? <ForgotUserPassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/superresetpassword"
    element={isLoggedIn ? <SuperResetpassword /> : <Navigate to="/login" replace />}
/>
         <Route
    path="/techresetpassword"
    element={isLoggedIn ? <TechResetpassword /> : <Navigate to="/login" replace />}
/>

<Route
    path="/roleaccess/updateroleaccess"
    element={isLoggedIn ? <Updateroleaccess /> : <Navigate to="/login" replace />}
/>

<Route
    path="/subscription"
    element={isLoggedIn ? <Subscription /> : <Navigate to="/login" replace />}
/>

<Route
    path="/reports/balance_list"
    element={isLoggedIn ? <Balance_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/pendingorder"
    element={isLoggedIn ? <PendingOrder /> : <Navigate to="/login" replace />}
/>

<Route
    path="/notification"
    element={isLoggedIn ? <NotificationForm /> : <Navigate to="/login" replace />}
/>

<Route
    path="/category"
    element={isLoggedIn ? <CategoryButton /> : <Navigate to="/login" replace />}
/>

<Route
    path="/kot"
    element={isLoggedIn ? <Kot /> : <Navigate to="/login" replace />}
/>

<Route
    path="/shortcut"
    element={isLoggedIn ? <Shortcut /> : <Navigate to="/login" replace />}
/>

<Route
    path="/customer_list"
    element={isLoggedIn ? <Customer_list /> : <Navigate to="/login" replace />}
/>

<Route
    path="/income_list"
    element={isLoggedIn ? <Income_list /> : <Navigate to="/login" replace />}
/>


        </Routes>
      </div>
    );
  }
}
export default App;
