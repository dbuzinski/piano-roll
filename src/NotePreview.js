import React from 'react';
import NoteExtender from './NoteExtender';

const NotePreview = ({duration}) => {
  return(
    <div
      style={{
        height:'8px',
        width: 28*duration+2*(duration-1)+'px',
        backgroundColor:'yellow',
        border: '1px solid',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <NoteExtender/>
      <NoteExtender/>
    </div>
)}

export default NotePreview
