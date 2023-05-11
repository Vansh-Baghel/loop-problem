const mongoose = require('mongoose');
const fs = require('fs')
const Status = require('../models/statusModel');
const Menu = require('../models/menuModel');

require('dotenv').config();

mongoose.set('strictQuery', true);

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const menuFile = JSON.parse(fs.readFileSync(`${__dirname}/menuFileJson.json`, 'utf-8'));
const statusFile = JSON.parse(fs.readFileSync(`${__dirname}/storeStatusJson.json`, 'utf-8'));

const importData = async (req, res) => {
  try {
    await Status.create(statusFile);
    await Menu.create(menuFile);
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
  // exit is used to turn off the terminal as the task gets over.
  process.exit();
};

const deleteData = async (req, res) => {
  try {
    await Status.deleteMany();
    await Menu.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log('Data failed to delete');
  }
  process.exit();
};

console.log(process.argv);

// when we use "node filePath --import", then import will be the 3rd argument.
if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
  