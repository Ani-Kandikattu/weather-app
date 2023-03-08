const form = document.querySelector("form");
const forecastDiv = document.querySelector("#forecast");
const previousCitiesDiv = document.querySelector("#previousCities");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = form.elements.cityInput.value;
  getForecast(city);
});

function getPreviousCities() {
  const cities = [];
  for (let i = 0; i < localStorage.length; i++) {
    cities.push(localStorage.key(i));
  }
  return cities;
}

function createPreviousCityButton(city) {
  const button = document.createElement("button");
  button.textContent = city;
  button.addEventListener("click", () => {
    const savedForecast = getSavedForecast(city);
    if (savedForecast) {
      showForecast(savedForecast);
    } else {
      forecastDiv.innerHTML = "<p>No forecast data found for this city.</p>";
    }
  });
  return button;
}

function showPreviousCities() {
  previousCitiesDiv.innerHTML = "";
  const cities = getPreviousCities();
  cities.forEach((city) => {
    const button = createPreviousCityButton(city);
    previousCitiesDiv.appendChild(button);
  });
}

async function getForecast(city) {
  const apiKey = "4e952528a0af8a8992ca6e0865ad1874";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    showForecast(data);
    saveForecast(city, data);
    showPreviousCities();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    const savedForecast = getSavedForecast(city);
    if (savedForecast) {
      showForecast(savedForecast);
    } else {
      forecastDiv.innerHTML =
        "<p>There was a problem getting the forecast for this city.</p>";
    }
  }
}

function showForecast(data) {
  const forecastArray = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );
  forecastDiv.innerHTML = "";
  forecastArray.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    const temp = item.main.temp;
    const description = item.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
    const forecastItem = `
			<div>
				<p>${date}</p>
				<p>${temp}&deg;C</p>
				<p>${description}</p>
				<img src="${iconUrl}" alt="${description}">
			</div>
		`;
    forecastDiv.insertAdjacentHTML("beforeend", forecastItem);
  });
}

function saveForecast(city, data) {
  const forecastString = JSON.stringify(data);
  localStorage.setItem(city, forecastString);
}

function getSavedForecast(city) {
  const forecastString = localStorage.getItem(city);
  if (forecastString) {
    const forecastData = JSON.parse(forecastString);
    return forecastData;
  } else {
    return null;
  }
}
