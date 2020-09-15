import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { closeAlert } from "../../actions/alert";

const Alert = ({ alerts, closeAlert }) => (
  <div className="alert_container">
    {alerts !== null &&
      alerts.length > 0 &&
      alerts.map((alert) => (
        <div key={alert.id} className={`alert`}>
          <div className="alert_close" onClick={() => closeAlert(alert.id)}>
            &times;
          </div>
          <div className="alert_message">{alert.msg}</div>
        </div>
      ))}
  </div>
);

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  closeAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps, { closeAlert })(Alert);
