import React, { Component } from "react";
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SidebarData = [
  
  {
    title: 'Settings',
    path: '#',
    icon: "fa-solid fa-gear",
    subNav: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    subNav: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
    subNav: [
      {
        title: 'Profile Setting',
        path: '/settings/super_setting',
        icon: "fa-solid fa-user-gear"
      },
   
    ]
},

{
  title: 'Store ',
  path: '#',
  icon: "fa-solid fa-store",
  iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
  iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
  subNav: [
    {
      title: 'Add New Store',
      path: '/register',
      icon: "fa-solid fa-user-plus"
    },
    {
      title: 'Store List',
      path: '/storelist',
      icon: "fa-solid fa-list"
    },
    {
      title: 'Free Trial',
      path: '/freetrial',
      icon: "fa-solid fa-user-plus"
    },
    {
      title: ' Store Paid Subscription',
      path: '/subscription',
      icon: "fa-solid fa-store",
    },
  ]    
},
{
  title: 'Technician',
  path: '#',
  icon: "fa-solid fa-user-gear",
  iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}} />,
  iconOpened: <RiIcons.RiArrowUpSFill  style={{color:"black"}}/>,

  subNav: [
    {
      title: 'Add Support Tech',
      path: '/technician',
      icon: "fa-solid fa-user-plus"
    },
    {
      title: 'Support Tech List',
      path: '/supportlist',
      icon: "fa-solid fa-list"
    },
  ]   
}
  
 
];

///////////////////////////////////////////////////              ADMIN SIDEBAR DATA               ////////////////////////////////////


export const AdminSidebarData = [

  {
    id:'1',
    title: "Dashboard",
    path: '/dashbord',
    icon:"fa-solid fa-house-chimney"
  },

  
  {
   
    title: "Cash Register",
    path: '/balanceform',
    icon:   "fa-solid fa-wallet"
  },

   { 
    id:'2',
    title: "Sales",
    path: '#',
    icon: 'fa-solid fa-bowl-food',
      iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,

    subNav: [
      {
        
        title: 'New Order',
        path: '/overview/order',
        icon:"fa-solid fa-bowl-rice",
      },
      {
        title: 'Order List',
        path: '/overview/order_list',
        icon: "fa-solid fa-cart-plus" 
      },
      {
        title: 'Bill List',
        path: '/overview/bill_list',
        icon: "fa-regular fa-rectangle-list"
      },
      {
        title: 'KOT',
        path: '/kot',
        icon: "fa-solid fa-kitchen-set"

     }
     
    ]
  },

  {
    title: "Inventory",
      path: '#',
      icon: "fa-solid fa-store",
        iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
        iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
  
      subNav: [
        {
          title: 'Add Inventory',
          path: '/inventory',
          icon: "fa-solid fa-circle-plus"
        },
  
        {
          title: 'Inventory List',
          path: '/inventory/Inventory_list',
          icon: "fa-solid fa-table-list"
        },
        
        
      ]
    },
  
    {
      title: 'Purchase',
      path: '#',
      icon:"fa-solid fa-cart-shopping",
        iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
        iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
  
        subNav: [
          {
            title: ' Add Vendor',
            path: '/vendor',
            icon: "fa-solid fa-user-plus"
            
          },
    
          {
            title: ' Vendor Payment',
            path: '/payment',
            icon: "fa-regular fa-credit-card"
        
          },
          {
            title: 'Vendor Inventory',
            path: '/VendorInventory',
            icon:"fa-solid fa-warehouse"
        
          },
       
     ]
    },

 
  {
    id:'5',
    title: 'Food Management',
    path: '#',
    icon: 'fas fa-hamburger',
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
    

    subNav: [
      {
        title: 'Add Menu',
        path: '/food/food',
        icon: 'fas fa-pizza-slice'
      },
      {
        title: 'Food List',
        path: '/Food/Food_list',
        icon: "fa-solid fa-list"
      },
      {
        title: 'Add Addons',
        path: '/food/add_ons',
        icon: "fa-regular fa-square-plus"
      },
      {
        title: 'Add-on List',
        path: '/addOn/addOn_list',
        icon: "fa-solid fa-list"
      },
      {
        title: 'Add Recipe',
        path: '/receipe',
        icon: 'fa fa-cutlery'
      },
      {
        title: 'Recipe List',
        path: '/receipe_list',
        icon: "fa-solid fa-list"
      }

    ]   
  },
  {
    id:'3',
    title: 'Reports',
    path: '#',
    icon:"fa-solid fa-chart-column",
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,

    subNav: [
     {
        title: 'Vendor',
        path: '/reports/vendor_list',
        icon: "fa-solid fa-note-sticky",
        cName: 'sub-nav'
     },
     {
        title: 'Payment',
        path: '/reports/payment_list',
        icon: "fa-solid fa-note-sticky",
        cName: 'sub-nav'
     },
     {
        title: 'Billing',
        path: '/overview/bill_list',
        icon: "fa-solid fa-note-sticky"
     },
     {
        title: 'Vendor Inventory',
        path: '/reports/vendor_invoice_list',
        icon:"fa-solid fa-note-sticky"
     },
     {
    title: 'Cash register',
    path: '/reports/balance_list',
    icon:"fa-solid fa-note-sticky"
  },
  {
    title: 'Customer',
    path: '/customer_list',
    icon:"fa-solid fa-note-sticky"
},

{
  title: 'Daily Income',
  path: '/income_list',
  icon:"fa-solid fa-note-sticky"
},
    
    ]
},
 

 
  
  
  {
    id:'7',
    title: 'User',
    path: '#',
    icon: "fa-solid fa-circle-user",
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,

    subNav: [
      {
        title: 'Add User',
        path: '/user/adduser',
        icon: "fa-solid fa-user-plus"
      },
      
      {
        title: 'User List',
        path: '/user/userlist',
        icon: "fa-solid fa-list"
      }
    ]   
  },
  {
    id:'8',
    title: 'Role Permission',
    path: '#',
    icon: "fa-sharp fa-solid fa-lock",
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,

    subNav: [
      {
        title: 'User Role Access',
        path: '/role/roleaccess',
        icon: "fa-solid fa-user-check"
      },
      {
        title: 'Role List',
        path: '/role/rolelist',
        icon: "fa-solid fa-list"
      },
     // added this new code
     {
      title: 'Update Role Access',
      path: '/roleaccess/updateroleaccess',
      icon: "fa-solid fa-list-check"
   }
    ]   
  },
  
  {
    title: 'Profile Settings',
    path: '#',
    icon: "fa-solid fa-gear",
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,

    subNav: [

     
     {
        title: 'Store Setting',
        path: '/settings',
        icon:"fa-solid fa-sliders"

     },
     {
        title: 'Payment Setting',
        path: '/settings/payment_setting',
        icon: "fa-regular fa-credit-card"
     },
     {
        title: 'Tax Setting',
        path: '/settings/taxsetting',
        icon: "fa-solid fa-toolbox"
     },
     {
      title: 'Pos Setting',
      path: '/category',
      icon: "fa-solid fa-toolbox"
   },
     
    ]

},
{
  title: 'User Manual',
  icon: "fa-solid fa-download",
},

{
  title: 'Shortcut Keys',
  path: '/shortcut',
  icon: "fa-solid fa-keyboard",
  },
  
 ];
///////////////////////////////////////////////////         Support sidebar data /////////////////////////////
export const SupportSidebarData = [
  
    {
    title: 'Settings',
    path: '#',
    icon: "fa-solid fa-gear",
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
    subNav: [
      {
        title: 'Profile Setting',
        path: '/settings/tech_setting',
        icon: "fa-solid fa-user-gear"
      },
      ]   
  },
  {
    title: 'Store ',
    path: '#',
    icon: "fa-solid fa-store",
    iconClosed: <RiIcons.RiArrowDownSFill style={{color:"black"}}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{color:"black"}}/>,
    subNav: [
      {
        title: 'Add New Store',
        path: '/register',
        icon: "fa-solid fa-user-plus"
      },
      {
        title: 'Store List',
        path: '/storelist',
        icon: "fa-solid fa-list"
      },
      {
        title: 'Free Trial',
        path: '/freetrial',
        icon: "fa-solid fa-user-plus"
      },
      {
        title: ' Store Paid Subscription',
        path: '/subscription',
        icon: "fa-solid fa-store",
      },
      {
        title: 'Notification',
        path: '/notification',
        icon: "fa-solid fa-store",
      },
    ]    
  },
];




