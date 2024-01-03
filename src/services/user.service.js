import axios from 'axios';
import authHeader from './auth-header';
import authService from '../services/auth.service';

const API_URL = 'http://localhost:8083/api';
const currentuser = authService.getCurrentUser();
class UserService {
getPublicContent() {
    return axios.get(API_URL + 'all');
}

getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
}

getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
}

getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
}
allAccesss(){
    return axios.get(API_URL + `/auth/user/byStoreId/${currentuser.storeid}`);
}
deleteUser(id){
    return axios.delete(API_URL + "/auth/user/users/"+id);
}
}

export default new UserService();