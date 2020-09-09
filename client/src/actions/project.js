import axios from "axios";
import { setAlert, refreshAlert } from "./alert";

import {
  GET_PROJECTS,
  GET_PROJECTS_ERROR,
  GET_OUTSTANDING_ISSUES,
  GET_OUTSTANDING_ISSUES_ERROR,
  CREATE_PROJECT,
  PROJECT_ERROR,
  GET_PROJECT,
  EDIT_PROJECT,
  UNSHARE_PROJECT,
  PROJECT_DELETED,
  CREATE_ISSUE,
  ISSUE_ERROR,
  UPDATE_STATUS,
  EDIT_ISSUE,
  DELETE_ISSUE,
  ADD_COMMENT,
  DELETE_COMMENT,
  COMMENT_ERROR,
} from "./types";

// Get all of a user's projects
export const getProjects = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects`);

    dispatch({
      type: GET_PROJECTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROJECTS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create a project
export const createProject = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/projects/", formData, config);

    dispatch({
      type: CREATE_PROJECT,
      payload: res.data,
    });

    history.push(`/projects/${res.data._id}`);

    dispatch(setAlert("Project Created"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg)));
    }
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit a project
export const editProject = (formData, projectId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `/api/projects/${projectId}`,
      formData,
      config
    );

    dispatch({
      type: EDIT_PROJECT,
      payload: res.data,
    });

    if (formData.projectName || formData.projectKey) {
      dispatch(setAlert("Project Updated"));
    }

    if (formData.sharedWith) {
      dispatch(setAlert("Successfully shared"));
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg)));
    }
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get project by Id
export const getProjectById = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}`);

    dispatch({
      type: GET_PROJECT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Unshare project with user/team
export const unshareProject = (projectId, shareeId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/projects/${projectId}/${shareeId}`);

    dispatch({
      type: UNSHARE_PROJECT,
      payload: shareeId,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Unshare project with yourself
export const removeSharedProject = (projectId, shareeId, history) => async (
  dispatch
) => {
  try {
    const res = await axios.delete(`/api/projects/${projectId}/${shareeId}`);

    dispatch({
      type: UNSHARE_PROJECT,
      payload: shareeId,
    });

    history.push(`/projects`);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete project
export const deleteProject = (projectId, history) => async (dispatch) => {
  try {
    await axios.delete(`/api/projects/${projectId}`);
    dispatch(setAlert("Project Deleted"));

    history.push("/projects");

    dispatch({
      type: PROJECT_DELETED,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create Issue on Project
export const createIssue = (formData, projectId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      `/api/projects/${projectId}/issues`,
      formData,
      config
    );

    dispatch({
      type: CREATE_ISSUE,
      payload: res.data,
    });

    dispatch(setAlert("Issue Created"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg)));
    }

    dispatch({
      type: ISSUE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update Status on Issue
export const updateStatus = (formData, projectId, issueId) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      `/api/projects/${projectId}/issues/${issueId}`,
      formData,
      config
    );

    dispatch({
      type: UPDATE_STATUS,
      payload: res.data,
    });

    dispatch(refreshAlert());

    dispatch(setAlert("Status Updated"));
  } catch (err) {
    dispatch({
      type: ISSUE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit Issue
export const editIssue = (formData, projectId, issueId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `/api/projects/${projectId}/issues/${issueId}/edit`,
      formData,
      config
    );

    dispatch({
      type: EDIT_ISSUE,
      payload: res.data,
    });

    dispatch(refreshAlert());

    dispatch(setAlert("Issue Updated"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg)));
    }
    dispatch({
      type: ISSUE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Issue
export const deleteIssue = (projectId, issueId) => async (dispatch) => {
  try {
    await axios.delete(`/api/projects/${projectId}/issues/${issueId}`);

    dispatch({
      type: DELETE_ISSUE,
      payload: issueId,
    });

    // history.push(`/projects/${projectId}`);

    dispatch(setAlert("Issue Deleted"));
  } catch (err) {
    dispatch({
      type: ISSUE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Comment
export const addComment = (formData, projectId, issueId) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      `/api/projects/${projectId}/issues/${issueId}/comments`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: { comments: res.data, issue: issueId },
    });

    dispatch(refreshAlert());

    dispatch(setAlert("Comment Added"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg)));
    }
    dispatch({
      type: COMMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Comment
export const deleteComment = (projectId, issueId, commentId) => async (
  dispatch
) => {
  try {
    const res = await axios.delete(
      `/api/projects/${projectId}/issues/${issueId}/comments/${commentId}`
    );

    dispatch({
      type: DELETE_COMMENT,
      payload: { comments: res.data, issue: issueId },
    });

    dispatch(refreshAlert());

    dispatch(setAlert("Comment Removed"));
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get current user's oustanding issues
export const getOutstandingIssues = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects/issues/${userId}`);

    dispatch({
      type: GET_OUTSTANDING_ISSUES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_OUTSTANDING_ISSUES_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
