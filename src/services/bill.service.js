import axios from "axios";
import authService from '../services/auth.service';

const currentuser = authService.getCurrentUser();

const API_URL=`http://localhost:8083/sys/Bill`;

class BillService{
placebill(bill)
    {
        return axios.post(API_URL+"/postBill",bill);
    }

    placebillOrder(bill)
    {
        return axios.post(API_URL+"/postbillOrder",bill);
    }

    getAllBill(bill)
    {
        return axios.get(API_URL+`/billorder/${currentuser.storeid}`,bill);
    }

    updateBill(bill)
    {
        return axios.put(API_URL+"/updatebill",bill);
    }

    deletebill(id)
    {
        return axios.delete(API_URL+"/deletebill/"+id);
    }

    getAllBillOrder(bill)
    {
        return axios.get(API_URL+"/getbill",bill);
    }

    getBillById(id)
    {
        return axios.get(API_URL+"/getBillByID/"+id);
    }

    updateBillOrder(id)
    {
        return axios.patch(API_URL+"/updateBill/",id);
    }
}

export default new BillService();