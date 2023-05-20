import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";

import { useContext, useState, useEffect } from "react";
import { chatContext } from "../../context/chat";
import { getLoggedInUserDetails } from '../../api/users';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const {selectedChat, setSelectedChat, chats, setChats} = useContext(chatContext)
  const [loggedInUser, setLoggedInUser] = useState({});

  
  useEffect(() => {

    const fetchLoggedInUser = async () => {
        try {
            const loggedInUserDetails = await getLoggedInUserDetails();
            setLoggedInUser(loggedInUserDetails);
        }
        catch (e) {
            console.error(e);
        }
    }
    fetchLoggedInUser();
}, [setLoggedInUser])

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat loggedInUser={loggedInUser}/>
    </Box>
  );
};

export default Chatbox;