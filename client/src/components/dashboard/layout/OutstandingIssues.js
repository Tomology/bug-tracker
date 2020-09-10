import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function OutstandingIssues({ outstandingIssues }) {
  const todayDate = Date.now();
  const osIssuesJSX = outstandingIssues.map((issue) => {
    return (
      <tr className="dashboard__issues--rows">
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
      <tr className="dashboard__issues--headings">
        <th>Project Name</th>
        <th>Issue Name</th>
        <th>Status</th>
        <th>Due Date</th>
      </tr>
      {outstandingIssues.length > 0 ? (
        osIssuesJSX
      ) : (
        <tr className="dashboard__issues--nil">
          <td colspan="4">No issues have been assigned to you.</td>
        </tr>
      )}
    </table>
  );
}

OutstandingIssues.propTypes = {};

export default OutstandingIssues;
