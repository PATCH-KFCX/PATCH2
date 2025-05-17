import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import { logUserOut } from "../adapters/auth-adapter";
import UpdateUsernameForm from "../components/UpdateUsernameForm";
import "../styles/User.css";

export default function UserPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const { id } = useParams();
  const isCurrentUserProfile = currentUser && currentUser.id === Number(id);

  useEffect(() => {
    const loadUser = async () => {
      const [user, error] = await getUser(id);
      if (error) return setError(error);
      setUserProfile(user);
      setBio(user.bio || "");
      setProfileImage(user.profileImage || null);
    };

    loadUser();
  }, [id]);

  const handleLogout = async () => {
    logUserOut();
    setCurrentUser(null);
    navigate("/");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      // TODO: Upload to backend if needed
    }
  };

  const handleBioSave = () => {
    // TODO: Save bio to backend
    console.log("Bio saved:", bio);
  };

  if (error) return <p>Sorry, there was a problem loading user. Please try again later.</p>;
  if (!userProfile) return null;

  const profileUsername = isCurrentUserProfile ? currentUser.name : userProfile.name;

  return (
    <div className="user-container">
      <div className="user-card">
        <h1>{profileUsername}</h1>

        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-pic" />
        ) : (
          <div className="profile-pic placeholder">No Photo</div>
        )}

        {isCurrentUserProfile && (
          <>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-input" />
            <UpdateUsernameForm currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </>
        )}

        <div className="bio-section">
          <h3>Bio</h3>
          {isCurrentUserProfile ? (
            <>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bio-input" />
              <button className="save-button" onClick={handleBioSave}>Save Bio</button>
            </>
          ) : (
            <p className="bio-text">{bio || "This user has no bio."}</p>
          )}
        </div>

        {isCurrentUserProfile && (
          <button className="logout-button" onClick={handleLogout}>Log Out</button>
        )}
      </div>
    </div>
  );
}
