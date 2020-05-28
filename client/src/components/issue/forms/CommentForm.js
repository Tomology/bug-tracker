import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../../actions/project";

const CommentForm = ({
  addComment,
  params,
  issueId,
  comments,
  project,
  setSelectedIssue,
  selectedIssue,
}) => {
  const [commentText, setCommentText] = useState({
    text: "",
  });



  const onChange = (e) => {
    setCommentText({
      ...commentText,
      text: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(commentText, params, issueId);
    setCommentText({ ...commentText, text: "" });
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <textarea
        placeholder="Add a comment..."
        className="form__input issue__main--comments-input"
        name="comment"
        value={commentText.text}
        onChange={(e) => onChange(e)}
      />
      <button
        type="submit"
        className="btn btn-grey issue__main--comments-button"
      >
        Submit
      </button>
    </form>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
