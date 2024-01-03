import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/esm/Table";
import { DLT } from "../redux/actions/action";
import AuthService from "../services/auth.service";

const Header = () => {
  const [price, setPrice] = useState(0);
  // console.log(price);

  const getdata = useSelector((state) => state.cartreducer.carts);

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dlt = (id) => {
    dispatch(DLT(id));
  };

  const total = () => {
    let price = 0;
    getdata.map((ele, k) => {
      price = ele.price * ele.qnty + price;
    });
    setPrice(price);
  };
  useEffect(() => {
    total();
  }, [total]);
  const CurrentUser = AuthService.getCurrentUser();
  const showSidebar = () => setSidebar(!sidebar);
  const [sidebar, setSidebar] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    // Fetch data from the database
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/
sys/UserSidebar/users/${CurrentUser.username}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <div>
      <Container>
           <Badge badgeContent={getdata.length} color="secondary" className="mt-3 mr-5"
         id="basic-button"
         aria-controls={open ? 'basic-menu' : undefined}
         aria-haspopup="true"
         aria-expanded={open ? 'true' : undefined}
         onClick={handleClick}>
           </Badge>
      </Container>
      <Menu
        id="basic-menu"
        className="mt-4"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {getdata.length ? (
          <div className="card_details" style={{ width: "24rem", padding: 10 }}>
            <Table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Food Iteam</th>
                </tr>
              </thead>
              <tbody>
                {getdata.map((e) => {
                  return (
                    <>
                      <tr>
                        <td>
                          <NavLink to={`/cart/${e.id}`} onClick={handleClose}>
                            <img
                              variant="top"
                              src={"data:image/png;base64," + e.image}
                            />
                          </NavLink>
                        </td>
                        <td>
                          <p>
                            <strong className="text-info">{e.rname}</strong>
                          </p>
                          <p>
                            <strong className="text-primary">Price : </strong>
                            <i class="fa-solid fa-indian-rupee-sign"></i>{" "}
                            <strong>{e.price}</strong>
                          </p>
                          <p>
                            <strong className="text-primary">
                              Quantity :{" "}
                            </strong>
                            <strong>{e.qnty}</strong>
                          </p>
                          <p
                            style={{
                              color: "red",
                              fontSize: 20,
                              cursor: "pointer",
                            }}
                            onClick={() => dlt(e.food_id)}
                          >
                            <i className="fas fa-trash-can smalltrash"></i>
                          </p>
                        </td>

                        <td
                          className="mt-5"
                          style={{
                            color: "red",
                            fontSize: 20,
                            cursor: "pointer",
                          }}
                          onClick={() => dlt(e.id)}
                        >
                          <i className="fas fa-trash-can largetrash"></i>
                        </td>
                      </tr>
                    </>
                  );
                })}
                <p className="text-center">
                  <strong className="text-success">Total :</strong>
                  <i class="fa-solid fa-indian-rupee-sign"></i>
                  {price}
                </p>
              </tbody>
            </Table>
          </div>
        ) : (
          <div
            className="card_details d-flex justify-content-center align-items-center"
            style={{ width: "24rem", padding: 10, position: "relative" }}
          >
            <i
              className="fas fa-close smallclose"
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 2,
                right: 20,
                fontSize: 23,
                cursor: "pointer",
              }}
            ></i>
            <p style={{ fontSize: 22 }}>Your carts is empty</p>
            <img
              src="./cart.gif"
              alt=""
              className="emptycart_img"
              style={{ width: "5rem", padding: 10 }}
            />
          </div>
        )}
      </Menu>
    </div>
  );
};

export default Header;
