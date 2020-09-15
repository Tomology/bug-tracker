import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CreateIssueForm from "../forms/CreateIssueForm";

function ProjectTop({ project, params, setSearchTerm }) {
  const [displayCreateIssue, displayCreateIssueToggle] = useState(false);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="project__top">
      <div className="project__top--navLinks">
        <Link to={`/projects`}>Projects</Link>
        <span> / {project.projectName}</span>
      </div>
      {project.url && (
        <div className="project__top--projectUrl">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="globe"
            className="svg-inline--fa fa-globe fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <path
              fill="currentColor"
              d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"
            ></path>
          </svg>
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            Link to {project.projectName}
          </a>
        </div>
      )}
      <button
        className="btn btn-green project__top--createIssue"
        onClick={() => displayCreateIssueToggle(true)}
      >
        Create Issue
      </button>
      {displayCreateIssue && (
        <CreateIssueForm
          displayCreateIssueToggle={displayCreateIssueToggle}
          sharedWith={project.sharedWith}
          creatorId={project.user}
          creatorName={project.name}
          params={params}
        />
      )}
      <h1>Issues</h1>
      <div className="project__top--filter">
        <input
          type="text"
          className="form__input"
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
    </div>
  );
}

ProjectTop.propTypes = {
  project: PropTypes.object.isRequired,
  params: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default ProjectTop;
