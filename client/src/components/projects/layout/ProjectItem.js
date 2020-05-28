import React from "react";
import { Link } from "react-router-dom";

const ProjectItem = ({ project }) => {
  return (
    <div class="profile__yourProjects--projects-projectItem">
      <span>
        <Link to="#!">{project.projectName}</Link>
      </span>
    </div>
  );
};

export default ProjectItem;
