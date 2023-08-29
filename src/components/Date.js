import React from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr'

const CurrentDate = () => {
  const currentDate = new Date();

  const formattedDate = format(currentDate, 'd MMMM yyyy', { locale: fr }); // Utilisez la locale "fr" pour les mois en français

  return (
    <div className='date-calendar-container'>
        {formattedDate}
    </div>
);
};

export default CurrentDate;