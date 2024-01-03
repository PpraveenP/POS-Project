import axios from "axios";
import authHeader from './auth-header';
import authService from '../services/auth.service';

const API_URL = "http://localhost:8083/api/auth/Tech";
const currentuser = authService.getCurrentUser();

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "/TechSignin", {
        username,
        password 
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }
 
  logout() { 
    localStorage.removeItem("user");
  }

  technician(username, saddress, contact,currency, country, state, updatedby, createdBy,email, password, comfirmpassword) {
    return axios.post(API_URL + "/techSignup", {
      username,
      saddress,
      contact,
      currency,
      country,
      state,
      updatedby,
      createdBy,
      email,
      password,
      comfirmpassword
    }); 
  }

getAllStores() {
    return axios.get(API_URL + "/gettech"); // New method with updated endpoint
}
updateStore(storeId, updatedData) {
    return axios.patch(API_URL + "/UpdateStoreInfo/" + storeId, updatedData);
}
getTechnicianBoard() {
    return axios.get(API_URL + 'technician', { headers: authHeader() });
  }
  getCurrentUser() {   
    return JSON.parse(localStorage.getItem('user'));;
  }

  deletetech(techid) {
    return axios.delete(API_URL + "/" + techid);
}
}

export default new AuthService();
