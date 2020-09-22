import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons'

class Square extends React.Component {

  renderSquare = () => {
    const squareState = this.props.squareState;
    const adjacentBombCount = squareState.adjacentBombCount;
    const bomb = squareState.bomb;
    const clicked = squareState.clicked;
    const hint = squareState.hint;
    const marked = squareState.marked;
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
    // Disable the button if it's been clicked
    if (this.props.squareState.clicked) {
      return (
        <button className="square" disabled>
          {this.renderSquare()}
        </button>
      );
    } else if (this.props.flag) {
      return (
        <button className="square flag" onClick={(e) => { this.props.onSquareClick(this.props.square, e)}}>
          {this.renderSquare()}
        </button>
      );
    }
    // Return initial functional button
    return (
      <button className="square" onClick={(e) => { this.props.onSquareClick(this.props.square, e)}}>
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
