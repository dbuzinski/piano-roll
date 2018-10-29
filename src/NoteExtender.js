import React, { Component } from 'react';
import {DragSource,DropTarget} from 'react-dnd';
import PropTypes  from 'prop-types';
import {ItemTypes} from './Constants';
import { getEmptyImage } from 'react-dnd-html5-backend';

const noteExtenderSource = {
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

const noteExtenderTarget = {
  drop(props,monitor) {
    props.drop(props)
    return
  },
}

function collectDrag(connect,monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  }
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class NoteExtender extends Component {
  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }

  render() {
    const { connectDragSource, connectDropTarget, connectDragPreview } = this.props;
    return(connectDragSource(connectDropTarget(
      <div className="noteExtender">|</div>))
  )}
}

NoteExtender.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

const NoteExtenderDropTarget = DropTarget([ItemTypes.Note,ItemTypes.NoteExtender],noteExtenderTarget,collectDrop)(NoteExtender);

export default DragSource(ItemTypes.NoteExtender,noteExtenderSource,collectDrag)(NoteExtenderDropTarget);
