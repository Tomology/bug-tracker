import React, { useState } from "react";
import Select from "react-select";
import { editTeam } from "../../../actions/team";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { customStyles } from "../../../utils/reactSelectStyles";

function InviteTeamMembers({ people, team, addPeopleToggle, editTeam }) {
  const [formData, setFormData] = useState({
    members: [],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    editTeam(formData, team._id);
    addPeopleToggle(false);
  };

  const memberOptions = [];

  people.people.map((person) =>
    memberOptions.push({
      _id: person.user._id,
      value: `${person.user.firstName} ${person.user.lastName}`,
      label: `${person.user.firstName} ${person.user.lastName}`,
    })
  );
  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Invite People</h3>
        <div className="popup__close" onClick={() => addPeopleToggle(false)}>
          &times;
        </div>
        <form className="popup__form" onSubmit={(e) => onSubmit(e)}>
          <Select
            className="react-select"
            styles={customStyles}
            options={memberOptions}
            isMulti
            onChange={(selected) =>
              setFormData({
                ...formData,
                members: selected,
              })
            }
          />
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => addPeopleToggle(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-green btn-form popup__form--create"
            >
              Send Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InviteTeamMembers.propTypes = {
  editTeam: PropTypes.func.isRequired,
};

export default connect(null, { editTeam })(InviteTeamMembers);
