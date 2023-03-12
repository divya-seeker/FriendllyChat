import { Input,Button, Tooltip,Text, Box, Menu, MenuButton, Avatar, MenuItem, MenuList, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import "./SideDrawer.css"
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router';
import {useDisclosure} from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat,setLoadingChat]=useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate=useNavigate();
  const toast=useToast();

  const logoutHandler=()=>{
    localStorage.removeItem("userinfo");
    navigate("/");
  }

  const accessChat=async(userId)=>{
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data}= await axios.post("/api/chat",{userId},config);

      if(!chats.find((c)=>c._id===data._id))
        setChats([data,...chats])
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    }
    catch (error) {
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
  

  return (
    <>
    <Box id="box">
      <Tooltip
      hasArrow placement='bottom-end' 
      label="Search Users to chat"
      >
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{base:"none",md:"flex"}} px="4">
              Search User
            </Text>
          </Button>
      </Tooltip>
      
      <Text display={"flex"} fontSize="2xl" fontFamily={"Work sans"}>
      <img width={"36px"} height={"25px"} src={require('../../assets/favi.jpg')}/>
        riendllyChat
      </Text>
      <div>
      <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        <Menu>
          <MenuButton as={Button} marginRight={'20px'} rightIcon={<ChevronDownIcon/>}>
              <Avatar  
              size='sm' 
              cursor='p' 
              name={user.name} 
              src={user.pic}
              />
          </MenuButton>
          <MenuList>
            <ProfileModal  user={user} >
            <MenuItem>
              My Profile
            </MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                Search Users
              </DrawerHeader>
            <DrawerBody>
              <Box className='search'>
                <Input
                  placeholder='Search by name or email'
                  mr={2}
                  value={search}
                  onChange={(e)=>{setSearch(e.target.value)}}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading?(<ChatLoading/>):(searchResult?.map(user=>(
                <UserListItem 
                  key={user._id}
                  user={user}
                  handleFunction={()=>{accessChat(user._id)}}
                />
              )))}
              {loadingChat && <Spinner ml='auto' display={'flex'}/>}
            </DrawerBody>
            </DrawerContent>
      </Drawer>
      
    </>
  )
}

export default SideDrawer


