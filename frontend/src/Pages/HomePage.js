import React, { useEffect } from 'react'
import {Container,Box,Text} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useNavigate } from 'react-router';

function HomePage() {

  const navigate=useNavigate();
  useEffect(() => {
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));

    if(!userInfo){
      navigate('/chats');
    }
  }, [navigate])


  return (<>
    <Container maxW='xl' >
    <Box display='flex' justifyContent='center' p={3} bg={'white'} w='100%' m='30px 0 15px 0'
    borderRadius={'lg'} borderWidth='1px'>
       <Text fontSize={'3xl'} fontFamily={'Work Sans'}>
          FriendllyTalk
       </Text> 
    </Box>
    <Box padding={3} bg={'white'} w='100%' m='20px 0 15px 0'
    borderRadius={'lg'} borderWidth='1px'>
    <Tabs variant='soft-rounded' colorScheme={'yellow'}>
      <TabList mb='0.5'>
        <Tab width={'50%'}>Login</Tab>
        <Tab width={'50%'}>Signup</Tab>
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
    </>
  )
}

export default HomePage