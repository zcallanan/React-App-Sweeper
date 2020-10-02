import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Notice extends React.Component {

  static propTypes = {
    notices: PropTypes.shape({
      bombNotice: PropTypes.bool.isRequired
    })
  }

  handleNotice = () => {
    const notices = this.props.notices;
    const bombNotice = notices.bombNotice;
    const victoryNotice = notices.victoryNotice;
    const defeatNotice = notices.defeatNotice;
    if (bombNotice) {
      return (
        <CSSTransition classNames="notices" key="bomb" timeout={{enter: 2500, exit: 2500}} >
          <span key="bomb" className="notice">
            <strong>You struck a bomb and lost a life!</strong>
          </span>
        </CSSTransition>
      )
    } else if (victoryNotice) {
      return (
        <CSSTransition classNames="notices" key="victory" timeout={{enter: 2500, exit: 2500}} >
          <span key="victory" className="notice">
            <strong>You revealed the final square!</strong>
          </span>
        </CSSTransition>
      )
    } else if (defeatNotice) {
      return (
        <CSSTransition classNames="notices" key="defeat" timeout={{enter: 2500, exit: 2500}} >
          <span key="defeat" className="notice">
            <strong>You ran out of lives!</strong>
          </span>
        </CSSTransition>
      )
    }
    return;
  }
  render() {
    return (
      <div className="notice-box">
        <TransitionGroup component="span" className="notices">
          {this.handleNotice()}
        </TransitionGroup>
      </div>
    )
  }

}

export default Notice;
