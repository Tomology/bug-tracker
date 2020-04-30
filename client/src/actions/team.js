import axios from "axios";
import { setAlert } from "./alert";

import { GET_TEAMS, GET_TEAMS_ERROR } from "./types";

export const getTeams = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/teams`);

    dispatch({
      type: GET_TEAMS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_TEAMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
