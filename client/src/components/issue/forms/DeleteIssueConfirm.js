import React from "react";
import { connect } from "react-redux";
import { deleteIssue } from "../../../actions/project";
import PropTypes from "prop-types";

function DeleteIssueConfirm({
  deleteIssue,
  params,
  selectedIssue,
  setSelectedIssue,
  displayDeleteIssueToggle,
}) {
  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div
          className="popup__close"
          onClick={() => displayDeleteIssueToggle(false)}
        >
          &times;
        </div>
        <span className="deleteWarning__message">
          Are you sure you want to permanently delete this issue? <br />
          This action is irreversible!
        </span>
        <div className="deleteWarning__buttons">
          <button
            className="btn btn-form btn-cancel"
            onClick={() => displayDeleteIssueToggle(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-form btn-danger"
            onClick={() => {
              deleteIssue(params, selectedIssue._id);
              setSelectedIssue({
                _id: "",
                progress: {},
                assignee: [],
                date: "",
                comments: [],
                issueType: "",
                issueName: "",
                issueNumber: "",
                summary: "",
                description: "",
                priority: "",
                name: "",
                user: "",
                dueDate: "",
              });
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteIssueConfirm.propTypes = {
  deleteIssue: PropTypes.func.isRequired,
};

export default connect(null, { deleteIssue })(DeleteIssueConfirm);
