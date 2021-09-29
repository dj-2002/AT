import react, { Component } from "react";
import { useParams } from "react-router";
import Webcam from "react-webcam";
import "./HomePage.scss";
import shortid from "shortid";
import {useHistory} from "react-router-dom";


const HomePage = () => {
  const {id} = useParams();
  
  const history = useHistory();
  const startCall = ()=> {
      const Shortid = shortid.generate();
      history.push(`${Shortid}#admin`);
  }

  return (
    <div className="main">
      <script
        src="https://kit.fontawesome.com/436f8c3672.js"
        crossorigin="anonymous"
      ></script>
      <div className="webcam">
        <Webcam />
      </div>
      <div className="allbtn">
        <div className="btn">
          <button className="btnA" onClick={startCall}
          >New Meeting </button>
        </div>
        <div className="input1">
          <input
            type="text"
            placeholder="Enter a code link"
            className="input"
          ></input>
        </div>
        <div className="btn2">
          <button className="btnB">Join  </button>
        </div>
      </div>
      <button className="circle"></button>
    </div>
  );
};
export default HomePage;
