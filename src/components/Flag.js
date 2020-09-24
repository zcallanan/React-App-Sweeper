import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons'

class Flag extends React.Component {
  static propTypes = {
    onMarkClick: PropTypes.func.isRequired,
    flagMode: PropTypes.bool.isRequired
  }

  renderFlagIcons = () => {
    if (this.props.flagMode) {
      return (
        <button className="flag-button-active">
          <p>Set Flag</p>
          <FontAwesomeIcon icon={ faFlag } />
        </button>
      )
    }
    return (
      <button className="flag-button">
        <p>Flag Possible Bomb</p>
        <FontAwesomeIcon icon={ farFlag } />
      </button>
    )
  }

  render() {
    return (
      <div>
        <form name="flagMode" onSubmit={this.props.onMarkClick}>
          {this.renderFlagIcons()}
        </form>
      </div>
    )
  }
}

export default Flag;
