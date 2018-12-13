import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';
import Note from './Note'

class Container extends Component {

  createCells = () => {
    const cells = []
    for (let row=1;row<=this.props.numRows;row++) {
      for (let col=1;col<=this.props.numCols;col++) {
        cells.push(<div className = "ContainerCell"
          onClick = {(e) => this.props.createNote(e,row,col,col)}
          style = {{gridRow:row,gridColumn:col}}
          key = {row+','+col}/>)
      }
    }
    return cells
  }

  render () {

    const { connectDropTarget } = this.props

    const styling = {
      gridTemplateRows:"repeat( "+this.props.numRows +",1fr)",
      gridTemplateColumns:"repeat( "+this.props.numCols + ",1fr)",
    }

    return ( connectDropTarget(
    <div className = "Container"
      style = {styling}>
      {this.createCells().concat(
        this.props.notes.map(x => <Note
          leftEnd={x.leftEnd}
          rightEnd={x.rightEnd}
          row={x.row}
          id={x.id}
          deleteNote={this.props.deleteNote}
          key = {'note ' + x.id}/>)
      )}
    </div>
  ))}
}

const containerTarget = {
  drop(props,monitor) {
    this.newEnds = null;
    switch (monitor.getItemType()) {
      case ItemTypes.NOTE: {
        let { x, y } = monitor.getDifferenceFromInitialOffset();
        let shiftX = Math.floor((x+15)/30);
        let shiftY = Math.floor((y+5)/10);
        let { id, row, leftEnd, rightEnd } = monitor.getItem();
        if (rightEnd+shiftX <= props.numCols && 0 < leftEnd+shiftX && row +shiftY <= props.numRows && 0 < row +shiftY) {
          props.moveNote(id, row + shiftY, leftEnd+shiftX, rightEnd+shiftX)
        }
        return
      }
      case ItemTypes.NOTE_EXTENDER: {
        let { x } = monitor.getDifferenceFromInitialOffset();
        let { id, side, leftEnd, rightEnd } = monitor.getItem();
        let shiftX
        if (side === 'left') {
          shiftX = Math.floor((x+1)/30);
          props.extend(id,side,leftEnd,rightEnd,leftEnd+shiftX)
        } else if (side === 'right') {
          shiftX = Math.ceil((x-1)/30);
          props.extend(id,side,leftEnd,rightEnd,rightEnd+shiftX)
        }
        return
      }
      default:
        return
    }
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

Container.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
};

export default DropTarget([ItemTypes.NOTE,ItemTypes.NOTE_EXTENDER], containerTarget, collect)(Container);
