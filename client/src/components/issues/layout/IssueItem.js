import React from "react";

function IssueItem({ issue, projectKey, setSelectedIssue }) {
  return (
    <a
      className="project__side--issuesList-item"
      onClick={() =>
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
        })
      }
    >
      <span>
        {issue.issueName} {`${projectKey}-${issue.issueNumber}`}
      </span>
    </a>
  );
}

export default IssueItem;
