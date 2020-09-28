import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Notice extends React.Component {

  static propTypes = {
    displayNotice: PropTypes.bool.isRequired
  }

  handleNotice = () => {
    const displayNotice = this.props.displayNotice;
    if (displayNotice) {
      return (
        <CSSTransition classNames="notice" key="that" timeout={{enter: 1500, exit: 1500}} >
          <span>
            You struck a bomb and lost a life!
          </span>
        </CSSTransition>
      )
    }
    return;
  }
  render() {
    return (
      <div>
        <TransitionGroup component="span" className="notice">
          {this.handleNotice()}
        </TransitionGroup>
      </div>
    )
  }

}

export default Notice;
