import { authContext } from "../context/auth";
import { useContext } from 'react'
import { Box } from "@chakra-ui/react";
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/chats/MyChats'
import ChatBox from '../components/chats/ChatBox'

const ChatRoute = () => {

    return <div style = {{width: '100%'}}>
        <SideDrawer/>
        <Box
        display='flex'
        justifyContent='space-between' w="100%" h = "91.5vh" p = "10px">
            <MyChats/>
            <ChatBox/>
        </Box>
    </div>
}

export default ChatRoute;