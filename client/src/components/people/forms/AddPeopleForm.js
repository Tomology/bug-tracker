import React, { useState } from "react";
import { searchPerson } from "../../../actions/people";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PeopleSearchItem from "../layout/PeopleSearchItem";

function AddPeopleForm({
  searchPerson,
  error,
  person,
  people,
  profile,
  addPeopleToggle,
}) {
  const [searchEmail, setSearchEmail] = useState({ email: "" });

  const onChange = (e) => {
    setSearchEmail({ email: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    searchPerson(searchEmail);
  };

  let searchResults = null;

  if (error.status === 404 && !person) {
    searchResults = <span>{error.msg}</span>;
  } else if (person) {
    searchResults = (
      <PeopleSearchItem
        profile={profile}
        people={people}
        person={person}
        key={person._id}
      />
    );
  }

  return (
    <div className="popup">
      <div className="deleteWarning__content">
        <div className="popup__close" onClick={() => addPeopleToggle(false)}>
          &times;
        </div>
        <span className="deleteWarning__message">Search for User</span>
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type="email"
            className="form__input u-margin-top-small"
            placeholder="User's Email"
            onChange={(e) => onChange(e)}
          />
          <div className="deleteWarning__buttons">
            <button
              className="btn btn-form btn-cancel"
              onClick={() => addPeopleToggle(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-form btn-green">
              Search
            </button>
          </div>
        </form>
        <div className="search__results">{searchResults}</div>
      </div>
    </div>
  );
}

AddPeopleForm.propTypes = {
  searchPerson: PropTypes.func.isRequired,
};

export default connect(null, { searchPerson })(AddPeopleForm);
