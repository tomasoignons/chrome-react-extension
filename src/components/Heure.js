import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"


const Heure = (props) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: false };
    const formattedTime = time.toLocaleString('en-US', timeOptions);
  
    return (
      <div className="clock-container">
        <AnimatePresence>
          <motion.div
            className="time-container"
            key={formattedTime}
            initial={{ opacity: 0, y: -170, x: props.isfavoris? 0: "-3.5vw"}}
            animate={{ opacity: 1, y: 0, x: props.isfavoris? 0: "-3.5vw" }}
            exit={{ opacity: 0, y: 170, x: props.isfavoris? 0: "-3.5vw" }}
            transition={{ duration: 1 }}
          >
            {formattedTime}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  
}

export default Heure