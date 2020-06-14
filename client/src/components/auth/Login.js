import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
  // Form Data State, Destructuring and Event Handling
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    if (e.target.name === "email" && invalidEmail === true) {
      setInvalidEmail(false);
    }
    if (e.target.name === "password" && invalidPassword === true) {
      setInvalidPassword(true);
    }
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
    }

    login(email, password);
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
          Email is required
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
        minLength="6"
      />
      {invalidPassword && (
        <span className="auth__login--password-validation form__validation">
          Password is required
        </span>
      )}
      <span className="auth__login--password-validation2 form__validation">
        Invalid credentials
      </span>

      <input
        type="submit"
        value="Log In"
        className="auth__login--submit btn btn-green u-margin-top-small"
      />
    </form>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
