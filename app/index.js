const dotenv = require('dotenv');
const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

// Routes
const authRoutes = require('./routes/AuthRoutes.js');
const loanRoutes = require('./routes/LoanRoutes.js');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());

app.post('/', (req, res) => {
  res.send("Welcome")
})

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

module.exports = {
  app
};