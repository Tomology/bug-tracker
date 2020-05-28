import React, { Fragment } from "react";
import Avatar from "react-avatar";

const ProfileAboutHeader = ({ profile: { user } }) => {
  return (
    <Fragment>
      <div className="profile__about--header">
        <Avatar
          className="profile__about--header-avatar"
          name={`${user.firstName} ${user.lastName}`}
          round={true}
          size={80}
        />
        <h2 className="profile__about--header-name">{`${user.firstName} ${user.lastName}`}</h2>
      </div>
      <h3>About</h3>
    </Fragment>
  );
};

export default ProfileAboutHeader;
