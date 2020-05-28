import React from "react";
import TeamItem from "./TeamItem";

function TeamList({ teams, searchTerm }) {
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
          <button className="btn btn-grey people__people--peopleItem-button">
            Start a Team
          </button>
        </div>
        {teamsFiltered}
      </div>
    </div>
  );
}

export default TeamList;
