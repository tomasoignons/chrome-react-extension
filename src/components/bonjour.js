import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"


const Bonjour = (props) => {
    const [greeting, setGreeting] = useState('');

    const getGreeting = () => {
      const currentTime = new Date().getHours();
  
      if (currentTime >= 6 && currentTime < 18) {
        return 'Bonjour';
      } else if (currentTime >= 18 && currentTime < 22.5) {
        return 'Bonsoir';
      } else {
        return 'Bonne nuit';
      }
    };
  
    useEffect(() => {
      setGreeting(getGreeting());
  
      const interval = setInterval(() => {
        setGreeting(getGreeting());
      }, 60000); // Toutes les minutes
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className='greetings'>
          <motion.div 
            key={greeting}
            initial={{ opacity: 0, x: props.isfavoris? 0: "-3.5vw"}}
            animate={{ opacity: 1, x: props.isfavoris? 0: "-3.5vw"}}
            exit={{ opacity: 0, x: props.isfavoris? 0: "-3.5vw" }}
            transition={{ duration: 1 }}
          >
            {greeting}, Emmanuel
          </motion.div>
      </div>
    );
}

export default Bonjour