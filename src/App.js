import React, { Component } from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Tone from 'tone';
import Container from './Container.js'
import Menu from './Menu.js'
import CustomDragLayer from './CustomDragLayer'
import toggleAudio from './toggleAudio'
import './App.css';

var identifier = 0

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {notes: [],
      playing:false,
      bpm:120}
  }

  componentWillUnmount() {
    Tone.Transport.stop()
    Tone.Transport.cancel()
  }

  createNote = (event,row,leftEnd,rightEnd) => {
    this.setState((state)=> {return(
      {notes:state.notes.concat([{leftEnd:leftEnd, rightEnd:rightEnd, row:row, id:identifier++}])
        ,playing:false}
    )})
  }

  deleteNote = (event,id) => {
    this.setState((state)=>{return(
      {notes:state.notes.filter(x => x.id !== id)
        ,playing:false}
    )})
  }

  moveNote = (id,newRow,newLeft,newRight) => {
    this.deleteNote(undefined,id)
    this.createNote(undefined,newRow,newLeft,newRight)
  }

  extendNote = (note,side,newEnd) => {
    if (side === 'left') {
      return Object.assign({},note,{leftEnd:newEnd})
    } else if (side === 'right') {
      return Object.assign({},note,{rightEnd:newEnd})
    } else {
      return note
    }
  }

  handleExtension = (id,side,previousLeft,previousRight,newEnd) => {
    if ( newEnd>0 && newEnd<=this.props.numCols ) {
      if (side === 'left') {
        if (newEnd <= previousRight && newEnd !== previousLeft) {
          this.setState((state) => {return(
            {notes:state.notes.map(x => (id===x.id) ? this.extendNote(x,side,newEnd): x)
              ,playing:false}
          )})
        }
      } else if (side ==='right') {
        if (newEnd >= previousLeft && newEnd !== previousRight) {
          this.setState((state) => {return(
            {notes:state.notes.map(x => (id===x.id) ? this.extendNote(x,side,newEnd): x)
              ,playing:false}
          )})
        }
      }
    }
  }

  setBpm = (event) => {
  let newBpm = event.target.value
  this.setState((state)=>{return(
    {bpm:newBpm
      ,playing:false}
  )})
  }

  togglePlayStop = (event) => {
    this.setState((state)=>{return(
      {playing:!state.playing}
    )})

  }

  render = () => {
    toggleAudio(this.state)
    return (
      <div className="App">
        <Menu
          playing = {this.state.playing}
          bpm = {this.state.bpm}
          setBpm = {this.setBpm}
          togglePlayStop = {this.togglePlayStop}/>
        <div>
          <div id="playhead"
            className = {this.state.playing ? 'movingPlayhead' : '' }
            style={{animationDuration: (960/this.state.bpm) + 's'}}/>
          <Container
            numRows = {this.props.numRows}
            numCols = {this.props.numCols}
            createNote = {this.createNote}
            deleteNote = {this.deleteNote}
            moveNote = {this.moveNote}
            extend = {this.handleExtension}
            notes = {this.state.notes}/>
          <CustomDragLayer/>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App)
