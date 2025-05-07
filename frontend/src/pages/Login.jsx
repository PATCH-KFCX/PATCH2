import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  // Redirect logged-in users to their profile page
  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText('');

    const [user, error] = await logUserIn({ username, password });
    if (error) return setErrorText(error.message);

    setCurrentUser(user);
    navigate(`/users/${user.id}`);
  };

  const navigateHomePage = () => {
     navigate('/')
     
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} aria-labelledby="login-heading">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            autoComplete="username"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" onClick={navigateHomePage}>Log in!</button>
        </form>
        {!!errorText && <p className="error-text">{errorText}</p>}
        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
}
