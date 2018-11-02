import React, { Component } from 'react';
import {DragSource} from 'react-dnd';
import PropTypes  from 'prop-types';
import {ItemTypes} from './Constants';
import { getEmptyImage } from 'react-dnd-html5-backend';

class NoteExtender extends Component {

  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }


  render() {
    const { connectDragSource } = this.props;
    return(connectDragSource(
      <div className="NoteExtender">|</div>
    ))
  }
}


const noteExtenderSource = {
  beginDrag(props) {
    return {id:props.id,
      side:props.side,
      leftEnd:props.leftEnd,
      rightEnd:props.rightEnd,
      row:props.row,
      duration: props.rightEnd-props.leftEnd+1}
  },
}

function collect(connect,monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  }
}

NoteExtender.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource(ItemTypes.NOTE_EXTENDER,noteExtenderSource,collect)(NoteExtender);
