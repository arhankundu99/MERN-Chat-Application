import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useContext, useState, useEffect } from 'react'
import { chatContext } from '../../context/chat'

import { sendChatMessage, getChatMessages } from '../../api/message'
import './styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'

const socket = io(process.env.REACT_APP_API_URL);

const SingleChat = ({ loggedInUser }) => {
    const { selectedChat, setSelectedChat, chats, setChats } = useContext(chatContext);


    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const toast = useToast();

    const getSenderName = (chatUsers) => {
        return chatUsers[0].email == loggedInUser.email ? chatUsers[1].name : chatUsers[0].name;
    }

    const sendMessage = async (event) => {
        try {
            if (event.key === "Enter" && newMessage) {
                setNewMessage('');
                const message = await sendChatMessage({ chatId: selectedChat._id, content: newMessage });
                console.log(message);

                setMessages([...messages, message])
                socket.emit("message_sent", message);
            }
        }
        catch (e) {
            toast({
                title: "Error while sending message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const messages = await getChatMessages(selectedChat._id);
            setMessages(messages);
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            toast({
                title: "Error while fetching messages of this chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    useEffect(() => {
        socket.emit('user_connected', loggedInUser._id);
    }, [socket, loggedInUser._id])


    useEffect(() => {
        if (selectedChat) {
            socket.emit('chatroom_joined', selectedChat._id);
        }
        const getMessagesOfSelectedChat = async () => {
            fetchMessages();
        }
        getMessagesOfSelectedChat();
    }, [selectedChat]);

    useEffect(() => {
        socket.on("new_message", (newMessage) => {
            if (selectedChat && selectedChat._id == newMessage.chat._id) {
                setMessages([...messages, newMessage])
            }
        })
    });

    // useEffect(() => {
    //     if(!selectedChat)
    //         return;



    //     const id = setInterval(async() => {
    //         try{

    //             const newMessages = await getChatMessages(selectedChat._id);
    //             if(messages.length != newMessages.length){
    //                 setMessages(newMessages);
    //             }
    //         }
    //         catch(e){
    //             console.error(e);
    //         }
    //     }, 1000);

    //     return () => {
    //         clearInterval(id);
    //     }
    // })

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // typing indicator logic
    }


    return (
        <>
            {selectedChat ? (
                <Box
                bgImage="url('https://mcdn.wallpapersafari.com/medium/27/32/jt4AoG.jpg')"
                backgroundSize="100% 100%"
                width="100%"
                h="95%">
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")} />

                        {!selectedChat.isGroupChat ? (
                            <>{getSenderName(selectedChat.users)}</>
                        ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                </>
                            )}
                    </Text>


                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}

                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                                <div className="messages">
                                    <ScrollableChat messages={messages} loggedInUser={loggedInUser} />
                                </div>

                            )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </Box>
            ) : (
                <Box
                bgImage="url('https://mcdn.wallpapersafari.com/medium/27/32/jt4AoG.jpg')"
                backgroundSize="100% 100%"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                    </Text>
                    </Box>
                )}

        </>
    )
}

export default SingleChat
