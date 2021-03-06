import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";
import { editIssue } from "../../../actions/project";
import { customStyles } from "../../../utils/reactSelectStyles";

export const EditIssueForm = ({
  selectedIssue,
  displayEditIssueToggle,
  project: { sharedWith, user, name },
  editIssue,
  params,
}) => {
  const [formData, setFormData] = useState({
    issueType: selectedIssue.issueType,
    issueName: selectedIssue.issueName,
    summary: selectedIssue.summary,
    description: selectedIssue.description,
    priority: `${selectedIssue.priority}`,
    dueDate: !selectedIssue.dueDate ? "" : selectedIssue.dueDate.slice(0, 10),
    assignee: !selectedIssue.assignee
      ? ""
      : selectedIssue.assignee.map((assign) => ({
          _id: assign._id,
          name: assign.name,
          value: assign.name,
          label: assign.name,
        })),
  });

  const {
    issueType,
    issueName,
    summary,
    description,
    priority,
    dueDate,
    assignee,
  } = formData;

  const assigneeOptions = [];

  assigneeOptions.push({
    _id: user,
    name: name,
    value: name,
    label: name,
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
    editIssue(formData, params, selectedIssue._id);
    displayEditIssueToggle(false);
  };

  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Edit Issue</h3>
        <div
          className="popup__close"
          onClick={() => displayEditIssueToggle(false)}
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
            maxLength="50"
            value={issueName}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="issueType" className="u-col-1-of-2">
            Issue Type <span className="u-text-warning">*</span>
          </label>
          <Select
            options={issueTypeOptions}
            defaultValue={{ value: issueType, label: issueType }}
            styles={customStyles}
            name="issueType"
            className="u-col-1-of-2"
            id="issueType"
            onChange={(selectedOption) => {
              setFormData({ ...formData, issueType: selectedOption.value });
            }}
          />
          <label htmlFor="priority" className="u-col-2-of-2">
            Priority <span className="u-text-warning">*</span>
          </label>
          <Select
            style={customStyles}
            className="u-col-2-of-2"
            id="priority"
            options={priorityOptions}
            name="priotityOptions"
            defaultValue={{ label: priority, value: priority }}
            onChange={(selectedOption) => {
              setFormData({ ...formData, priority: selectedOption.value });
            }}
          />
          <label htmlFor="summary">
            Summary <span className="u-text-warning">*</span>
          </label>
          <input
            type="text"
            name="summary"
            id="summary"
            className="form__input"
            maxLength="10000"
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
            maxLength="50000"
            value={description}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="assignee">Assignee(s)</label>
          <Select
            options={assigneeOptions}
            styles={customStyles}
            id="assignee"
            className="u-col-full"
            defaultValue={assignee}
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
            defaultValue={dueDate}
            onChange={(e) => onChange(e)}
          />
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => displayEditIssueToggle(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-green btn-form popup__form--create"
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
};

EditIssueForm.propTypes = {
  editIssue: PropTypes.func.isRequired,
  selectedIssue: PropTypes.object.isRequired,
  displayEditIssueToggle: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  params: PropTypes.string.isRequired,
};

export default connect(null, { editIssue })(EditIssueForm);
