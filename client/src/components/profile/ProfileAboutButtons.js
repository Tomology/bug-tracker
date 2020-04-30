import React, { Fragment } from "react";

const ProfileAboutButtons = () => {
  return (
    <Fragment>
      <div className="profileEdit">
        <button>Edit Profile</button>
      </div>
      <div className="profileDelete">
        <button>Delete Account</button>
      </div>
    </Fragment>
  );
};

export default ProfileAboutButtons;
