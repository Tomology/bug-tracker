import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import ProfileAboutEditable from "./ProfileAboutEditable";
import ProfileAboutReadOnly from "./ProfileAboutReadOnly";
import ProfileAboutButtons from "./ProfileAboutButtons";
import ProfileName from "./ProfileName";
import TeamItem from "../team/TeamItem";

const Profile = ({
  match,
  getProfileById,
  team: { teams },
  project: { projects },
  profile: { profile, receivedRequests, loading },
  auth,
}) => {
  useEffect(() => {
    getProfileById(match.params.user_id);
  }, [getProfileById, match.params.user_id]);

  const ownProfile = (
    <Fragment>
      <section className="profileBody">
        <ProfileName profile={profile} />
        <div className="profileSide">
          <ProfileAboutEditable profile={profile} />
          <ProfileAboutReadOnly profile={profile} />
          <ProfileAboutButtons />
          <div class="profileTeams">
            <h3>Teams I've Created</h3>
          </div>
        </div>
      </section>
    </Fragment>
  );
  const otherProfile = (
    <Fragment>
      <section className="profileBody">
        <h2>Other User's Profile</h2>
        <ProfileAboutEditable profile={profile} />
        <ProfileAboutReadOnly profile={profile} />
        <TeamItem profile={teams} /> // Change to correct syntax
      </section>
    </Fragment>
  );

  return (
    <Fragment>
      {profile === null ||
      receivedRequests === null ||
      teams === null ||
      projects === null ||
      loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user._id === profile.user._id
            ? ownProfile
            : otherProfile}
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
  project: state.project,
  team: state.team,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
