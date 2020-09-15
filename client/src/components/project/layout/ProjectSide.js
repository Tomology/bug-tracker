import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import ShareProjectForm from "../forms/ShareProjectForm";
import EditProjectForm from "../forms/EditProjectForm";
import Issues from "../../issues/Issues";
import DeleteProjectConfirm from "../forms/DeleteProjectConfirm";
import ProjectSharedWith from "./ProjectSharedWith";
import RemoveFromProjectsConfirm from "../forms/RemoveFromProjectsConfirm";

function ProjectSide({
  project,
  people,
  teams,
  params,
  selectedIssue,
  setSelectedIssue,
  searchTerm,
}) {
  const [shareProject, shareProjectToggle] = useState(false);
  const [editProjectForm, editProjectFormToggle] = useState(false);
  const [removeProject, removeProjectToggle] = useState(false);
  const [displayDeleteWarning, displayDeleteWarningToggle] = useState(false);
  const [displaySharedWith, displaySharedWithToggle] = useState(false);

  const isCreator = project.user === localStorage.getItem("currentUserId");
  return (
    <div className="project__side">
      <Issues
        project={project}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
        searchTerm={searchTerm}
        teams={teams}
      />
      {isCreator ? (
        <Fragment>
          <div className="project__side--button-special">
            <button
              className="btn btn-green share"
              onClick={() => shareProjectToggle(true)}
            >
              Share Project
            </button>
            <button
              className="btn btn-grey more"
              onClick={() => displaySharedWithToggle(true)}
            >
              &hellip;
            </button>
          </div>
          {shareProject && (
            <ShareProjectForm
              shareProjectToggle={shareProjectToggle}
              people={people}
              teams={teams}
              params={params}
            />
          )}
          {displaySharedWith && (
            <ProjectSharedWith
              project={project}
              params={params}
              displaySharedWithToggle={displaySharedWithToggle}
            />
          )}
          <button
            className="btn btn-grey project__side--button"
            onClick={() => editProjectFormToggle(true)}
          >
            Edit Project
          </button>
          {editProjectForm && (
            <EditProjectForm
              project={project}
              params={params}
              editProjectFormToggle={editProjectFormToggle}
            />
          )}
          <button
            className="btn btn-grey project__side--button"
            onClick={() => displayDeleteWarningToggle(true)}
          >
            Delete Project
          </button>
          {displayDeleteWarning && (
            <DeleteProjectConfirm
              params={params}
              displayDeleteWarningToggle={displayDeleteWarningToggle}
            />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <button
            className="btn btn-grey project__side--button"
            onClick={() => removeProjectToggle(true)}
          >
            Remove From Your Projects
          </button>
          {removeProject && (
            <RemoveFromProjectsConfirm
              removeProjectToggle={removeProjectToggle}
              params={params}
            />
          )}
        </Fragment>
      )}
    </div>
  );
}

ProjectSide.propTypes = {
  project: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  params: PropTypes.string.isRequired,
  selectedIssue: PropTypes.object.isRequired,
  setSelectedIssue: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default ProjectSide;
