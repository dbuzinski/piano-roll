import React, { Component } from 'react';
import {DragSource,DropTarget} from 'react-dnd';
import PropTypes  from 'prop-types';
import {ItemTypes} from './Constants';
import NoteExtender from './NoteExtender';
import { getEmptyImage } from 'react-dnd-html5-backend';

const noteSource = {
  beginDrag(props) {
    props.drag(props)
    return {}
  },
  endDrag(props, monitor) {
    const didDrop = monitor.didDrop()
    if (!didDrop) {
      props.drop(props)
    }
  }
}

const noteTarget = {
  drop(props,monitor) {
    props.drop(props)
    return
  },
  hover(props,monitor) {
    // props.hover(props)
    return
  }
}

function collectDrag(connect,monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Note extends Component {

  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }

  render() {
    const { connectDragSource, connectDropTarget, isDragging } = this.props;
    var styling = {
      gridRow : (this.props.row+1),
      gridColumn : (this.props.leftEndpoint+1) +'/'+ (this.props.rightEndpoint+2),
      display: isDragging? 'none' : 'flex',
      pointerEvents: this.props.pointerEventStyle
    };
    return (connectDragSource(connectDropTarget(
      <div className='note'
        style = {styling}
        onClick = {this.props.click}>
        <NoteExtender
          drop = {this.props.drop}
          leftEndpoint = {this.props.leftEndpoint}
          row = {this.props.row}
          col = {this.props.leftEndpoint}
          drag = {this.props.drag}
          side = 'left'
          type = 'NoteExtender'/>
        <NoteExtender
          drop = {this.props.drop}
          leftEndpoint = {this.props.leftEndpoint}
          row = {this.props.row}
          col = {this.props.leftEndpoint}
          drag = {this.props.drag}
          side = 'right'
          type = 'NoteExtender'/>
      </div>
    )))
  }
}

Note.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

const NoteDropTarget = DropTarget([ItemTypes.Note,ItemTypes.NoteExtender],noteTarget,collectDrop)(Note);

export default DragSource(ItemTypes.Note,noteSource,collectDrag)(NoteDropTarget);
