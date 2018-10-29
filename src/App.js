import React, { Component } from 'react';
import './App.css';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Note from './Note';
import NoteContainer from './NoteContainer';
import Tone from 'tone';
import Play from './img/Play.png'
import Stop from './img/Stop.png'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notes: {},
      notePreview: {},
      dragProps: {},
      playStop: 'Play',
      bpm: 120
    }
  }

  createNote = (event,row,col) => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    this.setState((state) => {
      let newNotes = state.notes
      newNotes[row+','+col] = {leftEndpoint: col, rightEndpoint: col, note: row, duration: 1}
      return(
      {notes: newNotes,
        playStop:'Play'}
    )})
  }

  deleteNote = (event,key) => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    this.setState((state) => {
      let newNotes = state.notes
      delete newNotes[key]
      return(
      {notes: newNotes,
        playStop:'Play'}
    )})
  }

  extendNote = (note, time, side) => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    if (this.state.dragProps.type === 'NoteExtender') {
      if (side === 'right') {
        let duration = this.state.notes[note+','+time].duration
        let leftEnd = this.state.notes[note+','+time].leftEndpoint
        let rightEnd = this.state.notes[note+','+time].rightEndpoint
        if ((rightEnd - time + 1 !== duration) && (rightEnd>=time)) {
          this.setState((state)=>{
            var newNotes = state.notes
            newNotes[note+','+time] = {leftEndpoint: leftEnd ,rightEndpoint:rightEnd, note:note, duration: (rightEnd-leftEnd + 1)}
            return(
            {notes:newNotes,
            dragProps:{},
            playStop: 'Play'}
          )})
        }
      } else if (side === 'left') {
        let duration = this.state.notes[note+','+time].duration
        let leftEnd = this.state.notes[note+','+time].leftEndpoint
        let rightEnd = this.state.notes[note+','+time].rightEndpoint
        if ((Math.abs(leftEnd - rightEnd) + 1 !== duration) && (leftEnd<=time+duration-1)) {
          this.setState((state=>{
            var newNotes = state.notes
            delete newNotes[note+','+time]
            newNotes[note+','+leftEnd] = {leftEndpoint: leftEnd, rightEndpoint: rightEnd, note: note, duration: (rightEnd-leftEnd + 1)}
            return(
              {notes:newNotes
              , dragProps:{}
              , playStop: 'Play'}
            )}))
        }
      }
    }
  }

  moveNote = (note, time, newNote, newTime) => {
      Tone.Transport.stop()
      Tone.Transport.cancel()
      this.setState((state) => {
        var newNotes = state.notes
        delete newNotes[note+','+time]

        newNotes[this.state.notePreview.note+','+this.state.notePreview.leftEndpoint] = this.state.notePreview
        return(
        {notes: newNotes,
          dragProps:{},
          notePreview:{},
          playStop:'Play'})
      })
  }

  handleDrag = (props) => {
    this.setState((state)=> {
      return(
        {dragProps:props}
      )})
  }

  handleContainerDrop = (props) => {
    if (this.state.dragProps.type === 'Note') {
      this.moveNote(this.state.dragProps.row,this.state.dragProps.leftEndpoint,props.position[0],props.position[1])
    } else if (this.state.dragProps.type === 'NoteExtender') {
      this.extendNote(this.state.dragProps.row,this.state.dragProps.col,this.state.dragProps.side)
    }
  }

  handleNoteDrop = (props) => {
      if (this.state.dragProps.type === 'Note') {
        this.moveNote(this.state.dragProps.row,this.state.dragProps.leftEndpoint,props.row,props.leftEndpoint)
      } else if (this.state.dragProps.type === 'NoteExtender') {
        this.extendNote(this.state.dragProps.row,this.state.dragProps.col,this.state.dragProps.side)
      }
    }

  previewExtend = (currentHover,side,note,time) => {
    if (side === 'right') {
      let rightEnd = this.state.notes[note+','+time].rightEndpoint
      if ((currentHover !== rightEnd) && (currentHover>=time)) {
        this.setState((state)=>{
          let newNotes = state.notes
          newNotes[note+','+time].rightEndpoint = currentHover
          return(
          {notes:newNotes}
        )})
      }
    } else if (side === 'left') {
      let duration = this.state.notes[note+','+time].duration
      let leftEnd = this.state.notes[note+','+time].leftEndpoint
      if ((currentHover !== leftEnd) && (currentHover<=time+duration-1)) {
        this.setState((state)=>{
          let newNotes = state.notes
          newNotes[note+','+time].leftEndpoint = currentHover
          return(
          {notes:newNotes}
        )})
      }
    }


  }

  previewMove = (hoverEndpoint,hoverNote,row,col) => {
    if ((this.state.notePreview.leftEndpoint !== hoverEndpoint) || (this.state.notePreview.note !== hoverNote)) {
      var duration = this.state.notes[row+','+col].duration
      var preview = { note: hoverNote,
        leftEndpoint: hoverEndpoint,
        rightEndpoint: hoverEndpoint+duration-1,
        duration: duration
      }
      this.setState((state) => {return(
        {notePreview:preview}
      )})
    }
  }

  handleHover = (props) => {
    if (this.state.dragProps.type === 'Note') {
      this.previewMove(props.position[1],props.position[0],this.state.dragProps.row,this.state.dragProps.leftEndpoint)
    } else if (this.state.dragProps.type === 'NoteExtender') {
      this.previewExtend(props.position[1],this.state.dragProps.side,this.state.dragProps.row,this.state.dragProps.col)
    }
  }

  pointerEventStyle = () => {
    if (Object.keys(this.state.dragProps).length === 0) {
      return 'auto'
    } else if (this.state.dragProps.type === 'NoteExtender') {
      return 'none'
    } else {
      return 'auto'
    }
  }

  displayNotes = () => {
    var notes = []
    for (let note in this.state.notes) {

      notes.push(<Note
        click = {(e) => this.deleteNote(e,note)}
        type = 'Note'
        drag = {this.handleDrag}
        drop = {this.handleNoteDrop}
        pointerEventStyle = {this.pointerEventStyle()}
        row = {this.state.notes[note].note}
        leftEndpoint = {this.state.notes[note].leftEndpoint}
        rightEndpoint = {this.state.notes[note].rightEndpoint}
        />)
    }
    if (this.state.notePreview.note !== undefined) {
      notes.push(<Note
        click = {(e) => this.deleteNote(e,this.state.notePreview.note)}
        type = 'Note'
        drag = {this.handleDrag}
        drop = {this.handleNoteDrop}
        row = {this.state.notePreview.note}
        leftEndpoint = {this.state.notePreview.leftEndpoint}
        rightEndpoint = {this.state.notePreview.rightEndpoint}
        />)
    }
    return(notes)
  }

  displayContainers = () => {
    var boxes = [];
    for (let i=0;i<192;i++) {
      let [col,row] = this.labelPosition(i)
      boxes.push(<NoteContainer
        click = {(e)=> this.createNote(e,row,col)}
        position = {[row,col]}
        drop = {this.handleContainerDrop}
        hover = {this.handleHover}
        />)
    };
    return boxes
  }

  labelPosition = (i) => {
    var second = i%12;
    var first = (i-second)/12;
    return [first,second]
  }


  playLoop = () => {
      var synth = new Tone.PolySynth(12,Tone.Synth).toMaster();
      Tone.Transport.bpm.value = this.state.bpm
      var part = new Tone.Part(function(time, event){
        //the events will be given to the callback with the time they occur
        synth.triggerAttackRelease(event.note, event.dur, time)
      }, this.createLoop())

      part.start(0)
      part.loop = true
      part.loopEnd = '4m'
      Tone.Transport.start('+.1')
  }

  togglePlayStop = (event) => {
    if (this.state.playStop === 'Play') {
      this.playLoop()
      this.setState((state)=>{return(
        {playStop:'Stop'}
      )})
    } else if (this.state.playStop === 'Stop') {
      Tone.Transport.stop()
      Tone.Transport.cancel()
      this.setState((state)=>{return(
        {playStop:'Play'}
      )})
    }
  }

  translateNote = {
    12: 'C4',
    11: 'C#4',
    10: 'D4',
    9: 'D#4',
    8: 'E4',
    7: 'F4',
    6: 'F#4',
    5: 'G4',
    4: 'G#4',
    3: 'A4',
    2: 'A#4',
    1: 'B4',
    0: 'C5'
  }

  createLoop = () => {
    var loop = []
    for (let note in this.state.notes) {
      let time = this.state.notes[note].leftEndpoint*60/(this.state.bpm)
      let noteChar = this.translateNote[this.state.notes[note].note]
      let dur = (this.state.notes[note].duration)*60/(this.state.bpm)
      loop.push({ time : time, note : noteChar, dur : dur})
    }
    return loop
  }

  setBpm = (event) => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    let newBpm = event.target.value
    this.setState((state)=>{return(
      {bpm:newBpm
      , playStop:'Play'}
    )})
  }

  render() {
    return (
      <div className="App">
        <div id='menu'>
          <div id = 'playButton'>
            <img
              onClick={this.togglePlayStop}
              src={this.state.playStop=='Play'? Play : Stop}
              ></img>
          </div>
          <div id = 'bpmText'> {this.state.bpm + ' BPM'} </div>
          <div>
            <input className='slider' type="range" min="60" max="200" defaultValue={this.state.bpm} onInput={this.setBpm}/>
          </div>
        </div>

        <div id='piano-roll'>
          <div id="playhead"
            className = {(this.state.playStop==='Play') ? '': 'movingPlayhead' }
            style={{animationDuration: (960/this.state.bpm) + 's'}}>
          </div>
          <div id ='piano-grid'>
            {this.displayContainers().concat(this.displayNotes())}
          </div>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App)
