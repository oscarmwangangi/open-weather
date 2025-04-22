'use client';

import { useEffect, useState, useRef } from 'react';
import { FiSearch, FiLoader, FiAlertCircle, FiArrowDown } from 'react-icons/fi';
import { WiDaySunny, WiRain, WiCloudy, WiThermometer } from 'react-icons/wi';


interface Weather {
  main?: {
    temp: number;
    humidity: number;
  };
  weather?: Array<{
    description: string;
    main: string;
  }>;
  wind?: {
    speed: number;
  };
  name?: string;
}

export default function Home() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('Nairobi');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showToast, setShowToast] = useState(false); // Controls the visibility of the "Enter city name" toast

  const searchRef = useRef<HTMLInputElement>(null); // Ref to target the input for search

  // Convert temperature based on unit
  const convertTemp = (temp: number) =>
    unit === 'F' ? (temp * 9 / 5 + 32).toFixed(1) : temp.toFixed(1);

  // This effect handles showing a helpful toast after a delay and hiding it later
  useEffect(() => {
    // Show the toast after 1 second if input is mounted
    const showTimer = setTimeout(() => {
      if (searchRef.current) {
        setShowToast(true);
      }
    }, 1000);

    // Hide the toast after it's been shown for 3 seconds (total 4s from mount)
    const hideTimer = setTimeout(() => {
      setShowToast(false);
    }, 4000);

    // Clean up both timers if the component unmounts early
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Fetch weather data from the backend API
  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/weather?city=${city}`);
      if (!res.ok) throw new Error('City not found');
      const data: Weather = await res.json();

      // Basic validation of response
      if (!data?.weather?.[0] || !data.main) {
        throw new Error('Invalid weather data format');
      }

      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Choose the weather icon based on condition
  const getWeatherIcon = (condition: string | undefined) => {
    const baseClass = "text-4xl transition-all duration-300 animate-pulse";
    if (!condition) return <WiCloudy className={`text-gray-400 ${baseClass}`} />;

    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className={`text-yellow-400 ${baseClass}`} />;
      case 'rain':
        return <WiRain className={`text-blue-400 ${baseClass}`} />;
      default:
        return <WiCloudy className={`text-gray-400 ${baseClass}`} />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-gray-900 p-4 md:p-8 text-gray-100">
      <div className="max-w-md mx-auto">

        {/* ---------- HEADER ---------- */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <WiThermometer className="text-red-400" />
            Weather App
          </h1>
          <p className="text-gray-400">Get real-time weather updates</p>
        </div>

        {/* ---------- SEARCH BAR ---------- */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={city}
            ref={searchRef}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all"
          />
          <button
            onClick={() => fetchWeather(city)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
            Search
          </button>
        </div>

        {/* ---------- WEATHER DISPLAY ---------- */}
        {loading ? (
          // Skeleton loader while fetching
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ) : error ? (
          // Error box when fetch fails
          <div className="bg-red-900/20 p-4 rounded-xl shadow-lg flex items-center gap-3 text-red-300 border border-red-800">
            <FiAlertCircle className="text-xl" />
            <p>{error}</p>
          </div>
        ) : weather?.weather?.[0] && weather.main ? (
          // Weather card with full data
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">
                  {weather.name || 'Unknown location'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {getWeatherIcon(weather.weather[0].main)}
            </div>

            {/* Weather Metrics */}
            <div className="space-y-4">
              {/* Temperature + toggle button */}
              <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌡</span>
                  <span className="font-semibold">
                    {convertTemp(weather.main.temp)}°{unit}
                  </span>
                </div>
                <button
                  onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                  className="text-sm bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-md transition-colors"
                >
                  °{unit === 'C' ? 'F' : 'C'}
                </button>
              </div>

              {/* Humidity + Wind */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-3 rounded-lg flex items-center gap-2">
                  <span>💧</span>
                  <div>
                    <p className="text-sm text-gray-400">Humidity</p>
                    <p className="font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-lg flex items-center gap-2">
                  <span>🌬</span>
                  <div>
                    <p className="text-sm text-gray-400">Wind Speed</p>
                    <p className="font-semibold">{weather.wind?.speed || 0} m/s</p>
                  </div>
                </div>
              </div>

              {/* Weather description */}
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <p className="flex items-center gap-2 text-gray-300">
                  <span>📝</span>
                  <span className="capitalize">
                    {weather.weather[0].description}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          // No data fallback
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
            <p className="text-gray-400">No weather data available</p>
          </div>
        )}

        {/* Last updated time */}
        {weather && (
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </div>

      {/* ---------- TOAST / BOUNCE ICON ---------- */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center bg-[#171717] border rounded-lg border-gray-700 p-3 shadow-lg">
            <p className="text-xs text-white mt-1">Enter city name</p>
            <FiArrowDown className="text-blue-500 text-2xl animate-bounce" />
          </div>
        </div>
      )}
    </main>
  );
}
