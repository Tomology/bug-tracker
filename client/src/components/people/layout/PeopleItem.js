import React from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";

const PeopleItem = ({ person }) => {
  return (
    <Link
      to={`/people/${person.user._id}`}
      className="people__people--peopleItem"
    >
      <Avatar
        name={`${person.user.firstName} ${person.user.lastName}`}
        round={true}
        size="8rem"
        className="people__people--peopleItem-avatar"
      ></Avatar>
      <span className="people__people--peopleItem-name">{`${person.user.firstName} ${person.user.lastName}`}</span>
    </Link>
  );
};

export default PeopleItem;
