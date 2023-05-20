const apiURLs = {
    auth: {
        LOGIN: '/user/login',
        REGISTER: '/user/register',
    },
    users: {
        FETCH_USERS: '/user',
        GET_LOGGED_IN_USER: '/user/details'
    },
    chat: {
        ACCESS_CHAT: '/chat',
        CREATE_GROUP: '/chat/group'
    },
    message: {
        SEND_MESSAGE: '/message',
        GET_MESSAGES: '/message'
    }
}

export default apiURLs;