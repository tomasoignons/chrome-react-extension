import React, { useEffect, useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"

const MotivationalQuote = (props) => {
    const motivationalQuotes = [
        "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès. Si vous aimez ce que vous faites, vous réussirez.",
        "Le seul moyen de faire du bon travail est d'aimer ce que vous faites.",
        "Ne laissez jamais le passé vous empêcher d'aller de l'avant.",
        "Votre temps est limité, ne le gâchez pas en vivant la vie de quelqu'un d'autre.",
        "La vie est soit une aventure audacieuse, soit rien du tout.",
        "Le futur appartient à ceux qui croient à la beauté de leurs rêves.",
        "Le succès c'est tomber sept fois et se relever huit.",
        "Croyez en vous-même et tout devient possible.",
        "La seule limite à notre réalisation du demain sera nos doutes d'aujourd'hui.",
        "Chaque jour est une nouvelle chance de changer votre vie.",
        "N'abandonnez jamais. Les miracles se produisent chaque jour.",
        "Votre détermination d'aujourd'hui est votre succès de demain.",
        "Les obstacles sont ces choses effrayantes que vous voyez lorsque vous détournez les yeux de vos objectifs.",
        "Le succès est la somme de petits efforts répétés jour après jour.",
        "Les gagnants trouvent des moyens, les perdants trouvent des excuses.",
        "N'attendez pas l'occasion, créez-la.",
        "Votre temps est précieux, ne le gaspillez pas en vivant la vie de quelqu'un d'autre.",
        "Chaque échec vous rapproche du succès.",
        "Si vous voulez quelque chose que vous n'avez jamais eu, vous devez faire quelque chose que vous n'avez jamais fait.",
        "La seule personne que vous êtes destiné à devenir est la personne que vous décidez d'être.",
        "Votre travail acharné donnera naissance à de grandes réalisations.",
    ];
      

    const [quote, setQuote] = useState('');
    const [nbreload, setNbreload] = useState(0)

    const generateRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        setNbreload(nbreload+1)
        setQuote(motivationalQuotes[randomIndex]);
    };

    useEffect(()=>{
        generateRandomQuote()
    }, [])

    return (
        <motion.div 
            className="motivational-quote-container"
            initial={{ opacity: 0, x: props.isfavoris? "3.5vw": 0}}
            animate={{ opacity: 1, x: props.isfavoris? "3.5vw": 0}}
            exit={{ opacity: 0, x: props.isfavoris? "3.5vw": 0 }}
            transition={{ duration: 1 }}
        >


            <motion.div 
                className='motivational-quote-title' 
                key={nbreload}
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 2 }}
            >
                "{quote}"
            
            </motion.div>
            <motion.div className='reload-motivational-quote' whileHover={{scale : 1.05}} onClick={()=>generateRandomQuote()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-refresh" width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
            </motion.div>
        </motion.div>
    );
};

export default MotivationalQuote;
