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
    modes: PropTypes.object.isRequired,
    square: PropTypes.string.isRequired
  }

  renderSquare = () => {
    const squares = this.props.squares;
    const bomb = squares.bomb;
    const clicked = squares.clicked;
    const flaggedBool = squares.flagged;
    const questionmarkBool = squares.questionMarked
    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <span>
          <img className="image" src="/images/bomb.png" alt="B"/>
        </span>
      )
    } else if (flaggedBool && !clicked) {
      return (
        <span>
          <FontAwesomeIcon icon={ faFlag } />
        </span>
      )
    } else if (questionmarkBool && !clicked) {
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
    const modes = this.props.modes;
    const adjacentBombCount = squares.adjacentBombCount;
    const clicked = squares.clicked;
    const hint = squares.hint;
    const flaggedBool = squares.flagged;
    const questionmarkBool = squares.questionMarked;
    let className;

    if (clicked) {
      // Disable the button if it's been clicked
      className = "square";
      return (
        <button className={`${className} ${square}`} disabled>
          {this.renderSquare()}
        </button>
      );
    } else if (modes.flagMode) {
      // Toggle placement of flags
      if (questionmarkBool) {
        className = "square flag-mode questionmarked";
      } else if (flaggedBool) {
        // In flagMode, if the square is flagged, show a solid flag
        className = "square flag-mode flagged";
      } else if (hint) {
        if (questionmarkBool) {
          // In flagMode, if the square has a solid question mark over a hint, display it (hint should be hidden)
          className = "square flag-mode questionmarked hint"
        } else {
          className = "square flag-mode hint";
        }
        return (
          <button className={`${className} ${square}`} onClick={() => { this.props.onSquareClick(square)}}>
            <span>
              <p className={`bomb-count neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
              {this.renderSquare()}
            </span>
          </button>
        );
      } else {
        className = "square flag-mode";
      }
    } else if (modes.questionMode) {
      // Toggle question marks
      if (flaggedBool) {
        // In questionMode, if the square is flagged
        className = "square questionmark-mode flagged";
      } else if (questionmarkBool) {
        className = "square questionmark-mode questionmarked";
      } else if (hint) {
        if (flaggedBool) {
          // In questionMode, if the square has a solid flag over a hint, display it
          className = "square questionmark-mode flagged hint"
        } else {
          className = "square questionmark-mode hint";
        }
        return (
          <button className={`${className} ${square}`} onClick={() => { this.props.onSquareClick(square)}}>
            <span>
              <p className={`bomb-count neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
              {this.renderSquare()}
            </span>
          </button>
        );
      } else {
        className = "square questionmark-mode";
      }
    } else if (hint) {
      if (flaggedBool) {
        className = "square flagged hint";
      } else if (questionmarkBool) {
        className = "square questionmarked hint";
      } else {
        // Toggle display of hints
        className="square hint";
      }

      return (
        <button className={`${className} ${square}`} onClick={() => { this.props.onSquareClick(square)}}>
          <span>
            <p className={`bomb-count neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
            {this.renderSquare()}
          </span>
        </button>
      );
    } else {
      if (flaggedBool) {
        className = "square flagged"
      } else if (questionmarkBool) {
        className = "square questionmarked"
      } else {
        // Default functional button
        className = "square default";
      }

    }
    return (
      <button className={`${className} ${square}`} onClick={() => { this.props.onSquareClick(square)}}>
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
