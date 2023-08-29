/*global chrome*/

import React, { useEffect, useRef, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"
import "../style/favoris.css"


  

const Favoris = (props) => {
    const [bookmarks, setBookmarks] = useState({});
    const [numeroFolder, setnumeroFolder] = useState(0)

    const [degrefolder, setdegrefolder] = useState([])
    const [show_brother_folder, setShow_brother_folder] = useState(false)
    const [brother_show, setBrother_show] = useState(0)

    const popupref = useRef(null)

    const [animationdroite, setAnimationdroite] = useState(true)
    const [animationgauche, setAnimationgauche] = useState(false)



    // -------------------------------à réactiver pour le truc réel, pour ça puisse être dynamique, ce serait mieux quand même non ?-----------------------------------------




    useEffect(() => {
         
          
        console.log("chargement des favoris")
        // Récupérer les favoris depuis le script d'extension
        const mdrlol = chrome.bookmarks.getSubTree("0")
        console.log(mdrlol)
        chrome.bookmarks.getSubTree("0", bookmarkTreeNodes => {
          console.log(bookmarkTreeNodes)
          const barrefavoris = bookmarkTreeNodes[0].children[0].children
          const autresfavoris = bookmarkTreeNodes[0].children[1].children

          let sans_dossier_barre_favoris = []
          let sans_dossier_autres_favoris = []
          for (let i=barrefavoris.length-1; i>-1; i=i-1){
            if (barrefavoris[i].url){
                sans_dossier_barre_favoris.unshift(barrefavoris[i])
                barrefavoris.splice(i, 1)
            } 
          }

          for (let i=autresfavoris.length-1; i>-1; i=i-1){
            if (autresfavoris[i].url){
                sans_dossier_autres_favoris.unshift(autresfavoris[i])
                autresfavoris.splice(i, 1)
            } 
          }          
          const favoris = [...barrefavoris, ...autresfavoris]
          favoris.unshift({children : sans_dossier_barre_favoris, title : "Barre de favoris"})
          favoris.push({children : sans_dossier_autres_favoris, title : "Autres favoris"})
          console.log(favoris)


          setBookmarks(favoris);
        });
      }, []);
      
    const naviguer_gauche = (degrefolder)=>{
        setAnimationdroite(false)
        setAnimationgauche(true)
        const listefolders = get_current_folder_list(degrefolder)
        let folder = {}
        let num_folder_gauche = numeroFolder

        const cycler_folder = ()=>{    
            if (num_folder_gauche === 0){
                num_folder_gauche = listefolders.length-1
                folder = listefolders[num_folder_gauche]
            } else {
                num_folder_gauche = num_folder_gauche-1
                folder = listefolders[num_folder_gauche]       
            }
            if (folder.children){
                setnumeroFolder(num_folder_gauche)
                return
            } else {
                return cycler_folder()
            }      
        }
        return (cycler_folder())
    }
        const naviguer_droite = (degrefolder)=>{
            setAnimationgauche(false)
            setAnimationdroite(true)
            const listefolders = get_current_folder_list(degrefolder)
            let folder = {}
            let num_folder_droit = numeroFolder

            const cycler_folder = ()=>{       
                if (num_folder_droit === listefolders.length-1){
                    num_folder_droit = 0
                    folder = listefolders[num_folder_droit]
                } else {
                    num_folder_droit = num_folder_droit+1
                    folder = listefolders[num_folder_droit]       
                }
                if (folder.children){
                    setnumeroFolder(num_folder_droit)
                    return
                } else {
                    return cycler_folder()
                }      
            }
            return (cycler_folder())
        }


        const get_folder_droite = (degrefolder)=>{
            const listefolders = get_current_folder_list(degrefolder)
            let folder = {}
            let num_folder_droit = numeroFolder

            const cycler_folder = ()=>{       
                if (num_folder_droit === listefolders.length-1){
                    num_folder_droit = 0
                    folder = listefolders[num_folder_droit]
                } else {
                    num_folder_droit = num_folder_droit+1
                    folder = listefolders[num_folder_droit]       
                }
                if (folder.children){
                    return folder.title
                } else {
                    return cycler_folder()
                }      
            }
            return (cycler_folder())
        }

        const get_folder_gauche = (degrefolder)=>{
            const listefolders = get_current_folder_list(degrefolder)
            let folder = {}
            let num_folder_gauche = numeroFolder

            const cycler_folder = ()=>{    
                if (num_folder_gauche === 0){
                    num_folder_gauche = listefolders.length-1
                    folder = listefolders[num_folder_gauche]
                } else {
                    num_folder_gauche = num_folder_gauche-1
                    folder = listefolders[num_folder_gauche]       
                }
                if (folder.children){
                    return folder.title
                } else {
                    return cycler_folder()
                }      
            }
            return (cycler_folder())
            
        }

        const click_favoris = (favori, key)=>{
            if(favori.children){
                let tableau = degrefolder
                setnumeroFolder(key)
                tableau.push(numeroFolder)
                setdegrefolder(tableau)
            } else if (favori.url){
                props.onclickfav(favori.url)
            }
        }


        const return_previous_dossier =()=>{
            let tableau = degrefolder
            setnumeroFolder(tableau[tableau.length-1])
            tableau.pop()
            setdegrefolder(tableau)
        }


        const getcurrentfolder = (degrefolder)=>{
            if (degrefolder === undefined){
                return
            }
            if(degrefolder.length === 0){
                return bookmarks
            } else if (degrefolder.length === 1){
                return bookmarks[degrefolder[0]]
            } else if (degrefolder.length === 2){
                return bookmarks[degrefolder[0]].children[degrefolder[1]]
            } else if (degrefolder.length === 3){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]]
            } else if (degrefolder.length === 4){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[degrefolder[3]]
            } else if (degrefolder.length === 5){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[degrefolder[3]].children[degrefolder[4]]
            } else {
                return bookmarks[numeroFolder]
            }
        }

        const get_current_folder_object = (degrefolder)=>{
            if (degrefolder === undefined){
                return
            }
            if(degrefolder.length === 0){
                return bookmarks[numeroFolder]
            } else if (degrefolder.length === 1){
                return bookmarks[degrefolder[0]].children[numeroFolder]
            } else if (degrefolder.length === 2){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[numeroFolder]
            } else if (degrefolder.length === 3){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[numeroFolder]
            } else if (degrefolder.length === 4){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[degrefolder[3]].children[numeroFolder]
            } else if (degrefolder.length === 5){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[degrefolder[3]].children[degrefolder[4]].children[numeroFolder]
            } else {
                return bookmarks[numeroFolder]
            }
        }

        const get_current_folder_list = (degrefolder)=>{
            if (degrefolder === undefined){
                return
            }
            if(degrefolder.length === 0){
                return bookmarks
            } else if (degrefolder.length === 1){
                return bookmarks[degrefolder[0]].children
            } else if (degrefolder.length === 2){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children
            } else if (degrefolder.length === 3){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children
            } else if (degrefolder.length === 4){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[degrefolder[3]].children
            } else if (degrefolder.length === 5){
                return bookmarks[degrefolder[0]].children[degrefolder[1]].children[degrefolder[2]].children[degrefolder[3]].children[degrefolder[4]].children
            } else {
                return bookmarks[numeroFolder]
            }
        }

        const get_folder_with_index = (numerofolder, index)=>{
            const tableau = degrefolder.slice(0, index)
            const folder = get_current_folder_list(tableau)[numerofolder]
            return folder
        }

        const getbrotherfolderlist = (numero)=>{
            console.log(numero)
            if (numero === 0){
                return bookmarks
            } else if (numero === 1){
                const data = bookmarks[degrefolder[0]].children
                return data
            } else if (numero === 2){
                const data = bookmarks[degrefolder[0]].children[degrefolder[1]].children
                return data
            }
        }

        const show_list_brother_folder = (numeroshow)=>{
            setShow_brother_folder(true)
            setBrother_show(numeroshow)
        }
        const handlepopupfolderclick = (numeroduclick)=>{
            setShow_brother_folder(false)
            setnumeroFolder(numeroduclick)
        }
        const handleCloseFenetre =()=>{
            setShow_brother_folder(false)
        }

        const handlequit = ()=>{
            props.quitevent()
        }

        const handleOutsideClick = (event) => {

            if (show_brother_folder && !event.target.classList.contains('popup-directory')) {
                if (event.target.classList.contains("show-popup-please")){
                    setShow_brother_folder(true)
                } else{
                    setShow_brother_folder(false);                            
                }  
            } 
            // Vérifie si le clic est en dehors de la popup et des éléments de la popup
          };
        

          // Ajoute l'écouteur d'événement lors du montage du composant
          useEffect(() => {
            window.addEventListener('click', handleOutsideClick);
        
            // Retire l'écouteur d'événement lors du démontage du composant
            return () => {
              window.removeEventListener('click', handleOutsideClick);
            };
          }, [show_brother_folder]);

        useEffect(()=>{
            console.log("ça a changé !")
        }, [degrefolder])


    
        return (
            <motion.div 
            className='favoris-container'
            initial={{ x: "-33vw",y : 0 }}
            animate={{ x: props.isclosingend? "-33vw": props.isfavoris? 0:  "-33vw", y : props.isclosingend? "-50vh" : 0 }}
            transition={{ 
                duration: 1, 
                type : props.isclosingend? "ease": props.isfavoris?"spring" : "ease",
                stiffness : props.isclosingend? 0: props.isfavoris?50: 0,
                ease : props.isclosingend? [1, 0, 1, 1]: props.isfavoris?[0, 1, 1, 1]:[1, 0, 1, 1],
                delay : props.isloading? 1 : 0
            }}
            >
                {bookmarks.length>0?(
                    <>
                    <div className='header-container'>
                        <div className='top-header-container'>
                            <div className='title-exit-fav-container'>                         
                                <motion.div className='exit-header-fav-container' whileHover={{scale : 1.1}} onClick={()=>handlequit()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-bar-to-left" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#0f3955" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M10 12l10 0" />
                                        <path d="M10 12l4 4" />
                                        <path d="M10 12l4 -4" />
                                        <path d="M4 4l0 16" />
                                    </svg>
                                </motion.div>
                                <div className='title-header-container'>Favoris</div>
                            </div>
                            <div className='directory-header-container' >
                                <span className='path-init'>F:/</span>
                                {degrefolder.length<1?(
                                    <motion.span className="show-popup-please" key={numeroFolder} initial={{opacity : 0}} animate={{opacity : 1}} exit={{opacity : 0}} onClick={()=> show_list_brother_folder(0)}>{get_current_folder_object(degrefolder).title}</motion.span>
                                ) : (
                                    <>
                                        {degrefolder.map((numfolder, index)=>(
                                            <motion.span key={index} initial={{opacity : 0}} animate={{opacity : 1}} exit={{opacity : 0}} className='show-popup-please'>{get_folder_with_index(numfolder, index).title}/</motion.span>
                                        ))}   
                                        <motion.span key={numeroFolder} initial={{opacity : 0}} animate={{opacity : 1}} exit={{opacity : 0}} className='show-popup-please' onClick={()=>show_list_brother_folder(degrefolder.length)}>{get_current_folder_object(degrefolder).title}</motion.span>                                   
                                    </>
                                    
                                  
                                )}                                   
                                <AnimatePresence>
                                {show_brother_folder && (
 
                                    <motion.div 
                                    className='popup-directory'
                                    ref={popupref}
                                    initial={{x: 0, y : "-65vh"}}
                                    animate={{x: 0, y : 0}}
                                    exit={{x: 0, y : "-65vh"}}
                                    transition={{ duration: 0.5, type: 'spring', stiffness: 70 }}

                                    >
                                        <div className='header-popup-directory'>
                                            <div className='titre-popup-directory'>Liste des dossiers : </div>
                                            <motion.div className='quit-popup-croix' onClick={()=> handleCloseFenetre()} whileHover={{scale : 1.05}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                    <path d="M18 6l-12 12" />
                                                    <path d="M6 6l12 12" />
                                                </svg>
                                            </motion.div>
                                        </div>
                                        <div className='scrollable-popup-directory'>
                                            {getbrotherfolderlist(brother_show).map((brofolder, index)=>(
                                                <>

                                                {brofolder.children?(
                                                    <motion.div 
                                                    className='brother-folder-popup-element-container'
                                                    initial={{background : "#ffffff", color : "#000000"}}
                                                    whileHover={{background:"#195881", color:"#ffffff"}} 
                                                    onClick={()=>handlepopupfolderclick(index)}
                                                    key={index}
                                                    >
                                                        <div className='folder-icon-popup'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-folder-filled" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" strokeWidth="0" fill="currentColor" />
                                                            </svg>  
                                                        </div>
                                                        <motion.div 
                                                        className='brother-folder-popup' 
                                                        >
                                                            {brofolder.title}
                                                        </motion.div>   

                                                    </motion.div>
                                                  
                                                ) : (
                                                    <></>
                                                )}
                                               
                                                </>

                                            ))}                                            
                                        </div>
                 
                                    </motion.div>

                                )}                                    
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className='navigation-header-container'>
                        <div className="naviguer-gauche-container" onClick={()=>naviguer_gauche(degrefolder)}>
                            <motion.div 
                                className='fichier-gauche-name'
                                key={numeroFolder}
                                initial={{opacity : 0, x: animationdroite? "3vh" : "-3vh"}}
                                animate={{opacity : 1, x : 0}}
                                transition={{ duration: 0.3}}
                            >
                                {get_folder_gauche(degrefolder)}
                            </motion.div>
                            <motion.div className='fleche-gauche' whileHover={{scale: 1.05}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-badge-left" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M11 17h6l-4 -5l4 -5h-6l-4 5z" />
                                </svg>
                            </motion.div>
                        </div>
                        <motion.div 
                            className='current-folder'
                            key={numeroFolder}
                            initial={{opacity : 0, x: animationdroite? "3vh" : "-3vh"}}
                            animate={{opacity : 1, x : 0}}
                            transition={{ duration: 0.3}}
                        >
                                {get_current_folder_object(degrefolder).title}
                        </motion.div>                      
                        <div className='naviguer-droite-container' onClick={()=>naviguer_droite(degrefolder)}>
                            <motion.div 
                                className='fichier-droite-name'
                                key={numeroFolder}
                                initial={{opacity : 0, x: animationdroite? "3vh" : "-3vh"}}
                                animate={{opacity : 1, x : 0}}
                                transition={{ duration: 0.3}}
                            >
                                    {get_folder_droite(degrefolder)}
                            </motion.div>
                            <motion.div className='fleche-droite' whileHover={{scale: 1.05}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-badge-right" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M13 7h-6l4 5l-4 5h6l4 -5z" />
                                </svg>
                            </motion.div>
                        </div>
                        </div>
                    </div>

                    <motion.div 
                        className='favoris-icons-container'
                        key={numeroFolder}
                    >
                        <div className='favoris-icons-container-scrollable'>
                            {degrefolder.length>0? (
                                <AnimatePresence>
                                <motion.div 
                                    className='widget-favoris' 
                                    whileHover={{scale : 1.05}} 
                                    onClick={()=> return_previous_dossier()}
                                    key={-1*numeroFolder} 
                                    initial={{opacity : 0}}
                                    animate={{opacity : 1}}
                                    exit = {{opacity : 0}}
                                    transition={{ duration: 1}}
                                >
                                    <div className='image-widget-favoris'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-folder-filled" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" strokeWidth="0" fill="currentColor" />
                                        </svg>  
                                    </div>
                                    <div className='widget-title'>
                                        ..
                                    </div>
                                </motion.div>
                                </AnimatePresence>
                            ) : (
                                <></>
                            )}
                            {get_current_folder_object(degrefolder).children.map((children, index) => (
                                <AnimatePresence>

                                <motion.div 
                                    className='widget-favoris' 
                                    key={index+300*numeroFolder} 
                                    whileHover={{scale : 1.05}} 
                                    onClick={()=> click_favoris(children, index)}
                                    initial={{opacity : 0}}
                                    animate={{opacity : 1}}
                                    exit = {{opacity : 0}}
                                    transition={{ duration: 0.5}}
                                >
                                    {children.url?(
                                        <div className='image-widget-favoris'>
                                            <img src={`https://www.google.com/s2/favicons?domain=${children.url}`} alt={`${children.title} favicon`} />       
                                        </div>                                 
                                    ) : (
                                        <div className='image-widget-favoris'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-folder-filled" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" strokeWidth="0" fill="currentColor" />
                                            </svg>  
                                        </div>
                                    )}
                                    <div className='widget-title'>
                                        {children.title}
                                    </div>
                                </motion.div>    
                                </AnimatePresence>  
                            ))}      
                        </div>

                    </motion.div>                    
                    
                    </>
                ):(
                <>
                </>)}
                

            </motion.div>
        );
};

export default Favoris