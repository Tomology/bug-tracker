import React from "react";
import PropTypes from "prop-types";
import IssueComments from "./IssueComments";
import Moment from "react-moment";

function IssueMain({
  selectedIssue: {
    _id,
    issueName,
    issueType,
    issueNumber,
    summary,
    description,
    date,
    comments,
  },
  selectedIssue,
  setSelectedIssue,
  project,
  params,
}) {
  return (
    <div className="issue__main">
      <h2 className="issue__main--issueName">{issueName}</h2>
      <span className="issue__main--key">
        {project.key}-{issueNumber}
      </span>
      <span className="issue__main--dateCreated">
        Created on <Moment format="DD MMMM YYYY">{date}</Moment>
      </span>
      <div className="issue__main--type">
        <span>Type</span>
        <p>{issueType}</p>
      </div>
      <div className="issue__main--summary">
        <span>Summary</span>
        <p>{summary}</p>
      </div>
      <div className="issue__main--description">
        <span>Description</span>
        <p>{description}</p>
      </div>
      <IssueComments
        comments={comments}
        issueId={_id}
        params={params}
        project={project}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
      />
    </div>
  );
}

IssueMain.propTypes = {
  selectedIssue: PropTypes.object.isRequired,
  setSelectedIssue: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  params: PropTypes.string.isRequired,
};

export default IssueMain;
