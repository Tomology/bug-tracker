import React from "react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import gradient from "random-gradient";

const TeamItem = ({ team }) => {
  const bgGradient = { background: gradient(team._id) };

  return (
    <Link to={`/people/team/${team._id}`} className="people__teams--teamItem">
      <div
        className="people__teams--teamItem-teamAvatar"
        style={bgGradient}
      ></div>
      <span className="people__teams--teamItem-teamName">{team.teamName}</span>
      <Avatar
        name={`${team.creator.firstName} ${team.creator.lastName}`}
        round={true}
        size="3rem"
        className="people__teams--teamItem-teamCreator"
      ></Avatar>
    </Link>
  );
};

export default TeamItem;
