import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { deleteTeam } from "../../../actions/team";

function DeleteTeamConfirm({
  deleteTeam,
  deleteTeamConfirmToggle,
  team,
  history,
}) {
  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div className="popup__close">&times;</div>
        <span className="deleteWarning__message">
          Are you sure you want to permanently delete this team? <br />
          This action is irreversible!
        </span>
        <div className="deleteWarning__buttons">
          <button
            className="btn btn-form btn-cancel"
            onClick={() => deleteTeamConfirmToggle(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-form btn-danger"
            onClick={() => deleteTeam(team._id, history)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteTeamConfirm.propTypes = {
  deleteTeam: PropTypes.func.isRequired,
  deleteTeamConfirmToggle: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { deleteTeam })(withRouter(DeleteTeamConfirm));
