import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button, Toast, useToast } from '@chakra-ui/react';
import React, { useState, useContext } from 'react'
import { register } from '../../api/users'
import { useHistory } from 'react-router-dom'
import { authContext } from '../../context/auth';

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const history = useHistory();
    const authCtx = useContext(authContext)
    const toast = useToast();

    const showPasswordClickHandler = () => {
        setShowPassword((show) => !show);
    }

    const showConfirmPasswordClickHandler = () => {
        setShowConfirmPassword((show) => !show);
    }

    const postDetails = (pic) => {

    }

    const signUpClickHandler = async () => {
        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match.")
            }
            console.log({ name, email, password, pic })
            const user = await register({ name, email, password, pic })
            
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('token', JSON.stringify(user.token))
            authCtx.setToken(JSON.stringify(user.token))
            history.push('/chats')
        }
        catch (e) {
            console.error(e);
            Toast({
                title: "Registration Failed",
                description: e.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }


    return <VStack spacing='5px' color="black">
        <FormControl id="first-name" isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input
                placeholder="Enter your name"
                onChange={(e) => { setName(e.target.value) }}
            />
        </FormControl>

        <FormControl id="email" isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input
                placeholder="Enter your email"
                onChange={(e) => { setEmail(e.target.value) }}
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
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showPasswordClickHandler}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>

        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>
                Confirm Password
            </FormLabel>
            <InputGroup>
                <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showConfirmPasswordClickHandler}>
                        {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>

        </FormControl>


        <FormControl id="pic">
            <FormLabel>
                Profile Pic
            </FormLabel>
            <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => { postDetails(e.target.files[0]) }}
            />


        </FormControl>

        <Button
            colorScheme="blue"
            width="100%"
            stype={{ marginTop: 15 }}
            onClick={signUpClickHandler}>
            Sign Up
        </Button>
    </VStack>
}

export default Signup;