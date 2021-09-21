import react from "react";
import {
  FaUserFriends,
  FaUserCircle,
} from "react-icons/fa";
import {BiComment} from "react-icons/bi";
import './CallPageHeader.scss'



const CallPageHeader = () => {
  return (
    <div className="CPH">
      <div className="header-item icon-block">
        <FaUserFriends className="icon1" />
      </div>
      &nbsp;
      <div className="header-item icon-block">
        <BiComment className="icon1" />
        <span className="alert-circle-icon"></span>
      </div>
      &nbsp;
      <div className="header-item icon-block">
        <FaUserCircle className="icon1" />
      </div>
    </div>
  );
};

export default CallPageHeader;
