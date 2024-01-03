import axios from "axios";
import authService from '../services/auth.service';


const API_URL="http://localhost:8083/sys/VendorInvoice";
const currentuser = authService.getCurrentUser();

class InvoiceService{
saveInvoice(invoice)
    {
        return axios.post(API_URL+"/postinvoice",invoice);
    }

    getVendorInvoice(invoice)
    {
        return axios.get(API_URL+`/invoices/${currentuser.storeid}`,invoice);
    }

    updateVendorInvoice(id)
    {
        return axios.put(API_URL+"/updatess"+id);
    }

    deleteVendorInvoice(id)
    {
        return axios.delete(API_URL+"/"+id);
    }

    getById(id)
    {
        return axios.get(API_URL+"/getInventoryByID/"+id); 
    }
    updateVendorInvoicee(id)
    {
        return axios.patch(API_URL+"/updateinvoice/"+id);
    }

}

export default new InvoiceService; 