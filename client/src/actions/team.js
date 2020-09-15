import axios from "axios";
import { setAlert } from "./alert";

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
} from "./types";

// Get all teams
export const getTeams = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/teams`);

    dispatch({
      type: GET_TEAMS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TEAM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create team
export const createTeam = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/teams", formData, config);

    dispatch({
      type: TEAM_CREATED,
      payload: res.data,
    });

    history.push(`/people/team/${res.data._id}`);

    dispatch(setAlert("Team Created Successfully"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch({
        type: VALIDATION_ERROR,
        payload: errors,
      });
    }
    dispatch({
      type: TEAM_CREATE_ERROR,
    });
  }
};

// Get team by id
export const getTeamById = (teamId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/teams/${teamId}`);

    dispatch({
      type: GET_TEAM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TEAM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit team
export const editTeam = (formData, teamId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(`/api/teams/${teamId}`, formData, config);

    dispatch({
      type: GET_TEAM,
      payload: res.data,
    });

    if (formData.members) {
      dispatch(setAlert("Invites sent out"));
    } else {
      dispatch(setAlert("Profile updated"));
    }
  } catch (err) {
    dispatch({
      type: TEAM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete team
export const deleteTeam = (teamId, history) => async (dispatch) => {
  try {
    await axios.delete(`/api/teams/${teamId}`);

    dispatch(setAlert("Team deleted"));

    history.push("/people");

    dispatch({
      type: DELETE_TEAM,
    });
  } catch (err) {
    dispatch({
      type: TEAM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Remove member
export const removeMember = (teamId, memberId) => async (dispatch) => {
  try {
    await axios.delete(`/api/teams/${teamId}/${memberId}`);

    dispatch({
      type: REMOVE_TEAM_MEMBER,
      payload: memberId,
    });

    dispatch(setAlert("Team member removed"));
  } catch (err) {
    dispatch({
      type: TEAM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Leave team
export const leaveTeam = (teamId, memberId, history) => async (dispatch) => {
  try {
    await axios.delete(`/api/teams/${teamId}/${memberId}`);

    history.push("/people");

    dispatch({
      type: LEAVE_TEAM,
    });

    dispatch(setAlert("You have removed yourself from the team"));
  } catch (err) {
    dispatch({
      type: TEAM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
