// src/pages/HomePage.js
import React from 'react';
import DashboardSubjects from '../components/DashboardSubjects';
import DashboardGoals from '../components/DashboardGoals'; // Import the new component
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>This is your main content area...</p>
      
      <DashboardSubjects />
      <DashboardGoals /> {/* Add the goals widget here */}
    </div>
  );
};

export default HomePage;