import { Spinner, Input, Tooltip, Box, Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Toast, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { authContext } from '../../context/auth';
import { searchUsers } from '../../api/users';
import ChatLoading from '../chats/ChatLoading';
import UserListItem from '../users/UserListItem'
import { getChat } from '../../api/chat';
import { chatContext } from '../../context/chat';


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const history = useHistory();
    const authCtx = useContext(authContext)
    const chatCtx = useContext(chatContext);

    const logoutClickHandler = () => {
        localStorage.removeItem("token");
        authCtx.setToken('')
    }

    const toast = useToast();

    const handleSearch = async (e) => {
        if (!search) {
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }

        try {
            setLoading(true);
            const searchResults = await searchUsers(search)
            setSearchResult(searchResults);

            setLoading(false);
        }
        catch (e) {
            console.error(e);
            setLoading(false);
            setSearchResult([])
            toast({
                title: "Error Occured",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const accessChat = async(userId) => {
        try{
            setLoadingChat(true);
            const chat = await getChat(userId);
            chatCtx.setSelectedChat(chat);
            setLoadingChat(false);
            onClose();
        }
        catch(e){
            console.error(e);
            setLoadingChat(false);
            toast({
                title: "Error fetching the chat",
                description: e.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const searchResultsJSX = searchResult?.map((user) => {
        return (
            <UserListItem
                key={user._id}
                user={user}
                handleClick={() => accessChat(user._id)} />
        )
    })

    return (
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px">

                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">

                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fas fa-search"></i>
                        <Text d={{ base: "none", md: "flex" }} px="4">
                            Search User
                    </Text>
                    </Button>

                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">
                    Chatter Box
            </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>My Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logoutClickHandler}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>


                        {loading ? (
                            <ChatLoading/>
                        ): searchResultsJSX}


                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>

                </DrawerContent>

            </Drawer>
        </div>
    )
}

export default SideDrawer
