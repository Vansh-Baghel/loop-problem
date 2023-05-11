const Report = require("../models/reportModel");
const Menu = require("../models/menuModel");
const catchAsync = require("./catchAsync");
const Status = require("../models/statusModel");

exports.triggerReport = catchAsync(async (req, res) => {
  const reportID = await Status.find();

  res.status(200).json({
    status: "success",
    id: reportID,
  });
});

exports.triggerMenu = catchAsync(async (req, res) => {
  const reportID = await Menu.find();

  res.status(200).json({
    status: "success",
    id: reportID,
  });
});

exports.getReport = catchAsync(async (req, res) => {
  const menuDetails = await Menu.findOne({ store_id: req.body.report_id });
  const storeDetails = await Status.findOne({ store_id: req.body.report_id });
  const reportDetails = await Report.findOne({ store_id: req.body.report_id });

  //////// Extracting the time from date format. START /////////////

    // If data doesn't exist, assuming that store is open 24 hours.
  if (menuDetails === null || storeDetails === null) {
    console.log("24 hours open");
    // Create a new post
    const newReport = new Report({
      store_id: req.body.report_id,
      uptime_last_hour: 60, //mins
      uptime_last_day: 24, // hours
      update_last_week: 24 * 7, // hours
      downtime_last_hour: 0,
      downtime_last_day: 0,
      downtime_last_week: 0,
    });

    // Save the post to the database
    await newReport.save();

     return res.status(200).json({message: "Shop is open 24 hours (Data is absent in one of the file.)", data : {newReport}});
    }

  console.log(req.body.report_id);
  console.log(storeDetails);
  const dateString = storeDetails.timestamp_utc;

  // Create a new Date object from the string
  const dateFormat = new Date(dateString);

  // Extract the time components and day number
  const weekDay = dateFormat.getDay();
  const hours = dateFormat.getHours();
  const minutes = dateFormat.getMinutes();
  const seconds = dateFormat.getSeconds();

  // Format the time as a string
  const timeString = `${hours}:${minutes}:${seconds}`;

  // //   Previous week function and data
  let previousWeek = getWeekNumber(weekDay); // get the current week number
  function getWeekNumber(weekDay) {
    const firstDayOfYear = new Date(weekDay.getFullYear(), 0, 1);
    const daysSinceFirstDayOfYear = (weekDay - firstDayOfYear) / 86400000;
    return Math.ceil(
      (firstDayOfYear.getDay() + 1 + daysSinceFirstDayOfYear) / 7
    );
  }

  ////////////// Extracting the time from date format. END /////////////////

  console.log(reportDetails);
  if (reportDetails === null) {
    const newReport = new Report({
      store_id: req.body.report_id,
      uptime_last_hour: 0, //mins
      uptime_last_day: 0, // hours
      update_last_week: 0, // hours
      downtime_last_hour: 0,
      downtime_last_day: 0,
      downtime_last_week: 0,
    });

    // Save the post to the database
    await newReport.save();
  }

  // console.log(menuDetails);
  // console.log(timeString + " Time String");
  // console.log(weekDay + " Week Day");
  // console.log(menuDetails.start_time_local + " Start String");
  // console.log(menuDetails.end_time_local + " end Day");

  // Data exists, check the following:
  //  1. Time is within the opening and closing hours.
  // 2. Current day is lesser or equal to the opening days mentioned.
  // If the time is not within the given time, it will print the existing data from the db, which is stored in reportDetails variable.
  else if (
    timeString > menuDetails.start_time_local &&
    timeString < menuDetails.end_time_local &&
    weekDay <= menuDetails.day
  ) {
    // Create a new post
    // 1. Have to calculate in hours as the data itself is updated every hour and not every minute.
    // 2. Calculate the total uptime and downtime based on active and inactive status. If inactive increase the downtime value, else increase the uptime.
    // 3. Using cron, check the status every hour.

    if (storeDetails.status === "active") {
      // We have to uptime last day till the value reaches 24. Once it reaches 24, restart it.

      //   If day has not changed, just increment the value.
      if (weekDay === dateFormat.getDay) {
        const updateReport = await Report.findOneAndUpdate(
          req.body.report_id,
          { store_id: req.body.report_id },
          // Storing a static value as the values are changed every hour therefore it uptime_last_hour and downtime_last_hour would either be 0 or 60.
          { uptime_last_hour: 60 }, //mins
          { $inc: { uptime_last_day: 1 } }, // hours
          //   Increment the last week hour by the active hours per day.
          { $inc: { update_last_week: reportDetails.uptime_last_day } } // hours
        );

        // Save the post to the database
        await updateReport.save();

        // If the day changes, reset the day count for hours to 0.
      } else {
        const updateReport = await Report.findOneAndUpdate(
          req.body.report_id,
          { uptime_last_day: 0 } // hours
        );

        await updateReport.save();
      }

      //   If the week has changed, reset the week count.
      if (getWeekNumber(weekDay) !== previousWeek) {
        const updateReport = await Report.findOneAndUpdate(
          req.body.report_id,
          { update_last_week: 0 } // hours
        );

        // Save the post to the database
        await updateReport.save();
      }
    } else if (storeDetails.status === "inactive") {
      if (weekDay === dateFormat.getDay) {
        const updateReport = await Report.findOneAndUpdate(
          req.body.report_id,
          { store_id: req.body.report_id },
          // Storing a static value as the values are changed every hour therefore it uptime_last_hour and downtime_last_hour would either be 0 or 60.
          { downtime_last_hour: 60 }, //mins
          { $inc: { downtime_last_day: 1 } }, // hours
          //   Increment the last week hour by the active hours per day.
          { $inc: { downdate_last_week: reportDetails.downtime_last_day } } // hours
        );

        // Save the post to the database
        await updateReport.save();

        // If the day changes, reset the day count for hours to 0.
      } else {
        const updateReport = await Report.findOneAndUpdate(
          req.body.report_id,
          { downtime_last_day: 0 } // hours
        );

        await updateReport.save();
      }

      //   If the week has changed, reset the week count.
      if (getWeekNumber(weekDay) !== previousWeek) {
        const updateReport = await Report.findOneAndUpdate(
          req.body.report_id,
          { downdate_last_week: 0 } // hours
        );

        // Save the post to the database
        await updateReport.save();
      }
    }
  } else {
    console.log("Existing data");
    reportDetails = await Report.findOne({ report_id: req.body.report_id });
  }

  res.status(200).json({
    status: "success",
    id: reportDetails,
  });
});
