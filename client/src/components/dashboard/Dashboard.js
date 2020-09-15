import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import OutstandingIssues from "./layout/OutstandingIssues";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { getOutstandingIssues } from "../../actions/project";

const Dashboard = ({
  auth: { user },
  profile: { profile },
  project: { outstandingIssues },
  getProfileById,
  getOutstandingIssues,
}) => {
  const currentUserId = localStorage.getItem("currentUserId");

  useEffect(() => {
    getProfileById(currentUserId);
    getOutstandingIssues(currentUserId);
  }, [getProfileById, getOutstandingIssues, currentUserId]);

  return !profile || !outstandingIssues ? (
    <Spinner />
  ) : (
    <section className="dashboard">
      <h1 className="dashboard__heading">Dashboard</h1>
      <span className="dashboard__welcome">
        Welcome {user.firstName} {user.lastName}.
      </span>
      <h2 className="dashboard__subheading--requests">Pending Requests</h2>
      <div className="dashboard__requests">
        <span>
          You have{" "}
          {profile.receivedRequest.length === 0 ? (
            "no pending requests."
          ) : (
            <Fragment>
              <strong>{profile.receivedRequest.length}</strong> pending
              request(s).{" "}
            </Fragment>
          )}
        </span>
        {profile.receivedRequest.length > 0 && (
          <Link to={`/people/${currentUserId}`} className="btn btn-green">
            View them
          </Link>
        )}
      </div>
      <h2 className="dashboard__subheading--issues">Issues Assigned To You</h2>
      <OutstandingIssues outstandingIssues={outstandingIssues} />
    </section>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  getOutstandingIssues: PropTypes.func.isRequired,
};

const mapSateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  project: state.project,
});

export default connect(mapSateToProps, {
  getProfileById,
  getOutstandingIssues,
})(Dashboard);
