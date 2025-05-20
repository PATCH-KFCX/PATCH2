import { NavLink } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import "../styles/SiteHeadingAndNav.css";

export default function SiteHeadingAndNav() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <header className="site-header">
      <NavLink id="logo" to="/">
        <span className="logo-icon">⚕️</span> PATCH
      </NavLink>
      <nav>
        <ul className="nav-links">
          {currentUser ? (
            <>
              <li>
                <NavLink to="/Health-Dashboard" className="nav-button">
                  My Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/medication-tracker" className="nav-button">
                  My Rx
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className="nav-button">
                  Symptom Logs
                </NavLink>
              </li>
              <li>
                <NavLink to="/blood-sugar-tracker" className="nav-button">
                  Insulin Logs
                </NavLink>
              </li>
              <li>
                <NavLink to={`/users/${currentUser.id}`} className="nav-button">
                  My Profile
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/sign-up">Sign Up</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
