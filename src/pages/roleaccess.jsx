import React from "react";
import { useState, useEffect, } from "react";
import authService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export const Roleaccess = () => {
  const currentuser = authService.getCurrentUser();
  const menuData = [
    {
      title: "Dashboard",
      path: "/userdashbord",
      icon: "fa-solid fa-house-chimney",
    },

    {
      title: "Cash Register",
      path: "/balanceform",
      icon: "fa-solid fa-wallet",
    },

    {
      title: "Sales",
      path: "#",
      icon: "fa-solid fa-mug-hot",

      subNav: [
        {
          title: "New Order",
          path: "/overview/order",
          icon: "fa-solid fa-bowl-rice",
        },
        {
          title: "Order List",
          path: "/overview/order_list",
          icon: "fa-solid fa-cart-plus",
        },
        {
          title: "Bill List",
          path: "/overview/bill_list",
          icon: "fa-sharp fa-solid fa-wallet",
        },
        {
          title: 'KOT',
          path: '/kot',
          icon: "fa-solid fa-kitchen-set"
  
       }
      ],
    },

    {
      title: "Inventory",
      path: "#",
      icon: "fa-solid fa-cart-flatbed",

      subNav: [
        {
          title: "Manage Inventory",
          path: "/inventory",
          icon: "fa-solid fa-file",
        },

        {
          title: "Inventory List",
          path: "/inventory/Inventory_list",
          icon: "fa-solid fa-cart-plus",
        },
      ],
    },

    {
      title: "Purchase",
      path: "#",
      icon: "fa-solid fa-truck-fast",

      subNav: [
        {
          title: " Add Vendor",
          path: "/vendor",
          icon: "fa-solid fa-user-plus",
        },

        {
          title: " Vendor Payment",
          path: "/payment",
          icon: "fa-solid fa-money-check-dollar",
        },
        {
          title: "Vendor Inventory",
          path: "/VendorInventory",
          icon: "fa-solid fa-warehouse",
        },
      ],
    },

    {
      title: "Food Management",
      path: "#",
      icon: "fas fa-hamburger",

      subNav: [
        {
          title: "Add Menu",
          path: "/food/food",
          icon: "fas fa-pizza-slice",
        },
        {
          title: "Food List",
          path: "/Food/Food_list",
          icon: "fa-solid fa-list",
        },
        {
          title: "Manage AddOns",
          path: "/food/add_ons",
          icon: "fa-regular fa-square-plus",
        },
        {
          title: "Add-on List",
          path: "/addOn/addOn_list",
          icon: "fa-solid fa-list",
        },
        {
          title: "Recipe",
          path: "/receipe",
          icon: "fa fa-cutlery",
        },
        {
          title: "Recipe List",
          path: "/receipe_list",
          icon: "fa-solid fa-list",
        },
      ],
    },
    {
      title: "Reports",
      path: "#",
      icon: "fa-solid fa-clipboard",

      subNav: [
        {
          title: "Vendor ",
          path: "/reports/vendor_list",
          icon: "fa-solid fa-note-sticky",
          cName: "sub-nav",
        },
        {
          title: "Payment ",
          path: "/reports/payment_list",
          icon: "fa-solid fa-note-sticky",
          cName: "sub-nav",
        },
        {
          title: "Billing ",
          path: "/overview/bill_list",
          icon: "fa-solid fa-note-sticky",
        },
        {
          title: "Vendor Inventory ",
          path: "/reports/vendor_invoice_list",
          icon: "fa-solid fa-note-sticky",
        },
        {
          title: "Balance ",
          path: "/reports/balance_list",
          icon: "fa-solid fa-note-sticky",
        },
        {
          title: 'Customer',
          path: '/customer_list',
          icon:"fa-solid fa-note-sticky"
      },
      ],
    },

    {
      title: "User",
      path: "#",
      icon: "fa-solid fa-circle-user",

      subNav: [
        {
          title: "Add User",
          path: "/user/adduser",
          icon: "fa-solid fa-user-plus",
        },

        {
          title: "User List",
          path: "/user/userlist",
          icon: "fa-solid fa-list",
        },
      ],
    },
    {
      title: "Role Permission",
      path: "#",
      icon: "fa-sharp fa-solid fa-lock",

      subNav: [
        {
          title: "User Role Access",
          path: "/role/roleaccess",
          icon: "fa-solid fa-user-check",
        },
        {
          title: "Role List",
          path: "/role/rolelist",
          icon: "fa-solid fa-list",
        },

        {
          title: "Update Role Access",
          path: "/roleaccess/updateroleaccess",
          icon: "fa-solid fa-users",
        },
      ],
    },

    {
      title: "Profile Settings",
      path: "#",
      icon: "fa-solid fa-user-gear",

      subNav: [
        {
          title: "Store Setting",
          path: "/settings",
          icon: "fa-solid fa-gear",
        },
        {
          title: "Payment Setting",
          path: "/settings/payment_setting",
          icon: "fa-regular fa-credit-card",
        },
        {
          title: "Tax Setting",
          path: "/settings/taxsetting",
          icon: "fa-solid fa-file-invoice",
        },
      ],
    },
  ];

  const [menu, setMenus] = useState([]);
  useEffect(() => {
    fetch(
      `http://localhost:8083/api/auth/user/byStoreId/${currentuser.storeid}`
    )
      .then((data) => data.json())
      .then((val) => setMenus(val));
  }, []);

  const [formData, setFormData] = useState({
    store_id: currentuser.storeid,
    username: "",
    menu: menuData.map((menu) => ({
      ...menu,
      subMenu: menu.subNav
        ? menu.subNav.map((subMenu) => ({ ...subMenu, checked: false }))
        : [],
      checked: false,
    })),
    iconData: menuData.map((menu) => ({
      title: menu.title,
      path: menu.path,
      icon: menu.icon,
    })),
  });



  const handleCheckboxChange = (menuIndex, subMenuIndex) => {
    setFormData((prevFormData) => {
     const updatedMenu = [...prevFormData.menu];
    
     if (subMenuIndex === undefined) {
        updatedMenu[menuIndex].checked = !updatedMenu[menuIndex].checked;
        updatedMenu[menuIndex].subMenu.forEach((subMenu) => {
         subMenu.checked = updatedMenu[menuIndex].checked;
        });
     } else {
        updatedMenu[menuIndex].subMenu[subMenuIndex].checked =
         !updatedMenu[menuIndex].subMenu[subMenuIndex].checked;

        // Check if at least one sub-menu is selected, then select the main menu
        updatedMenu[menuIndex].checked = updatedMenu[menuIndex].subMenu.some(
         (subMenu) => subMenu.checked
        );
     }

     return {
        ...prevFormData,
        menu: updatedMenu,
     };
    });
};


  const [msg, setMsg] = useState("");




  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if the 'username' is null or empty
    if (!formData.username) {
      // Show an error message (you can use a toast, alert, or any other method you prefer)
      console.error("Username is required.");
      toast.error("Username is required.");
      return; // Exit the function to prevent further processing
    }
  
    // Filter the formData based on the checked checkboxes
    const filteredMenu = formData.menu
      .filter((menu) => menu.checked) // Include only checked main menus
      .map((menu) => ({
        ...menu,
        subMenu: menu.subMenu.filter((subMenu) => subMenu.checked),
      }));
  
    // Check if at least one main menu or sub-menu is checked
    if (filteredMenu.length === 0) {
      console.error("At least one main menu or sub-menu must be checked.");
      toast.error("At least one main menu or sub-menu must be checked.");
      return; // Exit the function to prevent further processing
    }
  
    const filteredFormData = {
      store_id: currentuser.storeid,
      username: formData.username,
      id: formData.id,
      menu: filteredMenu,
      iconData: formData.iconData,
    };
  
    try {
      const response = await fetch(
        "http://localhost:8083/sys/UserSidebar/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredFormData),
        }
      );
  
      if (response.ok) {
        // Data successfully sent to the backend
        console.log("Role Assigned successfully");
        toast.success("Role Assigned successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // Reset the form data after successful submission
        setFormData({
          store_id: currentuser.storeid,
          username: "",
          id: menu.map.user.id,
          menu: formData.menu.map((menu) => ({
            ...menu,
            checked: false,
            subMenu: menu.subMenu.map((subMenu) => ({
              ...subMenu,
              checked: false,
            })),
          })),
          iconData: formData.iconData,
        });
      } else {
        // Handle the error case
        console.error("Failed to send data.");
        toast.error("Failed To Assign the Role");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
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

  return (
    <>
      <div className="p-5 animation">
        <div className="row p-5" style={{ fontSize: "2vh", marginTop: "3vh" }}>
          <div
            className="col-md-8"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "2vh",
              marginTop: "-100px",
            }}
          >
            {msg && (
              <h3 className="fs-4 text-center text-info">
                {msg} <i class="fa-solid fa-square-check"></i>
              </h3>
            )}
            <div className="card">
              <div
                className="card-header fs-3"
                style={{ color: "#000099" }}
              >
                <h4 className="text" style={{ fontSize: "3.5vh" }}>
                  <i class="fa-solid fa-user-check"></i> User Role Access :
                </h4>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <label
                    className="form-label font-weight-bold"
                    style={{ fontSize: "3vh" }}
                  >
                    Select User *
                  </label>
                  <select
                    className="form-select"
                    style={{ fontSize: "2.6vh" }}
                    aria-label="Default select example"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  >
                    <option selected>
                      -----Select User To Give Permission-----
                    </option>
                    {menu.map((user, i) => (
                      <option>{user.username}</option>
                    ))}
                  </select>
                  <label
                    className="form-label font-weight-bold mt-5"
                    style={{ fontSize: "2vh" }}
                  >
                    Select Role Permission *
                  </label>

                  <table className="table`1" style={{ width: "50vw" }}>
                    <thead>
                      <tr style={{ color: "black", fontSize: "2.5vh" }}>
                        <th>Select All</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.menu.map((menu, menuIndex) => (
                        <tr key={menuIndex}>
                          <td>
                            <h5
                              className="text-info font-weight-bold fst-italic"
                              style={{ fontSize: "3vh" }}
                            >
                              <input
                                className="mr-2"
                                style={{ fontSize: "2vh" }}
                                type="checkbox"
                                checked={menu.checked}
                                onChange={() => handleCheckboxChange(menuIndex)}
                              />
                              {menu.title}
                            </h5>
                          </td>
                          <td>
                            {menu.subMenu.map((subMenu, subMenuIndex) => (
                              <div key={subMenuIndex}>
                                <h6
                                  className="text-dark font-weight-bold fst-italic"
                                  style={{ fontSize: "3vh" }}
                                >
                                  <input
                                    className="mr-2"
                                    type="checkbox"
                                    checked={subMenu.checked}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        menuIndex,
                                        subMenuIndex
                                      )
                                    }
                                  />
                                  {subMenu.title}
                                </h6>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-center mt-3">
                    <button
                      class="btn btn-outline-light"
                      type="submit"
                      style={{ width: "14vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>

        <ToastContainer
          position="bottom-right"
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
          style={{ marginBottom: "100px", marginRight: "10px" }}
        />
      </div>
    </>
  );
};

// ---------------------------------------        UPDATE ROLE ACCESS         ------------------------------------
// {--------------------------Rushikesh Added This Code Complete ----------------------------------}

export const Updateroleaccess = () => {
  const currentuser = authService.getCurrentUser();
  const menuData = [
    {
      title: "Dashboard",
      path: "/userdashbord",
      icon: "fa-solid fa-house-chimney",

      subNav: [
       {
          title: '',
          path: '/',
          icon: ""
  
       }
      ],
    },

    {
      title: "Cash Register",
      path: "/balanceform",
      icon: "fa-solid fa-wallet",

      subNav: [
        {
           title: '',
           path: '/',
           icon: ""
   
        }
       ],
    },

    {
      title: "Sales",
      path: "#",
      icon: "fa-solid fa-mug-hot",

      subNav: [
        {
          title: "New Order",
          path: "/overview/order",
          icon: "fa-solid fa-bowl-rice",
        },
        {
          title: "Order List",
          path: "/overview/order_list",
          icon: "fa-solid fa-cart-plus",
        },
        {
          title: "Bill List",
          path: "/overview/bill_list",
          icon: "fa-sharp fa-solid fa-wallet",
        },
        {
          title: 'KOT',
          path: '/kot',
          icon: "fa-solid fa-kitchen-set"
  
       }
      ],
    },

    {
      title: "Inventory",
      path: "#",
      icon: "fa-solid fa-cart-flatbed",

      subNav: [
        {
          title: "Manage Inventory",
          path: "/inventory",
          icon: "fa-solid fa-file",
        },

        {
          title: "Inventory List",
          path: "/inventory/Inventory_list",
          icon: "fa-solid fa-cart-plus",
        },
      ],
    },

    {
      title: "Purchase",
      path: "#",
      icon: "fa-solid fa-truck-fast",

      subNav: [
        {
          title: " Add Vendor",
          path: "/vendor",
          icon: "fa-solid fa-user-plus",
        },

        {
          title: " Vendor Payment",
          path: "/payment",
          icon: "fa-solid fa-money-check-dollar",
        },
        {
          title: "Vendor Inventory",
          path: "/VendorInventory",
          icon: "fa-solid fa-warehouse",
        },
      ],
    },

    {
      title: "Food Management",
      path: "#",
      icon: "fas fa-hamburger",

      subNav: [
        {
          title: "Add Menu",
          path: "/food/food",
          icon: "fas fa-pizza-slice",
        },
        {
          title: "Food List",
          path: "/Food/Food_list",
          icon: "fa-solid fa-list",
        },
        {
          title: "Manage AddOns",
          path: "/food/add_ons",
          icon: "fa-regular fa-square-plus",
        },
        {
          title: "Add-on List",
          path: "/addOn/addOn_list",
          icon: "fa-solid fa-list",
        },
        {
          title: "Recipe",
          path: "/receipe",
          icon: "fa fa-cutlery",
        },
        {
          title: "Recipe List",
          path: "/receipe_list",
          icon: "fa-solid fa-list",
        },
      ],
    },
    {
      title: "Reports",
      path: "#",
      icon: "fa-solid fa-clipboard",

      subNav: [
        {
          title: "Vendor ",
          path: "/reports/vendor_list",
          icon: "fa-solid fa-note-sticky",
          cName: "sub-nav",
        },
        {
          title: "Payment ",
          path: "/reports/payment_list",
          icon: "fa-solid fa-note-sticky",
          cName: "sub-nav",
        },
        {
          title: "Billing ",
          path: "/overview/bill_list",
          icon: "fa-solid fa-note-sticky",
        },
        {
          title: "Vendor Inventory ",
          path: "/reports/vendor_invoice_list",
          icon: "fa-solid fa-note-sticky",
        },
        {
          title: "Balance ",
          path: "/reports/balance_list",
          icon: "fa-solid fa-note-sticky",
        },
        {
          title: 'Customer',
          path: '/customer_list',
          icon:"fa-solid fa-note-sticky"
      },
      ],
    },

    {
      title: "User",
      path: "#",
      icon: "fa-solid fa-circle-user",

      subNav: [
        {
          title: "Add User",
          path: "/user/adduser",
          icon: "fa-solid fa-user-plus",
        },

        {
          title: "User List",
          path: "/user/userlist",
          icon: "fa-solid fa-list",
        },
      ],
    },
    {
      title: "Role Permission",
      path: "#",
      icon: "fa-sharp fa-solid fa-lock",
      subNav: [
        {
          title: "User Role Access",
          path: "/role/roleaccess",
          icon: "fa-solid fa-user-check",
        },
        {
          title: "Role List",
          path: "/role/rolelist",
          icon: "fa-solid fa-list",
        },

        {
          title: "Update Role Access",
          path: "/roleaccess/updateroleaccess",
          icon: "fa-solid fa-users",
        },
      ],
    },

    {
      title: "Profile Settings",
      path: "#",
      icon: "fa-solid fa-user-gear",

      subNav: [
        {
          title: "Store Setting",
          path: "/settings",
          icon: "fa-solid fa-gear",
        },
        {
          title: "Payment Setting",
          path: "/settings/payment_setting",
          icon: "fa-regular fa-credit-card",
        },
        {
          title: "Tax Setting",
          path: "/settings/taxsetting",
          icon: "fa-solid fa-file-invoice",
        },
      ],
    },

  ];

  const [menu, setMenus] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  // Define a state variable to store the fetched user data
  const [fetchedUserData, setFetchedUserData] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:8083/sys/UserSidebar/store/${currentuser.storeid}/users`
    )
      .then((data) => data.json())
      .then((val) => setMenus(val));
  }, []);

  console.log(menu);

  const [formData, setFormData] = useState({
    store_id: currentuser.storeid,
    username: "",
    id: "",
    menu: menuData.map((menu) => ({
      ...menu,
      subMenu: menu.subNav
        ? menu.subNav.map((subMenu) => ({ ...subMenu, checked: false }))
        : [],
      checked: false,
    })),
    iconData: menuData.map((menu) => ({
      title: menu.title,
      path: menu.path,
      icon: menu.icon,
    })),
  });


  const handleCheckboxChange = (menuIndex, subMenuIndex) => {
    setFormData((prevFormData) => {
     const updatedMenu = [...prevFormData.menu];
    
     if (subMenuIndex === undefined) {
        updatedMenu[menuIndex].checked = !updatedMenu[menuIndex].checked;
        updatedMenu[menuIndex].subMenu.forEach((subMenu) => {
         subMenu.checked = updatedMenu[menuIndex].checked;
        });
     } else {
        updatedMenu[menuIndex].subMenu[subMenuIndex].checked =
         !updatedMenu[menuIndex].subMenu[subMenuIndex].checked;

        // Check if at least one sub-menu is selected, then select the main menu
        updatedMenu[menuIndex].checked = updatedMenu[menuIndex].subMenu.some(
         (subMenu) => subMenu.checked
        );
     }

     return {
        ...prevFormData,
        menu: updatedMenu,
     };
    });
};


  const [msg, setMsg] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if at least one role permission is selected
    const hasSelectedRole = formData.menu.some((menu) =>
      menu.subMenu.some((subMenu) => subMenu.checked)
    );
  
    if (!hasSelectedRole) {
      // Show an error toast message
      toast.error("Please select at least one role permission.");
      return; // Stop the submission process
    }
  
    // Check if the 'username' is null or empty
    if (!formData.username) {
      // Show an error message (you can use a toast, alert, or any other method you prefer)
      console.error("Username is required.");
      toast.error("Username is required.");
      return; // Exit the function to prevent further processing
    }
  
    // Filter the formData based on the checked checkboxes
    const filteredMenu = formData.menu
      .filter((menu) => menu.checked) // Include only checked main menus
      .map((menu) => ({
        ...menu,
        subMenu: menu.subMenu.filter((subMenu) => subMenu.checked),
      }));
  
    const filteredFormData = {
      store_id: currentuser.storeid,
      username: formData.username,
      id: formData.id,
      menu: filteredMenu,
      iconData: formData.iconData,
    };
  
    try {
      const response = await fetch(
        "http://localhost:8083/sys/UserSidebar/UserSidebar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredFormData),
        }
      );
  
      if (response.ok) {
        // Data successfully sent to the backend
        console.log("Role Updated Successfully");
        toast.success("Role Updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // Reset the form data after successful submission
        setFormData({
          store_id: currentuser.storeid,
          username: "",
          id: menu.map.user.id,
          menu: formData.menu.map((menu) => ({
            ...menu,
            checked: false,
            subMenu: menu.subMenu.map((subMenu) => ({
              ...subMenu,
              checked: false,
            })),
          })),
          iconData: formData.iconData,
        });
      } else {
        // Handle the error case
        console.error("Failed to send data.");
        toast.error("failed To Update the Role");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };


  const handleUserChange = (event) => {
    const selectedUser = menu.find((user) => user.username === event.target.value);
    if (selectedUser) {
      setFormData({
        ...formData,
        username: event.target.value,
        id: selectedUser.id,
      });
    }
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

 

  return (
    <>
      <div className="p-5 animation">
        {/* Neha Removed Title */}
        <div className="row p-5" style={{ fontSize: '"2vh' }}>
          <div
            className="col-md-8"
            style={{
              marginLeft: "auto",
              marginTop: "-5vh",
              marginRight: "auto",
              fontSize: "2vh",
            }}
          >
            {msg && (
              <h3 className="fs-4 text-center text-info">
                {msg} <i class="fa-solid fa-square-check"></i>
              </h3>
            )}
            <div className="card">
              <div
                className="card-header fs-3"
                style={{
                  color: "#000099"
                }}
              >
                <h4 className="text" style={{ fontSize: "3.5vh" }}>
                  <i class="fa-solid fa-user-check" style={{ fontSize: "3.5vh" }}></i> Update Role Access:
                </h4>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <label className="form-label font-weight-bold mt-5" style={{ fontSize: "2.6vh" }}>
                    Select User *
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="username"
                    style={{ fontSize: "2.8vh" }}
                    value={formData.username}
                    onChange={handleUserChange}
                    required
                  >
                    <option selected required>
                      -----Select User To Give Permission-----
                    </option>
                    {menu.map((user) => (
                      <option required>{user.username}</option>
                    ))}
                  </select>
                 

                  <label className="form-label font-weight-bold mt-5" style={{ fontSize: "2.4" }}>
                    Select Role Permission *
                  </label>

                  <table className="table`1" style={{ width: "50vw" }}>
                    <thead>
                      <tr style={{ color: "black", fontSize: "2.4vh" }}>
                        <th>Select All</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.menu.map((menu, menuIndex) => (
                        <tr key={menuIndex}>
                          <td>
                            <h5 className="text-info font-weight-bold fst-italic" style={{ fontSize: "3vh" }}>
                              <input
                                className="mr-2"
                                type="checkbox"
                                checked={menu.checked}
                                onChange={() => handleCheckboxChange(menuIndex)}
                              
                              />
                              {menu.title}
                            </h5>
                          </td>
                          <td>
                            {menu.subMenu.map((subMenu, subMenuIndex) => (
                              <div key={subMenuIndex}>
                                <h6 className="text-dark font-weight-bold fst-italic" style={{ fontSize: "3vh" }}>
                                  <input
                                    className="mr-2"
                                    type="checkbox"
                                    checked={subMenu.checked}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        menuIndex,
                                        subMenuIndex
                                      )
                                    }
                                  />
                                  {subMenu.title}
                                </h6>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-center mt-3">
                    <button
                      class="btn btn-outline-light"
                      type="submit"
                      style={{ width: "14vw", padding: "4px", color: "white", backgroundColor: "#03989e", borderRadius: "5px", marginTop: "2vh", fontSize: "3vh" }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>


            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
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
          style={{ marginBottom: "100px", marginRight: "10px" }}
        />
      </div>
    </>
  );
};
