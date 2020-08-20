var express=require('express');
var http=require('http')
var app=express();
var cors=require('cors');
// const { v4: uuidV4 } = require('uuid')

var server=http.createServer(app)
var io=require('socket.io')(server)

app.use(cors())
app.get('/api',(req,res)=>{
    res.send('hi')
})

io.on('connection',socket=>{
    const { id } = socket.client;
    console.log(`User connected: ${id}`);

    socket.on('stream',stream=>{
        console.log("stream" ,stream)
        socket.emit("stream",stream)
        
        // socket.broadcast.emit("stream",stream)
    })
    socket.on('sendmessage',data=>{
        console.log(data)

        io.emit("message",data)
    })
    socket.on('disconnect',()=>{
        console.log('disconnected')
    })
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build")); // serve the static react app
    app.get(/^\/(?!api).*/, (req, res) => {
      // don't serve api routes to react app
      res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
    });
    console.log("Serving React App...");
  }

server.listen(process.env.PORT||5000);