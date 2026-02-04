import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PrivacyPolicyPage.css";

function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <div className="policy-container">
        <h1>Privacy Policy</h1>
        <p className="policy-updated">Last updated: February 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Academic Hub respects your privacy and is committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, and safeguard your data when you use our platform.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <ul>
            <li>Personal information such as name and email during registration</li>
            <li>Authentication data for secure login</li>
            <li>Content you create (goals, ideas, subjects, tutorials)</li>
            <li>Basic usage and analytics data</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve platform features</li>
            <li>To manage user authentication and security</li>
            <li>To personalize your academic dashboard</li>
            <li>To communicate important updates</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We use industry-standard security practices to protect your data.
            However, no online system is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>
            Academic Hub may use third-party tools for analytics or hosting.
            These services access only the data necessary to perform their
            functions.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. You may also request account deletion at any time.
          </p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Continued use of
            Academic Hub implies acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us through the Academic Hub platform.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default PrivacyPolicyPage;
