import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

var d = new Date();
var hrs = d.getHours();
var mins = d.getMinutes();
var t = hrs + ":" + mins;
var err = 0;
const app = express();
const port = 3000;
const apikey = "788df89c5d46e9f68cd646dff8d905b2";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Function to fetch weather data and process it
async function getWeatherData(city, country) {
  
  const result = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&limit=1&appid=${apikey}&units=imperial`
  );
  const forecast_result = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apikey}`
  );
  var min_fivedaytemps = [];
  var max_fivedaytemps = [];
  var five_days = [];
  var icons = [];
  var count = 0;
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  forecast_result.data.list.forEach((i) => {
    min_fivedaytemps.push(i.main.temp_min);
    max_fivedaytemps.push(i.main.temp_max);
    if (count == 0 || count == 8 || count == 16 || count == 24 || count == 32) {
      five_days.push(days[new Date(i.dt_txt).getDay()]);
    }
    if (
      count == 4 ||
      count == 12 ||
      count == 20 ||
      count == 28 ||
      count == 36
    ) {
      icons.push(i.weather[0].icon);
    }
    count++;
  });
  var day1 = [
    five_days[0],
    icons[0],
    Math.min(...min_fivedaytemps.slice(0, 8)),
    Math.max(...max_fivedaytemps.slice(0, 8)),
  ];
  var day2 = [
    five_days[1],
    icons[1],
    Math.min(...min_fivedaytemps.slice(8, 16)),
    Math.max(...max_fivedaytemps.slice(8, 16)),
  ];
  var day3 = [
    five_days[2],
    icons[2],
    Math.min(...min_fivedaytemps.slice(16, 24)),
    Math.max(...max_fivedaytemps.slice(16, 24)),
  ];
  var day4 = [
    five_days[3],
    icons[3],
    Math.min(...min_fivedaytemps.slice(24, 32)),
    Math.max(...max_fivedaytemps.slice(24, 32)),
  ];
  var day5 = [
    five_days[4],
    icons[4],
    Math.min(...min_fivedaytemps.slice(32, 40)),
    Math.max(...max_fivedaytemps.slice(32, 40)),
  ];
  return {
    time: t,
    data: result.data,
    temp: Math.round(result.data.main.temp),
    temp_min: Math.round(result.data.main.temp_min),
    temp_max: Math.round(result.data.main.temp_max),
    description: result.data.weather[0].description,
    city: city.toUpperCase() + ", " + country,
    feels_like: Math.round(result.data.main.feels_like),
    wind: result.data.wind.speed,
    wind_dir: result.data.wind.deg,
    icon_id: result.data.weather[0].icon,
    sunrise: result.data.sys.sunrise,
    sunset: result.data.sys.sunset,
    humidity: result.data.main.humidity,
    pressure: result.data.main.pressure,
    visibility: result.data.visibility,
    dimenstions: [
      result.data.coord.lon,
      result.data.coord.lat,
      result.data.timezone,
    ],
    rain: [result.data.rain], // rain:{ //    "1hr":20, //    "3hr":30 // },
    snow: [result.data.snow], // snow:{ //     "1hr":20, //     "3hr":30 //  },
    dayone: day1,
    daytwo: day2,
    daythree: day3,
    dayfour: day4,
    dayfive: day5,
    err:err,
  };

}
app.get("/", async (req, res) => {
  const city = "new york";
  const country = "US";
  const data = await getWeatherData(city, country);
  res.render("index.ejs", data);
    err =0;
});
app.post("/submit", async (req, res) => {
    const country = req.body.country;
  const city = req.body.city_name;
try{
    const data = await getWeatherData(city, country);
    res.render("index.ejs", data);
} catch(error){
    err =1;
    res.redirect("/");
}
});
app.listen(port, () => {
  console.log(`Server Listening On Port : ${port}`);
});