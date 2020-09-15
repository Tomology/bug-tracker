import React from "react";
import { respondFriendRequest } from "../../../actions/profile";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function FriendRequestItem({ request, params, respondFriendRequest }) {
  const acceptRequest = () => {
    respondFriendRequest({ status: true }, params, request.user._id);
  };

  const declineRequest = () => {
    respondFriendRequest({ status: false }, params, request.user._id);
  };

  return (
    <div className="profile__receivedRequests--requests-person">
      <span>
        {`${request.user.firstName} ${request.user.lastName}`} would like to add
        you as a contact.
      </span>
      <div className="profile__receivedRequests--buttons">
        <button
          className="btn btn-green profile__receivedRequests--buttons-button"
          onClick={() => acceptRequest()}
        >
          Accept
        </button>
        <button
          className="btn btn-grey profile__receivedRequests--buttons-button"
          onClick={() => declineRequest()}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

FriendRequestItem.propTypes = (state) => ({
  respondFriendRequest: PropTypes.func.isRequired,
});

export default connect(null, { respondFriendRequest })(FriendRequestItem);
