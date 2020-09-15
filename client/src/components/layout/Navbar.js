import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const currentUserId = localStorage.getItem("currentUserId");
  const authLinks = (
    <Fragment>
      <input type="checkbox" className="toggle__checkbox" id="navi-toggle" />
      <label htmlFor="navi-toggle" className="toggle__button">
        <span className="toggle__button--icon">&nbsp;</span>
      </label>
      <nav className="navigation">
        <ul className="navigation__list">
          <li className="navigation__item">
            <Link to="/dashboard" className="navigation__link">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="columns"
                className="svg-inline--fa fa-columns fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64V160h160v256zm224 0H288V160h160v256z"
                ></path>
              </svg>
              <span className="navigation__link--text">Dashboard</span>
            </Link>
          </li>
          <li className="navigation__item">
            <Link to="/projects" href="#" className="navigation__link">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="folder"
                className="svg-inline--fa fa-folder fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"
                ></path>
              </svg>
              <span className="navigation__link--text">Projects</span>
            </Link>
          </li>
          <li className="navigation__item">
            <Link to="/people" className="navigation__link">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="user-friends"
                className="svg-inline--fa fa-user-friends fa-w-20"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"
                ></path>
              </svg>
              <span className="navigation__link--text">People</span>
            </Link>
          </li>
          <li className="navigation__item">
            <Link to={`/people/${currentUserId}`} className="navigation__link">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="user"
                className="svg-inline--fa fa-user fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                ></path>
              </svg>
              <span className="navigation__link--text">Profile</span>
            </Link>
          </li>
          <li className="navigation__item">
            <a href="" className="navigation__link" onClick={() => logout()}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="sign-out-alt"
                className="svg-inline--fa fa-sign-out-alt fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
                ></path>
              </svg>
              <span className="navigation__link--text">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </Fragment>
  );

  return (
    <Fragment>
      {!loading && <Fragment>{isAuthenticated && authLinks}</Fragment>}
    </Fragment>
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
