import axios from 'axios'
import apiURLs from './apiURLs';

export async function sendChatMessage({content, chatId}){
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}${apiURLs.message.SEND_MESSAGE}`, {content, chatId}, config);

    return response.data;
}

export async function getChatMessages(chatId){

    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}${apiURLs.message.GET_MESSAGES}/${chatId}`, config);

    return response.data;
}
