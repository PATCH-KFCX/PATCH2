import '../styles/Home.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="hero-content">
          <h1>Welcome to PATCH</h1>
          <p>Your personal health assistant for tracking symptoms and managing appointments.</p>
          <Link to="/sign-up" className="cta-button">Get Started</Link>
        </div>
      </header>
      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Symptom Tracker</h3>
            <p>Log and monitor your symptoms over time to identify patterns and share with your doctor.</p>
          </div>
          <div className="feature-card">
            <h3>Appointment Scheduler</h3>
            <p>Easily schedule appointments with the right specialists based on your symptoms.</p>
          </div>
          <div className="feature-card">
            <h3>User Profiles</h3>
            <p>Manage your personal information and view your health history in one place.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Login</h3>
            <p>Access your data securely with our robust authentication system.</p>
          </div>
          <div className="feature-card">
            <h3>Health Insights</h3>
            <p>Get personalized health insights based on your logged symptoms and activities.</p>
          </div>
          <div className="feature-card">
            <h3>Medication Reminders</h3>
            <p>Set reminders to take your medications on time and stay on top of your health.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
