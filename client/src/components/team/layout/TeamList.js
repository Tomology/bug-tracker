import React from "react";
import PropTypes from "prop-types";
import TeamItem from "./TeamItem";

function TeamList({ teams, searchTerm, createTeamToggle }) {
  const teamsFiltered = teams
    .filter((team) => {
      if (searchTerm === "") {
        return team;
      } else if (team.teamName.toLowerCase().includes(searchTerm)) {
        return team;
      }
    })
    .map((team) => {
      return <TeamItem team={team} key={team._id} />;
    });

  return (
    <div className="people__teams">
      <h3>Teams</h3>
      <div className="people__teams--list">
        <div href="#" className="people__teams--teamItem">
          <div className="people__teams--teamItem-teamAvatar"></div>
          <button
            className="btn btn-grey people__people--peopleItem-button"
            onClick={() => createTeamToggle(true)}
          >
            Start a Team
          </button>
        </div>
        {teamsFiltered}
      </div>
    </div>
  );
}

TeamList.propTypes = {
  teams: PropTypes.array.isRequired,
  searchTerm: PropTypes.string,
  createTeamToggle: PropTypes.func.isRequired,
};

export default TeamList;
