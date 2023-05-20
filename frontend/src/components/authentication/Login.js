import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button, Toast, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react'
import {login} from '../../api/users'
import { useHistory } from 'react-router-dom'
import { authContext } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();
    const context = useContext(authContext)
    const toast = useToast();

    const showPasswordClickHandler = () => {
        setShowPassword((show) => !show);
    }

    const LoginClickHandler = async() => {
        try{
            const user = await login({email, password})
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('token', JSON.stringify(user.token))
            context.setToken(JSON.stringify(user.token))
            history.push('/chats')
        }
        catch(e){
            console.error(e);
        }
    }


    return <VStack spacing='5px' color="black">

        <FormControl id="email" isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input
                placeholder="Enter your email"
                onChange={(e) => { setEmail(e.target.value) }}
                value = {email}
            />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showPasswordClickHandler}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>

        </FormControl>

        <Button
            colorScheme="blue"
            width="100%"
            stype={{marginTop: 15}}
            onClick={LoginClickHandler}>
            Login
        </Button>

        <Button
            variant="solid"
            colorScheme="red"
            width="100%"
            stype={{marginTop: 15}}
            onClick={() => {
                setEmail("guest@chatterbox.com");
                setPassword("guest");
            }}>
            Get Guest User Credentials
        </Button>
    </VStack>
}

export default Login;