import axios from "axios";

const API_URL = "http://localhost:8083/api/auth/user";

class UserService {
login(username, password) {
    return axios
     .post(API_URL + "/signin", {
        username,
        password
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

userRegister(username, email, contact, password,comfirmpassword,storeid,gstno,crtby,updtaeby,address,currency)
     {
    return axios.post(API_URL + "/signup", {
     username,
     email,
     contact,
     password,
     comfirmpassword,
     storeid,
     gstno,
     crtby,
     updtaeby,
     address,
     currency,
     
    });
}

getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
}
}
export default new UserService();