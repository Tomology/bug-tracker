import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { deleteProject } from "../../../actions/project";

function DeleteProjectConfirm({
  deleteProject,
  history,
  params,
  displayDeleteWarningToggle,
}) {
  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div
          className="popup__close"
          onClick={() => displayDeleteWarningToggle(false)}
        >
          &times;
        </div>
        <span className="deleteWarning__message">
          Are you sure you want to permanently delete this project? <br />
          This action is irreversible!
        </span>
        <div className="deleteWarning__buttons">
          <button
            className="btn btn-form btn-cancel"
            onClick={() => displayDeleteWarningToggle(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-form btn-danger"
            onClick={() => deleteProject(params, history)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteProjectConfirm.propTypes = {
  deleteProject: PropTypes.func.isRequired,
};

export default connect(null, { deleteProject })(
  withRouter(DeleteProjectConfirm)
);
