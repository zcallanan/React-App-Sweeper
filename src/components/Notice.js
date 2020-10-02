import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Notice extends React.Component {

  static propTypes = {
    notices: PropTypes.shape({
      bombNotice: PropTypes.bool.isRequired,
      victoryNotice: PropTypes.bool.isRequired,
      defeatNotice: PropTypes.bool.isRequired
    })
  }

  handleNotice = () => {
    const { bombNotice, victoryNotice, defeatNotice} = this.props.notices;
    let notice = {};
    if (bombNotice) {
      // Notice content
      notice = {
        key: "bomb",
        message: "You struck a bomb and lost a life!"
      }
    } else if (victoryNotice) {
      notice = {
        key: "victory",
        message: "You revealed the final square!"
      }
    } else if (defeatNotice) {
      notice = {
        key: "defeat",
        message: "You ran out of lives!"
      }
    }
    if (Object.keys(notice).length > 0) {
      // If there's content to display, render it
      return (
        <CSSTransition classNames="notices" key={notice.key} timeout={{enter: 2500, exit: 2500}} >
          <span key={notice.key} className="notice">
            <strong>{notice.message}</strong>
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
