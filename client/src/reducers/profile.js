import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GET_REQUESTS,
  REQUEST_ERROR,
} from "../actions/types";

const initialState = {
  profile: null,
  receivedRequests: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_REQUESTS:
      return {
        ...state,
        receivedRequests: payload,
        loading: false,
      };
    case REQUEST_ERROR:
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
      };
    default:
      return state;
  }
}
