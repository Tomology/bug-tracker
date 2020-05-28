import React from "react";
import PropTypes from "prop-types";
import IssueComments from "./IssueComments";
import Moment from "react-moment";

function IssueMain({
  selectedIssue: {
    _id,
    issueName,
    issueType,
    summary,
    description,
    date,
    comments,
  },
  selectedIssue,
  setSelectedIssue,
  project,
  params,
  refreshIssue,
}) {
  return (
    <div className="issue__main">
      <h2 className="issue__main--issueName">{issueName}</h2>
      <span className="issue__main--key">Project key - #</span>
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
        refreshIssue={refreshIssue}
      />
    </div>
  );
}

IssueMain.propTypes = {};

export default IssueMain;
