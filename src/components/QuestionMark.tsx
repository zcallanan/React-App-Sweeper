import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { GameState, ModesType } from "../types";

interface Props {
  modes: ModesType;
  gameState: GameState;
  onModeClick(e: React.FormEvent<HTMLFormElement>): void;
}

const QuestionMark = ({modes, gameState, onModeClick}: Props): JSX.Element => {
  const renderQuestionIcons = (): JSX.Element => {
    const attribute = {};
    // If a bomb is exploding or you have won/lost, disable the button
    if (modes.bombMode || gameState.progress !== 0) {
      attribute["disabled"] = "disabled";
    }
    if (modes.questionMode) {
      // Question mode button was clicked
      return (
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
