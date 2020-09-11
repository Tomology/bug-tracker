import { v4 as uuidv4 } from "uuid";
import {
  SET_ALERT,
  REMOVE_ALERT,
  REFRESH_ALERT,
  REFRESH_REMOVE,
} from "./types";

export const setAlert = (msg, alertType, timeout = 10000) => (dispatch) => {
  const id = uuidv4();

  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    timeout
  );
};

export const closeAlert = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_ALERT,
    payload: id,
  });
};

export const refreshAlert = () => (dispatch) => {
  dispatch({
    type: REFRESH_ALERT,
  });

  setTimeout(() => dispatch({ type: REFRESH_REMOVE }), 10);
};

