import { NavLink } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import "../styles/SiteHeadingAndNav.css";

export default function SiteHeadingAndNav() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <header className="site-header">
      <a id="logo" href="/">
        <span className="logo-icon">⚕️</span> PATCH
      </a>
      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          {currentUser ? (
            <>
              <li>
                <NavLink to={`/users/${currentUser.id}`}>
                  {currentUser.name}
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
