import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProjectItem = ({ project }) => {
  return (
    <div className="profile__yourProjects--projects-projectItem">
      <span>
        <Link to={`/projects/${project._id}`}>{project.projectName}</Link>
      </span>
    </div>
  );
};

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectItem;
