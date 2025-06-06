import { useNavigate } from "react-router-dom";
import { updateUsername } from "../adapters/user-adapter";
import "../styles/User.css";

export default function UpdateUsernameForm({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
    const [user, error] = await updateUsername(Object.fromEntries(formData));
    // If our user isn't who they say they are
    // (an auth error on update) log them out
    // We added the httpStatus as a custom cause in our error
    if (error?.cause === 401 || error?.cause === 403) {
      setCurrentUser(null);
      return navigate("/");
    }

    if (error?.cause === 400) {
      alert("There was a problem with your input.");
      return;
    }

    setCurrentUser(user);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="update-heading">
      <h2 id="update-heading">Name: {currentUser.name} </h2>

      <label htmlFor="name">New Name: </label>
      <input type="text" id="name" name="name" />

      <input type="hidden" name="id" value={currentUser.id} />

      <button className="update-name">Update Name</button>
    </form>
  );
}
