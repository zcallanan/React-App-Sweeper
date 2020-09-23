import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons'

class Square extends React.Component {
  static propTypes = {
    squares: PropTypes.shape({
      adjacentBombCount: PropTypes.number.isRequired,
      bomb: PropTypes.bool.isRequired,
      clicked: PropTypes.bool.isRequired,
      hint: PropTypes.bool.isRequired,
      marked: PropTypes.bool.isRequired
    }),
    onSquareClick: PropTypes.func.isRequired,
    flagMode: PropTypes.bool.isRequired,
    square: PropTypes.string.isRequired
  }

  renderSquare = () => {
    const squares = this.props.squares;
    const adjacentBombCount = squares.adjacentBombCount;
    const bomb = squares.bomb;
    const clicked = squares.clicked;
    const hint = squares.hint;
    const marked = squares.marked;
    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <span>
          <img className="image" src="/images/bomb.png" alt="B"/>
        </span>
      )
    } else if (marked && !clicked) {
      return (
        <span>
          <FontAwesomeIcon icon={ faFlag } />
        </span>
      )
    }  else if (hint && !clicked) {
      // If it has an adjacent bomb, has not been clicked, hint is true, show the hint
      return (
        <span>
          <p className={`neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
          <FontAwesomeIcon className="flag-icon" icon={ farFlag } />
        </span>
      )
    } else if (!bomb && clicked) {
      // Not a bomb, has been clicked
      return;
    }
    return (
      <span>
        <p>?</p>
        <FontAwesomeIcon className="flag-icon" icon={ farFlag } />
      </span>
    );
  }

  generateButton = () => {
    const squares = this.props.squares;
    const square = this.props.square;

    // Disable the button if it's been clicked
    if (squares.clicked) {
      return (
        <button className="square" disabled>
          {this.renderSquare()}
        </button>
      );
    } else if (this.props.flagMode) {
      return (
        <button className="square flag" onClick={() => { this.props.onSquareClick(square)}}>
          {this.renderSquare()}
        </button>
      );
    }
    // Return initial functional button
    return (
      <button className="square" onClick={() => { this.props.onSquareClick(square)}}>
        {this.renderSquare()}
      </button>
    );
  }

  render() {
    return (
      <div>
        {this.generateButton()}
      </div>
    );
  }

}

export default Square;
