import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Register from "../auth/Register";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <body class="container">
      <section className="landing">
        <div class="landing__text">
          <h1 class="heading-primary">
            <span class="heading-primary--main landing__logo">Cimex</span>
            <span class="heading-primary--sub">
              Project management and issue tracking
            </span>
          </h1>

          <ul class="landing__text--list">
            <li>Manage your projects</li>
            <li>Track your issues</li>
            <li>Collaborate with others</li>
            <li>Track your projects</li>
            <li>Track your projects</li>
          </ul>

          <img src="../img/landing2.svg" alt="coders" class="landing__img" />
        </div>
        <div class="auth">
          <div class="auth__toggle">
            <div class="btn-toggle-color"></div>
            <button class="auth__toggle--register btn-toggle">Register</button>
            <button class="auth__toggle--login btn-toggle">Login</button>
          </div>
          <Register />
        </div>
      </section>
    </body>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
