// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState("03"); // Default to March
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [statistics, setStatistics] = useState(null);

  const fetchTransactions = async () => {
    const response = await axios.get("http://localhost:4000/transactions", {
      params: { month, search, page, perPage },
    });
    setTransactions(response.data);
  };

  const fetchStatistics = async () => {
    const response = await axios.get("http://localhost:4000/statistics", {
      params: { month },
    });
    setStatistics(response.data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
  }, [month, search, page]);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("en-US", { month: "long" });
  };

  return (
    <div className="app-container">
      <h1 className="header">Transaction Dashboard</h1>
      <div className="controls">
        <input
          type="text"
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transaction"
        />
        <select
          className="month-select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <TransactionsTable transactions={transactions} />
      <div className="pagination">
        <span>Page No: {page}</span>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={transactions.length < perPage}
        >
          Next
        </button>
      </div>
      <div className="per-page">Per Page: {perPage}</div>

      {statistics && (
        <Statistics statistics={statistics} month={getMonthName(month)} />
      )}

      {month && <BarChart month={month} />}
      <PieChart month={month} />

    </div>
  );
};

export default App;
