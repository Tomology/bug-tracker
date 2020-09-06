import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import People from "./components/people/People";
import Team from "./components/team/Team";
import Projects from "./components/projects/Projects";
import Project from "./components/project/Project";
import PrivateRoute from "./components/routing/PrivateRoute";
import "./App.css";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Route exact path="/" component={Landing} />
          <Navbar />
          <main className="mainBody">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/people" component={People} />
              <PrivateRoute exact path="/people/:user_id" component={Profile} />
              <PrivateRoute
                exact
                path="/people/team/:team_id"
                component={Team}
              />
              <PrivateRoute exact path="/projects" component={Projects} />
              <PrivateRoute
                exact
                path="/projects/:project_id"
                component={Project}
              />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </main>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
