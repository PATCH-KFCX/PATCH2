import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { registerUser } from "../adapters/auth-adapter";
import "../styles/SignUp.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [errorText, setErrorText] = useState("");
  const [name, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");
    if (!name || !age || !email || !password)
      return setErrorText("Missing name or password");

    const [user, error] = await registerUser({ name, age, email, password });
    if (error) return setErrorText(error.message);

    setCurrentUser(user);
    navigate("/");
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            autoComplete="name"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="age">Age</label>
          <input
            autoComplete="age"
            type="number"
            id="age"
            name="age"
            min="1"
            max="130"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            autoComplete="email"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="off"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up Now!</button>
        </form>
        {!!errorText && <p className="error-text">{errorText}</p>}
        <p>
          <Link to="/login">Already have an account? Log in!</Link>
        </p>
      </div>
    </div>
  );
}
