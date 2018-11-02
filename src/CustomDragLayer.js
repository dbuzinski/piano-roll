import React from 'react';
import PropTypes from 'prop-types';
import {ItemTypes} from './Constants';
import snapToGrid from './snapToGrid';
import { DragLayer } from 'react-dnd';
import NotePreview from './NotePreview';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(props,itemType) {
  switch (itemType) {
    case ItemTypes.NOTE: {
      const { initialOffset, currentOffset } = props;
      if (!initialOffset || !currentOffset) {
        return {
          display: 'none'
        };
      }

      let { x, y } = currentOffset;
      let relativeX = x - initialOffset.x
      let relativeY = y - initialOffset.y
      let [snappedX, snappedY] = snapToGrid(relativeX, relativeY)
      let newX = snappedX+initialOffset.x
      let newY = snappedY+initialOffset.y

      const transform = `translate(${newX}px, ${newY}px)`;
      return {
        transform: transform,
        WebkitTransform: transform
      };
    }
    default:
      return {}
  }
}

class CustomDragLayer extends React.Component {
  renderItem(item,type) {
    switch (type) {
    case ItemTypes.NOTE:
      return (
        <NotePreview duration = {item.duration}/>
      );
    default:
      return null
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }
    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props,itemType)}>
          {this.renderItem(item,itemType)}
        </div>
      </div>
    );
  }
}

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  initialOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  isDragging: PropTypes.bool.isRequired
};

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export default DragLayer(collect)(CustomDragLayer);
