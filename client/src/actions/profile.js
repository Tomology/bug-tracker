import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  PROFILE_ERROR,
  GET_REQUESTS,
  REQUEST_ERROR,
} from "./types";

import { getProjects } from "./project";
import { getTeams } from "./team";

// Get all pending requests for current user
export const getPendingRequests = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/people/${userId}/requests`);

    dispatch({
      type: GET_REQUESTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get profile by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/people/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(getPendingRequests(userId));

    dispatch(getProjects());
    dispatch(getTeams());
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit Profile
export const editProfile = (formData, userId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(`/api/people/${userId}`, formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Profile Updated"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
