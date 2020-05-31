import React from "react";
import { respondFriendRequest } from "../../../actions/profile";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const TeamInviteItem = ({ request, params, respondFriendRequest }) => {
  const acceptRequest = () => {
    respondFriendRequest({ status: true }, params, request._id);
  };

  const declineRequest = () => {
    respondFriendRequest({ status: false }, params, request._id);
  };
  return (
    <div className="profile__receivedRequests--requests-team">
      <span>
        <a href="#">
          {`${request.creator.firstName} ${request.creator.lastName}`}
        </a>{" "}
        has invited you to join their team:{" "}
        <a href="#">{`${request.teamName}`}</a>
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
};

TeamInviteItem.propTypes = (state) => ({
  respondFriendRequest: PropTypes.func.isRequired,
});

export default connect(null, { respondFriendRequest })(TeamInviteItem);
