import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
  });

  const { email, firstName, lastName, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({ firstName, lastName, email, password });
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <form onSubmit={(e) => onSubmit(e)} className="auth__register">
        <p className="auth__register--lead heading__secondary">
          Create Your Account
        </p>
        <label className="auth__register--email">
          Email <span class="u-warning-text">*</span>
        </label>
        <input
          className="auth__register--email form__input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => onChange(e)}
        />
        <span class="form__validation">Please include a valid e-mail</span>

        <label className="auth__register--firstName">
          First name <span class="u-warning-text">*</span>
        </label>
        <input
          className="auth__register--firstName form__input"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => onChange(e)}
        />

        <label className="auth__register--lastName">
          Last name <span class="u-warning-text">*</span>
        </label>
        <input
          className="auth__register--lastName form__input"
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => onChange(e)}
        />
        <span class="form__validation">Name is required</span>

        <label className="auth__register--password">
          Password <span class="u-warning-text">*</span>
        </label>
        <input
          className="auth__register--password form__input"
          type="password"
          name="password"
          value={password}
          onChange={(e) => onChange(e)}
        />
        <span class="form__validation">
          Please enter a password with 6 or more characters
        </span>

        <label className="auth__register--password">
          Confirm Password <span class="u-warning-text">*</span>
        </label>
        <input
          className="auth__register--password form__input"
          type="password"
          name="password2"
          value={password2}
          onChange={(e) => onChange(e)}
        />
        <span class="form__validation">Please confirm your password</span>

        <input
          type="submit"
          value="REGISTER"
          className="auth__register--submit btn btn-green u-margin-top-small"
        />
      </form>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
