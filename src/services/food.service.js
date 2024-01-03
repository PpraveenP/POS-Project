import axios from "axios";
import AuthService from "./auth.service";

const API_URL="http://localhost:8083/sys/Food";
const currentUser =AuthService.getCurrentUser();
class FoodService {

    addFood(food)
    {
        const headers = {
            Authorization: `Bearer ${currentUser.accessToken.substr(currentUser.accessToken)}`,
          };
        return axios.post(API_URL+"/postFood",food);
    }

    getFood(food)
    {
        const headers ={
            Authorization: `Bearer ${currentUser.accessToken.substr(currentUser.accessToken)}`,
          };
        return axios.get(API_URL+`/foods/${currentUser.storeid}`,food);
    }

    deleteFood(food_id)
    {
        const headers ={
            Authorization: `Bearer ${currentUser.accessToken.substr(currentUser.accessToken)}`,
          };
        return axios.delete(API_URL +"/deletefood/" + food_id);
    } 
    
    updateFood(food)
    {
        const headers ={
            Authorization: `Bearer ${currentUser.accessToken.substr(currentUser.accessToken)}`,
          };
        return axios.update(API_URL +"/updatefood",food);
    } 

    getfoodImage(id)
    {
        const headers ={
            Authorization: `Bearer ${currentUser.accessToken.substr(currentUser.accessToken)}`,
          };
        return axios.get(API_URL +"/image/"+id);
    }
}

export default new FoodService; 


