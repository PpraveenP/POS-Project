import axios from "axios";

const API_URL = "http://localhost:8083/api/auth/store"; // Endpoint URL should match your backend

class StoreService {
  getStoreById(storeId) {
    return axios.get(API_URL + "/stores/" + storeId);
  }

  deleteStore(storeId) {
    return axios.delete(API_URL + "/" + storeId);
  }
  getAllStores() {
    return axios.get(API_URL + "/admin/allstores"); // Updated endpoint
  }
  getAllSupportStores() {
    return axios.get(API_URL + "/support/allstores"); // New method with updated endpoint
  }
}

export default new StoreService();
