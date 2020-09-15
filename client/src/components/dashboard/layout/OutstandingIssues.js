import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function OutstandingIssues({ outstandingIssues }) {
  const osIssuesJSX = outstandingIssues.map((issue) => {
    return (
      <tr key={issue.issueId} className="dashboard__issues--rows">
        <td>
          <Link to={`/projects/${issue.projectId}`}>{issue.projectName}</Link>
        </td>
        <td>{issue.issueName}</td>
        <td>{issue.progress}</td>
        <td>
          {issue.dueDate ? (
            <Moment format="DD MMMM YYYY">{issue.dueDate}</Moment>
          ) : (
            "No Due Date"
          )}
        </td>
      </tr>
    );
  });
  return (
    <table className="dashboard__issues">
      <thead>
        <tr className="dashboard__issues--headings">
          <th>Project Name</th>
          <th>Issue Name</th>
          <th>Status</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {outstandingIssues.length > 0 ? (
          osIssuesJSX
        ) : (
          <tr className="dashboard__issues--nil">
            <td colSpan="4">No issues have been assigned to you.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

OutstandingIssues.propTypes = {
  outstandingIssues: PropTypes.array.isRequired,
};

export default OutstandingIssues;
