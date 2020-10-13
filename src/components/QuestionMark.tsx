import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle as farQuestionCircle } from '@fortawesome/free-regular-svg-icons'

interface Props {
  modes: modesType,
  gameState: gameStateType,
  onModeClick(e: React.FormEvent<HTMLInputElement>): void
}

interface State {
}

class QuestionMark extends React.Component<Props, State> {
  renderQuestionIcons = () => {
    const attribute = {};
    // If a bomb is exploding or you have won/lost, disable the button
      if (this.props.modes.bombMode || this.props.gameState.progress !== 0) {
        attribute["disabled"] = "disabled";
      }
    if (this.props.modes.questionMode) {
      return (
        <button className="btn btn-outline-secondary question-button buttons" {...attribute} >
          <p>Mark As Unknown</p>
          <FontAwesomeIcon icon={ faQuestionCircle } />
        </button>
      )
    }
    return (
      <button className="btn btn-outline-secondary question-button buttons" {...attribute} >
        <p>Mark As Unknown</p>
        <FontAwesomeIcon icon={ farQuestionCircle } />
      </button>
    )
  }

  render() {
    return (
      <div>
        <form name="questionMode" onSubmit={() => this.props.onModeClick}>
          {this.renderQuestionIcons()}
        </form>
      </div>
    )
  }
}

export default QuestionMark;
