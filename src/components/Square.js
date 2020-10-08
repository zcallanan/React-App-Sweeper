import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faQuestionCircle, faBomb, faFireAlt } from '@fortawesome/free-solid-svg-icons'
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
    squareKey: PropTypes.string.isRequired
  }

  cssTransition = (squareKey, explodeTrigger, fire) => {
    console.log(explodeTrigger, fire)
    if (explodeTrigger && !fire) {
      return (
        <CSSTransition classNames="bomba" key={squareKey} in={explodeTrigger} appear={explodeTrigger} onEnter={() => this.props.explode(squareKey)} timeout={{enter: 1000, exit: 1000}} >
          <FontAwesomeIcon key={squareKey} icon={ faBomb } />
        </CSSTransition>
      )
    } else if (!explodeTrigger && fire) {
      return (
        <CSSTransition className="fire-enter" classNames="fire" mountOnEnter key={squareKey} in={fire} appear={fire} timeout={{enter: 10000, exit: 20000}} >
          <FontAwesomeIcon key={squareKey} icon={ faFireAlt } />
        </CSSTransition>
      )
    }
  }

  renderIcons = () => {
    const squareData = this.props.squareData;
    const gameState = this.props.gameState;
    const squareKey = this.props.squareKey;
    const explodeTrigger = squareData.explosion.explodeTrigger;
    let fire = squareData.explosion.explodeFire;
    const bomb = squareData.bomb;
    const clicked = squareData.clicked;
    const flaggedBool = squareData.flagged;
    const questionmarkBool = squareData.questionMarked
    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <TransitionGroup component="span" className="bomba">
          {this.cssTransition(squareKey, explodeTrigger, fire)}
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
    if (gameState.progress !== -1) {
      return (
        <span>
          <FontAwesomeIcon className="flag-icon" icon={ farFlag } />
          <FontAwesomeIcon className="questionmark-icon" icon={ farQuestionCircle } />
        </span>
      );
    }

  }

  disableButtons = attribute => {
    const modes = this.props.modes;
    if (modes.bombMode || modes.drawing) {
      attribute["disabled"] = "disabled";
    }
    return attribute;
  }

  insertElement = element => {
    if (element) {
      const adjacentBombCount = this.props.squareData.adjacentBombCount;
      return (
        <p className={`bomb-count neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
      )
    }
  }

  buttonMarkup = (className, attribute, element) => {
    const squareKey = this.props.squareKey;

    return (
      <button className={className} {...attribute} onClick={() => { this.props.onSquareClick(squareKey)}}>
        <span>
          {this.insertElement(element)}
          {this.renderIcons()}
        </span>
      </button>
    )
  }

  // Handles button modes
  generateButton = () => {
    const squareData = this.props.squareData;
    const modes = this.props.modes;
    const clicked = squareData.clicked;
    const hint = squareData.hint;
    const flaggedBool = squareData.flagged;
    const questionmarkBool = squareData.questionMarked;
    const drawingBool = modes.drawing;
    let className;
    let attribute = {};
    let element = false;

    if (clicked) {
      // Disable the button if it's been clicked
      className = "square";
      attribute["disabled"] = "disabled";
      return this.buttonMarkup(className, attribute, element);
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
          // Toggle display of hints if hint is true and it doesn't have a flag or question mark
          element = true;
          className = "square flag-mode hint";
        }
        return this.buttonMarkup(className, attribute, element);
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
          // Toggle display of hints if hint is true and it doesn't have a flag or question mark
          element = true;
          className = "square questionmark-mode hint";
        }
        return this.buttonMarkup(className, attribute, element);
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
        element = true;
        className = (!modes.bombMode ? "square hint" : "square hint bomb-mode");
      }
      attribute = this.disableButtons(attribute);
      return this.buttonMarkup(className, attribute, element);
    } else {
      attribute = this.disableButtons(attribute)
      if (flaggedBool) {
        className = (!modes.bombMode ? "square flagged" : "square flagged bomb-mode");
      } else if (questionmarkBool) {
        className = (!modes.bombMode ? "square questionmarked" : "square questionmarked bomb-mode");
      } else {
        if (drawingBool) {
          // If the board is drawing, disable the buttons
          className = "drawing default";
          attribute = this.disableButtons(attribute);
        } else {
          // Default functional button
          className = (!modes.bombMode ? "square default" : "square default bomb-mode");
        }
      }

    }
    return this.buttonMarkup(className, attribute, element);
  }

  render() {
    const squareKey = this.props.squareKey;
    const modes = this.props.modes;
    let squareScroll = modes.newGame && !this.props.animations.squareScroll ? true : false;
    return (
      <TransitionGroup component="div" className="squares" key={`${squareKey}-${this.props.animations.seed}`}>
        <CSSTransition classNames="squares" in={squareScroll} appear={squareScroll} key={`${squareKey}-${this.props.animations.seed}`} onEnter={() => this.props.toggleScroll(false)} timeout={{enter: 1500}} >
          {this.generateButton()}
        </CSSTransition>
      </TransitionGroup>
    );
  }

}

export default Square;
