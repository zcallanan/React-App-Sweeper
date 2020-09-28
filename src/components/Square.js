import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faQuestionCircle, faBomb } from '@fortawesome/free-solid-svg-icons'
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

  state = {
    bombStatus: {}
  }

  componentDidUpdate() {
    const squares = this.props.squares;
    const square = this.props.square;

    let bombStatus = {...this.state.bombStatus};
    if (!bombStatus[square]) {
      bombStatus[square] = {
        explodeTrigger: false,
        explodeUpdateOne: false,
        explodeUpdateTwo: false,
        explodeUpdateThree: false
      }
      this.setState({bombStatus});
    }

    if (squares.explode) {
      const bombStatus = {...this.state.bombStatus};
      if (!bombStatus[square]['explodeUpdateOne']) {
        bombStatus[square]['explodeUpdateOne'] = true;
        bombStatus[square]['explodeTrigger'] = true;
        // Trigger other explode booleans with timeouts
      }
    }

  }

  renderSquare = () => {
    const squares = this.props.squares;
    const square = this.props.square;
    const explode = squares.explode;
    const bomb = squares.bomb;

    const clicked = squares.clicked;
    const flaggedBool = squares.flagged;
    const questionmarkBool = squares.questionMarked
    if (bomb && clicked) {
      console.log('yep')
      // If it's a bomb and clicked, show the bomb
      return (
        <TransitionGroup component="span" className="bomba">
        {explode && (
          <CSSTransition classNames="bomba" key={square} in={explode} appear={explode} onEnter={() => this.props.explode(square)} timeout={{enter: 1000, exit: 1000}} >
            <FontAwesomeIcon key={square} icon={ faBomb } />
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
        <button className={className} disabled>
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
          <button className={className} onClick={() => { this.props.onSquareClick(square)}}>
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
          <button className={className} onClick={() => { this.props.onSquareClick(square)}}>
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
        <button className={className} onClick={() => { this.props.onSquareClick(square)}}>
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
      <button className={className} onClick={() => { this.props.onSquareClick(square)}}>
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
