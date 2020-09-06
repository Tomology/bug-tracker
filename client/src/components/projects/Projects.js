import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProjects } from "../../actions/project";
import { getPeople } from "../../actions/people";
import { getTeams } from "../../actions/team";
import ProjectList from "./layout/ProjectList";
import Spinner from "../layout/Spinner";
import CreateProjectForm from "./forms/CreateProjectForm";

function Projects({
  project: { projects, project, loading },
  people,
  team: { teams },
  getProjects,
  getPeople,
  getTeams,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [createProject, createProjectToggle] = useState(false);

  useEffect(() => {
    getProjects();
    getPeople();
    getTeams();
  }, [getProjects, getPeople, getTeams]);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Fragment>
      {!projects ? (
        <Spinner />
      ) : (
        <section className="projects">
          <h1>Projects</h1>
          <button
            className="btn btn-green projects__button"
            onClick={() => createProjectToggle(true)}
          >
            Create Project
          </button>
          {createProject && (
            <CreateProjectForm
              people={people}
              teams={teams}
              createProjectToggle={createProjectToggle}
            />
          )}
          <div className="projects__filter">
            <input
              type="text"
              className="form__input"
              value={searchTerm}
              onChange={(e) => onChange(e)}
            />
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="search"
              className="svg-inline--fa fa-search fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
              ></path>
            </svg>
          </div>
          <ProjectList projects={projects} searchTerm={searchTerm} />
        </section>
      )}
    </Fragment>
  );
}

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  getPeople: PropTypes.func.isRequired,
  getTeams: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  people: state.people,
  team: state.team,
});

export default connect(mapStateToProps, { getProjects, getPeople, getTeams })(
  Projects
);
