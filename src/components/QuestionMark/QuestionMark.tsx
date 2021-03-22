/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { QuestionProps } from "../../types";

const QuestionMark = ({ modes, progress, onModeClick }: QuestionProps): JSX.Element => {
  const renderQuestionIcons = (): JSX.Element => {
    // If a bomb is exploding or you have won/lost, disable the button
    const attribute: Record<string, unknown> = (modes.bombMode || progress !== 0)
      ? { disabled: "disabled" }
      : {};
    if (modes.questionMode) {
      // Question mode button was clicked
      return (
        // eslint-disable-next-line react/button-has-type
        <button
          className="btn btn-outline-secondary question-button buttons"
          {...attribute}
        >
          <p>Mark As Unknown</p>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
      );
    }
    // Question mode button is not clicked
    return (
      // eslint-disable-next-line react/button-has-type
      <button
        className="btn btn-outline-secondary question-button buttons"
        {...attribute}
      >
        <p>Mark As Unknown</p>
        <FontAwesomeIcon icon={farQuestionCircle} />
      </button>
    );
  };

  return (
    <div>
      <form name="questionMode" onSubmit={onModeClick}>
        {renderQuestionIcons()}
      </form>
    </div>
  );
};

export default QuestionMark;
