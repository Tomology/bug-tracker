import React, { useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createProject } from "../../../actions/project";
import { customStyles } from "../../../utils/reactSelectStyles";

function CreateProjectForm({
  people,
  teams,
  createProjectToggle,
  createProject,
  history,
}) {
  const [formData, setFormData] = useState({
    projectName: "",
    key: "",
    url: "",
    sharedWith: [],
  });

  const { projectName, key, url } = formData;
  const shareWithOptions = [];

  people.people.map((person) =>
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

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createProject(formData, history);
  };

  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Create Project</h3>
        <div
          className="popup__close"
          onClick={() => createProjectToggle(false)}
        >
          &times;
        </div>
        <form className="popup__form" onSubmit={(e) => onSubmit(e)}>
          <label htmlFor="projectName">
            Project Name <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            value={projectName}
            className="form__input"
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="key">
            Key <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            name="key"
            id="key"
            value={key}
            className="form__input"
            placeholder={
              projectName
                ? `e.g. ${projectName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}`
                : ""
            }
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="url">Project URL</label>
          <input
            type="text"
            name="url"
            id="url"
            value={url}
            className="form__input"
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="sharedWith">Share Project</label>
          <Select
            id="sharedWith"
            options={shareWithOptions}
            className="react-select"
            styles={customStyles}
            onChange={(selected) => {
              setFormData({
                ...formData,
                sharedWith: selected,
              });
            }}
            isMulti
          />
          <span className="popup__form--infoText" style={{ marginTop: "2px" }}>
            Note: you can only share the project with people that are in your
            contacts and teams of which you are a member.
          </span>
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => createProjectToggle(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={projectName.length === 0 || key.length === 0}
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

CreateProjectForm.propTypes = {
  createProject: PropTypes.func.isRequired,
};

export default connect(null, { createProject })(withRouter(CreateProjectForm));
