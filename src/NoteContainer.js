import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const containerTarget = {
  drop(props,monitor) {
    // props.drop()
    props.drop(props)
    return
  },
  hover(props,monitor) {
    props.hover(props)
    return
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class NoteContainer extends Component {

  render() {
    const { connectDropTarget } = this.props

    var styling = {
      gridRow:this.props.position[0]+1,
      gridColumn:this.props.position[1]+1,
    }
    return(connectDropTarget(
      <div className='container'
      style = {styling}
      onClick = {this.props.click}></div>
    ))
  }
}

NoteContainer.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget([ItemTypes.Note,ItemTypes.NoteExtender], containerTarget, collect)(NoteContainer);
