import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Register from "../auth/Register";
import Login from "../auth/Login";

const Landing = ({ isAuthenticated }) => {
  const [authFormToggle, setAuthFormToggle] = useState("auth login-selected");

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="landing__text">
        <h1 className="heading-primary heading-primary--main landing__text--brand">
          Cimex
        </h1>
        <h2 className="landing__text--subtext">
          Project management & issue tracking software
        </h2>
        <img
          src={require("../../img/landing.svg")}
          alt="coders"
          className="landing__img"
        />
      </div>
      <div className={authFormToggle} id="auth">
        <div className="auth__toggle">
          <div className="auth__toggle--slider"></div>
          <div
            className="auth__toggle--register"
            id="register"
            onClick={() => setAuthFormToggle("auth")}
          >
            Register
          </div>
          <div
            className="auth__toggle--login"
            id="login"
            onClick={() => setAuthFormToggle("auth login-selected")}
          >
            Sign In
          </div>
        </div>
        <Register />
        <Login />
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
