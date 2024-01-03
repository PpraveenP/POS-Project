import axios from "axios";

const API_URL = "http://localhost:8083/api/auth/store";

class AuthService {
login(username, password ,id,storeid,storeName,gstno,contact,saddress,logoUrl) {
    return axios
     .post(API_URL + "/storeSignin", {
        username,
        password,
        id,
        storeid,
        storeName,
        gstno,
        contact,
        saddress,
        logoUrl,
     })
     .then(response => {
        if (response.data.accessToken) {
         localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
     });
}

logout() {
    localStorage.removeItem("user");
}

register(
    store_name,
    username,
    saddress,
    contact,
    gstno,
    country,
    country_code,
   
    currency,
    state,
    email,
    password,
    comfirmpassword,
    createdby,
    updatedby,
    subscriptionType,

) {
    return axios.post(API_URL + "/storeSignup", {
     store_name,
     username,
     saddress,
     contact,
     gstno,
     country,
     country_code,
     currency,
     state,
     email,
     password,
     comfirmpassword,
     createdby,
     updatedby,
     subscriptionType,
    });
}

freetrial(
    store_name,
    username,
    saddress,
    contact,
    gstno,
    currency,
    country,
    country_code,
   
    state,
    email,
    password,
    comfirmpassword,
    createdby,
    updatedby,
    freeTrialRequested,
    freeTrialType,
    subscriptionType,
) {
    return axios.post(API_URL + "/storeFreeTrial", {
     store_name,
     username,
     saddress,
     contact,
     gstno,
     currency,
     country,
     country_code,
    
     state,
     email,
     password,
     comfirmpassword,
     createdby,
     updatedby,
     freeTrialRequested,
     freeTrialType,
     subscriptionType,

    });
}

isLoggedIn() {
    const user = localStorage.getItem('user'); // Retrieve the user details

    // Check if the user exists and if the user's token or any authentication details exist
    return !!user; // Modify this based on your authentication setup
 }

getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
}
}

export default new AuthService();