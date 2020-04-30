import axios from "axios";
import { setAlert } from "./alert";

import { GET_PROJECTS, GET_PROJECTS_ERROR } from "./types";

export const getProjects = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects`);

    dispatch({
      type: GET_PROJECTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROJECTS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
