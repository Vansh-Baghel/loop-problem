const express = require('express')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const reportRouter = require('./routes/reportRouter');
const cors = require('cors');
app.use(cors());

// Connecting to DB.
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Didn't connect to MongoDB"));

  // Separating router
app.use('/' , reportRouter);

// Server port
const port = 5000;

app.listen(port, () => {
  console.log(`App running from port ${port}`);
});
