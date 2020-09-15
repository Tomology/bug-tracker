import React, { Fragment } from "react";
import PropTypes from "prop-types";
import IssueSide from "./layout/IssueSide";
import IssueMain from "./layout/IssueMain";

function Issue({ project, selectedIssue, setSelectedIssue, params }) {
  return (
    <Fragment>
      {selectedIssue._id !== "" && (
        <Fragment>
          <IssueMain
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
            project={project}
            params={params}
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

Issue.propTypes = {
  project: PropTypes.object.isRequired,
  selectedIssue: PropTypes.object.isRequired,
  setSelectedIssue: PropTypes.func.isRequired,
  params: PropTypes.string.isRequired,
};

export default Issue;
