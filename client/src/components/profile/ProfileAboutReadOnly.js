import React from "react";

const ProfileAboutReadOnly = ({ profile: { user } }) => {
  return (
    <div className="profileContact">
      <div className="profileEmail">
        <i className="far fa-envelope"></i>
        {`  `}
        <span>{user.email}</span>
      </div>
    </div>
  );
};

export default ProfileAboutReadOnly;
