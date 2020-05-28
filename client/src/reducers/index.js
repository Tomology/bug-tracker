import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import project from "./project";
import team from "./team";
import people from "./people";

export default combineReducers({
  alert,
  auth,
  profile,
  project,
  team,
  people,
});
