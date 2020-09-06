import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import ProfileAboutReadOnly from "./layout/ProfileAboutReadOnly";
import ProfileAboutHeader from "./layout/ProfileAboutHeader";
import ProfileAboutEdit from "./forms/ProfileAboutEdit";
import TeamItem from "../team/layout/TeamItem";
import PendingRequests from "./layout/PendingRequests";
import ProjectItem from "../projects/layout/ProjectItem";
import { getProjects } from "../../actions/project";
import { getTeams } from "../../actions/team";
import { getPendingRequests } from "../../actions/profile";

const Profile = ({
  match,
  getProfileById,
  getProjects,
  getTeams,
  getPendingRequests,
  team,
  project,
  team: { teams },
  project: { projects },
  profile: { profile, receivedRequests, loading },
  auth,
}) => {
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    getProfileById(match.params.user_id);
    getProjects();
    getTeams();
    if (localStorage.getItem("currentUserId") === match.params.user_id) {
      getPendingRequests(match.params.user_id);
    }
  }, [getProfileById, match.params.user_id]);

  const ownProfile = (
    <Fragment>
      <section className="profile">
        <div className="profile__about">
          <ProfileAboutHeader profile={profile} />
          {isEditing ? (
            <ProfileAboutEdit
              setEditing={setEditing}
              params={match.params.user_id}
              profile={profile}
              loading={loading}
              getProfileById={getProfileById}
            />
          ) : (
            <ProfileAboutReadOnly profile={profile} setEditing={setEditing} />
          )}
        </div>
        <div className="profile__main">
          <PendingRequests
            receivedRequests={receivedRequests}
            params={match.params.user_id}
          />
          <div className="profile__yourProjects">
            <h3>Projects You've Created</h3>
            <div className="profile__yourProjects--projects">
              {projects && projects.length > 0 ? (
                projects
                  .filter(
                    (project) => project.user._id === match.params.user_id
                  )
                  .map((project) => (
                    <ProjectItem key={project._id} project={project} />
                  ))
              ) : (
                <span className="noItems">
                  You haven't created any projects...
                </span>
              )}
            </div>
          </div>

          <div className="profile__yourTeams">
            <h3>Teams You've Created</h3>
            <div className="profile__yourTeams--teams">
              {teams && teams.length > 0 ? (
                teams
                  .filter((team) => team.creator._id === match.params.user_id)
                  .map((team) => <TeamItem key={team._id} team={team} />)
              ) : (
                <span className="noItems">
                  You haven't created any teams...
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
  const otherProfile = (
    <section className="profile">
      <div className="profile__about">
        <ProfileAboutHeader profile={profile} />

        <ProfileAboutReadOnly
          profile={profile}
          params={match.params.user_id}
          teams={teams}
        />
      </div>

      <div className="profile__main">
        <div className="profile__yourProjects">
          <h3>Projects You've Collaborated On</h3>
          <div className="profile__yourProjects--projects">
            {projects &&
              projects.length > 0 &&
              projects
                .filter(
                  (project) =>
                    project.user === match.params.user_id ||
                    project.sharedWith
                      .map((sharee) => sharee._id)
                      .indexOf(match.params.user_id) !== -1
                )
                .map((project) => (
                  <ProjectItem key={project._id} project={project} />
                ))}
          </div>
        </div>
        <div className="profile__yourTeams">
          <h3>Your Mutual Teams</h3>
          <div className="profile__yourTeams--teams">
            {teams &&
              teams.length > 0 &&
              teams
                .filter(
                  (team) =>
                    team.creator._id === match.params.user_id ||
                    (team.members
                      .map((member) => member._id)
                      .indexOf(match.params.user_id) !== -1 &&
                      team.members.map(
                        (member) => member.status === "Accepted"
                      ))
                )
                .map((team) => <TeamItem key={team._id} team={team} />)}
          </div>
        </div>
      </div>
    </section>
  );

  const currentUserProfile =
    match.params.user_id === localStorage.getItem("currentUserId");

  return (
    <Fragment>
      {currentUserProfile ? (
        <Fragment>
          {team.loading || project.loading || loading || !receivedRequests ? (
            <Spinner />
          ) : (
            <Fragment>{ownProfile}</Fragment>
          )}
        </Fragment>
      ) : (
        <Fragment>
          {team.loading || project.loading || loading ? (
            <Spinner />
          ) : (
            <Fragment>{otherProfile}</Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  getTeams: PropTypes.func.isRequired,
  getPendingRequests: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, {
  getProfileById,
  getProjects,
  getTeams,
  getPendingRequests,
})(Profile);
