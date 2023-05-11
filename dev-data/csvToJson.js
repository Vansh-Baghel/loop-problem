const path = require('path');
const fs = require('fs');
const csvFilePath = path.join(__dirname, './store status.csv')
const menuFilePath = path.join(__dirname, './Menuhours.csv')
const csv = require('csvtojson');

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    const jsonString = JSON.stringify(jsonObj);

    fs.writeFile(path.join(__dirname, './storeStatusJson.json'), jsonString, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('CSV file converted to JSON');
    });
  })
  .catch((err) => {
    console.error(err);
  });
  
csv()
  .fromFile(menuFilePath)
  .then((jsonObj) => {
    const jsonString = JSON.stringify(jsonObj);

    fs.writeFile(path.join(__dirname, './menuFileJson.json'), jsonString, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('CSV file converted to JSON');
    });
  })
  .catch((err) => {
    console.error(err);
  });
