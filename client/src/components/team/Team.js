import React, { useEffect, Fragment } from "react";
import TeamSide from "./layout/TeamSide";
import TeamMain from "./layout/TeamMain";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getTeamById } from "../../actions/team";
import { getPeople } from "../../actions/people";

function Team({ getTeamById, getPeople, match, team, people }) {
  useEffect(() => {
    getTeamById(match.params.team_id);
    getPeople();
  }, [getTeamById, match.params.team_id, getPeople]);

  return (
    <Fragment>
      {team.loading ||
      !team.team ||
      !team.creator ||
      !team.projects ||
      !team.members ||
      !people ? (
        <Spinner />
      ) : (
        <section className="team">
          <TeamSide team={team} people={people} />
          <TeamMain team={team} />
        </section>
      )}
    </Fragment>
  );
}

Team.propTypes = {
  getTeamById: PropTypes.func.isRequired,
  getPeople: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  team: state.team,
  people: state.people,
});

export default connect(mapStateToProps, { getTeamById, getPeople })(Team);
