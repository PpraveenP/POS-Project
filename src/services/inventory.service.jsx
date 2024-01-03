import axios from "axios";
import authService from "./auth.service";

const API_URL = "http://localhost:8083/sys/Inventory";
const currentuser = authService.getCurrentUser();

class InventoryService {
  saveInventory(inventory) {
    return axios.post(API_URL + "/save", inventory);
  }

  getAllInventory() {
    return axios.get(API_URL + `/inventory/${currentuser.storeid}`);
  }

  updateInventory(inventory) {
    return axios.put(API_URL + "/updates", inventory);
  }

  deleteInventory(id) {
    return axios.delete(API_URL + "/deleteinventory/" + id);
  }

  getById(id) {
    return axios.get(API_URL + "/getInventoryByID/" + id);
  }
}

export default new InventoryService();
