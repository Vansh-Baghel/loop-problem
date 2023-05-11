const mongoose = require ('mongoose');

const menuModel = new mongoose.Schema({
    store_id: Number,
    day: String,
    start_time_local: String,
    end_time_local: String
});

const Menu = mongoose.model('Menu', menuModel);

module.exports = Menu;