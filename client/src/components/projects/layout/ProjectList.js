import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";

function ProjectList({ projects, searchTerm }) {
  const projectsFiltered = projects
    .filter((project) => {
      if (searchTerm === "") {
        return project;
      } else if (
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${project.user.firstName} ${project.user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return project;
      }
    })
    .map((project) => {
      return (
        <tr className="projects__list--projectItem" key={project._id}>
          <td className="projects__list--projectItem-projectName">
            <Link to={`/projects/${project._id}`}>
              <span>{project.projectName}</span>
            </Link>
          </td>
          <td className="projects__list--projectItem-key">
            <Link to={`/projects/${project._id}`}>{project.key}</Link>
          </td>
          <td className="projects__list--projectItem-lead">
            <Link to={`/people/${project.user._id}`}>
              <Avatar
                name={`${project.user.firstName} ${project.user.lastName}`}
                round={true}
                size="2rem"
              />
              <span className="projects__list--projectItem-lead-name">{`${project.user.firstName} ${project.user.lastName}`}</span>
            </Link>
          </td>
        </tr>
      );
    });

  return (
    <table className="projects__list">
      <tr className="projects__list--headings">
        <th>Name</th>
        <th>Key</th>
        <th>Lead</th>
      </tr>
      {projectsFiltered}
    </table>
  );
}

export default ProjectList;
