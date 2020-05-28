import React, { Fragment, useEffect } from "react";
import IssueSide from "./layout/IssueSide";
import IssueMain from "./layout/IssueMain";

function Issue({
  project,
  selectedIssue,
  setSelectedIssue,
  params,
  refreshIssue,
}) {
  return (
    <Fragment>
      {selectedIssue._id !== "" && (
        <Fragment>
          <IssueMain
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
            project={project}
            params={params}
            refreshIssue={refreshIssue}
          />
          <IssueSide
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
            params={params}
            project={project}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default Issue;
