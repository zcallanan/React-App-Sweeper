import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag, faQuestionCircle as farQuestionCircle } from '@fortawesome/free-regular-svg-icons'

class Square extends React.Component {
  static propTypes = {
    squares: PropTypes.shape({
      adjacentBombCount: PropTypes.number.isRequired,
      bomb: PropTypes.bool.isRequired,
      clicked: PropTypes.bool.isRequired,
      hint: PropTypes.bool.isRequired,
      flagged: PropTypes.bool.isRequired,
      questionMarked: PropTypes.bool.isRequired
    }),
    onSquareClick: PropTypes.func.isRequired,
    marks: PropTypes.object.isRequired,
    square: PropTypes.string.isRequired
  }

  renderSquare = () => {
    const squares = this.props.squares;
    const bomb = squares.bomb;
    const clicked = squares.clicked;
    const flagged = squares.flagged;
    const questionMarked = squares.questionMarked
    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <span>
          <img className="image" src="/images/bomb.png" alt="B"/>
        </span>
      )
    } else if (flagged && !clicked) {
      return (
        <span>
          <FontAwesomeIcon icon={ faFlag } />
        </span>
      )
    } else if (questionMarked && !clicked) {
      return (
        <span>
          <FontAwesomeIcon icon={ faQuestionCircle } />
        </span>
      )
    }
    return (
      <span>
        <FontAwesomeIcon className="flag-icon" icon={ farFlag } />
        <FontAwesomeIcon className="questionmark-icon" icon={ farQuestionCircle } />
      </span>
    );
  }

  // Handles button modes
  generateButton = () => {
    const squares = this.props.squares;
    const square = this.props.square;
    const marks = this.props.marks;
    const adjacentBombCount = squares.adjacentBombCount;
    const clicked = squares.clicked;
    const hint = squares.hint;
    const flagged = squares.flagged;


    if (clicked) {
      // Disable the button if it's been clicked
      return (
        <button className="square" disabled>
          {this.renderSquare()}
        </button>
      );
    } else if (marks.flagMode) {
      // Toggle placement of flags
      if (hint) {
        return (
          <button className="square flag hint" onClick={() => { this.props.onSquareClick(square)}}>
            <span>
              <p className={`bomb-count neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
              <FontAwesomeIcon className="flag-icon" icon={ farFlag } />
            </span>
          </button>
        );
      }
      if (flagged) {
        return (
          <button className="square flag flagged" onClick={() => { this.props.onSquareClick(square)}}>
            {this.renderSquare()}
          </button>
        );
      }
      return (
        <button className="square flag" onClick={() => { this.props.onSquareClick(square)}}>
          {this.renderSquare()}
        </button>
      );
    } else if (marks.questionMode) {
      // Toggle placement of question marks
      return (
        <button className="square questionmark" onClick={() => { this.props.onSquareClick(square)}}>
          {this.renderSquare()}
        </button>
      );
    } else if (hint) {
      // Toggle display of hints
      return (
        <button className="square hint" onClick={() => { this.props.onSquareClick(square)}}>
          <span>
            <p className={`neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
            <FontAwesomeIcon className="flag-icon" icon={ farFlag } />
          </span>
        </button>
      );
    }
    // Return initial functional button
    return (
      <button className="square default" onClick={() => { this.props.onSquareClick(square)}}>
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
