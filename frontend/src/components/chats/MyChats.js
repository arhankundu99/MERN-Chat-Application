
import React, { useContext, useEffect, useState } from 'react'
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { getChats } from '../../api/chat';
import { chatContext } from '../../context/chat'

import { AddIcon } from "@chakra-ui/icons";

import ChatLoading from "./ChatLoading";

import { Button } from "@chakra-ui/react";
import { getLoggedInUserDetails } from '../../api/users';
import GroupChatModal from '../miscellaneous/GroupChatModal'



const MyChats = () => {

    const { selectedChat, setSelectedChat, chats, setChats } = useContext(chatContext);
    const [loggedInUser, setLoggedInUser] = useState({});
    const toast = useToast();

    const getSenderName = (chatUsers) => {

        return chatUsers[0].email == loggedInUser.email ? chatUsers[1].name : chatUsers[0].name;
    }

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatsOfLoggedInUser = await getChats();
                setChats(chatsOfLoggedInUser);
                console.log(chatsOfLoggedInUser)
            }
            catch (e) {
                toast({
                    title: "Error occured while fetching the chats.",
                    description: e.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                })
            }
        }

        const fetchLoggedInUser = async () => {
            try {
                const loggedInUserDetails = await getLoggedInUserDetails();
                setLoggedInUser(loggedInUserDetails);
            }
            catch (e) {
                console.error(e);
            }
        }

        fetchChats();
        fetchLoggedInUser();
    }, [setChats, toast])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            width={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                </Button>
                </GroupChatModal>

            </Box>

            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                width="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => {
                            return (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat ? getSenderName(chat.users) : chat.chatName}
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}
                                </Box>
                            )
                        })}
                    </Stack>
                ) : (
                        <ChatLoading />
                    )}
            </Box>
        </Box>
    )
}

export default MyChats
