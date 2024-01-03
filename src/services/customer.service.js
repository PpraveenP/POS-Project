import axios from "axios";
import authService from "./auth.service";

const API_URL=`http://localhost:8083/sys/customer`;
const currentuser = authService.getCurrentUser();
class CustomerService{

    saveCustomer(customer)
    {
        return axios.post(API_URL+"/savecustomer",customer);
    }

    getAllCustomer(customer)
    {
        return axios.get(API_URL+`/getcustomer/${currentuser.storeid}`,customer);
    }

    
}

 export default new CustomerService

