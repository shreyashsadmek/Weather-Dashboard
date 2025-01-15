const apiKey = 'f8fbfcb4a989483c929183319251501';

function fetchWeather() {
    const city = document.getElementById('city').value.trim();
    
    if (!city) {
        displayError("Please enter a city name.");
        return;
    }

    const currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastWeatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => response.json()),
        fetch(forecastWeatherUrl).then(response => response.json())
    ])
    .then(data => {
        const currentData = data[0];
        const forecastData = data[1];

        displayCurrentWeather(currentData);
        displayForecastWeather(forecastData);
    })
    .catch(error => {
        displayError("Error fetching data.");
        console.error('Error:', error.message);
    });
}

function displayCurrentWeather(data) {
    const { name, region, country, localtime } = data.location;
    const { temp_c, humidity, condition, wind_mph, is_day } = data.current;
    
    const dayOrNight = is_day === 1 ? "Day" : "Night";

    const weatherContent = `
        <h2>${name}, ${region}, ${country}</h2>
        <p><strong>Condition:</strong> ${condition.text}</p>
        <p><strong>Temperature:</strong> ${temp_c}°C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind_mph} mph</p>
        <p><strong>Day/Night:</strong> ${dayOrNight}</p>
        <p><strong>Time:</strong> ${localtime}</p>
    `;
    document.getElementById('weather-info').innerHTML = weatherContent;
}

function displayForecastWeather(data) {
    const forecastInfo = `
        <h3>7-Day Weather Forecast</h3>
        <ul>
            ${data.forecast.forecastday.map(day => `
                <li>${day.date}: 
                    ${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C, 
                    Condition: ${day.day.condition.text}</li>
            `).join('')}
        </ul>
    `;
    document.getElementById('forecast-info').innerHTML = forecastInfo;
}

function displayError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    if (!document.querySelector('.error-message')) {
        document.body.appendChild(errorMessage);
    }
}
