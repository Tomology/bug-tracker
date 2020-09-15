import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { removeSharedProject } from "../../../actions/project";

function RemoveFromProjectsConfirm({
  removeProjectToggle,
  removeSharedProject,
  params,
  history,
}) {
  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div
          className="popup__close"
          onClick={() => removeProjectToggle(false)}
        >
          &times;
        </div>
        <span className="deleteWarning__message">
          This project has been shared with you. Are you sure you want to remove
          it from your projects?
        </span>
        <div className="deleteWarning__buttons">
          <button
            className="btn btn-form btn-cancel"
            onClick={() => removeProjectToggle(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-form btn-danger"
            onClick={() =>
              removeSharedProject(
                params,
                localStorage.getItem("currentUserId"),
                history
              )
            }
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

RemoveFromProjectsConfirm.propTypes = {
  removeSharedProject: PropTypes.func.isRequired,
  removeProjectToggle: PropTypes.func.isRequired,
  params: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { removeSharedProject })(
  withRouter(RemoveFromProjectsConfirm)
);
