import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { unshareProject } from "../../../actions/project";

function ProjectSharedWith({
  project,
  params,
  unshareProject,
  displaySharedWithToggle,
}) {
  const sharedWith = project.sharedWith.map((sharee) => (
    <div className="sharedWith__item" key={sharee._id}>
      <span className="name">{sharee.name}</span>
      <span
        className="remove"
        onClick={() => unshareProject(params, sharee._id)}
      >
        &times;
      </span>
    </div>
  ));

  return (
    <div className="popup">
      <div className="popup__content">
        <h3>Project Shared With</h3>
        <div
          className="popup__close"
          onClick={() => displaySharedWithToggle(false)}
        >
          &times;
        </div>
        <div className="sharedWith">{sharedWith}</div>
      </div>
    </div>
  );
}

ProjectSharedWith.propTypes = {
  unshareProject: PropTypes.func.isRequired,
};

export default connect(null, { unshareProject })(ProjectSharedWith);
