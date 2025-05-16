import '../styles/Home.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="hero-content">
          <h1>Welcome to PATCH</h1>
          <p>Track symptoms, monitor insulin, and manage your health in one secure place.</p>
          <Link to="/sign-up" className="cta-button">Get Started</Link>
        </div>
      </header>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {[
            {
              title: 'Symptom Tracker',
              desc: 'Log and review symptoms over time for deeper health insights.',
            },
            {
              title: 'Blood Sugar Monitor',
              desc: 'Track your daily insulin levels with visual trends.',
            },
            {
              title: 'User Dashboard',
              desc: 'View and manage logs from one clean and accessible interface.',
            },
            {
              title: 'Secure Access',
              desc: 'Your health data is private and protected with robust security.',
            },
            {
              title: 'Health Insights',
              desc: 'Receive helpful summaries based on your history and logs.',
            },
            {
              title: 'Medication Reminders',
              desc: 'Set custom reminders to stay on track with your care plan.',
            },
          ].map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
