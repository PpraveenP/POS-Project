import axios from "axios";
import authService from "./auth.service";


const API_URL="http://localhost:8083/sys/fooditems";
const currentuser = authService.getCurrentUser();
class FooditemService{

    saveFooditem(fooditem)
    {
        return axios.post(API_URL+"/addfood",fooditem);
    }

    getAllInventory(inventory)
    {
        return axios.get(API_URL+`/inventory/${currentuser.storeid}`,inventory);
    }

    updateInventory(inventory)
    {
        return axios.put(API_URL+"/updates",inventory);
    }

    deleteInventory(id)
    {
        return axios.delete(API_URL+"/deleteinventory/"+id);
    }

    getById(id)
    {
        return axios.get(API_URL+"/getInventoryByID/"+id); 
    }

}

export default new FooditemService; s