import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editTeam } from "../../../actions/team";

function EditTeamForm({ editTeamToggle, team, loading, editTeam }) {
  const [formData, setFormData] = useState({
    teamName: "",
    teamDescription: "",
  });

  const { teamName, teamDescription } = formData;

  useEffect(() => {
    setFormData({
      teamName: loading || !team.teamName ? "" : team.teamName,
      teamDescription:
        loading || !team.teamDescription ? "" : team.teamDescription,
    });
  }, [loading, team.teamName, team.teamDescription]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    editTeam(formData, team._id);
    editTeamToggle(false);
  };
  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Edit Team</h3>
        <div className="popup__close" onClick={() => editTeamToggle(false)}>
          &times;
        </div>
        <form className="popup__form" onSubmit={(e) => onSubmit(e)}>
          <label htmlFor="teamName">
            Team Name <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            name="teamName"
            id="teamName"
            maxLength="50"
            value={teamName}
            className="form__input"
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="teamDescription">Team Description</label>
          <textarea
            name="teamDescription"
            id="teamDescription"
            className="form__input"
            maxLength="5000"
            value={teamDescription}
            onChange={(e) => onChange(e)}
          />
          <div className="popup__form--buttons">
            <button
              onClick={() => editTeamToggle(false)}
              className="btn btn-cancel btn-form popup__form--cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!teamName.length > 0}
              className="btn btn-green btn-form popup__form--create"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditTeamForm.propTypes = {
  editTeam: PropTypes.func.isRequired,
  editTeamToggle: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(null, { editTeam })(EditTeamForm);
