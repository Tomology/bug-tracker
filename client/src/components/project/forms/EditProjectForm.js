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
    url: "",
    key: "",
  });

  const { projectName, url, key } = formData;

  useEffect(() => {
    setFormData({
      projectName: !project.projectName ? "" : project.projectName,
      key: !project.key ? "" : project.key,
      url: !project.url ? "" : project.url,
    });
  }, [project.projectName, project.key, project.url]);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    editProject(formData, params);
    editProjectFormToggle(false);
  };
  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Edit Project</h3>
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
            maxLength="50"
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
            maxLength="10"
            value={key}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="url">Project URL</label>
          <input
            type="text"
            name="url"
            id="url"
            maxLength="5000"
            value={url}
            className="form__input"
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
              className="btn btn-green btn-form popup__form--create"
              disabled={projectName.length === 0 || key.length === 0}
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
  editProjectFormToggle: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  params: PropTypes.string.isRequired,
};

export default connect(null, { editProject })(EditProjectForm);
