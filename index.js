import { Socket } from "dgram";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import cors from 'cors';


const app = express();
const port = 7000;

const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
   cors: {
       origin: "*", // Allow all origins
       methods: ["GET", "POST"]
   }
});

app.use(express.static(path.resolve('./public')));
app.get('/', (req, res) => {
   return res.sendFile( '/index.html');
});

let socketConnected = new Set();

io.on('connection' ,  onConnected );

function onConnected (socket) {
 console.log(`Socket Connected ` , socket.id);
 socketConnected.add(socket.id);


 io.emit('clients-total' , socketConnected.size);

 socket.on('disconnect' , () => {
  console.log(`Socket Disconnected ${socket.id}`);
  socketConnected.delete(socket.id);
  io.emit('clients-total' , socketConnected.size);
 })

 socket.on('message' , (data) => {
    socket.broadcast.emit('chat-message' , data);
 });

 socket.on('feedback' , (data) => {
   socket.broadcast.emit('feedback'  , data);
 })

}




 server.listen(port , () => {
     console.log(`Server running at http://localhost:${port}`);
 });

