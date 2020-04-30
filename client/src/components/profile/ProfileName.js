import React from "react";

const ProfileName = ({ profile: { user } }) => {
  return <h2>{`${user.firstName} ${user.lastName}`}</h2>;
};

export default ProfileName;
