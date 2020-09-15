import React, { Fragment } from "react";
import PropTypes from "prop-types";
import IssuesList from "./layout/IssuesList";

function Issues({
  project: { issues, key },
  teams,
  selectedIssue,
  setSelectedIssue,
  searchTerm,
}) {
  return (
    <Fragment>
      <IssuesList
        issues={issues}
        projectKey={key}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
        searchTerm={searchTerm}
        teams={teams}
      />
    </Fragment>
  );
}

Issues.propTypes = {
  project: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  selectedIssue: PropTypes.object.isRequired,
  setSelectedIssue: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
};

export default Issues;
