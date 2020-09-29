import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faQuestionCircle, faBomb } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag, faQuestionCircle as farQuestionCircle } from '@fortawesome/free-regular-svg-icons'

class Square extends React.Component {
  static propTypes = {
    squareData: PropTypes.shape({
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

  state = {
    bombStatus: {}
  }

  renderSquare = () => {
    const squareData = this.props.squareData;
    const squareKey = this.props.squareKey;
    const explodeTrigger = squareData.explosion.explodeTrigger;
    const bomb = squareData.bomb;
    const clicked = squareData.clicked;
    const flaggedBool = squareData.flagged;
    const questionmarkBool = squareData.questionMarked
    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <TransitionGroup component="span" className="bomba">
        {explodeTrigger && (
          <CSSTransition classNames="bomba" key={squareKey} in={explodeTrigger} appear={explodeTrigger} onEnter={() => this.props.explode(squareKey)} timeout={{enter: 1000, exit: 1000}} >
            <FontAwesomeIcon key={squareKey} icon={ faBomb } />
          </CSSTransition>
        )}
        </TransitionGroup>
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

  disableButtons = attribute => {
    const modes = this.props.modes;
    if (modes.bombMode) {
      attribute["disabled"] = "disabled";
    }
    return attribute;
  }

  // Handles button modes
  generateButton = () => {
    const squareData = this.props.squareData;
    const squareKey = this.props.squareKey;
    const modes = this.props.modes;
    const adjacentBombCount = squareData.adjacentBombCount;
    const clicked = squareData.clicked;
    const hint = squareData.hint;
    const flaggedBool = squareData.flagged;
    const questionmarkBool = squareData.questionMarked;
    let className;
    let attribute = {};

    if (clicked) {
      // Disable the button if it's been clicked
      className = "square";
      attribute["disabled"] = "disabled";
      return (
        <button className={className} {...attribute}>
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
          <button className={className} onClick={() => { this.props.onSquareClick(squareKey)}}>
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
          <button className={className} onClick={() => { this.props.onSquareClick(squareKey)}}>
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
        className = (!modes.bombMode ? "square flagged hint" : "square flagged hint bomb-mode");
      } else if (questionmarkBool) {
        className = (!modes.bombMode ? "square questionmarked hint" : "square questionmarked hint bomb-mode");
      } else {
        // Toggle display of hints
        className = (!modes.bombMode ? "square hint" : "square hint bomb-mode");
      }
      attribute = this.disableButtons(attribute)
      return (
        <button className={className} {...attribute} onClick={() => { this.props.onSquareClick(squareKey)}}>
          <span>
            <p className={`bomb-count neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
            {this.renderSquare()}
          </span>
        </button>
      );
    } else {
      if (flaggedBool) {
        className = (!modes.bombMode ? "square flagged" : "square flagged bomb-mode");
      } else if (questionmarkBool) {
        className = (!modes.bombMode ? "square questionmarked" : "square questionmarked bomb-mode");
      } else {
        // Default functional button
        className = (!modes.bombMode ? "square default" : "square default bomb-mode");
      }
      attribute = this.disableButtons(attribute)
    }
    return (
      <button className={className} {...attribute} onClick={() => { this.props.onSquareClick(squareKey)}}>
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
