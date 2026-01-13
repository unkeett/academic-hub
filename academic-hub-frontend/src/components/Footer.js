import "./Footer.css";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>Academic Hub</h2>
          <p>Your personal academic organization center.</p>

          <div className="social-icons">
            <a href="https://x.com/home" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/feed/" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com/" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="/">Features</a>
            <a href="/">Integrations</a>
          </div>

          <div>
            <h4>Resources</h4>
            <a href="/">FAQ</a>
            <a href="/">Support</a>
            <a href="/">Help Center</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="/">About</a>
            <a href="/">Careers</a>
            <a href="/">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Academic Hub. All rights reserved.</span>

        <div className="footer-bottom-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
