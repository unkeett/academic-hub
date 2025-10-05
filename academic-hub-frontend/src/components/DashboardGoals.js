// src/components/DashboardGoals.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardGoals.css';

const DashboardGoals = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const response = await axios.get('http://localhost:5001/api/goals');
    // Sort goals to show incomplete ones first
    const sortedGoals = response.data.sort((a, b) => a.completed - b.completed);
    setGoals(sortedGoals);
  };

  const toggleComplete = async (id, currentStatus) => {
    await axios.put(`http://localhost:5001/api/goals/${id}`, {
      completed: !currentStatus,
    });
    // Refetch goals to update the UI
    fetchGoals();
  };

  return (
    <div className="goals-widget card">
      <h3>Today's Goals</h3>
      {goals.length > 0 ? (
        <ul className="goals-list">
          {goals.map((goal) => (
            <li key={goal._id} className={goal.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleComplete(goal._id, goal.completed)}
              />
              <span>{goal.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No goals set for today. Add one!</p>
      )}
    </div>
  );
};

export default DashboardGoals;