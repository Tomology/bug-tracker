import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GET_REQUESTS,
  REQUEST_ERROR,
  FRIEND_REQUEST_RESPONSE,
  FRIEND_REQUEST_RESPONSE_DECLINE,
  FRIEND_REQUEST_SENT,
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
    case FRIEND_REQUEST_SENT:
      return {
        ...state,
        profile: {
          ...state.profile,
          sentRequest: payload.sentRequest,
          receivedRequest: payload.receivedRequest,
          people: payload.people,
        },
        loading: false,
      };
    case FRIEND_REQUEST_RESPONSE:
      return {
        ...state,
        receivedRequests: state.receivedRequests.filter((invite) => {
          if (invite.user) {
            return invite.user._id !== payload;
          } else {
            return invite._id !== payload;
          }
        }),
        loading: false,
      };
    case FRIEND_REQUEST_RESPONSE_DECLINE:
      return {
        ...state,
        profile: {
          ...state.profile,
          receivedRequest: state.profile.receivedRequest.filter(
            (invite) => invite._id !== payload
          ),
        },
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
