import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Academic Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
