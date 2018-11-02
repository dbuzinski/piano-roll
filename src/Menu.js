import React from 'react';
import Play from './img/Play.png'
import Stop from './img/Stop.png'

const Menu = ({playing, bpm, togglePlayStop, setBpm}) => {
  return(
    <div id='menu'>
      <div id = 'playButton'>
        <img
          src={playing? Stop : Play}
          onClick={togglePlayStop}
          alt = 'play button'/>
      </div>
      <div id = 'bpmText'> {bpm + ' BPM'} </div>
      <div>
        <input className='slider'
          type="range" min="60"
          max="200" defaultValue={bpm}
          onInput={setBpm}/>
      </div>
    </div>
)}

export default Menu
