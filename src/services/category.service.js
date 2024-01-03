import axios from "axios";
import authService from "./auth.service";

const API_URL = "http://localhost:8083/sys/Button";
const currentuser = authService.getCurrentUser();

class CategoryService {
  saveCategory(category) {
    return axios.post(API_URL + "/postbutton", category);
  }

  getAllCategory() {
    return axios.get(API_URL + `/getbutton/${currentuser.storeid}`);
  }


  deleteCategory(id){
    return axios.delete(API_URL + "/deletecategory/" + id);

  }

  getById(id) {
    return axios.get(API_URL + "/getcategory/" + id);
  }
}

export default new CategoryService();
