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
  REFRESH_ALERT,
  REFRESH_REMOVE,
} from "../actions/types";

const initialState = {
  projects: null,
  project: null,
  refreshIssue: null,
  loading: true,
  outstandingIssues: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        project: null,
        loading: false,
      };
    case CREATE_PROJECT:
      return {
        ...state,
        projects: [payload, ...state.projects],
        loading: false,
      };
    case GET_PROJECT:
      return {
        ...state,
        project: payload.project,
        loading: false,
      };
    case EDIT_PROJECT:
      return {
        ...state,
        project: payload,
        loading: false,
      };
    case UNSHARE_PROJECT:
      return {
        ...state,
        project: {
          ...state.project,
          sharedWith: state.project.sharedWith.filter(
            (sharee) => sharee._id !== payload
          ),
        },
        loading: false,
      };
    case PROJECT_DELETED:
      return {
        ...state,
        project: null,
        loading: false,
      };
    case CREATE_ISSUE:
      return {
        ...state,
        project: {
          ...state.project,
          issues: payload,
        },
        loading: false,
      };
    case EDIT_ISSUE:
    case UPDATE_STATUS:
      return {
        ...state,
        project: {
          ...state.project,
          issues: payload,
        },
        loading: false,
      };
    case DELETE_ISSUE:
      return {
        ...state,
        project: {
          ...state.project,
          issues: state.project.issues.filter((issue) => issue !== payload),
        },
        loading: false,
      };
    case ADD_COMMENT:
    case DELETE_COMMENT:
      return {
        ...state,
        project: {
          ...state.project,
          issues: state.project.issues.map((issue) => {
            if (issue._id === payload.issue) {
              issue.comments = payload.comments;
              return issue;
            } else {
              return issue;
            }
          }),
        },
        loading: false,
      };
    case GET_OUTSTANDING_ISSUES:
      return {
        ...state,
        outstandingIssues: payload,
        loading: false,
      };
    case REFRESH_ALERT:
      return {
        ...state,
        refreshIssue: true,
        loading: false,
      };
    case REFRESH_REMOVE:
      return {
        ...state,
        refreshIssue: null,
        loading: false,
      };
    case COMMENT_ERROR:
    case ISSUE_ERROR:
    case PROJECT_ERROR:
    case GET_PROJECTS_ERROR:
    case GET_OUTSTANDING_ISSUES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
