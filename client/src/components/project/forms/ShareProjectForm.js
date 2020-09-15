import React, { useState } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { editProject } from "../../../actions/project";
import { customStyles } from "../../../utils/reactSelectStyles";

function ShareProjectForm({
  shareProjectToggle,
  people,
  teams,
  params,
  editProject,
}) {
  const [formData, setFormData] = useState({
    sharedWith: [],
  });
  const shareWithOptions = [];

  people.map((person) =>
    shareWithOptions.push({
      _id: person.user._id,
      name: `${person.user.firstName} ${person.user.lastName}`,
      value: `${person.user.firstName} ${person.user.lastName}`,
      label: `${person.user.firstName} ${person.user.lastName}`,
    })
  );

  teams.map((team) =>
    shareWithOptions.push({
      _id: team._id,
      name: team.teamName,
      value: team.teamName,
      label: team.teamName,
    })
  );

  const onSubmit = (e) => {
    e.preventDefault();
    editProject(formData, params);
    shareProjectToggle(false);
  };

  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Share Project</h3>
        <div className="popup__close" onClick={() => shareProjectToggle(false)}>
          &times;
        </div>
        <form className="popup__form" onSubmit={(e) => onSubmit(e)}>
          <Select
            isMulti
            options={shareWithOptions}
            styles={customStyles}
            className="react-select"
            onChange={(selected) => {
              setFormData({
                ...formData,
                sharedWith: selected,
              });
            }}
          />
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => shareProjectToggle(false)}
            >
              Cancel
            </button>
            <button
              disabled={
                !formData.sharedWith || formData.sharedWith.length === 0
                  ? true
                  : false
              }
              className="btn btn-green btn-form popup__form--create"
              type="submit"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ShareProjectForm.propTypes = {
  editProject: PropTypes.func.isRequired,
};

export default connect(null, { editProject })(ShareProjectForm);
