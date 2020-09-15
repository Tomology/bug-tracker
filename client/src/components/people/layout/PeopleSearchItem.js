import React, { Fragment } from "react";
import { sendRequest } from "../../../actions/people";
import { respondFriendRequestSearch } from "../../../actions/profile";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Avatar from "react-avatar";

const PeopleSearchItem = ({
  people,
  person,
  profile,
  sendRequest,
  respondFriendRequestSearch,
}) => {
  const acceptRequest = () => {
    respondFriendRequestSearch(
      { status: true },
      localStorage.getItem("currentUserId"),
      person.user._id
    );
  };

  const declineRequest = () => {
    respondFriendRequestSearch(
      { status: false },
      localStorage.getItem("currentUserId"),
      person.user._id
    );
  };

  // Blurb
  let blurb = "";
  if (person.jobTitle && person.organization) {
    blurb = `${person.jobTitle} at ${person.organization}`;
  } else if (!person.jobTitle && person.organization) {
    blurb = `Works at ${person.organization}`;
  }

  const onClick = () => {
    sendRequest(person.user._id);
  };

  const indexCheck = person.user._id;

  let bottomSection = "";

  if (
    profile.sentRequest
      .map((request) => request._id)
      .indexOf(person.user._id) !== -1
  ) {
    bottomSection = (
      <button disabled={true} className="btn btn-form btn-green">
        Request Sent
      </button>
    );
  } else if (
    profile.receivedRequest
      .map((request) => request._id)
      .indexOf(indexCheck) !== -1
  ) {
    bottomSection = (
      <Fragment>
        <span>You have a pending request from this user:</span>
        <button
          className="btn btn-form btn-grey"
          onClick={() => declineRequest()}
        >
          Decline
        </button>
        <button
          className="btn btn-form btn-green"
          onClick={() => acceptRequest()}
        >
          Accept
        </button>
      </Fragment>
    );
  } else if (
    people.map((person) => person.user._id).indexOf(indexCheck) === -1
  ) {
    bottomSection = (
      <button className="btn btn-form btn-green" onClick={() => onClick()}>
        Add to Contacts
      </button>
    );
  } else {
    bottomSection = (
      <button disabled={true} className="btn btn-form btn-green">
        User already in contacts
      </button>
    );
  }

  return (
    <div className="search__results--peopleItem">
      <Avatar
        round={true}
        size="8rem"
        name={`${person.user.firstName} ${person.user.lastName}`}
        className="search__results--peopleItem-avatar"
      ></Avatar>
      <span className="search__results--peopleItem-name">{`${person.user.firstName} ${person.user.lastName}`}</span>
      <span className="search__results--peopleItem-blurb">{blurb}</span>
      <div className="search__results--peopleItem-options">{bottomSection}</div>
    </div>
  );
};

PeopleSearchItem.propTypes = {
  sendRequest: PropTypes.func.isRequired,
  respondFriendRequestSearch: PropTypes.func.isRequired,
  people: PropTypes.array.isRequired,
  person: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default connect(null, { sendRequest, respondFriendRequestSearch })(
  PeopleSearchItem
);
