import React from "react";
import "./VideoStream.scss";
import { useParams, useHistory } from "react-router-dom";
import { getRequest, postRequest } from "../Utils/apiRequests";
import { useState, useEffect } from "react";
import CallPageHeader from "../Ui/CallPageHeader/CallPageHeader";
import CallPageFooter from "../Ui/CallPageFooter/CallPageFooter";
import Peer from "simple-peer";
import { BASE_URL, GET_CALL_ID, SAVE_CALL_ID } from "../Utils/apiEndPoints";
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_BASE_URL);
let peer = null;
const initialState = [];



const VideoStream = () => {
  let { id } = useParams();
  const yesAdmin = window.location.hash == "#admin" ? true : false;
  const url = `${window.location.origin}${window.location.pathname}`;
  const [isPresenting, setIsPresenting] = useState(false);
  const [screenCastStream, setScreenCastStream] = useState();
  const [messageAlert, setMessageAlert] = useState({});
  const [streamObj, setStreamObj] = useState();
  const [isAudio, setIsAudio] = useState(true);
  const history = useHistory();

  useEffect(() => {
    initWebRTC();
    socket.on("code", (data) => {
      if (data.url === url) {
        peer.signal(data.code);
      }
    });
  }, []);

  const getRecieverCode = async () => {
    const response = await getRequest(`${BASE_URL}${GET_CALL_ID}/${id}`);
    if (response.code) {
      peer.signal(response.code);
    }
  };

  const initWebRTC = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        peer = new Peer({
          initiator: yesAdmin,
          trickle: false,
          stream: stream,
        });
        if (!yesAdmin) {
          getRecieverCode();
        }

        peer.on("signal", async (data) => {
          if (yesAdmin) {
            let payload = {
              id,
              signalData: data,
            };
            await postRequest(`${BASE_URL}${SAVE_CALL_ID}`, payload);
          } else {
            socket.emit("code", { code: data, url }, (cbData) => {
              console.log("code sent");
            });
          }
        });
        peer.on("stream", (stream) => {
          // got remote video stream, now let's show it in a video tag
          let video = document.querySelector("video");

          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            video.src = window.URL.createObjectURL(stream); // for older browsers
          }

          video.play();
        });
      });
  };

  const toggleAudio = (value) => {
    streamObj.getAudioTracks()[0].enabled = value;
    setIsAudio(value);
  };

  const disconnectCall = () => {
    peer.destroy();
    history.push("/");
    window.location.reload();
  };
  return (
    <div className="stream">
      <video className="video-container" src="" controls></video>
      <CallPageHeader />
      <CallPageFooter
        isAudio={isAudio}
        toggleAudio={toggleAudio}
        disconnectCall={disconnectCall}
      />
    </div>
  );
};

export default VideoStream;
