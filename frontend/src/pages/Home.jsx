import '../styles/Home.css';
import { Link } from 'react-router-dom';
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="hero-content">
          <h1>PATCH</h1>
          <p>Track symptoms. Monitor insulin. Manage your health securely.</p>
          <Link to="/sign-up" className="cta-button">Get Started</Link>
        </div>
      </header>

      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          {[
            { title: 'Symptom Tracker', desc: 'Log and review symptoms over time.' },
            { title: 'Blood Sugar Monitor', desc: 'Track your daily insulin levels visually.' },
            { title: 'User Dashboard', desc: 'Manage all your logs in one place.' },
            { title: 'Secure Access', desc: 'Private and encrypted data handling.' },
            { title: 'Health Insights', desc: 'Get summaries based on your logs.' },
            { title: 'Medication Reminders', desc: 'Stay on top of your care plan.' },
          ].map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
