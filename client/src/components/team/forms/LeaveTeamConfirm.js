import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveTeam } from "../../../actions/team";
import { withRouter } from "react-router-dom";

function LeaveTeamConfirm({ leaveTeamToggle, leaveTeam, history, team }) {
  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div className="popup__close" onClick={() => leaveTeamToggle(false)}>
          &times;
        </div>
        <span className="deleteWarning__message">
          Are you sure you want to remove yourself from this team?
        </span>
        <div className="deleteWarning__buttons">
          <button
            className="btn btn-form btn-cancel"
            onClick={() => leaveTeamToggle(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-form btn-danger"
            onClick={() =>
              leaveTeam(
                team._id,
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

LeaveTeamConfirm.propTypes = {
  leaveTeam: PropTypes.func.isRequired,
};

export default connect(null, { leaveTeam })(withRouter(LeaveTeamConfirm));
