import Tone from 'tone';

const translateNote = {
  13: 'C4',
  12: 'C#4',
  11: 'D4',
  10: 'D#4',
  9: 'E4',
  8: 'F4',
  7: 'F#4',
  6: 'G4',
  5: 'G#4',
  4: 'A4',
  3: 'A#4',
  2: 'B4',
  1: 'C5'
}

const mapNoteToEvent = (note,bpm) => {
  let time = (note.leftEnd-1)*60/bpm;
  let noteChar = translateNote[note.row];
  let duration = (note.rightEnd-note.leftEnd+1)*60/(bpm)
  return { time : time, note : noteChar, duration : duration}
}

const playLoop = (notes,bpm) => {
    var loop = notes.map(note => mapNoteToEvent(note,bpm));
    console.log(loop);
    var synth = new Tone.PolySynth(12,Tone.Synth).toMaster();
    Tone.Transport.bpm.value = bpm

    var part = new Tone.Part(function(time, event){
      //the events will be given to the callback with the time they occur
      synth.triggerAttackRelease(event.note, event.duration, time)
    }, loop)

    part.start(0)
    part.loop = true
    part.loopEnd = '4m'
    Tone.Transport.start('+.1')
}

const toggleAudio = ({notes,bpm,playing}) => {
  if (playing) {
    Tone.Transport.stop()
    Tone.Transport.cancel()
  } else {
    playLoop(notes,bpm);
  }
}

export default toggleAudio
