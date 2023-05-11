## Task Explanation

- We have to store the CSV data which is given whose parameters are : _store_id, timestamp_utc, status_.
- We are given business hours whose schema parameters are : store_id, dayOfWeek(0=Monday, 6=Sunday), start_time_local, end_time_local.
- Timezone is also given, which IMO is not really required for the output.
- If the store_id doesn't match or data is missing, assume it is open 24\*7.
- We have to output the report which contains: _store_id, uptime_last_hour(in minutes), uptime_last_day(in hours), update_last_week(in hours), downtime_last_hour(in minutes), downtime_last_day(in hours), downtime_last_week(in hours)_
- Uptime === Active hours
- Downtime === inactive hours

## Issue with data provided

- The data which is provided is too big for json to push inside the mongodb.
- I used csvtojson package to convert the csv file to json to try and push the data in the mongodb by converting .csv to .json file which unfortunately failed as the data was too big.
- Next, I found another approach to store the data ie by manually deleting the number of data and storing atleast 60 values for each. The problem during this approach was that the id with such limitation of data were not equal. For this, I copied the ids in the excel sheets and made them equal.
- This was also not the best approach as the data was very limited.
- Lastly, I manually imported the data in mongodb using Add Data option in it.
- This worked well, took comparatively more time to store the data.

## Code/ Logic Explanation

- There are 3 routes/ urls at port 5000: _/get_report , /trigger_report and /trigger_menu_.
- trigger_report gets all the data which is stored in the store status.csv file. It requires no input.
- trigger_menu gets all the data which is stored in the menu hours.csv file. It requires no input.
- get_report gets the report by passing the report_id. It requires report_id.
- If the report_id doesn't exist in reports data, there will be new report which will be generated with new values.
- To check the backend every hour, we can use Task Scheduler in Windows and set the task to 1 day and triggering every hour, which will check the backend file at every hour interval for 1 day (could also select infinite days). 
![Screenshot 2023-05-08 191454](https://user-images.githubusercontent.com/103327712/236852198-7144283a-30f1-4efb-9f1c-511a4d889d13.png)
- There are few variables which would get the number of current week day (as per the data) , hours, minutes, seconds extracted from the date format, timeString which is combined result of hour, min, sec, and previousWeek which keeps the track if the week is changed or not, these variables are:
  weekDay
  hours
  minutes
  seconds
  timeString
  previousWeek

## Calculation Approach

- If the data is not present, then set the uptime maximum which could exist.
- For hour, keep 60 (in minutes); for past week, keep 24 \* 7 (in hours); for past day, keep 24 (in hours).
- If the data is present, create a new report at first and start calculating every hour through task scheduler.
- Once the user checks the report for the first time, then from second time, it will get the updated values.
- If the previous day number doesn't match the current day number, we would have to reset the day data as total active or inactive hours couldn't be more than 24 hours.
- If the week number is changed, reset the week number.

## Frontend (If it was to be made)
* API calls could be done using axios.
```JS
const ENDPOINT_BACKEND = "https://localhost:5000";

React.useEffect(() => {
  axios.get(`${ENDPOINT_BACKEND}/trigger_report`).then((resp) => {
    setAllReportIds(resp.data);
    console.log(getAllReportIds);
  });
}, []);

React.useEffect(() => {
  axios
    .post(`${ENDPOINT_BACKEND}/get_report/`, { report_id: 123 })
    .then((resp) => {
      console.log(resp.data);
    });
});
```

## Outcome

![Screenshot 2023-05-08 194141](https://user-images.githubusercontent.com/103327712/236852157-97fc4292-c1d5-49b6-949f-32be3803237b.png)
![Screenshot 2023-05-08 194130](https://user-images.githubusercontent.com/103327712/236852164-32cf98b8-e39a-473d-a46f-cecc2909b063.png)

# Thank You for making it till here!!
![image](https://user-images.githubusercontent.com/103327712/236854191-d8adbf58-a7e6-4737-9288-019d1f9d9d23.png)

