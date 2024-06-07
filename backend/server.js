const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const ProductTransaction = require("./models/ProductTransaction");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/transactions", {});

//Database Initialization API
app.get("/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await ProductTransaction.deleteMany({});
    await ProductTransaction.insertMany(response.data);
    res.send("Database initialized with seed data");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Transactions API to fetch data on transaction table

app.get("/transactions", async (req, res) => {
  const { month, search, page, perPage } = req.query;

  const startDate1 = new Date(`2021-${month.padStart(2, "0")}-01`);
  const endDate1 = new Date(
    startDate1.getFullYear(),
    startDate1.getMonth() + 1,
    0
  );

  const startDate2 = new Date(`2022-${month.padStart(2, "0")}-01`);
  const endDate2 = new Date(
    startDate2.getFullYear(),
    startDate2.getMonth() + 1,
    0
  );

  const transactionsPromise = ProductTransaction.find({
    $or: [
      { dateOfSale: { $gte: startDate1, $lte: endDate1 } },
      { dateOfSale: { $gte: startDate2, $lte: endDate2 } },
    ],
    title: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));

  try {
    const transactions = await transactionsPromise;
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//Statistics API to fetch data

app.get("/statistics", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  const startDate1 = new Date(`2021-${month.padStart(2, "0")}-01`);
  const endDate1 = new Date(
    startDate1.getFullYear(),
    startDate1.getMonth() + 1,
    0
  );

  const startDate2 = new Date(`2022-${month.padStart(2, "0")}-01`);
  const endDate2 = new Date(
    startDate2.getFullYear(),
    startDate2.getMonth() + 1,
    0
  );

  const transactions = await ProductTransaction.find({
    $or: [
      { dateOfSale: { $gte: startDate1, $lte: endDate1 } },
      { dateOfSale: { $gte: startDate2, $lte: endDate2 } },
    ],
  });

  const totalSales = transactions.reduce((acc, curr) => acc + curr.price, 0);
  const totalSoldItems = transactions.filter((t) => t.sold).length;
  const totalNotSoldItems = transactions.filter((t) => !t.sold).length;

  res.json({ totalSales, totalSoldItems, totalNotSoldItems });
});
//Bar chart API to fetch data in BarChart

app.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  const startDate1 = new Date(`2021-${month.padStart(2, "0")}-01`);
  const endDate1 = new Date(
    startDate1.getFullYear(),
    startDate1.getMonth() + 1,
    0
  );

  const startDate2 = new Date(`2022-${month.padStart(2, "0")}-01`);
  const endDate2 = new Date(
    startDate2.getFullYear(),
    startDate2.getMonth() + 1,
    0
  );

  const transactions = await ProductTransaction.find({
    $or: [
      { dateOfSale: { $gte: startDate1, $lte: endDate1 } },
      { dateOfSale: { $gte: startDate2, $lte: endDate2 } },
    ],
  });

  const priceRanges = {
    "0-100": 0,
    "101-200": 0,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 0,
    "601-700": 0,
    "701-800": 0,
    "801-900": 0,
    "901-above": 0,
  };

  transactions.forEach((t) => {
    if (t.price <= 100) priceRanges["0-100"]++;
    else if (t.price <= 200) priceRanges["101-200"]++;
    else if (t.price <= 300) priceRanges["201-300"]++;
    else if (t.price <= 400) priceRanges["301-400"]++;
    else if (t.price <= 500) priceRanges["401-500"]++;
    else if (t.price <= 600) priceRanges["501-600"]++;
    else if (t.price <= 700) priceRanges["601-700"]++;
    else if (t.price <= 800) priceRanges["701-800"]++;
    else if (t.price <= 900) priceRanges["801-900"]++;
    else priceRanges["901-above"]++;
  });

  res.json(priceRanges);
});
//Pie chart API to fetch data in PieChart

app.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  const startDate1 = new Date(`2021-${month.padStart(2, "0")}-01`);
  const endDate1 = new Date(
    startDate1.getFullYear(),
    startDate1.getMonth() + 1,
    0
  );

  const startDate2 = new Date(`2022-${month.padStart(2, "0")}-01`);
  const endDate2 = new Date(
    startDate2.getFullYear(),
    startDate2.getMonth() + 1,
    0
  );

  const transactions = await ProductTransaction.find({
    $or: [
      { dateOfSale: { $gte: startDate1, $lte: endDate1 } },
      { dateOfSale: { $gte: startDate2, $lte: endDate2 } },
    ],
  });

  const categoryCounts = transactions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  res.json(categoryCounts);
});

//Combined API to fetch data of all API

app.get("/combined-data", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  const startDate1 = new Date(`2021-${month.padStart(2, "0")}-01`);
  const endDate1 = new Date(
    startDate1.getFullYear(),
    startDate1.getMonth() + 1,
    0
  );

  const startDate2 = new Date(`2022-${month.padStart(2, "0")}-01`);
  const endDate2 = new Date(
    startDate2.getFullYear(),
    startDate2.getMonth() + 1,
    0
  );

  const transactionsPromise = ProductTransaction.find({
    $or: [
      { dateOfSale: { $gte: startDate1, $lte: endDate1 } },
      { dateOfSale: { $gte: startDate2, $lte: endDate2 } },
    ],
  });

  const statisticsPromise = axios.get(
    `http://localhost:${PORT}/statistics?month=${month}`
  );
  const barChartPromise = axios.get(
    `http://localhost:${PORT}/bar-chart?month=${month}`
  );
  const pieChartPromise = axios.get(
    `http://localhost:${PORT}/pie-chart?month=${month}`
  );

  const [transactions, statistics, barChart, pieChart] = await Promise.all([
    transactionsPromise,
    statisticsPromise,
    barChartPromise,
    pieChartPromise,
  ]);

  res.json({
    transactions,
    statistics: statistics.data,
    barChart: barChart.data,
    pieChart: pieChart.data,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
