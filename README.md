# Weather App (Next.js + Laravel)

![Project Banner](https://via.placeholder.com/1200x400?text=Weather+App+Banner)

A full-stack weather application with Next.js frontend and Laravel backend that fetches real-time weather data from OpenWeatherMap API.

## Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [Backend (Laravel)](#backend-laravel)
  - [Frontend (Next.js)](#frontend-nextjs)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features
- Modern Next.js frontend with TypeScript
- Robust Laravel API backend
- Real-time weather data fetching
- Responsive design with Tailwind CSS
- Clean, intuitive user interface
- Proper error handling and loading states

## 📋 Prerequisites
Before installation, ensure you have:

- **Node.js** (v16 or higher)
- **PHP** (v8.1 or higher)
- **Composer** (for Laravel)


## 🛠 Installation

### Backend (Laravel)
1. Clone the repository:
   ```bash
   git clone https://github.com/oscarmwangangi/open-weather.git
   cd open-weather
   ```
2. Install dependencies
    ```bash
    composer install
    ```

3. Serve the Laravel Application
    ```bash
    php artisan serve
    ```

## Frontend (Next.js)
1. Navigate to frontend directory:
    ```bash
    cd weather-frontend
    ```


2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Development Server
    ```bash
    npm run dev
    ```

- Once both the Laravel backend and the Next.js frontend are set up:
- You can access the application at `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.