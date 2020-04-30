import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/dashboard">
          {" "}
          <i className="fas fa-code"></i> BugTracker
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/your-work">Your Work</Link>
        </li>
        <li>
          <Link to="/add-issue">+ Create Issue</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/people">People</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <a onClick={logout} href="#!">
            <i className="fas fa-sign-out-alt"></i>{" "}
            <span className="hide-sm">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );

  return (
    <nav className="navbar bg-dark">
      {!loading && (
        <Fragment>
          {isAuthenticated ? authLinks : <div>Not Authenticated</div>}
        </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
