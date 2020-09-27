import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle as farQuestionCircle } from '@fortawesome/free-regular-svg-icons'

class QuestionMark extends React.Component {
  static propTypes = {
    onModeClick: PropTypes.func.isRequired,
    questionMode: PropTypes.bool.isRequired
  }

  renderQuestionIcons = () => {
    if (this.props.questionMode) {
      return (
        <button className="question-button">
          <p>Mark As Unknown</p>
          <FontAwesomeIcon icon={ faQuestionCircle } />
        </button>
      )
    }
    return (
      <button className="question-button">
        <p>Mark As Unknown</p>
        <FontAwesomeIcon icon={ farQuestionCircle } />
      </button>
    )
  }

  render() {
    return (
      <div>
        <form name="questionMode" onSubmit={this.props.onModeClick}>
          {this.renderQuestionIcons()}
        </form>
      </div>
    )
  }
}

export default QuestionMark;
