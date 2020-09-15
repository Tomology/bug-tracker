import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CommentForm from "../forms/CommentForm";
import Avatar from "react-avatar";
import Moment from "react-moment";
import { deleteComment } from "../../../actions/project";

function IssueComments({
  comments,
  issueId,
  params,
  project,
  selectedIssue,
  setSelectedIssue,
  deleteComment,
}) {
  const commentsJSX = comments.map((comment) => (
    <div
      key={comment._id}
      className="issue__main--comments-postedComments-commentItem"
    >
      <Link
        to={`/people/${comment.user}`}
        className="issue__main--comments-postedComments-commentItem-user"
      >
        <Avatar
          className="avatar"
          name={comment.name}
          round={true}
          size="2.5rem"
        />
        <span className="name">{comment.name}</span>
      </Link>
      <p className="comment">{comment.text}</p>
      <div className="issue__main--comments-postedComments-commentItem-footer">
        <div className="date">
          Posted on{" "}
          <Moment format="DD MMMM YYYY, h:mm:ss a">{comment.date}</Moment>
        </div>
        {comment.user.toString() === localStorage.getItem("currentUserId") && (
          <div
            className="remove"
            onClick={() => deleteComment(project._id, issueId, comment._id)}
          >
            Delete
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <div className="issue__main--comments">
      <span>Comments</span>
      <CommentForm
        issueId={issueId}
        params={params}
        project={project}
        comments={comments}
        setSelectedIssue={setSelectedIssue}
        selectedIssue={selectedIssue}
      />
      <div className="issue__main--comments-postedComments">{commentsJSX}</div>
    </div>
  );
}

IssueComments.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  issueId: PropTypes.string.isRequired,
  params: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  selectedIssue: PropTypes.object.isRequired,
  setSelectedIssue: PropTypes.func.isRequired,
};

export default connect(null, { deleteComment })(IssueComments);
