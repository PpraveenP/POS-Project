import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
// display: flex;
// color: black;
// justify-content: space-between;
// align-items: center;
// padding: 1vw;
// list-style: none;
// height: 5vh;
// text-decoration: none;
// font-size: 0.8vw;
// background: #d9d9d9;
// font-weight: 500;

  display: flex;
  color: black;
  justify-content: space-between;
  align-items: center; /* Updated to vertically center the content */
  padding: 1vw;
  list-style: none;
  height: 5vh;
  text-decoration: none;
  font-size: 0.9vw;
  background: #d9d9d9;
  font-weight: 600;



&:hover {
    background: #03989e;
    border-left: 5px solid black;
    cursor: pointer;
    color: black;
    transition: background 0.3s ease-in-out, border-left 0.3s ease-in-out;
    text-decoration: none;
    font-weight: bold;
}
`;

const SidebarLabel = styled.span`
margin-left: 10px;
`;

const DropdownLink = styled(Link)`
background: #b1b1b1;
box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
height: 5vh;
padding-left: 3rem;
display: flex;
align-items: center;
text-decoration: none;
color: black;
font-size: 0.8vw;
font-weight: bold;


&:hover {
    background: white;
    cursor: pointer;
    color: black;
    border-left: 5px solid  #03989e;
    font-weight: bold;
    transition: background 0.5s ease-in-out, border-left 0.9s ease-in-out;
    text-decoration: none;

}
`;
const SubMenuWrapper = styled.div`
overflow: hidden;
max-height: ${(props) => (props.isOpen ? '540px' : '0')};
transition: max-height 0.8s ease;
`;

const SubMenu = ({ item, currentlyOpenSubMenu, setCurrentlyOpenSubMenu, handleDownloadTemplate  }) => {
  // const [subnav, setSubnav] = useState(false);

  // const handleSidebarLinkClick = () => {
  //   if (item.subNav) {
  //     setSubnav(!subnav); // Toggle the submenu when clicked
  //   }
  // };

  // const handleSubMenuClick = (e) => {
  //   e.stopPropagation(); // Prevent the SidebarLink click event from triggering
  // };



  const [subnav, setSubnav] = useState(false);

  // const handleSidebarLinkClick = () => {
  //   if (item.subNav) {
  //     setSubnav(!subnav);
  //     setCurrentlyOpenSubMenu(item.title); // Set the currently open submenu
  //   }
  // };

  // const handleSidebarLinkClick = (e) => {
  //   e.stopPropagation(); // Prevent the click event from bubbling up to parent elements
  //   if (item.subNav) {
  //     setSubnav(!subnav); // Toggle the submenu visibility
  //     setCurrentlyOpenSubMenu(item.title); // Set the currently open submenu
  //   }
  // };
   
 
  // const handleSubMenuClick = (e) => {
  //   e.stopPropagation();
  // };


  // const handleSidebarLinkClick = (e) => {
  //   e.stopPropagation();
  //   console.log('Sidebar link clicked:', item.title);
  //   if (item.subNav) {
  //     console.log('Submenu toggled');
  //     setSubnav(!subnav);
  //     setCurrentlyOpenSubMenu(item.title);
  //   }
  // };

  const handleSidebarLinkClick = (e) => {
    e.stopPropagation();

    
    if (item.title === "User Manual") {
      // Handle logic specific to User Manual click
      handleDownloadTemplate();
      return;
    }
  
    if (item.subNav) {
      console.log('Submenu toggled');
      setSubnav(!subnav);
      setCurrentlyOpenSubMenu(item.title);
    }
  };
  
  const handleSubMenuClick = (e) => {
    e.stopPropagation();
    console.log('Submenu item clicked:', item.title);
    // Handle submenu item click actions if needed
    setSubnav(!subnav);
  };

  useEffect(() => {
    // Close the previously open submenu when a new submenu is opened
    if (subnav && item.title !== currentlyOpenSubMenu) {
      setSubnav(false);
    }
  }, [subnav, item.title, currentlyOpenSubMenu]);

  return (
  <>

      <SidebarLink
        to={item.path}
        onClick={handleSidebarLinkClick} // Change this from onMouseEnter to onClick
      >
        <div className="flex">
          <i className={`fa-lg mr-3 ${item.icon}`}></i>
          <SidebarLabel>
           {item.title}
            </SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>

      <SubMenuWrapper isOpen={subnav}>
        {item.subNav &&
          item.subNav.map((subItem, index) => {
            return (
              <DropdownLink
                to={subItem.path}
                key={index}
                onClick={handleSubMenuClick} // Add this onClick handler
              >
                <i className={`mr-2 icon fa-lg p-1 ${subItem.icon}`}></i>
                <SidebarLabel>{subItem.title}</SidebarLabel>
              </DropdownLink>
            );
          })}
      </SubMenuWrapper>

      {/* {handleDownloadTemplate && item.title === "User Manual" && (
        <SidebarLink to="#" onClick={handleDownloadTemplate}>
          <i className="fa-lg fa-solid fa-download"></i> Download User Manual
        </SidebarLink>
      )} */}
    </>  
  );
};

export default SubMenu;