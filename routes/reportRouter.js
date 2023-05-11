const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const reportController = require(`../controller/reportController`);

router.route('/trigger_report').get(reportController.triggerReport);

router.route('/trigger_menu').get(reportController.triggerMenu);

router.route('/get_report').post(jsonParser, reportController.getReport);

module.exports = router;
