import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { closeAlert } from "../../actions/alert";

const Alert = ({ alerts, closeAlert }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert`}>
      <div className="alert_close" onClick={() => closeAlert(alert.id)}>
        &times;
      </div>
      <div className="alert_message">{alert.msg}</div>
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps, { closeAlert })(Alert);
