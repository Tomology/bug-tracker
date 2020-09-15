import React, { Fragment, useState } from "react";
import ChangeStatusForm from "../forms/ChangeStatusForm";
import EditIssueForm from "../forms/EditIssueForm";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DeleteIssueConfirm from "../forms/DeleteIssueConfirm";
import Avatar from "react-avatar";
import Moment from "react-moment";

function IssueSide({ selectedIssue, setSelectedIssue, params, project }) {
  const [displayChangeStatus, displayChangeStatusToggle] = useState(false);
  const [displayEditIssue, displayEditIssueToggle] = useState(false);
  const [displayDeleteIssue, displayDeleteIssueToggle] = useState(false);

  const { progress, assignee, priority, name, user, dueDate } = selectedIssue;

  const isCreator =
    project.user === localStorage.getItem("currentUserId") ||
    user === localStorage.getItem("currentUserId");

  return (
    <div className="issue__side">
      <div className="issue__side--status">
        <span className="issue__side--heading">Status</span>
        <div className="issue__side--status-div">
          <span>{progress.progress}</span>
          <button
            className="btn btn-grey issue__side--status-button"
            onClick={() => displayChangeStatusToggle(true)}
          >
            Change Status
          </button>
          {progress.name && (
            <p className="issue__side--status-info">
              Status last changed by{" "}
              <Link to={`/people/${progress.user}`}>{progress.name}</Link> on{" "}
              <Moment format="DD MMMM YYYY, h:mm:ss a">{progress.date}</Moment>.
            </p>
          )}
        </div>
      </div>
      {displayChangeStatus && (
        <ChangeStatusForm
          displayChangeStatusToggle={displayChangeStatusToggle}
          selectedIssue={selectedIssue}
          params={params}
        />
      )}
      <div className="issue__side--assignee">
        <span className="issue__side--heading">Assignee(s)</span>
        {assignee ? (
          assignee.map((assignee) => (
            <div key={assignee._id} className="issue__side--assignee-item">
              <Avatar
                round={true}
                name={assignee.name}
                size="2.5rem"
                className="avatar"
              ></Avatar>
              <div className="name">{assignee.name}</div>
            </div>
          ))
        ) : (
          <div>Unassigned</div>
        )}
      </div>
      <div className="issue__side--reporter">
        <span className="issue__side--heading">Reporter</span>
        <Link to={`/people/${user}`} className="issue__side--reporter-item">
          <Avatar
            round={true}
            size="2.5rem"
            name={name}
            className="avatar"
          ></Avatar>
          <span className="name">{name}</span>
        </Link>
      </div>
      <div className="issue__side--priority">
        <span className="issue__side--heading">Priority</span>
        <span>{priority}</span>
      </div>
      <div className="issue__side--dueDate">
        <span className="issue__side--heading">Due Date</span>
        {dueDate ? (
          <span>
            <Moment format="DD MMMM YYYY">{dueDate}</Moment>
          </span>
        ) : (
          <span>No due date</span>
        )}
      </div>
      <div className="issue__side--buttons">
        {user === localStorage.getItem("currentUserId") && (
          <Fragment>
            <button
              className="btn btn-grey issue__side--buttons-button"
              onClick={() => displayEditIssueToggle(true)}
            >
              Edit Issue
            </button>
            {displayEditIssue && (
              <EditIssueForm
                selectedIssue={selectedIssue}
                displayEditIssueToggle={displayEditIssueToggle}
                project={project}
                params={params}
              />
            )}
          </Fragment>
        )}
        {isCreator && (
          <Fragment>
            <button
              className="btn btn-grey issue__side--buttons-button"
              onClick={() => displayDeleteIssueToggle(true)}
            >
              Delete Issue
            </button>
            {displayDeleteIssue && (
              <DeleteIssueConfirm
                params={params}
                selectedIssue={selectedIssue}
                setSelectedIssue={setSelectedIssue}
                displayDeleteIssueToggle={displayDeleteIssueToggle}
              />
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}

IssueSide.propTypes = {
  selectedIssue: PropTypes.object.isRequired,
};

export default IssueSide;
