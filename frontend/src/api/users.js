import axios from 'axios'
import apiURLs from './apiURLs'

export async function login(user) {
    const { email, password } = user;

    const response = await axios.post(`${process.env.REACT_APP_API_URL}${apiURLs.auth.LOGIN}`, {
        email,
        password
    })
    return response.data;


}

export async function register(user) {

    const { name, email, password, pic } = user;
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}${apiURLs.auth.REGISTER}`, {
        name,
        email,
        password,
        pic
    })
    return response.data;
}

export async function searchUsers(name){
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}${apiURLs.users.FETCH_USERS}?name=${name}`, config)

    return response.data;
}

export async function getLoggedInUserDetails(){
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}${apiURLs.users.GET_LOGGED_IN_USER}`, config)

    return response.data;
}