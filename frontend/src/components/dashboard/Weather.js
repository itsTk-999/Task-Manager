import React, { useState, useEffect } from 'react';
import axios from 'axios';
// We don't need the Weather.css file, as the styles are in DashboardPage.css

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  const onSuccess = async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      // 1. Get weather data
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
      const res = await axios.get(url);
      
      // 2. Get city name
      const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const geoRes = await axios.get(geoUrl);

      // 3. Combine and save the data
      setWeather({
        ...res.data.current_weather,
        city: geoRes.data.city || geoRes.data.locality || 'Your Location',
      });

    } catch (err) {
      console.error('API Error:', err);
      setError('Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => {
    console.error('Geolocation Error:', err);
    setError('Location permission denied. Cannot show local weather.');
    setLoading(false);
  };

  /**
   * Maps Open-Meteo weather codes to OpenWeatherMap icon IDs.
   */
  const getWeatherInfo = (code, isDay) => {
    const iconSuffix = (isDay === 1) ? 'd' : 'n';
    let iconCode = '01'; // Default: clear sky
    let description = 'Clear';

    if (typeof code !== 'number') {
      return {
        desc: 'Weather',
        iconUrl: `https://openweathermap.org/img/wn/01d@2x.png` // Default
      };
    }

    switch (code) {
      case 0:
        iconCode = '01';
        description = 'Clear Sky';
        break;
      case 1:
        iconCode = '02';
        description = 'Mainly Clear';
        break;
      case 2:
        iconCode = '03';
        description = 'Partly Cloudy';
        break;
      case 3:
        iconCode = '04';
        description = 'Overcast';
        break;
      case 45:
      case 48:
        iconCode = '50';
        description = 'Fog';
        break;
      case 51:
      case 53:
      case 55:
        iconCode = '09';
        description = 'Drizzle';
        break;
      case 61:
      case 63:
      case 65:
        iconCode = '10';
        description = 'Rain';
        break;
      case 80:
      case 81:
      case 82:
        iconCode = '09';
        description = 'Rain Showers';
        break;
      case 95:
      case 96:
      case 99:
        iconCode = '11';
        description = 'Thunderstorm';
        break;
      default:
        iconCode = '01';
        description = 'Clear';
    }

    return {
      desc: description,
      iconUrl: `https://openweathermap.org/img/wn/${iconCode}${iconSuffix}@2x.png`
    };
  };
  
  /**
   * Renders the main content.
   */
  const renderContent = () => {
    if (loading) {
      return <div className="weather-loading">Getting location & weather...</div>;
    }
    if (error) {
      return <div className="weather-error">{error}</div>;
    }
    if (!weather || typeof weather.weathercode === 'undefined' || typeof weather.temperature === 'undefined') {
      return <div className="weather-loading">Processing weather data...</div>;
    }

    const { desc, iconUrl } = getWeatherInfo(weather.weathercode, weather.is_day);

    return (
      <div className="weather-content">
        <div className="weather-info">
          {/* THIS IS THE UPDATED IMG TAG 
            It now uses className="weather-icon"
          */}
          <img src={iconUrl} alt={desc} className="weather-icon" />
          
          <div className="weather-details">
            <strong>{weather.city}</strong>
            <p>{desc}</p>
          </div>
        </div>
        <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
      </div>
    );
  };

  return (
    <div className="weather-card dashboard-card">
      <h3>Your Local Weather</h3>
      {renderContent()}
    </div>
  );
};

export default Weather;