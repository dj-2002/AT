import React, { useRef } from "react";
import "./VideoStream.css";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import CallPageHeader from "../Ui/CallPageHeader/CallPageHeader";
import CallPageFooter from "../Ui/CallPageFooter/CallPageFooter";
import Peer from "peerjs";
import {io} from "socket.io-client";
import MessageBox from "../MessageBox/MessageBox";

const socket = io("http://localhost:4000");
let myStream
let myVideo = document.createElement('video')
myVideo.muted = true



const VideoStream = () => {

  let { id : ROOM_ID } = useParams();
  
  const [isAudio, setIsAudio] = useState(true);
  const [myId, setMyId] = useState("");
  // const [myStream,setMyStream] = useState();

  // my useStates work
  

  let peer = new Peer()
  const peerConnections = {}
  
  const videoGrid = useRef();
  // const myVideo = useRef()

  const history =useHistory()


  useEffect(() => {
    initWebRTC();
    // console.log("use effect")
  }, []);

  const initWebRTC = () => {
    navigator.mediaDevices.getUserMedia({video: true,audio: true})
      .then((stream) => {
        myStream = (stream)
        // setMyStream(stream)
        // console.log("mystream : ",myStream,"stream :",stream)
        myVideo.srcObject = stream

        addVideo(myVideo, stream);
        peer.on('call' , call=>{
          // console.log('on call ',call)
          call.answer(stream);
          const vid = document.createElement('video');
          call.on('stream' , userStream=>{
            addVideo(vid , userStream);
          })
          call.on('error' , (err)=>{
            alert(err)
          })
          call.on("close", () => {
              vid.remove();
          })
          peerConnections[call.peer] = call;
        })
      
      }).catch(err=>{
          alert(err.message)
      });

      
      peer.on('error' , (err)=>{
        alert(err.type);
      });
      socket.on('userJoined' , id=>{
        // console.log("new user joined : ",id,myStream)
        const call  = peer.call(id , myStream);
        
        // console.log("call : ",call)
        const vid = document.createElement('video');
        call.on('error' , (err)=>{
          alert(err);
        })
        call.on('stream' , userStream=>{
          addVideo(vid , userStream);
        })
        call.on('close' , ()=>{
          vid.remove();
          // console.log("user disconnect")
        })
        peerConnections[id] = call;
      })
      socket.on('userDisconnect' , id=>{
        if(peerConnections[id]){
          peerConnections[id].close();
        }
      })
      peer.on('open' , (id)=>{
        setMyId(id);
        socket.emit("newUser" , id , ROOM_ID);
      })
  };

  function addVideo(video , stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.current.append(video);
  }

  const toggleAudio = (value) => {
    // console.log("toggleAudio with value : ",value,myStream)
    // streamObj.getAudioTracks()[0].enabled = value;
    myStream.getAudioTracks()[0].enabled = value;
    setIsAudio(value);
  };

  const disconnectCall = () => {
    // console.log("disconnect call called :",window.location.hostname)
 
    history.push("/");
    window.location.reload();
  };

  const playStop = () => {
    let enabled = myStream.getVideoTracks()[0].enabled;
    // console.log('playstop ',enabled)
  
    if (enabled) 
    {
      myStream.getVideoTracks()[0].enabled = false;
      //  myStream.getVideoTracks()[0].stop();
    }else{
      myStream.getVideoTracks()[0].enabled = true;
      // myVideo.play();
    }
  }
  
  return (
    <div className="main-container">
        <div className="video-container">
          <div className="video-player" ref={videoGrid}>
            {/* <video ref={myVideo} playsInline muted></video> */}
          </div>
          <div className="call-page-header">
            <CallPageHeader/>
          </div>
          <div className="call-page-footer">
            <CallPageFooter
              isAudio={isAudio}
              toggleAudio={toggleAudio}
              disconnectCall={disconnectCall}
              playStop = {playStop}
            />
          </div>
        </div>
        <div className="message-box">
          <MessageBox
            socket = {socket}
          ></MessageBox>
          </div>    
    </div>
  );
};

export default VideoStream;
