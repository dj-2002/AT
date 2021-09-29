const express = require('express');
const app = express();
const cors = require('cors')
const server = require('http').Server(app);

const io = require('socket.io')(
    server,{
        cors:{
            origin:"*",
            method: ["GET","POST"]
        }
    });
const port = process.env.PORT || 4000;
// const {v4:uuidv4} = require('uuid');
// const {ExpressPeerServer} = require('peer')
// const peer = ExpressPeerServer(server , {
//   debug:true
// });
// app.use('/peerjs', peer);
// app.set('view engine', 'ejs')
// app.use(express.static('public'))
app.use(cors())
app.get('/' , (req,res)=>{
//   res.redirect(`/${uuidv4()}`);
    res.send("server running")
});
// app.get('/:room' , (req,res)=>{
//     res.render('index' , {RoomId:req.params.room});
// });
io.on("connection" , (socket)=>{
    console.log("connection made id : "+socket.id)
    socket.on('newUser' , (id , room)=>{
        socket.join(room);
        socket.to(room).emit('userJoined' , id);
        console.log(id,room)
        socket.on('disconnect' , ()=>{
            socket.to(room).emit('userDisconnect' , id);
        })
         socket.on('newMessage',data=>{
             console.log("new message ",data.messageText)
            socket.to(room).emit('message',data)
        })
    })
   
    
})
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})


