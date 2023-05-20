import axios from 'axios'
import apiURLs from './apiURLs';

export async function getChat(userId){
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(`${process.env.REACT_APP_API_URL}${apiURLs.chat.ACCESS_CHAT}`, {userId}, config);

    return response.data;
}

export async function getChats(){
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}${apiURLs.chat.ACCESS_CHAT}`, config);

    return response.data;
}

export async function createGroupChat({groupChatName, selectedUsers}){
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${apiURLs.chat.CREATE_GROUP}`,
        {
            groupName: groupChatName,
            userIds: selectedUsers.map((u) => u._id),
        },
        config
    );

    return response.data;
}