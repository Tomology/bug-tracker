import React, { Fragment, useState } from "react";
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

export default Issues;
