/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { faFlag as farFlag } from "@fortawesome/free-regular-svg-icons";
import { FlagProps } from "../../types";

const Flag = ({ modes, progress, onModeClick }: FlagProps): JSX.Element => {
  const renderFlagIcons = (): JSX.Element => {
    // If a bomb is exploding or you have won/lost, disable the button
    const attribute: Record<string, unknown> = (modes.bombMode || progress !== 0)
      ? { disabled: "disabled" }
      : {};
    // Flagmode button was clicked
    if (modes.flagMode) {
      return (
        // eslint-disable-next-line react/button-has-type
        <button
          className="btn btn-outline-secondary flag-button buttons"
          {...attribute}
        >
          <p>Flag Bomb</p>
          <FontAwesomeIcon icon={faFlag} />
        </button>
      );
    }
    // Flagmode button not clicked
    return (
      // eslint-disable-next-line react/button-has-type
      <button
        className="btn btn-outline-secondary flag-button buttons"
        {...attribute}
      >
        <p>Flag Bomb</p>
        <FontAwesomeIcon icon={farFlag} />
      </button>
    );
  };

  return (
    <form name="flagMode" onSubmit={onModeClick}>
      {renderFlagIcons()}
    </form>
  );
};

export default Flag;
