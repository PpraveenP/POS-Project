import axios from "axios";
import authService from "./auth.service";

const API_URL = "http://localhost:8083/sys/Tax";
const currentuser = authService.getCurrentUser();
class TaxService {
  saveTax(tax) {
    return axios.post(API_URL + "/save", tax);
  }
  getTax(tax) {
    return axios.get(API_URL + `/stores/${currentuser.storeid}/taxes`, tax);
  }
  updatetax(tax) {
    return axios.get(API_URL + `/stores/${currentuser.storeid}`, tax);
  }
  deletetax(taxid) {
    return axios.delete(API_URL + "/taxes/" + taxid);
  }
}

export default new TaxService();
