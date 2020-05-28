import React from "react";
import ProjectItem from "../../projects/layout/ProjectItem";

function TeamMain({ team: { team, projects } }) {
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

export default TeamMain;
