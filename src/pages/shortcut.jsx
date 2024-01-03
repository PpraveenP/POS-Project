import React from "react";
import "./shortcut.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Shortcut = () => {
  return (
    <div className="animation d-flex justify-content-center" style={{marginTop:"15vh"}} >
      <div className="border border-dark p-4">
        <table className="table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>New Order</td>
              <td>Alt + N</td>
            </tr>
            <tr>
              <td>Running Order</td>
              <td>Alt + R</td>
            </tr>
            <tr>
              <td>Order List</td>
              <td>Alt + O</td>
            </tr>
            <tr>
              <td>Bill List</td>
              <td>Alt + B</td>
            </tr>
            <tr>
              <td>Add Inventory</td>
              <td>Alt + I</td>
            </tr>
            <tr>
              <td>Inventory List</td>
              <td>Alt + 1</td>
            </tr>
            <tr>
              <td>Add Vendor</td>
              <td>Alt + V</td>
            </tr>
            <tr>
              <td>Add Payment</td>
              <td>Alt + P</td>
            </tr>
            <tr>
              <td>Add Vendor Inventory</td>
              <td>Alt + T</td>
            </tr>
            <tr>
              <td>Add Food</td>
              <td>Alt + M</td>
            </tr>
            <tr>
              <td>Food List</td>
              <td>Alt + F</td>
            </tr>
            <tr>
              <td>Add Addon</td>
              <td>Alt + A</td>
            </tr>
            <tr>
              <td>Addon List</td>
              <td>Alt + 2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border border-dark p-4 ml-3">
        <table className="table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Add Recipe</td>
              <td>Alt + E</td>
            </tr>
            <tr>
              <td>Recipe List</td>
              <td>Alt + 3</td>
            </tr>
            <tr>
              <td>Vendor List</td>
              <td>Alt + 4</td>
            </tr>
            <tr>
              <td>Payment List</td>
              <td>Alt + 5</td>
            </tr>
            <tr>
              <td>Vendor Inventory List</td>
              <td>Alt + 6</td>
            </tr>
            <tr>
              <td>Add User</td>
              <td>Alt + U</td>
            </tr>
            <tr>
              <td>User List</td>
              <td>Alt + 7</td>
            </tr>
            <tr>
              <td>Tax Setting</td>
              <td>Alt + X</td>
            </tr>
            <tr>
              <td>Store Setting</td>
              <td>Alt + S</td>
            </tr>
            <tr>
              <td>Payment Setting</td>
              <td>Alt + Y</td>
            </tr>
            <tr>
              <td>POS Setting</td>
              <td>Alt + D</td>
            </tr>
            <tr>
              <td>Cash register</td>
              <td>Alt + C</td>
            </tr>
            <tr>
              <td>Cash List</td>
              <td>Alt + 8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
