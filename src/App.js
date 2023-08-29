import React, { useEffect, useState } from 'react';
import './App.css';
import {motion, AnimatePresence} from "framer-motion"
import Search from './components/search';
import Event from './components/event';
import Calendar from './components/calendar';
import Navbar from './components/navbar';
import Favoris from './components/favoris';
import Heure from './components/Heure';
import Bonjour from './components/bonjour';
import WeatherWidget from './components/widget.meteo';
import CurrentDate from './components/Date';
import MotivationalQuote from './components/motivation';
const jose = require("jose")


function App() {

  const [animationload, setAnimationload] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [isCalendar, setIsCalendar] = useState(true)
  const [isFavoris, setIsFavoris] = useState(true)

  const Credentials = JSON.parse(process.env.REACT_APP_CREDENTIALS)
  const privateKey = Credentials.private_key

  const backgroundImageUrls = [
    "./img/31.png",
    "./img/1.PNG",
    "./img/2.PNG",
    "./img/3.PNG",
    "./img/4.PNG",
    "./img/5.PNG",
    "./img/6.PNG",
    "./img/7.PNG",
    "./img/8.PNG",
    "./img/9.PNG",
    "./img/10.PNG",
    "./img/11.PNG",
    "./img/12.PNG",
    "./img/13.PNG",
    "./img/14.PNG",
    "./img/15.PNG",
    "./img/16.PNG",
    "./img/17.PNG",
    "./img/18.PNG",
    "./img/19.PNG",
    "./img/20.PNG",
    "./img/21.PNG",
    "./img/22.PNG",
    "./img/23.PNG",
    "./img/24.PNG",
    "./img/25.PNG",
    "./img/26.PNG",
    "./img/27.PNG",
    "./img/28.PNG",
    "./img/29.PNG",
    "./img/30.PNG",
  ]

  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

  const getRandomBackgroundImageUrl = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImageUrls.length);
    return backgroundImageUrls[randomIndex];
  };

  useEffect(() => {
    const randomImageUrl = getRandomBackgroundImageUrl();
    document.body.style.background = `url(${randomImageUrl}) no-repeat center center fixed`
    document.body.style.backgroundSize = 'cover';
    setBackgroundImageUrl(randomImageUrl);
  }, []);

  useEffect(()=>{
    console.log("on lance l'appel du token")
    async function createJwtToken() {
      const alg = 'RS256'
      const key = await jose.importPKCS8(privateKey, alg)


      // const jwtToken = await jose.SignJWT({}, key, signOptions);

      const jwt = await new jose.SignJWT({ 'urn:example:claim': true,  "scope": "https://www.googleapis.com/auth/calendar"})
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('test-google-calendar-api@agenda-chrome-extension.iam.gserviceaccount.com')
        .setAudience('https://oauth2.googleapis.com/token')
        .setExpirationTime('1h') 
        .setSubject("test-google-calendar-api@agenda-chrome-extension.iam.gserviceaccount.com")
        .sign(key)

      return jwt;
    }    
    createJwtToken()
      .then((res)=>{
        console.log(res)
        const jwtToken = res
        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
        requestBody.append('assertion', jwtToken);
        
        fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${Credentials.clientId}`,
          },
          body: requestBody.toString(),
        })
        .then(response => response.json())
        .then(data => {
          const accessToken_data = data.access_token;
          setAccessToken(accessToken_data)
      })
    })
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimationload(false)
    }, 3000);

    return () => {
      clearTimeout(timeoutId); // Nettoie le timeout si le composant est démonté avant qu'il ne s'exécute
    };
  }, []);
  const handleSearch = (query)=>{
    document.body.style.background = `white`
    setIsAnimating(true)
    setTimeout(()=>{
      window.location.href = `https://www.google.com/search?q=${query}`
    }, 1000)
  }
  const onclickfav = (url)=>{
    setIsAnimating(true)
    setTimeout(()=>{
      window.location.href = `${url}`
    }, 1000)
  }

  const handlequitcalendar = ()=>{
    setIsCalendar(false)
  }

  const handleshowcalendar =()=>{
    setIsCalendar(true)
  }

  const handlequitfavoris = ()=>{
    setIsFavoris(false)
  }
  const handleshowfavoris = ()=>{
    setIsFavoris(true)
  }

  return (
    <div className='container-opening'>
      <motion.div
        className="upper-half"
        initial={{ y: '-50vh' }}
        animate={{ y: isAnimating? "-50vh": 0 }}
        transition={{ duration: 1, ease : isAnimating? [1, 0, 1, 1]:[0, 1, 1, 1]}}
        style={{backgroundImage: `url(${backgroundImageUrl})`}}
      >
        <Navbar showcalendar={handleshowcalendar} showfavoris={handleshowfavoris} onSearch={handleSearch} isfavoris={isFavoris}/>
        <Heure isfavoris={isFavoris}/>
        <Event access_token={accessToken} quitevent={handlequitcalendar} iscalendar={isCalendar} isclosingend={isAnimating} isloading={animationload}/>
      </motion.div>
      <motion.div
        className="lower-half"
        initial={{ y: '50vh' }}
        animate={{ y: isAnimating? "50vh": 0 }}
        transition={{ duration: 1, ease : isAnimating? [1, 0, 1, 1]:[0, 1, 1, 1]}}
        style={{backgroundImage: `url(${backgroundImageUrl})`}}
      >
        <Bonjour isfavoris={isFavoris}/>
        <WeatherWidget/>
        <CurrentDate/>
        <MotivationalQuote isfavoris={isFavoris}/>
        <Favoris initialisation="initialisation" quitevent={handlequitfavoris} isfavoris={isFavoris} isclosingend={isAnimating} onclickfav={onclickfav} isloading={animationload}/>   
        <Calendar access_token={accessToken} iscalendar={isCalendar} isclosingend={isAnimating} isloading={animationload}/>
      </motion.div>
    </div>
  );
}

export default App;
