import React from "react";
import PropTypes from "prop-types";
import ProjectItem from "../../projects/layout/ProjectItem";

function TeamMain({ team: { projects } }) {
  const teamProjects = projects.map((project) => (
    <ProjectItem project={project} key={project._id} />
  ));

  return (
    <div className="team__main">
      <div className="profile__yourProjects">
        <h3>Worked On</h3>
        <div className="profile__yourProjects--projects">{teamProjects}</div>
      </div>
    </div>
  );
}

TeamMain.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamMain;
