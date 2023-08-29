import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"


const Event = (props) => {
  
    const [event, setEvent] = useState({});
    const [nextevent, setnextEvent] = useState({})
    const [noevent, setnoevent] = useState(false)
    const Credentials = JSON.parse(process.env.REACT_APP_CREDENTIALS)
    const privateKey = Credentials.private_key

    const [timeRemaining, setTimeRemaining] = useState("")
    const [elapsedPercentage, setElapsedPercentage] = useState(0)

    const [timenextevent, settimenextevent] = useState("")
    const [dureenextevent, setDureenextevent] = useState("")
  
    
    useEffect(()=>{
      console.log("lancez donc le event")
      const accessToken = props.access_token
      if (accessToken !== ""){

          // Utilisez l'access token pour accéder à l'API Google Calendar
          const calendarId = process.env.REACT_APP_CALENDAR_ID;
          const maxResults = 2;  // Limite le nombre d'événements à 10
          const timeMin = new Date().toISOString();
          const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
          const queryParams = `?maxResults=${maxResults}&timeMin=${timeMin}&orderBy=startTime&singleEvents=true`;
          console.log(baseUrl + queryParams)
          fetch(baseUrl + queryParams, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            const event = data.items[0];
            const nextevent = data.items[1]
            setEvent(event)
            setnextEvent(nextevent)
          })
          .catch(error => {
            console.log(error)
            console.error(error.data);
          });   
      } else {
        console.log("pas de chargement de l'agenda pour cause : logique")
      }
    }, [props.access_token])

    useEffect(() => {
        if (event.start !== undefined){
            console.log("il y a un évènement normalement")
            const maintenant = new Date();
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);



            if (maintenant - eventStart >0){
                if (noevent === true){
                    setnoevent(false)
                }
                const nextevent_start = new Date(nextevent.start.dateTime)
                const nextevent_end = new Date(nextevent.end.dateTime)    
                setDureenextevent(`${Math.floor((nextevent_end-nextevent_start) / (1000 * 60 * 60))}h ${Math.floor(((nextevent_end-nextevent_start) % (1000 * 60 * 60)) / (1000 * 60))}min`)            
                const updateRemainingTimeAndPercentage = () => {
                    const now = new Date();
                    const timeDiff = now - eventStart;
                    const totalDuration = eventEnd - eventStart;

                    const timeavantnextevent = nextevent_start - now
                
                    const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
                    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

                    if (Math.floor(((now - eventStart) / totalDuration) * 100) > 100){
                      window.location.reload();
                    }
                
                    const elapsedPercentageValue = Math.floor(((now - eventStart) / totalDuration) * 100);
                
                    setTimeRemaining(`${remainingHours}h ${remainingMinutes}min`);
                    setElapsedPercentage(elapsedPercentageValue);
                    settimenextevent(`${Math.floor(timeavantnextevent / (1000 * 60 * 60))}h ${Math.floor((timeavantnextevent % (1000 * 60 * 60)) / (1000 * 60))}min`)
                };
            
                updateRemainingTimeAndPercentage(); // Appel initial
            
                const interval = setInterval(() => {
                updateRemainingTimeAndPercentage();
                }, 60000); // Actualise toutes les minutes
            
                return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant                            
            } else {
                if (noevent === false){
                    setnoevent(true)
                }
                if (event !== nextevent){
                  setnextEvent(event)
                }

                const nextevent_start = new Date(nextevent.start.dateTime)
                const nextevent_end = new Date(nextevent.end.dateTime)    
                setDureenextevent(`${Math.floor((nextevent_end-nextevent_start) / (1000 * 60 * 60))}h ${Math.floor(((nextevent_end-nextevent_start) % (1000 * 60 * 60)) / (1000 * 60))}min`)            
                const updateRemainingTimeAndPercentage = () => {
                    const now = new Date();

                    const timeavantnextevent = nextevent_start - now
                    settimenextevent(`${Math.floor(timeavantnextevent / (1000 * 60 * 60))}h ${Math.floor((timeavantnextevent % (1000 * 60 * 60)) / (1000 * 60))}min`)
                };
            
                updateRemainingTimeAndPercentage(); // Appel initial
            
                const interval = setInterval(() => {
                updateRemainingTimeAndPercentage();
                }, 60000);
                return () => clearInterval(interval); // Actualise toutes les minutes
            }
        
           
        }

      }, [event.start, event.end]);
      
      const handleQuit = ()=>{
        props.quitevent()
      }

  return (
    <motion.div 
      className="event-container"
      initial={{ x: '21vw',y : 0}}
      animate={{ x: props.isclosingend? "21vw": props.iscalendar? 0:  "21vw", y : props.isclosingend? "50vh" : 0 }}
      transition={{ 
        duration: 1, 
        type : props.isclosingend? "ease": props.iscalendar?"spring" : "ease",
        stiffness : props.isclosingend? 0: props.iscalendar?50: 0,
        ease : props.isclosingend? [1, 0, 1, 1]: props.iscalendar?[0, 1, 1, 1]:[1, 0, 1, 1],
        delay : props.isloading? 1 : 0
      }}
    >
      <div className='event-container-header-container'>
        <div className='event-container-header-name'>Evènements</div>
        <motion.div 
          className='event-container-quit'
          whileHover={{scale: 1.1}}
          onClick={()=> handleQuit()}
          >
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-bar-to-right" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#0f3955" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M14 12l-10 0" />
            <path d="M14 12l-4 4" />
            <path d="M14 12l-4 -4" />
            <path d="M20 4l0 16" />
          </svg>
        </motion.div>
      </div>
        {noevent === false? (
          <div className='event-container-events'>
            <div className='evenement-actuel'>
                <div className='Titre-evenement-actuel'>{event.summary}</div>
                <div className='depuis-evenement-actuel'>Depuis : {timeRemaining}</div>
                <div className='pourcentage-accomplissement-evenement'>Soit {elapsedPercentage.toFixed(0)}%</div>
            </div>
            <div className='prochain-evenement'>
              <div>Prochain évènement : {nextevent.summary}</div>
              <div>Dans : {timenextevent}</div>
              <div>Pour : {dureenextevent}</div>
            </div>          
          
          </div>



        ) : (
          <div className='event-container-events'>
            <div className='evenement-actuel'>
              <div className='Titre-evenement-actuel'>Temps libre ! 💤</div>
              <div className='depuis-evenement-actuel-noevent'>le prochain évènement commence dans : {timenextevent}</div>
            </div>

            <div className='prochain-evenement'>
              <div>Prochain évènement : {nextevent.summary}</div>
              <div>Dans : {timenextevent}</div>
              <div>Pour : {dureenextevent}</div>
            </div>                
          </div>

        )}


      </motion.div>
  );
}

export default Event