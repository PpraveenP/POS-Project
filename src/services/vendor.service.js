import axios from "axios";
import authService from "./auth.service";

const API_URL=`http://localhost:8083/sys/Vendor`;
const currentuser = authService.getCurrentUser();
class ReportService{

    saveVendor(vendor)
    {
        return axios.post(API_URL+"/save",vendor);
    }

    getAllVendor(vendor)
    {
        return axios.get(API_URL+`/vendor/${currentuser.storeid}`,vendor);
    }

    updatevendor(vendor)
    {
        return axios.put(API_URL+"/updatevendor",vendor);  
    }

    deleteVendor(vendor_id)
    {
        return axios.delete(API_URL+"/deletes/"+vendor_id);  
    }

    getById(vendor_id)
    {
        return axios.get(API_URL+"/getVendorByID/"+vendor_id);  
    }
}

 export default new ReportService

