// src/components/TransactionsTable.js
import React from 'react';
import './TransactionsTable.css';

const TransactionsTable = ({ transactions }) => {
  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Category</th>
          <th>Sold</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.id}>
            <td>{transaction.id}</td>
            <td>{transaction.title}</td>
            <td>{transaction.description}</td>
            <td>{transaction.price}</td>
            <td>{transaction.category}</td>
            <td>{transaction.sold ? 'Yes' : 'No'}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
