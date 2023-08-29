import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSun, FiCloud, FiCloudDrizzle, FiCloudRain, FiWind, FiCloudSnow } from 'react-icons/fi';
import {motion, AnimatePresence} from "framer-motion"
import { Line } from 'react-chartjs-2';
import {parse, format} from "date-fns"
import {Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement} from "chart.js"
import '../style/WeatherWidget.css'; 


ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)



const WeatherWidget = () => {

    const [weatherData, setWeatherData] = useState(null);
    const [weatherDataChart, setWeatherDataChart] = useState(null);
    const [weatherDataPopup, setWeatherDataPopup] = useState(null)
    const [popup, setPopup] = useState(false)
    const popupRef = useRef(null);


    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY_WEATHER; // Remplacez par votre clé d'API
        const location = 'auto:ip'; // Obtient la localisation basée sur l'adresse IP
    
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=no`)
          .then(response => {
            setWeatherDataPopup(response.data)
            setWeatherDataChart(response.data.forecast.forecastday[0].hour);
          })
          .catch(error => {
            console.error('Erreur de requête API :', error);
          });
    }, []);
    

  
    useEffect(() => {
      const apiKey = process.env.REACT_APP_API_KEY_WEATHER; // Remplacez par votre clé d'API
      const location = 'auto:ip'; // Obtient la localisation basée sur l'adresse IP
  
      axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Erreur de requête API :', error);
      });
    }, []);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (popup && !event.target.classList.contains('popup-weather-big-container')) {
                if (event.target.classList.contains("show-popup-please")){
                    setPopup(true)
                } else{
                    setPopup(false);                            
                }  
            } 
            // Vérifie si le clic est en dehors de la popup et des éléments de la popup
          };
    
        window.addEventListener('click', handleClickOutside);
    
        return () => {
          window.removeEventListener('click', handleClickOutside);
        };
      }, [popup]);


    const getWeatherIcon = (weather) => {
      console.log(weather)
      switch (weather) {
        case 'clear':
        case "sunny":
          return <FiSun />;
        case 'partly cloudy':
        case 'cloudy':
          return <FiCloud />;
        case 'patchy rain possible':
        case 'patchy light rain':
          return <FiCloudDrizzle />;
        case 'light rain':
        case 'moderate rain':
        case 'thunderstorm':
          return <FiCloudRain />;
        case 'snow':
        case 'patchy snow possible':
        case 'blowing snow':
          return <FiCloudSnow />;
        default:
          return null;
      }
    };

    const getLabels = () => {
        return weatherDataChart ? weatherDataChart.map(hour => hour.time.slice(-5)) : [] // Extrayez l'heure de chaque enregistrement
      };
    
    const getTemperatures = () => {
        return weatherDataChart ? weatherDataChart.map(hour => hour.temp_c) : [] // Extrayez la température de chaque enregistrement
    };
    
    const chartData = {
        labels: getLabels(),
        datasets: [
          {
            label: 'Température (°C)',
            data: getTemperatures(),
            fill: false,
            borderColor: 'white',
            pointBorderWidth : 0,
            tension :0.5,
            pointRadius : 0,
          },
        ],
    };
    
    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear', 
            beginAtZero: true,
            title: {
              display: true,
              text: 'Température (°C)',
              color :"white",
            },
            grid : {
                borderDash : [30],
                color : "rgba(255, 255, 255, 0.5)",
            },
            ticks : {
              color :"white",
            }
          },
          x: {
            title: { 
              display: true,
              text: 'Heure',
              color : "white",
            },
            grid : {
                borderDash : [30],
                color :'rgba(255, 255, 255, 0.5)'
              },
            ticks : {
                maxTicksLimit: 5,
                stepSize : 5,
                color: "white",
            }
          },
        },
    };

    const handleshowpopup =()=>{
        setPopup(true)
    }
    const quitPopup = ()=>{
        setPopup(false)
    }
    
    return (
        <div>
            <div className="weather-widget show-popup-please" onClick={()=>handleshowpopup()}>
                {weatherData ? (
                <div className="weather-content show-popup-please">
                    <div className='weather-content-icon-temp show-popup-please'>
                        <div className="icon-weather-widget show-popup-please">{getWeatherIcon(weatherData.current.condition.text.toLowerCase())}</div>
                        <div className="temperature-weather-widget show-popup-please">{weatherData.current.temp_c}°</div>
                    </div>
                    <div className="location-weather-widget show-popup-please">{weatherData.location.name}</div>
                </div>
                ) : (
                <p>Chargement de la météo...</p>
                )}
            </div>                
            <AnimatePresence>
            {popup && (

                <motion.div 
                    className="popup-weather-big-container"
                    ref={popupRef}
                    drag
                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} // Limite les contraintes de drag
                    initial={{x: 0, y : "-100vh"}}
                    animate={{x: 0, y : 0}}
                    exit={{x: 0, y : "-100vh"}}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 70 }}
                >
                    <div className='header-popup-weather'>
                        <div className='header-title-popup-weather'>Prévisions météorologiques</div>
                        <motion.div className='header-title-popup-quit' whileHover={{scale : 1.05}} onClick={()=>quitPopup()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-cloud-x" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#eeeeee" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M13 18.004h-6.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.37 0 2.556 .8 3.117 1.964" />
                                <path d="M22 22l-5 -5" />
                                <path d="M17 22l5 -5" />
                            </svg>
                        </motion.div>
                    </div>
                    <div className="weather-chart">
                        {weatherData ? (
                            <Line data={chartData} options={chartOptions}></Line>
                        ) : (
                            <p>Chargement des prévisions...</p>
                        )}
                    </div>
                    <div className='content-widget-popup-weather'>

                        <div className='ligne-1-popup-weather'>
                            <div className='popup-widget-temperature-base'>
                                <div className="icon-weather-widget-popup">{getWeatherIcon(weatherData.current.condition.text.toLowerCase())}</div>                       
                                <div>{weatherData.current.temp_c}°C</div> 
                                <div>{format(new Date(weatherData.location.localtime), "dd/MM, HH:mm")}</div>
                            </div>
                        </div>
                        <div className='ligne-2-popup-weather'>
                            <div className='popup-widget-lever-soleil widget-classique'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-sunrise" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M3 17h1m16 0h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7m-9.7 5.7a4 4 0 0 1 8 0" />
                                        <path d="M3 21l18 0" />
                                        <path d="M12 9v-6l3 3m-6 0l3 -3" />
                                    </svg>
                                </div>
                                <div>{format(parse(weatherDataPopup.forecast.forecastday[0].astro.sunrise, 'hh:mm a', new Date()), "HH:mm")}</div>
                            </div>
                            <div className='popup-widget-coucher-soleil widget-classique'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-sunset" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M3 17h1m16 0h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7m-9.7 5.7a4 4 0 0 1 8 0" />
                                        <path d="M3 21l18 0" />
                                        <path d="M12 3v6l3 -3m-6 0l3 3" />
                                    </svg>
                                </div>
                                <div>{format(parse(weatherDataPopup.forecast.forecastday[0].astro.sunset, "hh:mm a", new Date()), 'HH:mm')}</div>                        
                            </div>
                        </div>
                        <div className='ligne-2-popup-weather'>
                            <div className='popup-widget-temperature-max widget-classique'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-temperature-plus" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M8 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />
                                        <path d="M8 9l4 0" />
                                        <path d="M16 9l6 0" />
                                        <path d="M19 6l0 6" />
                                    </svg>
                                </div>
                                <div>{weatherDataPopup.forecast.forecastday[0].day.maxtemp_c} °C</div>             
                            </div>  
                            <div className='popup-widget-temperature-min widget-classique'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-temperature-minus" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M8 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />
                                        <path d="M8 9l4 0" />
                                        <path d="M16 9l6 0" />
                                    </svg>
                                </div>
                                <div>{weatherDataPopup.forecast.forecastday[0].day.mintemp_c} °C</div>                    
                            </div>
                        </div>
                    </div>


                </motion.div>
            )}
            </AnimatePresence>
        </div>

    );
  };
  
  export default WeatherWidget;
  