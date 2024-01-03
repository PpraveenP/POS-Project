import axios from "axios";
import authService from "./auth.service";


const API_URL="http://localhost:8083/sys/api/store-payments";
const currentuser = authService.getCurrentUser();
class StorePaymentService{

    savepayment(storepayment)
    {
        return axios.post(API_URL+"/save",storepayment);
    }
    getpayment()
    {
        return axios.get(API_URL+`/storepayment/${currentuser.storeid}`);
    }
    getpaymentbyid(paymentId)
    {
        return axios.get(API_URL+"/getstorepaymentbyid/"+paymentId);
    }
    updatepayment(paymentId)
    {
        return axios.get(API_URL+"/updatestorepayment/"+paymentId);
    }
    deletepayment(paymentId)
    {
        return axios.delete(API_URL+`/deletestotepaymentbyid/${paymentId}`);
    }
}

export default new StorePaymentService; 