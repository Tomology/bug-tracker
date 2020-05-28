import {
  GET_PEOPLE,
  PEOPLE_ERROR,
  SEARCH_PERSON_ERROR,
  SEARCH_PERSON,
  FRIEND_REQUEST_RESPONSE_SEARCH,
  FRIEND_REQUEST_ERROR,
  REMOVE_CONTACT,
} from "../actions/types";

const initialState = {
  people: null,
  person: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PEOPLE:
      return { ...state, people: payload, loading: false };
    case SEARCH_PERSON:
      return { ...state, person: payload, loading: false };
    case REMOVE_CONTACT:
      return { ...state, person: null, loading: false };
    case FRIEND_REQUEST_RESPONSE_SEARCH:
      return { ...state, people: [payload, ...state.people] };
    case SEARCH_PERSON_ERROR:
    case FRIEND_REQUEST_ERROR:
      return { ...state, error: payload, person: null, loading: false };
    case PEOPLE_ERROR:
      return { ...state, error: payload, loading: false };
    default:
      return state;
  }
}
