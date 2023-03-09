//Use API to retrieve data
var weather = {
  apiKey: "4e952528a0af8a8992ca6e0865ad1874",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
  },

  displayWeather: function (data) {
    var { name } = data;
    var { icon, description } = data.weather[0];
    var { temp, humidity } = data.main;
    var { speed } = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".temp").innerText = temp + "° F";
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".wind").innerText = "Wind: " + speed + " mph";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".weather").classList.remove("loading");

    // Store the searched city in local storage
    var searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(name)) {
      searches.push(name);
      localStorage.setItem("searches", JSON.stringify(searches));
    }
    this.displaySearches();
  },

  displaySearches: function () {
    var searches = JSON.parse(localStorage.getItem("searches")) || [];
    var html = "";
    for (var i = 0; i < searches.length; i++) {
      html +=
        "<li><button onclick='weather.fetchWeather(\"" +
        searches[i] +
        "\")'>" +
        searches[i] +
        "</button></li>";
    }
    document.querySelector(".searches").innerHTML = html;
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  // Function to display the current date
  displayDate: function () {
    var date = new Date();
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var dateString = date.toLocaleDateString("en-US", options);
    document.querySelector(".date").innerText = dateString;
  },
};

//Function to get content of search bar and search
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

//Function to load weather for a default city when the page is first opened
weather.fetchWeather("Phoenix");

// Display previously searched cities on page load
weather.displaySearches();
