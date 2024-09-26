import React, { useState, useEffect} from 'react';


export default function Track({ name, artist, album }) {

   return (
        <div>
            <p><strong>{name}</strong></p>
            <p>{artist}</p>
            <p>{album}</p>
        </div>
   );
 
}