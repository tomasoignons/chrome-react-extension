import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"

const Calendar = (props) => {

  const [events, setEvents] = useState([]);

  useEffect(()=>{

    const accessToken = props.access_token
    console.log("le calendar se lance")
    if (accessToken !== ""){
      
        // Utilisez l'access token pour accéder à l'API Google Calendar
        const calendarId = process.env.REACT_APP_CALENDAR_ID;
        const maxResults = 9;  // Limite le nombre d'événements à 10
        const timeMin = new Date().toISOString();
        const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
        const queryParams = `?maxResults=${maxResults}&timeMin=${timeMin}&orderBy=startTime&singleEvents=true`;

        fetch(baseUrl + queryParams, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(data => {
          const listevents = data.items;
          const event1 = data.items[0]
          const maintenant = new Date();
          const eventStart = new Date(event1.start.dateTime);

          if (maintenant - eventStart <0){
            listevents.shift()
          } else {
            listevents.shift()
            listevents.shift()
          }
          setEvents(listevents)
        })
        .catch(error => {
          console.log(error)
          console.error(error.data);
        });   
    } else {
      console.log("pas de chargement de l'agenda pour cause : logique")
    }
  }, [props.access_token])

  const getColor = (nom)=>{
    if (nom === "Trajet"){
      return "#616161"
    } else if (nom === "Salle"){
      return "#d50100"
    } else if (nom === "Cours"){
      return "#127c44"
    } else if (nom === "Exercices"){
      return "#32b67a"
    } else if (nom === "Manger"){
      return "#fc4d18"
    } else if (nom === "Se laver les dents"){
      return "#039be6"
    } else if (nom === "Douche"){
      return "#3f51b8"
    } else if (nom === "Travail"){
      return "#064d26"
    } else if (nom === "Pause"){
      return "#e77c74"
    } else if (nom === "Messe"){
      return "#8e24aa"
    } else if (nom === "Dormir"){
      return "#f6bf26"
    } else if (nom === "Religieux"){
      return "#8d25aa"
    } else if (nom === "Préparation"){
      return "#000000"
    } else {
      return "#800000"
    }
  }


  return (
    <motion.div 
      className="calendar-container"
      initial={{ x: '21vw', y : 0}}
      animate={{ x: props.isclosingend? "21vw": props.iscalendar? 0: "21vw", y : props.isclosingend? "-50vh" : 0 }}
      transition={{ 
        duration: 1, 
        type : props.isclosingend? "ease": props.iscalendar?"spring" : "ease",
        stiffness : props.isclosingend? 0: props.iscalendar?50: 0,
        ease : props.isclosingend? [1, 0, 1, 1]: props.iscalendar?[0, 1, 1, 1]:[1, 0, 1, 1],
        delay : props.isloading? 1 : 0
      }}
    >
      <div className='calendar-container-header'>Evènements à venir :</div>
      <div className='calendar-container-scrollable'>

        {events !== undefined && events !== [] ?(
          <>
          {events.map((evenement, index) => (
            <div className='calendar-event-list'
              key={index}
              >
              <div className='event-list-event-titre'>
                {evenement.summary}
              </div>

              {evenement.description !== undefined?(
                <>              
                <div className='event-list-event-description'>
                {evenement.description}
              </div>
                </>
              ) : (
                <></>
              )}

            </div>      
          ))}               
          </>
        ) : (
          <>
          
          </>
        )}
      </div>

      </motion.div>
  );
}

export default Calendar