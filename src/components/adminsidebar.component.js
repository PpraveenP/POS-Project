import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { AdminSidebarData, SidebarData } from './sidebardata.component';
import SubMenu from './submenucomponent';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import authService from '../services/auth.service';
import axios from 'axios';
import { toast } from 'react-toastify';


const Nav = styled.div`
  background: #BFCAD0;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  text-decoration: none;
`;



const NavIcon = styled(Link)`
  
  height: 6.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 2vw;
  
 
  ${({ sidebar }) =>
    sidebar &&
    `
    font-size: 2vw; /* Font size when sidebar is expanded */
    color: #fff; /* Text color when sidebar is expanded */
    
  `}
  ${({ sidebar }) =>
    !sidebar &&
    `
    font-size: 1.3vw; /* Font size when sidebar is collapsed */
    color: #000; /* Text color when sidebar is collapsed */
    &:hover {
      color: #03989e; /* Change text color to white on hover */
      border-left: 5px solid #03989e;

    }
  `}
`;



const SidebarNav = styled.nav`
  background: #BFCAD0;
  width: ${({ sidebar }) => (sidebar ? '15vw' : '8vh')};
  height: 100vh;
  display: flex;
  // justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '0')};
  transition: all 350ms ease-in-out;
  z-index: 10;
  text-decoration: none;
  overflow: auto;
  margin-top: 10vh;

  

  /* Additional CSS properties based on the sidebar state */
  ${({ sidebar }) =>
    sidebar &&
    css`
      /* CSS properties when sidebar is open */
      // Add your additional styles here when the sidebar is open
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
        background: #d9d9d9;

    `}

  ${({ sidebar }) =>
    !sidebar &&
    css`
      /* CSS properties when sidebar is closed */
      // Add your additional styles here when the sidebar is closed
      background: #d9d9d9;
      overflow-Y:auto;

    `}

  
  ${(props) =>
    props.scrollbar &&
    css`
      &::-webkit-scrollbar {
        width: 8px; /* Adjust the width as needed */
        background-color: #BFCAD0;
        margin-bottom: 100%;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #6B7A89; /* Color of the scrollbar thumb */
        border-radius: 8px; /* Rounded corners on the thumb */
      }
    `}
`;

const SidebarWrap = styled.div`
  flex-grow: 1; /* Allow the content to take up remaining vertical space */
  text-decoration: none;
  padding: rem; /* Add padding to the content area */
`;


const CircleIcon = styled.div`
  width: 2.8vw;
  height: 5vh;
  background-color: #d9d9d9; /* Circle background color */
  border-radius: 50%; /* Makes the div a circle */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: fixed;
  margin-top: -9.3vh;
  z-index: 111;
`;
const CircleIconClose = styled(Link)`
  width: 2.8vw;
  height: 5vh;
  background-color: #d9d9d9; /* Circle background color */
  border-radius: 50%; /* Makes the div a circle */
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  margin-top: -7.5vh;
  cursor: pointer;
  margin-left: 1.2vh; /* Apply margin-left directly in the styled component */
`;


const RightSidebar = styled.div`
  position: fixed;
  top: ${({ iconPosition }) => `${iconPosition.top}px`};
  // left: ${({ iconPosition }) => `${iconPosition.right}px`};
  left: 8vh; /* Set the fixed left position to 60px */
  /* Adjust the right property as needed */
  right: ${({ isOpen }) => (isOpen ? '0' : '10vh')};
  width: 18vw;
  background-color: #fff;
  // transition: right 0.3s ease-in-out;
  /* Add more styles as per your requirements */

`;






const HoverableSidebar = ({ isOpen, closeSidebar, selectedItem, iconPosition, currentlyOpenSubMenu, setCurrentlyOpenSubMenu, handleDownloadTemplate }) => {
  const handleMouseEnter = () => {
    if (!isOpen) {
      closeSidebar(); 
    }
  };

  const handleMouseLeave = () => {
    if (isOpen) {
      closeSidebar(); 
    }
  };

  return (
    <div className={`hoverable-sidebar ${isOpen ? 'open' : ''}`} onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {iconPosition && (
        <RightSidebar isOpen={isOpen} iconPosition={iconPosition}>
         {isOpen && selectedItem && (
            
            <SubMenu item={selectedItem} isVisible={isOpen} currentlyOpenSubMenu={currentlyOpenSubMenu}
              setCurrentlyOpenSubMenu={setCurrentlyOpenSubMenu} handleDownloadTemplate={handleDownloadTemplate}/>
          )}
        
        </RightSidebar>
      )}

    </div>
  );
};



const AdminSidebar = () => {
  const [hoverableSidebarOpen, setHoverableSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [iconPosition, setIconPosition] = useState(null);
  const currentUser = authService.getCurrentUser();
  const [currentlyOpenSubMenu, setCurrentlyOpenSubMenu] = useState(null);


  const handleSidebarIconHover = (item, event) => {
    const iconPosition = event.target.getBoundingClientRect();
    setSelectedItem(item); // Set the selected item in state
    setHoverableSidebarOpen(true); // Open the hoverable sidebar
    setIconPosition(iconPosition); // Set iconPosition in state
    setCurrentlyOpenSubMenu(item);
  };

  const handleSidebarIconLeave = () => {
    setHoverableSidebarOpen(false);
    setSelectedItem(null); // Reset selected item when closing sidebar
  };
  



  const [sidebar, setSidebar] = useState(false);
  const [subSidebar, setSubSidebar] = useState(false);

  // const showSidebar = () => setSidebar(!sidebar);
  const showSidebar = (isOpen) => {
    const containerd = document.querySelector('.animation');
    if (isOpen) {
      containerd.style.transition = 'margin-left 0.6s, transform 0.5s'; // Add transition property
      containerd.style.marginLeft = '2vw';
      containerd.style.transform = 'translateX(5vw)'; // Add transform property
    } else {
      containerd.style.transition = 'margin-left 0.6s, transform 0.5s'; // Add transition property
      containerd.style.marginLeft = '0vw';
      containerd.style.transform = 'translateX(0)'; // Reset transform property
    }
    setSidebar(!sidebar);
    setSubSidebar(false);
  };

  const showSubSidebar = () => {
    setSubSidebar(!subSidebar);
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebar(false);

        // Reset the CSS properties of containerd
        const containerd = document.querySelector('.animation');
        containerd.style.transition = 'margin-left 0.6s, transform 0.5s';
        containerd.style.marginLeft = '0vw';
        containerd.style.transform = 'translateX(0)';
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  const [logo, setLogo] = useState(null);

  // rushikeshs made this new changes ....................
  useEffect(() => {
    const delay = 20000; // 2 seconds delay (you can adjust this value)

    const timeoutId = setTimeout(() => {
      // Make an HTTP GET request to fetch the store logo
      axios
        .get(`192.168.0.156/api/auth/store/${currentUser.storeid}/logo`, {
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
    }, delay);

    // Cleanup the timeout in case the component unmounts before the delay finishes
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDownloadTemplate = () => {
    const excelTemplateUrl = process.env.PUBLIC_URL + "/user_manual.pdf";
    // Create an anchor element and trigger a click event to download the template
    const link = document.createElement("a");
    link.href = excelTemplateUrl;
    link.target = "_blank"; // Open the link in a new tab
    link.download = "user_manual.pdf"; // Set the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Display a success message
    toast.success("user Manual file downloaded successfully.");
  };


  return (
    <div onMouseLeave={() => handleSidebarIconLeave()}>
      <IconContext.Provider value={{ color: '#fff' }}>
        <SidebarNav sidebar={sidebar} ref={sidebarRef}>
          <SidebarWrap>
            {sidebar ? (
              <>
                <CircleIconClose to='#' onClick={() => showSidebar(false)} style={{ position: "fixed" }}>
                  <FaIcons.FaBars style={{ fontSize: "1.5vw", color: "black", position: "fixed" }} />
                </CircleIconClose>
                <div className="text-center">
                  {/* <CircleIconClose to='#' onClick={() => showSidebar(false)}>
                    <FaIcons.FaBars style={{ fontSize: "1.5vw", color: "#fff",position:"fixed" }} />
                  </CircleIconClose> */}
                  <div>
                    {currentUser.logoUrl && (
                      <img
                        src={logo}
                        className="mt-3"
                        width="30%"
                        height="30%"
                        alt=""
                        style={{ margin: "auto", display: "block" }}
                      />
                    )}
                  </div>

                </div>
                <h6 className='font-weight-bold text-center mt-3 text-success' style={{ fontSize: "2vh" }}><i class="fa-regular fa-circle-dot fa-lg">
                </i> {currentUser.storeName}</h6>

                {/* {AdminSidebarData.map((item, index) => {
                  return <SubMenu item={item} key={index} />;
                })} */}
                {/* <div className="text-center">
                  {AdminSidebarData.map((item, index) => (
                    <SubMenu
                      item={item}
                      key={index}
                      currentlyOpenSubMenu={currentlyOpenSubMenu}
                      setCurrentlyOpenSubMenu={setCurrentlyOpenSubMenu}
                    />
                  ))}
                </div> */}

                <div className="text-center">
                  {AdminSidebarData.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.title === "User Manual" ? (
                        <SubMenu
                          item={item}
                          key={index}
                          currentlyOpenSubMenu={currentlyOpenSubMenu}
                          setCurrentlyOpenSubMenu={setCurrentlyOpenSubMenu}
                          handleDownloadTemplate={handleDownloadTemplate}
                        />
                      ) : (
                        <SubMenu
                          item={item}
                          key={index}
                          currentlyOpenSubMenu={currentlyOpenSubMenu}
                          setCurrentlyOpenSubMenu={setCurrentlyOpenSubMenu}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-center mt-3">

                  <div className='circle '>
                    {!sidebar && (
                      <CircleIcon onClick={() => showSidebar(true)} className='ml-2 cicon fixed' style={{ position: "fixed" }}>
                        <FaIcons.FaBars style={{ fontSize: "1.5vw", color: "black", position: "fixed" }} />
                      </CircleIcon>
                    )}
                  </div></div>
                {/* <hr className="text-white" /> */}

                {AdminSidebarData.map((item, index) => (
                  // <div key={index} >
                  <>
                    <NavIcon to={item.path} key={index}
                      onMouseEnter={(event) => handleSidebarIconHover(item, event)}
                    // onMouseLeave={() => handleSidebarIconLeave()}
                    >
                      {/* <i className={`icon text-white mr-2 ${item.icon}`} style={{ fontSize: "1.2vw" }}></i> */}
                      <div style={{ verticalAlign: "middle" }}>
                        <i className={`icon text-black mr-2 ${item.icon}`} style={{ fontSize: "1.2vw" }}></i>
                      </div>
                    </NavIcon>

                    {hoverableSidebarOpen && selectedItem === item && (
                      <HoverableSidebar
                        isOpen={hoverableSidebarOpen}
                        closeSidebar={() => {
                          setHoverableSidebarOpen(false);
                          setSelectedItem(null); // Reset selected item when closing sidebar
                        }}
                        selectedItem={selectedItem}
                        iconPosition={iconPosition} // Pass iconPosition as a prop
                        currentlyOpenSubMenu={currentlyOpenSubMenu}
                        setCurrentlyOpenSubMenu={setCurrentlyOpenSubMenu}                         
                        handleDownloadTemplate={handleDownloadTemplate} // Make sure to pass the function here
                      />
                    )}
                  </>
                ))}

              </>
            )}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </div>
  );
};
export default AdminSidebar;
