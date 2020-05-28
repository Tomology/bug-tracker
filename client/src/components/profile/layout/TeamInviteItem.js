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
      <button className="btn btn-green" onClick={() => acceptRequest()}>
        Accept
      </button>
      <button className="btn btn-grey" onClick={() => declineRequest()}>
        Decline
      </button>
    </div>
  );
};

TeamInviteItem.propTypes = (state) => ({
  respondFriendRequest: PropTypes.func.isRequired,
});

export default connect(null, { respondFriendRequest })(TeamInviteItem);
