import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons'

class Flag extends React.Component {
  static propTypes = {
    onModeClick: PropTypes.func.isRequired,
    flagMode: PropTypes.bool.isRequired
  }

  renderFlagIcons = () => {
    if (this.props.flagMode) {
      return (
        <button className="flag-button">
          <p>Flag Bomb</p>
          <FontAwesomeIcon icon={ faFlag } />
        </button>
      )
    }
    return (
      <button className="flag-button">
        <p>Flag Bomb</p>
        <FontAwesomeIcon icon={ farFlag } />
      </button>
    )
  }

  render() {
    return (
      <form name="flagMode" onSubmit={this.props.onModeClick}>
        {this.renderFlagIcons()}
      </form>
    )
  }
}

export default Flag;
