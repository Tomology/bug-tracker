import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function InvalidCredentials({ validationError }) {
  return (
    validationError.filter(
      (error) => error.msg === "This e-mail is already in use"
    ).length > 0 &&
    validationError
      .filter((error) => error.msg === "This e-mail is already in use")
      .map((error) => (
        <span key={error.msg} className="auth__register--email-validation">
          {error.msg}
        </span>
      ))
  );
}

InvalidCredentials.propTypes = {
  validationError: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  validationError: state.auth.validationError,
});

export default connect(mapStateToProps, {})(InvalidCredentials);
