import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login, removeValidationErrorAlert } from "../../actions/auth";
import InvalidCredentials from "./validationAlerts/InvalidCredentials";

const Login = ({
  login,
  isAuthenticated,
  validationError,
  removeValidationErrorAlert,
}) => {
  // Form Data State, Destructuring and Event Handling
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    // Remove validation error(s) when field is changed
    if (validationError.length > 0) {
      removeValidationErrorAlert();
    }
    if (e.target.name === "email" && invalidEmail === true) {
      setInvalidEmail(false);
    }
    if (e.target.name === "password" && invalidPassword === true) {
      setInvalidPassword(false);
    }

    // Set the form data
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Validation States
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  // Handle Form Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(email) === false) {
      setInvalidEmail(true);
    }

    if (!password) {
      setInvalidPassword(true);
      return;
    }

    login(email, password);

    if (validationError.length === 0) {
      document.getElementById("SIGN IN").value = "SIGNING IN...";
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="auth__login"
      id="auth__login"
    >
      <p className="auth__login--lead heading__secondary">
        Sign Into Your Account
      </p>
      <label className="auth__login--email-label">
        Email <span className="u-text-warning">*</span>
      </label>
      <input
        type="text"
        name="email"
        value={email}
        className="auth__login--email-input form__input"
        onChange={(e) => onChange(e)}
      />
      {invalidEmail && (
        <span className="auth__login--email-validation form__validation">
          Please enter a valid email
        </span>
      )}
      <label className="auth__login--password-label">
        Password <span className="u-text-warning">*</span>
      </label>
      <input
        type="password"
        name="password"
        value={password}
        className="auth__login--password-input form__input"
        onChange={(e) => onChange(e)}
      />
      {invalidPassword && (
        <span className="auth__login--password-validation form__validation">
          Please enter your password
        </span>
      )}
      <InvalidCredentials />
      <input
        id="SIGN IN"
        type="submit"
        value="SIGN IN"
        className="auth__login--submit btn btn-auth u-margin-top-small"
      />
    </form>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  validationError: PropTypes.array.isRequired,
  removeValidationErrorAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  validationError: state.auth.validationError,
});

export default connect(mapStateToProps, { login, removeValidationErrorAlert })(
  Login
);
