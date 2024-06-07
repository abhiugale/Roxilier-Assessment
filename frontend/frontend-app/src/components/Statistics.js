// src/components/Statistics.js
import React from 'react';
import './Statistics.css';

const Statistics = ({ statistics, month }) => {
  return (
    <div className="statistics-container">
      <h2 className="statistics-header">Statistics - {month}</h2>
      <div className="statistics-card">
        <p><strong>Total sale:</strong> {statistics.totalSales}</p>
        <p><strong>Total sold items:</strong> {statistics.totalSoldItems}</p>
        <p><strong>Total not sold items:</strong> {statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
