import React, { useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateStatus } from "../../../actions/project";
import { customStyles } from "../../../utils/reactSelectStyles";

function ChangeStatusForm({
  displayChangeStatusToggle,
  updateStatus,
  selectedIssue,
  params,
}) {
  const [formData, setFormData] = useState({
    label: `${selectedIssue.progress.progress}`,
    value: `${selectedIssue.progress.progress}`,
  });

  const statusOptions = [
    {
      label: "Open",
      value: "Open",
    },
    {
      label: "In Progress",
      value: "In Progress",
    },
    {
      label: "In Review",
      value: "In Review",
    },
    {
      label: "Resolved",
      value: "Resolved",
    },
  ];

  const handleUpdate = (e) => {
    e.preventDefault();
    updateStatus(formData, params, selectedIssue._id);
    displayChangeStatusToggle(false);
  };
  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Update Status</h3>
        <div
          className="popup__close"
          onClick={() => displayChangeStatusToggle(false)}
        >
          &times;
        </div>
        <form className="popup__form" onSubmit={(e) => handleUpdate(e)}>
          <Select
            options={statusOptions}
            styles={customStyles}
            defaultValue={formData}
            className="react-select"
            onChange={(selected) =>
              setFormData({ ...formData, progress: selected.value })
            }
          />
          <div className="popup__form--buttons">
            <button
              className="btn btn-cancel btn-form popup__form--cancel"
              onClick={() => displayChangeStatusToggle(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-green btn-form popup__form--create"
              type="submit"
            >
              Change Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ChangeStatusForm.propTypes = {
  updateStatus: PropTypes.func.isRequired,
};

export default connect(null, { updateStatus })(ChangeStatusForm);
