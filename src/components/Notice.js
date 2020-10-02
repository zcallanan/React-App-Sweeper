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
    if (bombNotice) {
      return (
        <CSSTransition classNames="notices" key="bomb" timeout={{enter: 2500, exit: 2500}} >
          <span key="bomb" className="bomb-notice">
            <strong>You struck a bomb and lost a life!</strong>
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
