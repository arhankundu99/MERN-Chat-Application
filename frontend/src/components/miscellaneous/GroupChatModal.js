import React, { useContext } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { chatContext } from '../../context/chat';
import { searchUsers } from '../../api/users';
import { createGroupChat } from '../../api/chat';
import UserBadgeItem from "../users/UserBadgeItem";
import UserListItem from "../users/UserListItem";

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { chats, setChats } = useContext(chatContext);

    const addUserInGroupHandler = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const searchUserHandler = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const foundUsers = await searchUsers(query);
            setLoading(false);
            setSearchResult(foundUsers);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const deleteUserHandler = (user) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
    };

    const submitGroupHandler = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            
            const newChat = await createGroupChat({groupChatName, selectedUsers});
            setChats([newChat, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                d="flex"
                justifyContent="center"
              >
                Create Group Chat
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody d="flex" flexDir="column" alignItems="center">
                <FormControl>
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add Users eg: John, Piyush, Jane"
                    mb={1}
                    onChange={(e) => searchUserHandler(e.target.value)}
                  />
                </FormControl>
                <Box w="100%" d="flex" flexWrap="wrap">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => deleteUserHandler(u)}
                    />
                  ))}
                </Box>
                {loading ? (
                  // <ChatLoading />
                  <div>Loading...</div>
                ) : (
                  searchResult?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleClick={() => addUserInGroupHandler(user)}
                      />
                    ))
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={submitGroupHandler} colorScheme="blue">
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
}

export default GroupChatModal
