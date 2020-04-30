import React from "react";

const TeamItem = ({ teams }) => {
  return (
    <div class="team">
      <h4>
        <a href="#!">{teams.teamName}</a> // Change this to map through
      </h4>
    </div>
  );
};

export default TeamItem;
