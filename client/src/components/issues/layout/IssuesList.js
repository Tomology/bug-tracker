import React, { useState } from "react";
import PropTypes from "prop-types";
import IssueItem from "./IssueItem";
import Select from "react-select";
import { filterStyles } from "../../../utils/reactSelectStyles";

function IssuesList({
  issues,
  projectKey,
  selectedIssue,
  setSelectedIssue,
  searchTerm,
  teams,
}) {
  const [issueFilters, setIssueFilters] = useState("All");
  const teamIds = teams.map((team) => team._id.toString());

  const filterOptions = [
    { value: "All", label: "All" },
    { value: "Open", label: "Open" },
    { value: "Assigned To Me", label: "Assigned To Me" },
    { value: "Resolved", label: "Resolved" },
  ];
  const issuesList = issues.filter((issue) => {
    if (issueFilters === "All") {
      return issue;
    } else if (issueFilters === "Open") {
      if (issue.progress.progress === "Open") {
        return issue;
      }
    } else if (issueFilters === "Assigned To Me") {
      if (issue.assignee) {
        if (
          issue.assignee
            .map((assign) => assign._id.toString())
            .indexOf(localStorage.getItem("currentUserId")) !== -1 ||
          issue.assignee.filter((assign) => teamIds.indexOf(assign._id) !== -1)
            .length > 0
        ) {
          return issue;
        }
      }
    } else if (issueFilters === "Resolved") {
      if (issue.progress.progress === "Resolved") {
        return issue;
      }
    }
  });

  const issuesListSearchFilter = issuesList.filter((issue) => {
    if (searchTerm === "") {
      return issue;
    } else if (
      `${issue.issueName.toLowerCase()} ${issue.issueNumber}`.includes(
        searchTerm.toLowerCase()
      )
    ) {
      return issue;
    }
  });

  const issuesListMapped = issuesListSearchFilter.map((issue) => (
    <IssueItem
      issue={issue}
      projectKey={projectKey}
      key={issue._id}
      selectedIssue={selectedIssue}
      setSelectedIssue={setSelectedIssue}
    />
  ));

  return (
    <div className="project__side--issuesList">
      <Select
        styles={filterStyles}
        options={filterOptions}
        onChange={(filter) => setIssueFilters(filter.value)}
        placeholder={"Issue Filters"}
        className="project__side--selectFilter"
      />
      {issuesListMapped}
    </div>
  );
}

IssuesList.propTypes = {
  issues: PropTypes.array.isRequired,
  projectKey: PropTypes.string.isRequired,
  selectedIssue: PropTypes.object.isRequired,
  setSelectedIssue: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  teams: PropTypes.array.isRequired,
};

export default IssuesList;
