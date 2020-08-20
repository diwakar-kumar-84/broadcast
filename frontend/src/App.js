import React, { useEffect,useState } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIO from 'socket.io-client'
var ENDPOINT='http://broadcast84.herokuapp.com'
const socket=socketIO.connect(ENDPOINT)

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [streamvideosrc,setstreamvideosrc]=useState()
 
  useEffect(()=>{
    socket.on("message", message => {
      console.log(message)
      setMessages([...messages, message]);
      });
    socket.on('stream',data=>{
     console.log(data)
    //  setstreamvideosrc(data)
   
})
     
  },[message])

 var streamCamVideo=()=> {
    var constraints = { audio: true, video: { width: 500, height: 300 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(mediaStream) {
        var video = document.querySelector("video");
          
        // socket.emit('stream',mediaStream)

        video.srcObject = mediaStream;
              
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.
  }

  // function vidOff(){
  //   var constraints = { audio: false, video: { width: 700, height: 500 } };
  //   navigator.mediaDevices
  //     .getUserMedia(constraints)
  //     .then(function(mediaStream) {
  //       var video = document.querySelector("video");

  //       video.srcObject = "";
  //       video.onloadedmetadata = function(e) {
  //         video.pause();

  //       };
  //     })
  //     .catch(function(err) {
  //       console.log(err.name + ": " + err.message);
  //     }); // always check for errors at the end.
  // }

  var onMessageSubmit = () => {
    socket.emit("sendmessage", message);
    setMessage('')
  };
  return (
    <div className="container">
       <div className="row">
<div className="col-8">

</div>
      <div style={{height:'300',width:'500'}}>
       <video  src={streamvideosrc} autoPlay={"true"} style={{width:'500',height:'300'}} />
       <button onClick={()=>streamCamVideo()} className="form-control">Start streaming</button>
      </div>

    <div className="row fixed-bottom">
      <div className="col-10">
       <input className="form-control mb-3 ml-3" onChange={e=>setMessage(e.target.value)} 
       value={message}
        placeholder="Enter Message Here" onKeyPress={e => (e.key === "Enter" ? onMessageSubmit(e) : null)}/>
      </div>
      <div className="col-2">
       <button className="form-control" onClick={()=>onMessageSubmit()} >Send</button>
      </div>
    </div>
      
       {/* <button onClick={vidOff()}>off</button> */}
       <div className="col-4" style={{overflow:'auto',height:'300px'}}>
       {messages.map(i=>{return(
         <div className="alert alert-secondary" >
         <p>{i}</p>
         </div>
       )})}
       </div>
       </div>

    </div>
  );
}

export default App;
