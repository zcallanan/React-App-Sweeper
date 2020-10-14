import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons'

interface Props {
  modes: modesType,
  gameState: gameStateType,
  onModeClick(e: React.FormEvent<HTMLFormElement>): void
}

interface State {

}

class Flag extends React.Component<Props, State> {

  renderFlagIcons = () => {
    const attribute = {};
    // If a bomb is exploding or you have won/lost, disable the button
    if (this.props.modes.bombMode || this.props.gameState.progress !== 0) {
      attribute["disabled"] = "disabled";
    }
    if (this.props.modes.flagMode) {
      return (
          <button className="btn btn-outline-secondary flag-button buttons" {...attribute}>
            <p>Flag Bomb</p>
            <FontAwesomeIcon icon={ faFlag } />
          </button>
        )
    }
    return (
      <button className="btn btn-outline-secondary flag-button buttons" {...attribute}>
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
