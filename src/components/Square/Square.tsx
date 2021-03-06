/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faQuestionCircle,
  faBomb,
  faFireAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFlag as farFlag,
  faQuestionCircle as farQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import squareInit from "./square-init";
import squareReducer from "./square-reducer";
import { SquareProps, Disabled } from "../../types";

const Square = ({
  animations,
  gameState,
  modes,
  squareData,
  squareKey,
  explode,
  onSquareClick,
  toggleScroll,
}: SquareProps): JSX.Element => {
  // Manage state
  const [squareState, squareDispatch] = React.useReducer(
    squareReducer,
    squareInit,
  );

  React.useEffect((): void => {
    // From State
    const { bombAnimIsPlaying }: { bombAnimIsPlaying: boolean } = squareState;
    const { fireAnimIsPlaying }: { fireAnimIsPlaying: boolean } = squareState;
    // From Props
    const { explodeTrigger }: { explodeTrigger: boolean } = squareData.explosion;
    const { explodeFire }: { explodeFire: boolean } = squareData.explosion;
    // Reset square if it's a new game
    if (modes.newGame && fireAnimIsPlaying) {
      // Stop fire anim
      squareDispatch({
        type: "SQUARE_SET_FIRE_ANIM",
        payload: {
          fireAnimIsPlaying: false,
        },
      });
    } else if (
      (modes.newGame && bombAnimIsPlaying)
      || (!explodeTrigger && bombAnimIsPlaying)
    ) {
      // Stop bomb anim
      squareDispatch({
        type: "SQUARE_SET_BOMB_ANIM",
        payload: {
          bombAnimIsPlaying: false,
        },
      });
    }
    // Prevent animation renders if an animation is already playing
    if (explodeTrigger && !explodeFire && !bombAnimIsPlaying) {
      // Start bomb anim
      squareDispatch({
        type: "SQUARE_ALL_VALUES",
        payload: {
          bombAnimIsPlaying: true,
          fireAnimIsPlaying: false,
        },
      });
    } else if (!explodeTrigger && explodeFire && !fireAnimIsPlaying) {
      // Start fire anim
      squareDispatch({
        type: "SQUARE_ALL_VALUES",
        payload: {
          bombAnimIsPlaying: false,
          fireAnimIsPlaying: true,
        },
      });
    }
  }, [
    squareData.explosion,
    modes.newGame,
    squareState,
  ]);

  const cssTransition = (): JSX.Element => {
    // From State
    const { bombAnimIsPlaying }: { bombAnimIsPlaying: boolean } = squareState;
    const { fireAnimIsPlaying }: { fireAnimIsPlaying: boolean } = squareState;
    // From Props
    const { bombFade }: { bombFade: boolean } = animations;
    const { explodeTrigger }: { explodeTrigger: boolean } = squareData.explosion;
    const { explodeFire }: { explodeFire: boolean } = squareData.explosion;

    let output: JSX.Element;

    if (gameState.progress === 1) {
      // On win, change bomb opacity
      output = (
        <CSSTransition
          classNames="win"
          mountOnEnter
          key={squareKey}
          in={bombFade}
          appear={bombFade}
          timeout={{ enter: 3000, exit: 3000 }}
        >
          <FontAwesomeIcon key={squareKey} icon={faBomb} />
        </CSSTransition>
      );
    } else if (explodeTrigger && !explodeFire && !bombAnimIsPlaying) {
      // Handles bomb explosion animation
      output = (
        <CSSTransition
          classNames="bomba"
          key={squareKey}
          in={explodeTrigger}
          appear={explodeTrigger}
          onEnter={() => explode(squareKey)}
          timeout={{ enter: 1000, exit: 1000 }}
        >
          <FontAwesomeIcon key={squareKey} icon={faBomb} />
        </CSSTransition>
      );
    } else if (!explodeTrigger && explodeFire && !fireAnimIsPlaying) {
      // Handles fire explosion animation
      output = (
        <CSSTransition
          className="fire-enter"
          classNames="fire"
          mountOnEnter
          key={squareKey}
          in={explodeFire}
          appear={explodeFire}
          timeout={{ enter: 10000, exit: 20000 }}
        >
          <FontAwesomeIcon key={squareKey} icon={faFireAlt} />
        </CSSTransition>
      );
    }
    return output;
  };

  const renderIcons = (): JSX.Element => {
    // From Props
    const { bomb }: { bomb: boolean } = squareData;
    const { clicked }: { clicked: boolean } = squareData;
    const flaggedBool: boolean = squareData.flagged;
    const questionmarkBool: boolean = squareData.questionMarked;

    let output: JSX.Element;

    if (bomb && clicked) {
      // Bomb icon
      output = (
        <TransitionGroup component="span" className="bomba">
          {cssTransition()}
        </TransitionGroup>
      );
    } else if (flaggedBool && !clicked) {
      // Solid flag icon
      output = (
        <span>
          <FontAwesomeIcon icon={faFlag} />
        </span>
      );
    } else if (questionmarkBool && !clicked) {
      // Solid questionmark icon
      output = (
        <span>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </span>
      );
    } else if (gameState.progress === 0) {
      // Lined flag and questionmark icons for cursor hover
      output = (
        <span>
          <FontAwesomeIcon className="flag-icon" icon={farFlag} />
          <FontAwesomeIcon
            className="questionmark-icon"
            icon={farQuestionCircle}
          />
        </span>
      );
    }
    return output;
  };

  const disableButtons = (): Disabled | Record<string, never> => (modes.bombMode
    || modes.drawing
    ? { disabled: "disabled" }
    : {});

  const insertElement = (element: boolean): JSX.Element => {
    let output: JSX.Element;
    if (element) {
      const { adjacentBombCount }: { adjacentBombCount: number } = squareData;
      output = (
        <p className={`bomb-count neighbors-${adjacentBombCount}`}>
          {adjacentBombCount}
        </p>
      );
    }
    return output;
  };

  const buttonMarkup = (
    className: string,
    attribute: Record<string, unknown>,
    element: boolean,
  ): JSX.Element => {
    const output = (
      // eslint-disable-next-line react/button-has-type
      <button
        className={className}
        {...attribute}
        onClick={() => {
          onSquareClick(squareKey);
        }}
      >
        <span>
          {insertElement(element)}
          {renderIcons()}
        </span>
      </button>
    );
    return output;
  };

  // Handles button modes
  const generateButton = (): JSX.Element => {
    // From Props
    const { clicked }: { clicked: boolean } = squareData;
    const { hint }: { hint: boolean } = squareData;
    const flaggedBool: boolean = squareData.flagged;
    const questionmarkBool: boolean = squareData.questionMarked;
    const drawingBool: boolean = modes.drawing;

    let className = "";
    let attribute: Disabled | Record<string, never> = {};
    let element = false;
    let output: JSX.Element;

    if (clicked) {
      // Disable the button if it's been clicked
      className = "square";
      attribute = { disabled: "disabled" };
      output = buttonMarkup(className, attribute, element);
    } else if (modes.flagMode) {
      // Toggle placement of flags
      if (questionmarkBool) {
        className = "square flag-mode questionmarked";
      } else if (flaggedBool) {
        // In flagMode, if the square is flagged, show a solid flag
        className = "square flag-mode flagged";
      } else if (hint) {
        if (questionmarkBool) {
          /* In flagMode, if the square has a solid question mark over a hint,
          display it (hint should be hidden) */
          className = "square flag-mode questionmarked hint";
        } else {
          /* Toggle display of hints if hint is true and it doesn't have a
          flag or question mark */
          element = true;
          className = "square flag-mode hint";
        }
        output = buttonMarkup(className, attribute, element);
      } else {
        className = "square flag-mode";
      }
    } else if (modes.questionMode) {
      // Toggle question marks
      if (flaggedBool) {
        // In questionMode, if the square is flagged
        className = "square questionmark-mode flagged";
      } else if (questionmarkBool) {
        className = "square questionmark-mode questionmarked";
      } else if (hint) {
        if (flaggedBool) {
          // In questionMode, if the square has a solid flag over a hint, display it
          className = "square questionmark-mode flagged hint";
        } else {
          // Toggle display of hints if hint is true and it doesn't have a flag or question mark
          element = true;
          className = "square questionmark-mode hint";
        }
        output = buttonMarkup(className, attribute, element);
      } else {
        className = "square questionmark-mode";
      }
    } else if (hint) {
      if (flaggedBool) {
        // If a square eligible to display a hint is flagged, display the flag
        className = !modes.bombMode
          ? "square flagged hint"
          : "square flagged hint bomb-mode";
      } else if (questionmarkBool) {
        // If a square eligible to display a hint is question marked, display the question mark
        className = !modes.bombMode
          ? "square questionmarked hint"
          : "square questionmarked hint bomb-mode";
      } else {
        // Toggle display of hints
        element = true;
        className = !modes.bombMode ? "square hint" : "square hint bomb-mode";
      }
      attribute = disableButtons();
      output = buttonMarkup(className, attribute, element);
    } else {
      attribute = disableButtons();
      if (flaggedBool) {
        // if a square is clickable or a bomb is active, display the flag on the square
        className = !modes.bombMode
          ? "square flagged"
          : "square flagged bomb-mode";
      } else if (questionmarkBool) {
        // if a square is clickable or a bomb is active, display the question mark on the square
        className = !modes.bombMode
          ? "square questionmarked"
          : "square questionmarked bomb-mode";
      } else if (drawingBool) {
        // If the board is drawing, disable the buttons
        className = "drawing default";
        attribute = disableButtons();
      } else {
        // Default functional button
        className = !modes.bombMode
          ? "square default"
          : "square default bomb-mode";
      }
    }
    if (!output) {
      return buttonMarkup(className, attribute, element);
    }
    return output;
  };

  const squareScroll = (modes.newGame && !animations.squareScroll);

  return (
    <TransitionGroup
      component="div"
      className="squares"
      key={`${squareKey}-${animations.seed}`}
    >
      <CSSTransition
        classNames="squares"
        in={squareScroll}
        appear={squareScroll}
        key={`${squareKey}-${animations.seed}`}
        onEnter={() => toggleScroll(false, "squareScroll")}
        timeout={{ enter: 1500 }}
      >
        {generateButton()}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Square;
