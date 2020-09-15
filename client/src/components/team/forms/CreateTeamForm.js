import React, { useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createTeam } from "../../../actions/team";
import { customStyles } from "../../../utils/reactSelectStyles";
import { withRouter } from "react-router-dom";

function CreateTeamForm({ people, createTeam, createTeamToggle, history }) {
  const [formData, setFormData] = useState({
    teamName: "",
    teamDescription: "",
    members: [],
  });

  const { teamName, teamDescription } = formData;

  const memberOptions = [];

  people.map((person) =>
    memberOptions.push({
      _id: person.user._id,
      value: `${person.user.firstName} ${person.user.lastName}`,
      label: `${person.user.firstName} ${person.user.lastName}`,
    })
  );

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createTeam(formData, history);
  };

  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Create a Team</h3>
        <div className="popup__close" onClick={() => createTeamToggle(false)}>
          &times;
        </div>
        <form onSubmit={(e) => onSubmit(e)} className="popup__form">
          <label htmlFor="teamName">
            Team Name <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            maxLength="50"
            value={teamName}
            className="form__input"
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="teamDescription">Team Description</label>
          <textarea
            name="teamDescription"
            id="teamDescription"
            maxLength="5000"
            value={teamDescription}
            className="form__input"
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="inviteMembers">Invite Members</label>
          <Select
            options={memberOptions}
            isMulti
            id="inviteMembers"
            className="react-select"
            styles={customStyles}
            onChange={(selected) =>
              setFormData({
                ...formData,
                members: selected,
              })
            }
          />
          <span className="popup__form--infoText">
            Note: you can only invite people that are in your contacts.
          </span>
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => createTeamToggle(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!teamName.length > 0}
              className="btn btn-green btn-form popup__form--create"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateTeamForm.propTypes = {
  createTeam: PropTypes.func.isRequired,
  createTeamToggle: PropTypes.func.isRequired,
  people: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { createTeam })(withRouter(CreateTeamForm));
