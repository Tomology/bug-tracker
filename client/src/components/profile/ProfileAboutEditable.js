import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAboutEditable = ({
  profile: { jobTitle, department, organization, location },
}) => {
  return (
    <Fragment>
      <div className="profileAbout">
        <div className="jobTitle">
          <i className="fas fa-briefcase"></i>
          {`  `}
          <span>{jobTitle}</span>
        </div>
        <div className="department">
          <i className="fas fa-project-diagram"></i>
          {`  `}
          <span>{department}</span>
        </div>
        <div className="organization">
          <i className="far fa-building"></i>
          {`  `}
          <span>{organization}</span>
        </div>
        <div className="location">
          <i className="fas fa-globe-americas"></i>
          {`  `} <span>{location}</span>
        </div>
      </div>
    </Fragment>
  );
};

ProfileAboutEditable.propTypes = {};

export default ProfileAboutEditable;
