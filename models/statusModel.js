const mongoose = require ('mongoose');

const statusModel = new mongoose.Schema({
    store_id: Number,
    status: String,
    timestamp_utc: Date
});

const Status = mongoose.model('Status', statusModel);

module.exports = Status;