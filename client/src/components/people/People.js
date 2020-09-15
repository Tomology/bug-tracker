import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { getPeople } from "../../actions/people";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import PeopleList from "./layout/PeopleList";
import TeamList from "../team/layout/TeamList";
import AddPeopleForm from "./forms/AddPeopleForm";
import CreateTeamForm from "../team/forms/CreateTeamForm";
import { getTeams } from "../../actions/team";
import { getProfileById } from "../../actions/profile";

const People = ({
  profile: { profile },
  people: { people, loading, person, error },
  team: { teams },
  getPeople,
  getTeams,
  getProfileById,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addPeople, addPeopleToggle] = useState(false);
  const [createTeam, createTeamToggle] = useState(false);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    getPeople();
    getTeams();
    getProfileById(localStorage.getItem("currentUserId"));
  }, [getPeople, getTeams, getProfileById]);

  return (
    <Fragment>
      {people === null || teams === null || loading ? (
        <Spinner />
      ) : (
        <section className="people">
          {createTeam && (
            <CreateTeamForm
              people={people}
              createTeamToggle={createTeamToggle}
            />
          )}
          <div className="people__buttons">
            <button
              className="btn btn-grey btn-people people__buttons-btn"
              onClick={() => createTeamToggle(true)}
            >
              Start a team
            </button>
            <button
              className="btn btn-green people__buttons-btn"
              onClick={() => addPeopleToggle(true)}
            >
              Add User
            </button>
          </div>
          {addPeople && (
            <AddPeopleForm
              profile={profile}
              person={person}
              error={error}
              people={people}
              addPeopleToggle={addPeopleToggle}
            />
          )}
          <div className="people__filter">
            <input
              type="text"
              className="people__filter--search searchBar"
              value={searchTerm}
              onChange={(e) => onChange(e)}
              placeholder="Search your people and teams"
            />
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="search"
              className="svg-inline--fa fa-search fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
              ></path>
            </svg>
          </div>
          <PeopleList
            people={people}
            searchTerm={searchTerm}
            addPeopleToggle={addPeopleToggle}
          />
          <TeamList
            teams={teams}
            searchTerm={searchTerm}
            createTeamToggle={createTeamToggle}
          />
        </section>
      )}
    </Fragment>
  );
};

People.propTypes = {
  people: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getPeople: PropTypes.func.isRequired,
  getTeams: PropTypes.func.isRequired,
  getProfileById: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
  people: state.people,
  team: state.team,
  profile: state.profile,
});

export default connect(mapStatetoProps, {
  getPeople,
  getTeams,
  getProfileById,
})(People);
