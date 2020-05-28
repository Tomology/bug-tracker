import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeContact } from "../../../actions/people";

function RemoveUserConfirm({
  removeContact,
  history,
  params,
  toggleRemoveUser,
  hasMutualTeam,
}) {
  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div className="popup__close" onClick={() => toggleRemoveUser(false)}>
          &times;
        </div>
        {hasMutualTeam ? (
          <span className="deleteWarning__message">
            You cannot remove a contact with whom you share a team.
          </span>
        ) : (
          <span className="deleteWarning__message">
            Are you sure you want to remove user from contacts?
          </span>
        )}
        <div className="deleteWarning__buttons">
          <button
            className="btn btn-form btn-cancel"
            onClick={() => toggleRemoveUser(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-form btn-danger"
            disabled={hasMutualTeam}
            onClick={() => removeContact(params, history)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

RemoveUserConfirm.propTypes = {
  removeContact: PropTypes.func.isRequired,
};

export default connect(null, { removeContact })(RemoveUserConfirm);
