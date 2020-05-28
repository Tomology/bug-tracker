import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PEOPLE,
  PEOPLE_ERROR,
  SEARCH_PERSON,
  SEARCH_PERSON_ERROR,
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_ERROR,
  REMOVE_CONTACT,
} from "./types";

// Get all of a user's people
export const getPeople = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/people");

    dispatch({
      type: GET_PEOPLE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PEOPLE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Search for a user by e-mail
export const searchPerson = (searchEmail) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/people/search", searchEmail, config);

    dispatch({
      type: SEARCH_PERSON,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: SEARCH_PERSON_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// Send friend's request
export const sendRequest = (userId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/people/${userId}/requests`);

    dispatch({
      type: FRIEND_REQUEST_SENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: FRIEND_REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Remove contact
export const removeContact = (userId, history) => async (dispatch) => {
  try {
    await axios.delete(`/api/people/${userId}/remove`);

    dispatch(setAlert("User Removed From Contacts"));

    history.push("/people");

    dispatch({
      type: REMOVE_CONTACT,
    });
  } catch (err) {
    dispatch({
      type: PEOPLE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    dispatch(setAlert(err.response.data.msg));
  }
};
