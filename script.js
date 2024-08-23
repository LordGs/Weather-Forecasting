document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherByCity('San Fernando');

    document.getElementById('getWeather').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value;
        if (city) {
            fetchWeatherByCity(city);
        } else {
            alert('Please enter a city name.');
        }
    });
});

function fetchWeatherByCity(city) {
    const apiKey = '68b3a72e861cb6da79efa4f0d83af86f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&q=${city}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data); 
            
            if (data && data.city && data.list) {
                const cityName = data.city.name;
                const country = data.city.country;
                displayWeather(data, cityName, country);
            } else {
                console.error('Invalid data structure:', data);
                alert('Received unexpected data format from API.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please check your city name or try again later.');
        });
}

function displayWeather(data, city, country) {
    const location = document.getElementById('locName');
    const cityLabel = document.getElementById('cityLabel');
    const todayDate = document.getElementById('todayDate');
    const todayTemp = document.getElementById('todayTemp');
    const todayDescription = document.getElementById('todayDescription');
    const todayTime = document.getElementById('todayTime');
    const todayHumidity = document.getElementById('todayHumidity');
    const todayWind = document.getElementById('todayWind');
    const countryFlag = document.getElementById('countryFlag');
    const dayNightIcon = document.getElementById('dayNightIcon');
    const weatherSummary = document.getElementById('weatherSummary'); 
    const todayContainer = document.getElementById('today');
    const otherDaysContainer = document.getElementById('otherDays');

    // Clear 
    location.textContent = `${country}`;
    cityLabel.textContent = `${city}`;
    todayDate.textContent = '';
    todayTemp.textContent = '';
    todayDescription.textContent = '';
    todayTime.textContent = '';
    todayHumidity.textContent = '';
    todayWind.textContent = '';
    countryFlag.src = `https://flagpedia.net/data/flags/h80/${country.toLowerCase()}.png`; 
    dayNightIcon.src = ''; 
    weatherSummary.textContent = ''; 
    otherDaysContainer.innerHTML = '';

    const forecastList = data.list;
    let days = {};

    // organize
    forecastList.forEach(forecast => {
        let date = new Date(forecast.dt * 1000).toLocaleDateString('en-GB', { weekday: 'long', month: 'short', day: 'numeric' });
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(forecast);
    });

    let dayCount = 0;
    for (let day in days) {
        if (dayCount === 0) {
            let forecast = days[day][0];
            if (forecast) {
                let time = new Date(forecast.dt * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                let temp = `${forecast.main.temp}°`;
                let description = forecast.weather[0].description;
                let dayOrNight = new Date(forecast.dt * 1000).getHours() >= 6 && new Date(forecast.dt * 1000).getHours() < 18 ? 'day' : 'night';
                let dayNightIconUrl = dayOrNight === 'day' ? 'local/sun.png' : 'local/moon.png'; // Update with your local image paths
                let humidity = `Humidity: ${forecast.main.humidity}%`;
                let windSpeed = `Wind Speed: ${forecast.wind.speed} m/s`;

                todayDate.textContent = `${day}`;
                todayTemp.textContent = `${temp}`;
                todayDescription.textContent = `Weather: ${description}`;
                todayTime.textContent = `Time: ${time}`;
                todayHumidity.textContent = humidity;
                todayWind.textContent = windSpeed;
                dayNightIcon.src = dayNightIconUrl;

                // weather summary
                let summary = createWeatherSummary(description);
                weatherSummary.textContent = summary;
            }
        } else if (dayCount < 5) {
            let forecast = days[day][0];
            if (forecast) {
                let dayElement = document.createElement('div');
                dayElement.classList.add('card', 'day-card');

                let dateElement = document.createElement('h2');
                dateElement.classList.add('dayDate');
                dateElement.textContent = day;
                dayElement.appendChild(dateElement);

                let temp = `${forecast.main.temp} °C`;
                let description = forecast.weather[0].description;
                let iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

                let icon = document.createElement('img');
                icon.classList.add('dayIcon');
                icon.src = iconUrl;
                icon.alt = description;

                let tempElement = document.createElement('p');
                tempElement.classList.add('dayTemp');
                tempElement.textContent = `${temp}`;

                let descriptionElement = document.createElement('p');
                descriptionElement.classList.add('dayDescription');
                descriptionElement.textContent = `${description}`;

                dayElement.appendChild(icon);
                dayElement.appendChild(tempElement);
                dayElement.appendChild(descriptionElement);

                otherDaysContainer.appendChild(dayElement);
            }
        }

        dayCount++;
    }
}

function createWeatherSummary(description) {
    if (description.includes('rain')) {
        return 'Today, you can expect rain throughout the day. Don’t forget your umbrella!';
    } else if (description.includes('clear')) {
        return 'The weather will be clear and sunny today. It’s a great day to be outside!';
    } else if (description.includes('cloud')) {
        return 'Cloudy skies are expected for today. It might be a bit gloomy, so dress accordingly.';
    } else if (description.includes('snow')) {
        return 'Snow is expected today, so prepare for a winter wonderland and stay warm!';
    } else if (description.includes('storm')) {
        return 'Stormy weather is on the way today. It’s best to stay indoors and stay safe.';
    } else {
        return `The weather today is characterized by ${description}. Please plan your day accordingly.`;
    }
}

