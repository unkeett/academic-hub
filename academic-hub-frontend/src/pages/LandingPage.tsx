import React, { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBullseye, FaLightbulb, FaVideo, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const BookIcon = FaBook as ElementType;
const BullseyeIcon = FaBullseye as ElementType;
const LightbulbIcon = FaLightbulb as ElementType;
const VideoIcon = FaVideo as ElementType;
const GradCapIcon = FaGraduationCap as ElementType;
const CheckCircleIcon = FaCheckCircle as ElementType;

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="logo">
            <GradCapIcon className="logo-icon" />
            ACADEMIC <span>HUB</span>
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <Link to="/dashboard" className="nav-link btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">Revolutionizing Student Success</div>
          <h1>Master Your Academic Journey</h1>
          <p>Academic Hub is the all-in-one workspace for modern students. Organize your course materials, track your progress, and stay motivated throughout your studies.</p>
          <div className="hero-ctas">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary large">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary large">Get Started for Free</Link>
                <Link to="/login" className="btn-secondary large">Sign In</Link>
              </>
            )}
          </div>
          <div className="hero-trust">
            <div className="trust-item"><CheckCircleIcon /> Free for students</div>
            <div className="trust-item"><CheckCircleIcon /> No credit card required</div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <div className="app-preview-mockup">
              <div className="mock-sidebar">
                <div className="mock-sidebar-item"></div>
                <div className="mock-sidebar-item"></div>
                <div className="mock-sidebar-item"></div>
              </div>
              <div className="mock-content">
                <div className="mock-center-brand">
                  <GradCapIcon className="mock-brand-icon-large" />
                  <h2>ACADEMIC HUB</h2>
                  <p className="mock-tagline">Simplify your studies, amplify your success.</p>
                </div>
                <div className="mock-grid">



                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Create your profile</h3>
            <p>Sign up in seconds and set up your academic profile for the current semester.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Add your subjects</h3>
            <p>Organize your courses and link all your study materials in one central location.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Set and achieve goals</h3>
            <p>Define your academic milestones and use our tracking tools to stay on course.</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Everything You Need to Succeed</h2>
          <p>Powerful tools designed specifically for the challenges of modern academia.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><BookIcon /></div>
            <h3>Subject Management</h3>
            <p>Keep all your course materials, notes, and resources organized by subject. Never lose a syllabus or a key reading again.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BullseyeIcon /></div>
            <h3>Goal Tracking</h3>
            <p>Set academic milestones, track study hours, and monitor your progress towards your GPA targets.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><LightbulbIcon /></div>
            <h3>Idea Lab</h3>
            <p>Capture research ideas, project concepts, and creative thoughts. Tag them by subject for easy retrieval later.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><VideoIcon /></div>
            <h3>Tutorial Library</h3>
            <p>Save and organize educational videos and tutorials. Create custom playlists for complex topics you're mastering.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-header">
          <h2>Loved by Students Worldwide</h2>
          <p>Join thousands of students who have transformed their study habits.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>"Academic Hub changed how I manage my finals. Everything is so much more organized now! I went from feeling overwhelmed to feeling in control."</p>
            <div className="author">
              <div className="author-info">
                <strong>Sarah J.</strong>
                <span>Computer Science Student</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>"The goal tracking feature keeps me motivated. I love seeing my progress over the semester. It's the first thing I open every morning."</p>
            <div className="author">
              <div className="author-info">
                <strong>Mark T.</strong>
                <span>Engineering Major</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>"Finally, a tool that understands how students actually work. The Idea Lab is perfect for my thesis research notes."</p>
            <div className="author">
              <div className="author-info">
                <strong>Elena R.</strong>
                <span>Biology Researcher</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to excel in your studies?</h2>
          <p>Join Academic Hub today and start organizing your way to success.</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary large">Go to Dashboard</Link>
          ) : (
            <Link to="/register" className="btn-primary large">Create Your Free Account</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
