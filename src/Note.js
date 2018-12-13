import React, {Component} from 'react';
import {DragSource} from 'react-dnd'
import PropTypes  from 'prop-types';
import {ItemTypes} from './Constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import NoteExtender from './NoteExtender'

class Note extends Component {

  constructor() {
    super();
    this.state = {childDragging: false}
  }

  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }

  dragChild() {
    this.setState((state)=>{return {childDragging:true}})
  }

  dropChild() {
    this.setState((state)=>{return {childDragging:false}})
  }

  render(){

    const {leftEnd, rightEnd, row, id, deleteNote, connectDragSource, isDragging} = this.props
    const styling = {
      gridRow:row,
      opacity: ( isDragging || this.state.childDragging)? 0 : 1,
      gridColumn : leftEnd +'/'+ (rightEnd+1),
    }

    return (connectDragSource(
      <div className="Note"
        style = {styling}
        onClick = {(e)=> deleteNote(e,id)}>
        <NoteExtender id = {id}
          side = 'left'
          leftEnd = {leftEnd}
          rightEnd = {rightEnd}
          row = {row}
          drag = {() => this.dragChild()}
          drop = {() => this.dropChild()}/>
        <NoteExtender id = {id}
          side = 'right'
          leftEnd = {leftEnd}
          rightEnd = {rightEnd}
          row = {row}
          drag = {() => this.dragChild()}
          drop = {() => this.dropChild()}/>
      </div>
    ))
  }
}

const noteSource = {
  beginDrag(props) {
    return {id:props.id,
      type:ItemTypes.NOTE,
      leftEnd:props.leftEnd,
      rightEnd: props.rightEnd,
      row: props.row,
      duration: props.rightEnd-props.leftEnd+1}
  },
}

function collect(connect,monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

Note.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource(ItemTypes.NOTE,noteSource,collect)(Note);
