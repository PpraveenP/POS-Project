
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { userSidebarData } from './sidebardata.component';
import SubMenu from './submenucomponent';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import AuthService from '../services/auth.service';
import authService from '../services/auth.service';


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
  margin-right: 1rem;
  height: 7vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-decoration: none;
  font-size: 2vw;
 
  ${({ sidebar }) =>
      sidebar &&
      `
    font-size: 1.5vw; /* Font size when sidebar is expanded */
    color: #fff; /* Text color when sidebar is expanded */
    
  `}
  ${({ sidebar }) =>
      !sidebar &&
      `
    font-size: 1.3vw; /* Font size when sidebar is collapsed */
    color: #000; /* Text color when sidebar is collapsed */
    &:hover {
      color: #03989e; /* Change text color to white on hover */
      // border-left: 10px solid #03989e;
    }
  `}
`;

const SidebarNav = styled.nav`
  background: #BFCAD0;
  width: ${({ sidebar }) => (sidebar ? '16vw' : '4vw')};
  height: 90vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '0')};
  transition: all 350ms ease-in-out;
  z-index: 10;
  text-decoration: none;
  overflow: auto;
  margin-top: 10vh;
  margin-bottom: 100%;


  /* Additional CSS properties based on the sidebar state */
  ${({ sidebar }) =>
      sidebar &&
      css`
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
      background: #d9d9d9;
    `}

  ${({ sidebar }) =>
      !sidebar &&
      css`
      background: #d9d9d9;
      overflow-Y: auto;
    `}
  
  ${(props) =>
      props.scrollbar &&
      css`
      &::-webkit-scrollbar {
        width: 8px;
        background-color: #BFCAD0;
        margin-bottom: 100%;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #6B7A89;
        border-radius: 8px;
        margin-bottom: 100%;
      }
    `}
`;

const SidebarWrap = styled.div`
  flex-grow: 1;
  text-decoration: none;
  padding: 1rem;
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
  margin-top: -14.3vh;
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
  margin-top: -9vh;
  cursor: pointer;
  margin-left: 0.2vh; /* Apply margin-left directly in the styled component */
`;





const RightSidebar = styled.div`
  position: fixed;
  top: ${({ iconPosition }) => `${iconPosition.top}px`};
  // left: ${({ iconPosition }) => `${iconPosition.right}px`};
  left: 4vw; /* Set the fixed left position to 60px */
  /* Adjust the right property as needed */
  right: ${({ isOpen }) => (isOpen ? '0' : '10vh')};
  width: 15vw;
  background-color: #fff;
  transition: right 0.3s ease-in-out;
  /* Add more styles as per your requirements */
  overflow: auto;

`;



const HoverableSidebar = ({ isOpen, closeSidebar, selectedItem, iconPosition, subMenuItems, menuItem }) => {
   const handleMouseEnter = () => {
      if (!isOpen) {
         closeSidebar(); // Open the sidebar when mouse enters if it's not already open
      }
   };

   const handleMouseLeave = () => {
      if (isOpen) {
         closeSidebar(); // Close the sidebar when mouse leaves if it's open
      }
   };



   return (
      <div className={`hoverable-sidebar ${isOpen ? 'open' : ''}`} onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave} >
         {iconPosition && (

            <RightSidebar isOpen={isOpen} iconPosition={iconPosition}>

               {isOpen && selectedItem && (
                  <>
                     <SubMenu item={selectedItem} isVisible={isOpen} />
                     {selectedItem.subMenu && (
                        <>
                           {selectedItem.subMenu.map((item, index) => (
                              <li key={index} className="text-black">
                                 <SubMenu item={item} isVisible={isOpen} />
                              </li>
                           ))}
                        </>
                     )}
                  </>
               )}

            </RightSidebar>
         )}

      </div>
   );
};








const UserSidebar = () => {
   const CurrentUser = AuthService.getCurrentUser();
   const [sidebar, setSidebar] = useState(false);
   const [data, setData] = useState(null);
   const sidebarRef = useRef(null);
   const [hoverableSidebarOpen, setHoverableSidebarOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [iconPosition, setIconPosition] = useState(null);
   const currentUser = authService.getCurrentUser();

   // const showSidebar = () => setSidebar(!sidebar);
   // const toggleSidebar = () => {
   //    setSidebar(!sidebar);
   //    setHoverableSidebarOpen(false); // Close hoverable sidebar when main sidebar is toggled
   //    setSelectedItem(null); // Reset selected item
   // };

   const handleSidebarIconHover = (item, event) => {
      const iconPosition = event.target.getBoundingClientRect();
      setSelectedItem(item); // Set the selected item in state
      setHoverableSidebarOpen(true); // Open the hoverable sidebar
      setIconPosition(iconPosition); // Set iconPosition in state
   };


   const handleSidebarIconLeave = () => {
      setHoverableSidebarOpen(false);
      setSelectedItem(null); // Reset selected item when closing sidebar
   };



   const [subSidebar, setSubSidebar] = useState(false);

   // const showSidebar = () => setSidebar(!sidebar);
   const showSidebar = (isOpen) => {
      const containerd = document.querySelector('.animation');
      if (isOpen) {
         containerd.style.transition = "margin-left 0.6s, transform 0.5s"; // Add transition property
         containerd.style.marginLeft = "2vw";
         containerd.style.transform = "translateX(5vw)"; // Add transform property
       } else {
         containerd.style.transition = "margin-left 0.6s, transform 0.5s"; // Add transition property
         containerd.style.marginLeft = "0vw";
         containerd.style.transform = "translateX(0)"; // Reset transform property
       }
      setSidebar(!sidebar);
      setSubSidebar(false);
   };

   const showSubSidebar = () => {
      setSubSidebar(!subSidebar);
   };

   useEffect(() => {
      const handleOutsideClick = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
          setSidebar(false);
  
          // Reset the CSS properties of containerd
          const containerd = document.querySelector(".animation");
          containerd.style.transition = "margin-left 0.6s, transform 0.5s";
          containerd.style.marginLeft = "0vw";
          containerd.style.transform = "translateX(0)";
        }
      };
  
      document.addEventListener("mousedown", handleOutsideClick);
  
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);
   useEffect(() => {
      fetchData();
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
         setSidebar(false);
      }
   };

   const fetchData = async () => {
      try {
         const response = await fetch(`http://localhost:8083/sys/UserSidebar/users/${CurrentUser.username}`);
         const data = await response.json();
         setData(data);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };



   return (


      <div onMouseLeave={() => handleSidebarIconLeave()}>
         <IconContext.Provider value={{ color: '#fff' }}>
            <SidebarNav sidebar={sidebar} ref={sidebarRef}>
               <SidebarWrap >

                  {sidebar ? (
                     <>
                        <CircleIconClose to='#' onClick={() => showSidebar(false)} style={{ position: "fixed" }}>
                           <FaIcons.FaBars style={{ fontSize: "1.5vw", color: "black", position: "fixed" }} />
                        </CircleIconClose>
                        <div className="text-center" >
                           <img src={process.env.PUBLIC_URL + '/SYS.jpeg'} className="rounded" width="60" height="60" alt="" />
                        </div>
                        <h6 className='text-success font-weight-bold text-center mt-3'><i class="fa-regular fa-circle-dot fa-lg"></i> User : {currentUser.username}</h6>
                        {/* <hr className="text-black" /> */}
                        <div>
                           {data && data.menu ? (
                              <>
                                 {data.menu.map((menuItem, index) => (
                                    <li key={index}>
                                       <Link
                                          to={menuItem.path}
                                          className="text-black ml-2"
                                          style={{
                                             textDecoration: 'none',
                                             color: 'black',
                                             transition: 'color 0.3s ease-in-out',
                                          }}
                                          onMouseEnter={(e) => {
                                             e.target.style.color = "#03989e"; // Change text color on hover
                                          }}
                                          onMouseLeave={(e) => {
                                             e.target.style.color = 'black'; // Revert text color on hover out
                                          }}
                                       >
                                          <h6>
                                             <i className={`mx-1 text-black icon ${menuItem.icon}`}></i> <span style={{ fontSize: "1vw"}}>{menuItem.title}</span>
                                          </h6>
                                       </Link>
                                       <div className="ml-2 mt-2">
                                          {
                                             menuItem.subMenu.map((item, index) => {
                                                return <SubMenu item={item} key={index} />;
                                             })
                                          }
                                       </div>
                                    </li>
                                 ))}
                              </>
                           ) : (
                              <div colSpan="11" className="text-center font-weight-bold text-white bg-danger p-4">
                                 <i className="fa-solid fa-triangle-exclamation fa-beat fa-2x"></i>
                                 <h6 className='mt-2 bg-dark p-2'>No roles/permissions have been assigned to the user !!</h6>
                              </div>
                           )}
                        </div>
                     </>
                  ) : (

                     <>
                        <div className="text-center mt-5 mr-3">
                           <div className='circle '>
                              {!sidebar && (
                                 <CircleIcon onClick={() => showSidebar(true)} className='ml-4 fixed' style={{ position: "fixed" }}>
                                    <FaIcons.FaBars style={{ fontSize: "1.5vw", color: "black", position: "fixed" }} />
                                 </CircleIcon>
                              )}</div>

                           {data && data.menu ? (
                              <>
                                 {data.menu.map((menuItem, index) => (
                                    <li key={index}>
                                       <NavIcon
                                          to={menuItem.path}
                                          onMouseEnter={(event) => handleSidebarIconHover(menuItem, event)}
                                       >
                                          <i className={`text-black  ml-4 ${menuItem.icon}`} style={{ fontSize: "1.2vw" }}></i>
                                       </NavIcon>
                                       {hoverableSidebarOpen && (
                                          <HoverableSidebar
                                             isOpen={hoverableSidebarOpen}
                                             closeSidebar={() => {
                                                setHoverableSidebarOpen(false);
                                                setSelectedItem(null);
                                             }}
                                             selectedItem={selectedItem}
                                             iconPosition={iconPosition}
                                             // subMenuItems={selectedItem?.subMenu || []}
                                             subMenuItems={(selectedItem && selectedItem.subMenu) || menuItem.subMenu || []}

                                          // ... other props as needed
                                          />
                                       )}
                                    </li>
                                 ))}
                              </>
                           ) : (
                              <div colSpan="11" className="text-center font-weight-bold text-white bg-danger p-4">
                                 <i className="fa-solid fa-triangle-exclamation fa-beat fa-2x"></i>
                              </div>
                           )}
                        </div>
                     </>
                  )}
               </SidebarWrap>
            </SidebarNav>
         </IconContext.Provider>
      </div>
   );
};

export default UserSidebar;

