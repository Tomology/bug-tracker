import React, { Fragment, useState } from "react";
import IssuesList from "./layout/IssuesList";

function Issues({ project: { issues, key }, setSelectedIssue, searchTerm }) {
  return (
    <Fragment>
      <IssuesList
        issues={issues}
        projectKey={key}
        setSelectedIssue={setSelectedIssue}
        searchTerm={searchTerm}
      />
    </Fragment>
  );
}

export default Issues;
