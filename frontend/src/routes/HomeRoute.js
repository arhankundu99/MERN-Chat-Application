import { Container, Box, Text, Tabs, TabList, TabPanel, Tab, TabPanels } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import {authContext} from '../context/auth'

const HomeRoute = () => {
    const context = useContext(authContext);
    const history = useHistory();

    useEffect(() => {
        if(context.token){
            history.push('/chats')
        }
    }, [context, history])

    return (
        <Container maxW='xl' centerContent={true}>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="1g"
                borderWidth="1px">
                <Text fontSize="4xl" fontFamily="sans-serif">Chatter Box</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px">
                <Tabs variant='soft-rounded'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomeRoute;