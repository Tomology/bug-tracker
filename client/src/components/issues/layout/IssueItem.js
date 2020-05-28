import React, { useState } from "react";

function IssueItem({ issue, projectKey, selectedIssue, setSelectedIssue }) {
  const bgColor = (id) => {
    if (selectedIssue._id === id) {
      return "blue";
    }
    return "";
  };

  return (
    <a
      className="project__side--issuesList-item"
      style={{ backgroundColor: bgColor(issue._id) }}
      onClick={() => {
        setSelectedIssue({
          _id: issue._id,
          progress: issue.progress,
          assignee: issue.assignee ? issue.assignee : [],
          date: issue.date,
          comments: issue.comments,
          issueType: issue.issueType,
          issueName: issue.issueName,
          issueNumber: issue.issueNumber,
          summary: issue.summary,
          description: issue.description,
          priority: issue.priority,
          name: issue.name,
          user: issue.user,
          dueDate: issue.dueDate,
        });
      }}
    >
      <span>
        {issue.issueName} {`${projectKey}-${issue.issueNumber}`}
      </span>
    </a>
  );
}

export default IssueItem;
