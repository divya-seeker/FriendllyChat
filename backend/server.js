const express=require('express');
const dotenv=require('dotenv');
const app=express();
var path = require('path');
const chats =require('./data/data');
const connectDB = require('./config/dbConnect');
const colors=require('colors');
const mongoose=require('mongoose');
const chatRoutes=require('./routes/chatRoutes');
const userRoutes=require('./routes/userRoutes');
const messageRoutes=require('./routes/messageRoutes');
const {notFound,errorHandler}=require('./middlewares/errorMiddleware');

dotenv.config();
mongoose.set('strictQuery', true);

app.use(express.json());// to accept JSON Data 

app.get('/',(req,res)=>{
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
})

app.use('/api/chat',chatRoutes);

app.get('/api/chats/:id',(req,res)=>{
    // console.log(req.params.id);
    const singleChat=chats.find((chat)=>
        req.params.id===chat._id
    )
    if(!singleChat){res.send("Not Found!!!")}
    res.send(singleChat);
})

app.use('/api/user',userRoutes);
app.use('/api/message',messageRoutes);


//Error Handling MiddleWares
app.use(notFound);
app.use(errorHandler)


connectDB();
const port=process.env.PORT||5000;
const server=app.listen(port,()=>{
    console.log(`Listening at Port:${port}`.yellow.bold);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });