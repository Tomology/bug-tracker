import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editProfile } from "../../actions/profile";

const EditProfile = ({ editProfile }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    organization: "",
    location: "",
  });

  const { jobTitle, department, organization, location } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    editProfile(formData);
  };

  return (
    <Fragment>
      <section className="container">
        <p className="lead">Edit Profile</p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <label for="jobTitle">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={jobTitle}
            onChange={(e) => onChange(e)}
            className="jobTitle"
            placeholder="Your Job Title"
          />
          <label for="department">Department</label>
          <input
            type="text"
            name="department"
            value={department}
            onChange={(e) => onChange(e)}
            className="department"
            placeholder="Your Department"
          />
          <label for="organization">Organization</label>
          <input
            type="text"
            name="organization"
            value={organization}
            onChange={(e) => onChange(e)}
            className="organization"
            placeholder="Your Organization"
          />
          <label for="location">Location</label>
          <input
            type="text"
            className="location"
            name="location"
            value={location}
            onChange={(e) => onChange(e)}
            placeholder="Your Location"
          />
          <button type="submit">Save Changes</button>
          <button>Cancel</button>
        </form>
      </section>
    </Fragment>
  );
};

EditProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { editProfile })(EditProfile);
