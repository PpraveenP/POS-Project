import axios from "axios";
import authService from "./auth.service";


const API_URL="http://localhost:8083/sys/Payment";
const currentuser = authService.getCurrentUser();

class PaymentService{

    savePayment(payment)
    {
        return axios.post(API_URL+"/postpayment",payment);
    }

    getPayment(payment)
    {
        return axios.get(API_URL+`/payments/${currentuser.storeid}`,payment);
    }

    updatepayment(payment)
    {
        return axios.put(API_URL+"/updatepayment",payment);
    }

    deletePayment(id)
    {
        return axios.delete(API_URL+"/"+ id);
    }
}

export default new PaymentService;
