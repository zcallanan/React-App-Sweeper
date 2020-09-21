import React from 'react';

function Square(props) {
  return (
    <button className="square" onClick={props.onSquareClick}>
      ?
    </button>
  );
}

export default Square;
