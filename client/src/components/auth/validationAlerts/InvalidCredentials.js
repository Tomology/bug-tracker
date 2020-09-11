import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function InvalidCredentials({ validationError }) {
  return (
    validationError.filter((error) => error.msg === "Invalid Credentials")
      .length > 0 &&
    validationError
      .filter((error) => error.msg === "Invalid Credentials")
      .map((error) => (
        <span className="auth__login--password-validation form__validation">
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
