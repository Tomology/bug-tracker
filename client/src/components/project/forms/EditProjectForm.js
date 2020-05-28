import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { editProject } from "../../../actions/project";

function EditProjectForm({
  project,
  editProject,
  params,
  editProjectFormToggle,
}) {
  const [formData, setFormData] = useState({
    projectName: "",
    key: "",
  });

  const { projectName, key } = formData;

  useEffect(() => {
    setFormData({
      projectName: !project.projectName ? "" : project.projectName,
      key: !project.key ? "" : project.key,
    });
  }, []);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    editProject(formData, params);
  };
  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Create Project</h3>
        <div
          className="popup__close"
          onClick={() => editProjectFormToggle(false)}
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
            value={projectName}
            id="projectName"
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
            className="form__input"
            value={key}
            onChange={(e) => onChange(e)}
          />
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => editProjectFormToggle(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-green btn-form popup__form--create"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditProjectForm.propTypes = {
  editProject: PropTypes.func.isRequired,
};

export default connect(null, { editProject })(EditProjectForm);
