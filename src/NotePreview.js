import React from 'react';

const NotePreview = () => {
  return(
    <div
      style={{
        height:'8px',
        backgroundColor:'yellow',
        border: '1px solid',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <div className="ExtenderPreview">|</div>
      <div className="ExtenderPreview">|</div>
    </div>
)}

export default NotePreview
