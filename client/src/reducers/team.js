import {
  GET_TEAMS,
  TEAM_CREATED,
  TEAM_CREATE_ERROR,
  GET_TEAM,
  TEAM_ERROR,
  DELETE_TEAM,
  REMOVE_TEAM_MEMBER,
  VALIDATION_ERROR,
  LEAVE_TEAM,
} from "../actions/types";

const initialState = {
  teams: null,
  team: null,
  members: null,
  creator: null,
  projects: null,
  loading: true,
  error: {},
  validationErrors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TEAMS:
      return {
        ...state,
        teams: payload,
        loading: false,
      };
    case TEAM_CREATED:
      return {
        ...state,
        teams: [payload, ...state.teams],
        loading: false,
      };
    case GET_TEAM:
      return {
        ...state,
        team: payload.team,
        creator: payload.creator,
        members: payload.teamMembers,
        projects: payload.projects,
        loading: false,
      };
    case REMOVE_TEAM_MEMBER:
      return {
        ...state,
        members: state.members.filter((member) => member._id !== payload),
        loading: false,
      };
    case LEAVE_TEAM:
    case DELETE_TEAM:
      return {
        ...state,
        team: null,
        creator: null,
        members: null,
        projects: null,
        loading: false,
      };
    case VALIDATION_ERROR:
      return {
        ...state,
        validationErrors: payload,
        loading: false,
      };
    case TEAM_ERROR:
    case TEAM_CREATE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
