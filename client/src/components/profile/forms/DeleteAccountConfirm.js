import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../../actions/alert";
import { deleteAccount } from "../../../actions/profile";

function DeleteAccountConfirm({
  deleteEmail,
  setDeleteEmail,
  email,
  user,
  toggleConfirmDelete,
  setAlert,
  deleteAccount,
  history,
}) {
  const onChange = (e) =>
    setDeleteEmail({ ...deleteEmail, email: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email !== user.email) {
      setAlert("Email doesn't match");
    } else {
      deleteAccount(user._id, history);
    }
  };

  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div
          className="popup__close"
          onClick={() => toggleConfirmDelete(false)}
        >
          &times;
        </div>
        <span className="deleteWarning__message">
          Are you sure you want to delete your account? <br />
          You will permenantly lose all your contacts, teams and projects.
        </span>
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type="email"
            className="deleteWarning__inputConfirm"
            placeholder="Confirm Email"
            onChange={(e) => onChange(e)}
          />
          <div className="deleteWarning__buttons">
            <button
              className="btn btn-form btn-cancel"
              onClick={() => toggleConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              disabled={email !== user.email}
              className="btn btn-form btn-danger"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

DeleteAccountConfirm.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  deleteEmail: PropTypes.string.isRequired,
  setDeleteEmail: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  toggleConfirmDelete: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { setAlert, deleteAccount })(DeleteAccountConfirm);
