import React from "react";
import { formReducer, formInit } from "../reducers";
import {
  GameState,
  CustomGameValues,
  SizeDifficultyLives,
  DictString
} from "../types";

interface Props {
  gameState: GameState;
  data: CustomGameValues;
  options: SizeDifficultyLives;
  modalClose: () => void;
  initSquares: (size: number) => void;
  saveOptions: (obj: SizeDifficultyLives) => void;
}

const Form = ({
  gameState,
  data,
  options,
  modalClose,
  initSquares,
  saveOptions,
}: Props): JSX.Element => {
  // Manage state
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    formInit,
  );

  React.useEffect(() => {
    const sizeState = formState.size;
    const difficultyState = formState.difficulty;
    const livesState = formState.lives;
    if (sizeState < 0 && difficultyState < 0 && livesState < 0 ) {
      formDispatch({
        type: "InitValues",
        payload: {
          size: options.size,
          difficulty: options.difficulty,
          lives: options.lives,
        },
      });
    }
  }, [
    options.size,
    options.difficulty,
    options.lives,
    formState.size,
    formState.difficulty,
    formState.lives
  ]);

  // Field Validation
  const handleValidation = (): boolean => {
    // From State
    const sizeState: number = formState.size;
    const difficultyState: number = formState.difficulty;
    const livesState: number = formState.lives;

    let formIsValid = true;
    let errorString: string;

    // Size of board
    if (!sizeState) {
      formIsValid = false;
      errorString = "Square number field cannot be empty";
    } else if (typeof sizeState !== undefined) {
      if (isNaN(sizeState)) {
        // If input NaN() returns true
        formIsValid = false;
        errorString = "Enter an integer number";
      } else if (sizeState < 5 || sizeState > 20) {
        // If input is not in range
        formIsValid = false;
        errorString = "Enter a number between 5 and 20";
      }
    } else if (!difficultyState) {
      formIsValid = false;
      errorString = "The percentage field cannot be empty";
    } else if (typeof difficultyState !== undefined && isNaN(difficultyState)) {
      // If the value of the select is not a number for some reason
      formIsValid = false;
      errorString = "Select a different percentage";
    } else if (!livesState) {
      formIsValid = false;
      errorString = "The lives field cannot be empty";
    } else if (typeof livesState !== undefined && isNaN(livesState)) {
      // If the value of the select is not a number for some reason
      formIsValid = false;
      errorString = "Select a different number of lives";
    }

    formDispatch({
      type: "SetError",
      payload: { errorString },
    });
    return formIsValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Validate fields
    if (handleValidation()) {
      // Close the modal on a submit
      modalClose();
      // From State
      const sizeState: number = formState.size;
      const difficultyState: number = formState.difficulty;
      const livesState: number = formState.lives;
      // Pass values to global state
      saveOptions({
        size: sizeState,
        difficulty: difficultyState,
        lives: livesState,
      });
      // Determine positioning of bombs
      initSquares(sizeState);
    } else {
      setTimeout(() => {
        const errorState: string = formState.errorString;
        alert(errorState);
      }, 200);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if ((e.target as HTMLInputElement).name === 'size') {
      formDispatch({
        type: "SetSize",
        payload: {
          size: Number((e.target as HTMLInputElement).value),
        },
      });
    }
  };

  const handleChangeSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    if ((e.target as HTMLSelectElement).name === 'difficulty') {
      formDispatch({
        type: "SetDifficulty",
        payload: {
          difficulty: Number((e.target as HTMLSelectElement).value),
        },
      });
    } else if ((e.target as HTMLSelectElement).name === 'lives') {
      formDispatch({
        type: "SetLives",
        payload: {
          lives: Number((e.target as HTMLSelectElement).value),
        },
      });
    }
  };

  const submitButtonText = (): string => {
    /* If the player won or lost, ask if they want to Play Another Game.
    If from customize settings, display Play Sweeper */
    return gameState.progress !== 0 ? "Play Again?" : "Play Sweeper";
  };

  const percentages: DictString = data.bombPercentage;
  const lives: DictString = data.numberOfLives;

  return (
    <div className="settings">
      <form key="optionsForm" onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="size" className="label">
              <strong>Squares along a side:</strong>
            </label>
            <input
              value={formState.size}
              onChange={handleChange}
              name="size"
              key="size"
              type="text"
              id="size"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">
              <strong>Percentage of bombs:</strong>
            </label>
            <select
              value={formState.difficulty}
              onChange={handleChangeSelect}
              name="difficulty"
              key="difficulty"
              id="difficulty"
              className="form-control"
            >
              {Object.keys(percentages).map((key) => (
                <option key={key} value={key}>
                  {percentages[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lives">
              <strong>Number of Lives:</strong>
            </label>
            <select
              value={formState.lives}
              onChange={handleChangeSelect}
              name="lives"
              key="lives"
              id="lives"
              className="form-control"
            >
              {Object.keys(lives).map((key) => (
                <option key={key} value={key}>
                  {lives[key]}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary" type="submit">
            {submitButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
