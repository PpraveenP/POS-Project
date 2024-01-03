import axios from "axios";
import authService from '../services/auth.service';

const API_URL="http://localhost:8083/sys/Addons";
const currentuser = authService.getCurrentUser();

class AddOnService {
saveaddon(addon)
    {
        return axios.post(API_URL+"/saveaddon",addon);
    }
    getaddon(addon)
    {
        return axios.get(API_URL+`/addon/${currentuser.storeid}`,addon);
    }
    deleteaddOn(id)
    {
        return axios.delete(API_URL + "/addon/" + id);
    } 

    updateaddOn(id)
    {
        return axios.put(API_URL + "/updateaddon" + id);
    } 

    updateAddOn(id)
    {
        return axios.patch(API_URL + "/updateaddon/" + id);
    }
    getById(id)
    {
        return axios.get(API_URL + "/getAddonByID/" + id);
    }

}
export default new AddOnService; 