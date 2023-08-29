import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"


const Search = (props) => {
  const [isActive, setIsActive] = useState(false)
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const inputRef = useRef(null)
  const componentRef = useRef(null)

  const handleElementClick = ()=>{
    setIsActive(true)
    setIsInputVisible(true)
  }

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      console.log("il y a un clic en dehors")
      setIsInputVisible(false);
      setIsActive(false)
    }
  };

  const handleInputChange = (event)=>{
    setSearchQuery(event.target.value)

  }
  
  const handleKeyPress = (event)=>{
    if(event.key === "Enter"){
      event.preventDefault()
      props.onSearch(searchQuery)
    }
  }


  useEffect(()=>{
    if(isInputVisible){
      window.addEventListener("click", handleClickOutside)
    } else{
      window.removeEventListener("click", handleClickOutside)
    }
    return ()=>{
      window.removeEventListener("click", handleClickOutside)
    }
  }, [isInputVisible])

  useEffect(() => {
    // Placer le focus dans la zone de texte
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);



  return (
    <div className="search-container" ref={componentRef}>
      <AnimatePresence>
      {isInputVisible && (
        <motion.input 
          ref={inputRef}
          className='search-input'
          type='text'
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder='Recherchez'
          initial={{width:0, x: 0, opacity:0}}
          animate={{width :"47vw", x: props.isfavoris? "3.4vw":0, opacity: 1}}
          exit={{width:0, x: "-20px", opacity:0}}
          transition={{
            duration:1, 
            delay : isActive? 0.05: 0
          }}
          style={{
            position : 'relative',
            transformOrigin:"right",
          }}
          />
      )}    
      </AnimatePresence>
      <motion.div
        className='search-icon'
        whileHover={{scale: 1.2}}
        onClick={handleElementClick}
        initial={{x:0}}
        animate={{x : props.isfavoris? "3.5vw" :0}}
        transition={{
          duration : 1,
          delay: isActive?0 : 0.1
        }}
        style={{position : 'relative'}}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#eeeeee" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
      </motion.div>

      </div>
  );
}

export default Search