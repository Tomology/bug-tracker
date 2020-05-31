import React from "react";
import FriendRequestItem from "./FriendRequestItem";
import TeamInviteItem from "./TeamInviteItem";

function PendingRequests({ receivedRequests, params }) {
  const requestArray = receivedRequests.map((request) => {
    if (request.creator) {
      return (
        <TeamInviteItem key={request._id} request={request} params={params} />
      );
    } else {
      return (
        <FriendRequestItem
          key={request._id}
          request={request}
          params={params}
        />
      );
    }
  });
  return (
    <div className="profile__receivedRequests">
      <h3>Pending Requests</h3>
      <span className="infoText">
        Note: accepting a team invite automatically adds all members to your
        contacts.
      </span>
      <div className="profile__receivedRequests--requests">
        {requestArray.length > 0 ? (
          requestArray
        ) : (
          <span className="noItems">You have no pending requests...</span>
        )}
      </div>
    </div>
  );
}

export default PendingRequests;
