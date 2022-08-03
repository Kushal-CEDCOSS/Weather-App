import React, { useEffect, useState } from "react";
import "./App.css";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import cities from "./countries.js";

function App() {
  var today = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [data, setData] = useState([]);
  const [city, setCity] = useState(cities);
  const [result, setResult] = useState([]);
  const [resultCities, setResultCities] = useState([]);

  // Function to find the country to be searched
  const findCountry = () => {
    var input = document.getElementById("inputCountry").value;
    if (input.length === 0) {
      setData([]);
      setResultCities([]);
      setResult([]);
      return;
    }
    var allCountries = Object.keys(city);
    setResult(
      allCountries.filter((country) =>
        country.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  // Function to find the cities of the input country
  const getCities = () => {
    var country = document.getElementById("inputCountry").value;
    if(Object.keys(city).indexOf(country) === -1)
    {
      alert("Please select a country from the suggestion dropdown list only!!");
      return;
    }
    if (country.length === 0) {
      return;
    }
    setResultCities(cities[country]);
  };

  // Function to fill in the country name
  const fill = (e) => {
    document.getElementById("inputCountry").value = e.target.id;
    setResult([]);
  };

  // Function to get weather details.
  const fetchRequest = (e) => {
    var criteria = e.target.id;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${criteria}&APPID=903507f17d707fecd352d38301efba77&units=metric`
    )
      .then((result) => result.json())
      .then((json) => setData(json));
  };

  const showWeatherDetails = () => {
    if (data.length === 0) {
      return;
    }
    if (
      data["weather"][0]["main"] === "Haze" ||
      data["weather"][0]["main"] === "Mist"
    ) {
      document.querySelector("#Card").classList.add("haze");
      document.querySelector("#Card").classList.remove("cloudy");
      document.querySelector("#Card").classList.remove("sunny");
      document.querySelector("#Card").classList.remove("rain");
      document.querySelector("#Card").classList.remove("mist");
    } else if (data["weather"][0]["main"] === "Rain") {
      document.querySelector("#Card").classList.add("rain");
      document.querySelector("#Card").classList.remove("cloudy");
      document.querySelector("#Card").classList.remove("sunny");
      document.querySelector("#Card").classList.remove("haze");
      document.querySelector("#Card").classList.remove("mist");
    } else if (data["weather"][0]["main"] === "Clouds") {
      document.querySelector("#Card").classList.add("cloudy");
      document.querySelector("#Card").classList.remove("rain");
      document.querySelector("#Card").classList.remove("sunny");
      document.querySelector("#Card").classList.remove("haze");
      document.querySelector("#Card").classList.remove("mist");
    } else if (data["weather"][0]["main"] === "Clear") {
      document.querySelector("#Card").classList.add("sunny");
      document.querySelector("#Card").classList.remove("rain");
      document.querySelector("#Card").classList.remove("cloudy");
      document.querySelector("#Card").classList.remove("haze");
      document.querySelector("#Card").classList.remove("mist");
    }
  };

  useEffect(() => {
    showWeatherDetails();
  }, [data]);

  console.log(data);
  console.log([data].length);
  return (
    <div className="App">
      <div className="Row">
        <TextField
          id="inputCountry"
          label="Type a country name"
          variant="outlined"
          onKeyUp={findCountry}
        />
        <Button variant="contained" onClick={getCities}>
          Fetch Cities
        </Button>
        <FormControl sx={{ width: "15%" }}>
          <InputLabel id="demo-simple-select-label">Cities</InputLabel>
          <Select labelId="demo-simple-select-label" id="Cities" label="Cities">
            {resultCities.map((item) => (
              <MenuItem onClick={fetchRequest} value={item} id={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <ul>
        {result.map((item) => (
          <li onClick={fill} id={item}>
            {item}
          </li>
        ))}
      </ul>

      {(data.length === 0 || data.cod === "404") ? <div className="blank"></div> :
        <div id="Card">
          <h1>
            {data.name}, {data.sys.country}
          </h1>
          <h2>
            {monthNames[today.getMonth()]} {today.getDay()},{" "}
            {today.getFullYear()}
          </h2>
          <h1>{data.main.temp}°C</h1>
          <h2>{data.weather[0].description}</h2>
          <h4>Visibity : {data.visibility} Meters</h4>
          <h4>Wind Speed : {data.wind.speed} kmph</h4>
        </div>
      }
    </div>
  );
}

export default App;
