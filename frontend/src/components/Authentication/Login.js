import React, { useState } from 'react'
import {Button, FormControl, FormLabel, VStack ,Input, InputGroup, InputRightElement} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router';


function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [picLoading, setPicLoading] = useState(false);

  const guestLoginHandler=()=>{
    setEmail('guest@gmail.com');
    setPassword('1kiyusa1');
  }

  const toast=useToast();
  const navigate=useNavigate();
  
  const submitHandler = async () => {
    setPicLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
  function handleClick(){
    if(show===true){
      setShow(false);
    }
    else{
      setShow(true);
    }
  }

  return (
    <div>
      <VStack >
      <FormControl>
        <FormLabel mt={'6px'}>Email </FormLabel>
        <Input
        value={email}
        id='email'
        type={'email'}
        placeholder='Enter your Email-id' 
        onChange={(event)=>{setEmail(event.target.value)}}>
        </Input>


        <FormLabel mt={'6px'}>Password</FormLabel>
        <InputGroup>
          <Input
          value={password}
          id='password'
          autoComplete="off"
          type={show?'text':'password'}
          placeholder='Enter Password' 
          onChange={(event)=>{setPassword(event.target.value)}}>

          </Input>
          <InputRightElement>
            <Button 
            onClick={handleClick}
            fontWeight={'400'} 
            height={'90%'} 
            borderRadius={'50%'} 
            position='absolute' right='7px' 
            colorScheme="yellow" variant='ghost'
            >
              {show?'Hide':'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      <Button
      colorScheme={'blue'}
      width={'100%'}
      style={{marginTop:'10px'}}
      onClick={submitHandler}
      isLoading={picLoading}
      >
      Login
      </Button>
      <Button
      colorScheme={'red'}
      width={'100%'}
      style={{marginTop:'10px'}}
      onClick={guestLoginHandler}
      >
      Get Guest User Credentials
      </Button>
      </FormControl>
    </VStack>
    </div>
  )
}

export default Login