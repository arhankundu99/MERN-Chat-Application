import { useHistory } from "react-router-dom";

const { createContext, useState } = require("react");

export const chatContext = createContext();

const ChatProvider = ({ children }) => {

    const [selectedChat, setSelectedChat] = useState('');
    const [chats, setChats] = useState([])

    return (
        <chatContext.Provider value = {{selectedChat, setSelectedChat, chats, setChats}}>
            {children}
        </chatContext.Provider>
    )
}

export default ChatProvider;