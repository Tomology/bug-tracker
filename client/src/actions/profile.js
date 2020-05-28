import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  PROFILE_ERROR,
  GET_REQUESTS,
  REQUEST_ERROR,
  FRIEND_REQUEST_RESPONSE,
  FRIEND_REQUEST_RESPONSE_SEARCH,
  FRIEND_REQUEST_RESPONSE_DECLINE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
} from "./types";

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

// Accept/Decline Friend's Request
export const respondFriendRequest = (
  responseObject,
  userId,
  requestId
) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let alertText = "";

    if (responseObject.status === true) {
      alertText = "added";
    } else {
      alertText = "declined";
    }

    await axios.post(
      `/api/people/${userId}/requests/${requestId}`,
      responseObject,
      config
    );

    dispatch({
      type: FRIEND_REQUEST_RESPONSE,
      payload: requestId,
    });

    dispatch(setAlert(`Request has been ${alertText}`));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Respond to Friend's Request from User Search Item
export const respondFriendRequestSearch = (
  responseObject,
  userId,
  requestId
) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let alertText = "";

    if (responseObject.status === true) {
      alertText = "added";
    } else {
      alertText = "declined";
    }

    const res = await axios.post(
      `/api/people/${userId}/requests/${requestId}`,
      responseObject,
      config
    );

    console.log(responseObject.status === false);

    if (responseObject.status === true) {
      dispatch({
        type: FRIEND_REQUEST_RESPONSE_SEARCH,
        payload: res.data,
      });
    } else {
      dispatch({
        type: FRIEND_REQUEST_RESPONSE_DECLINE,
        payload: requestId,
      });
    }

    dispatch(setAlert(`Request has been ${alertText}`));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Account
export const deleteAccount = (userId, history) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/people/${userId}`);
    history.push("/");

    dispatch({
      type: CLEAR_PROFILE,
    });
    dispatch({
      type: ACCOUNT_DELETED,
    });

    dispatch(setAlert("Your account has been deleted"));
  } catch (err) {}
};
