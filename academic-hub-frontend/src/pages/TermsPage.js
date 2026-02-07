import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./TermsPage.css";

function TermsPage() {
  return (
    <>
      <Navbar />

      <div className="terms-container">
        <h1>Terms & Conditions</h1>
        <p className="terms-updated">Last updated: February 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Academic Hub, you agree to comply with and be
            bound by these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2>2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and all activities under your account.
          </p>
        </section>

        <section>
          <h2>3. Platform Usage</h2>
          <ul>
            <li>Do not misuse or attempt to disrupt the platform</li>
            <li>Do not upload harmful, illegal, or abusive content</li>
            <li>Respect other users and their data</li>
          </ul>
        </section>

        <section>
          <h2>4. Content Ownership</h2>
          <p>
            You retain ownership of content you create. By using Academic Hub,
            you grant us permission to store and display this content for
            platform functionality.
          </p>
        </section>

        <section>
          <h2>5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms without prior notice.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            Academic Hub is provided on an “as-is” basis. We are not liable for
            any indirect or consequential damages arising from platform use.
          </p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>
            These Terms may be updated at any time. Continued use of the
            platform constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            For questions regarding these Terms & Conditions, contact us through
            Academic Hub.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default TermsPage;
