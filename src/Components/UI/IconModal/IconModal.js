import React from 'react';
import PropTypes from 'prop-types';

function IconModal({ width, height, color, fill, viewBox, onClick, children }) {
  return (
    <svg
      width={width}
      height={height}
      color={color}
      fill={fill}
      viewBox={viewBox}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

IconModal.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default IconModal;
