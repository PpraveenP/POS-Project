import axios from "axios";
import authHeader from "./auth-header";
import authService from "./auth.service";

const API_URL = "http://localhost:8083/";

const currentuser = authService.getCurrentUser();
class RoleuserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }

  getAllUser() {
    return axios.get(
      API_URL + `sys/UserSidebar/store/${currentuser.storeid}/users`
    );
  }
  registerUser() {
    return axios.post(API_URL + "addMenu");
  }
  // -----------------------Neha Added this function-----------
  deleteRole(id) {
    return axios.delete(API_URL + "sys/UserSidebar/delete/" + id);
  }
}

export default new RoleuserService();
