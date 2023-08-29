import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"
import Search from './search';


const Navbar = (props) => {

  const OpenCalendar = ()=>{
    props.showcalendar()
  }
  const OpenFavoris = ()=>{
    props.showfavoris()
  }

  return (
    <motion.div className="navbar-container">
        <motion.div 
            className='star-button'
            whileHover={{scale : 1.1}}
            onClick={()=>OpenFavoris()}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#eeeeee" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
             </svg>
        </motion.div>
        <div className='searchbar'>
            <Search onSearch={props.onSearch} isfavoris={props.isfavoris}/>
        </div>
        <motion.div 
            className='events-button'
            onClick={OpenCalendar}
            whileHover={{scale: 1.1}}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-code" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#eeeeee" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M20 21l2 -2l-2 -2" />
                <path d="M17 17l-2 2l2 2" />
            </svg>
        </motion.div>
      </motion.div>
  );
}

export default Navbar