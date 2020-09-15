import React, { Fragment, useState } from "react";
import EditTeamForm from "../forms/EditTeamForm";
import PropTypes from "prop-types";
import { removeMember } from "../../../actions/team";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import InviteTeamMembers from "../forms/InviteTeamMembers";
import DeleteTeamConfirm from "../forms/DeleteTeamConfirm";
import LeaveTeamConfirm from "../forms/LeaveTeamConfirm";

function TeamSide({
  team: { team, creator, members, loading },
  people,
  removeMember,
}) {
  const [editTeam, editTeamToggle] = useState(false);
  const [deleteTeamConfirm, deleteTeamConfirmToggle] = useState(false);
  const [addPeople, addPeopleToggle] = useState(false);
  const [leaveTeam, leaveTeamToggle] = useState(false);

  const isTeamCreator = creator._id === localStorage.getItem("currentUserId");

  const teamMembers = members.map((member) => (
    <div className="team__members--list-memberItem" key={member._id}>
      <Link to="#">
        <Avatar
          className="team__members--list-memberItem-avatar"
          name={`${member.firstName} ${member.lastName}`}
          round={true}
          size="2.5rem"
        />
        <div className="team__members--list-memberItem-spans">
          <span className="team__members--list-memberItem-name">
            {`${member.firstName} ${member.lastName}`}
          </span>
          {member.status === "Invited" && (
            <span className="team__members--list-memberItem-status">
              {member.status}
            </span>
          )}
        </div>
      </Link>
      {isTeamCreator && (
        <button
          className="team__members--list-memberItem-remove"
          onClick={() => removeMember(team._id, member._id)}
        >
          &times;
        </button>
      )}
    </div>
  ));

  let teamMemberNumber;

  if (teamMembers.length === 0) {
    teamMemberNumber = "0 Members";
  } else if (teamMembers.length === 1) {
    teamMemberNumber = "1 Member";
  } else {
    teamMemberNumber = `${teamMembers.length} Members`;
  }

  return (
    <div className="team__side">
      <h3>{team.teamName}</h3>
      {team.teamDescription && (
        <span className="team__side--description">{team.teamDescription}</span>
      )}
      <div className="team__side--teamCreator">
        <span className="team__side--teamCreator-title">Created by:</span>
        <Link to="#" className="team__side--teamCreator-info">
          <Avatar
            className="team__side--teamCreator-info-avatar"
            name={`${creator.firstName} ${creator.lastName}`}
            round={true}
            size="2rem"
          ></Avatar>
          <span className="team__side--teamCreator-info-name">{`${creator.firstName} ${creator.lastName}`}</span>
        </Link>
      </div>
      {isTeamCreator && (
        <button
          onClick={() => addPeopleToggle(true)}
          className="btn btn-green team__side--buttons"
        >
          Invite People
        </button>
      )}
      {addPeople && (
        <InviteTeamMembers
          people={people}
          team={team}
          addPeopleToggle={addPeopleToggle}
        />
      )}

      <div className="team__members">
        <h4>Members</h4>

        <span>{teamMemberNumber}</span>
        <div className="team__members--list">{teamMembers}</div>
      </div>
      {isTeamCreator ? (
        <Fragment>
          <button
            className="btn btn-grey team__side--buttons u-margin-top-small"
            onClick={() => editTeamToggle(true)}
          >
            Edit Team
          </button>
          {editTeam && (
            <EditTeamForm
              editTeamToggle={editTeamToggle}
              editTeam={editTeam}
              team={team}
              loading={loading}
            />
          )}
          <button
            className="btn btn-grey team__side--buttons"
            onClick={() => deleteTeamConfirmToggle(true)}
          >
            Delete Team
          </button>
          {deleteTeamConfirm && (
            <DeleteTeamConfirm
              deleteTeamConfirmToggle={deleteTeamConfirmToggle}
              team={team}
            />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <button
            onClick={() => leaveTeamToggle(true)}
            className="btn btn-grey team__side--buttons u-margin-top-small"
          >
            Leave Team
          </button>
          {leaveTeam && (
            <LeaveTeamConfirm leaveTeamToggle={leaveTeamToggle} team={team} />
          )}
        </Fragment>
      )}
    </div>
  );
}

TeamSide.propTypes = {
  removeMember: PropTypes.func.isRequired,
};

export default connect(null, { removeMember })(TeamSide);
