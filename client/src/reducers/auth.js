import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  VALIDATION_ERROR_ALERT,
  REMOVE_VALIDATION_ERROR_ALERT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  validationError: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      localStorage.setItem("currentUserId", payload._id);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        validationError: [],
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        validationError: [],
      };
    case VALIDATION_ERROR_ALERT:
      return {
        ...state,
        validationError: [payload, ...state.validationError],
      };
    case REMOVE_VALIDATION_ERROR_ALERT:
      return {
        ...state,
        validationError: [],
      };
    case LOGOUT:
    case ACCOUNT_DELETED:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      localStorage.removeItem("currentUserId");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
