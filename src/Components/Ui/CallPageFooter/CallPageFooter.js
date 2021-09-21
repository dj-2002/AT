import react from "react";
import { FaMicrophone, FaPhoneAlt, FaVideo,FaDesktop,FaMicrophoneSlash} from "react-icons/fa";
import "./CallPageFooter.scss";

const CallPageFooter = (isAudio, toggleAudio, disconnectCall) => {
  return (
    <div className="CPF">
      <div
        className={`Footer-item ${!isAudio ? "red-bg" : null}`}
        onClick={() => toggleAudio(!isAudio)}
      >
        <FaMicrophone
          className="icon1"
          icon={isAudio ? FaMicrophone : FaMicrophoneSlash}
        />
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div className="Footer-item" onClick={disconnectCall}>
        <FaPhoneAlt className="icon1 red" />
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div className="Footer-item">
        <FaVideo className="icon1" />
      </div>
      <div className="footer-item">
        <FaDesktop className="icon-main" />
      </div>
    </div>
  );
};

export default CallPageFooter;
