import React, { useState } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createIssue } from "../../../actions/project";
import { customStyles } from "../../../utils/reactSelectStyles";

function CreateIssueForm({
  sharedWith,
  creatorId,
  creatorName,
  displayCreateIssueToggle,
  params,
  createIssue,
}) {
  const [formData, setFormData] = useState({
    issueName: "",
    issueType: "",
    summary: "",
    description: "",
    assignee: [],
    priority: "",
    dueDate: "",
  });

  const {
    issueName,
    issueType,
    priority,
    summary,
    description,
    dueDate,
  } = formData;

  const assigneeOptions = [];

  assigneeOptions.push({
    _id: creatorId,
    name: creatorName,
    value: creatorName,
    label: creatorName,
  });

  sharedWith.map((sharee) =>
    assigneeOptions.push({
      _id: sharee._id,
      name: sharee.name,
      value: sharee.name,
      label: sharee.name,
    })
  );

  const issueTypeOptions = [
    { value: "Bug", label: "Bug" },
    { value: "Improvement", label: "Improvement" },
    { value: "Task", label: "Task" },
    { value: "Other", label: "Other" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createIssue(formData, params);
  };

  const todaysDate = new Date().toISOString().split("T")[0];

  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Create Issue</h3>
        <div
          className="popup__close"
          onClick={() => displayCreateIssueToggle(false)}
        >
          &times;
        </div>
        <form className="popup__form" onSubmit={(e) => onSubmit(e)}>
          <label htmlFor="issueName">
            Issue Name <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            name="issueName"
            id="issueName"
            className="form__input"
            value={issueName}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="issueType" className="u-col-1-of-2">
            Issue Type<span className="u-text-warning">*</span>
          </label>
          <Select
            options={issueTypeOptions}
            styles={customStyles}
            className="u-col-1-of-2"
            id="issueType"
            name="issueType"
            onChange={(selectedOption) => {
              setFormData({ ...formData, issueType: selectedOption.value });
            }}
          />
          <label htmlFor="priority" className="u-col-2-of-2">
            Priority <span className="u-text-warning">*</span>
          </label>
          <Select
            styles={customStyles}
            className=" u-col-2-of-2"
            id="priority"
            options={priorityOptions}
            name="priorityOptions"
            onChange={(selectedOption) => {
              setFormData({ ...formData, priority: selectedOption.value });
            }}
          />

          <label htmlFor="summary">
            Summary <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            id="summary"
            className="form__input"
            name="summary"
            value={summary}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="description">
            Description <span className="u-text-warning">*</span>
          </label>
          <textarea
            name="description"
            className="form__input"
            id="description"
            value={description}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="assignee">Assignee(s)</label>
          <Select
            options={assigneeOptions}
            styles={customStyles}
            className="u-col-full"
            id="assignee"
            isMulti
            onChange={(selected) =>
              setFormData({
                ...formData,
                assignee: selected,
              })
            }
          />
          <span className="popup__form--infoText" style={{ marginTop: "2px" }}>
            Note: you can only assign an issue to people and teams with whom
            this project has been shared.
          </span>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            className="form__input"
            value={dueDate}
            onChange={(e) => onChange(e)}
            min={todaysDate}
          />
          <div class="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => displayCreateIssueToggle(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-green btn-form popup__form--create"
              type="submit"
              disabled={
                issueName.length === 0 ||
                issueType.length === 0 ||
                priority.length === 0 ||
                summary.length === 0 ||
                description.length === 0
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateIssueForm.propTypes = {
  createIssue: PropTypes.func.isRequired,
};

export default connect(null, { createIssue })(CreateIssueForm);
