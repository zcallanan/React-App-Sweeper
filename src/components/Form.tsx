import React from "react";
import { GameState, CustomGameValues, SizeDifficultyLives } from "../types";

interface Props {
  gameState: GameState;
  data: CustomGameValues;
  options: SizeDifficultyLives; // Prop is an int
  modalClose: () => void;
  initSquares: (size: number) => void;
  saveOptions: (obj: SizeDifficultyLives) => void;
}

interface State {
  options: SizeDifficultyLives; // Locally stored as a string from the form
  errors: ErrorType;
}

type ErrorType = {
  size?: string;
  difficulty?: string;
  lives?: string;
};

class Form extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      options: {
        size: "",
        difficulty: "",
        lives: "",
      },
      errors: {
        size: null,
        difficulty: null,
        lives: null,
      },
    };
  }

  componentDidMount() {
    // Set an initial local state. Only do this if size: {} is not set
    if (this.state.options.size === "") {
      const options: SizeDifficultyLives = { ...this.state.options };
      options.size = this.props.options.size.toString();
      options.difficulty = this.props.options.difficulty.toString();
      options.lives = this.props.options.lives.toString();
      this.setState({ options });
    }
  }

  // Field Validation
  protected handleValidation = (): boolean => {
    // Copy local state objects
    const options: SizeDifficultyLives = { ...this.state.options };
    const errors: ErrorType = { ...this.state.errors };
    let size: number;
    let difficulty: number;
    let lives: number;
    if (typeof options.size === "string") {
      size = Number(options.size);
    }
    if (typeof options.difficulty === "string") {
      difficulty = Number(options.difficulty);
    }
    if (typeof options.lives === "string") {
      lives = Number(options.lives);
    }
    let formIsValid = true;

    // Size of board
    if (!options.size) {
      formIsValid = false;
      errors.size = "Square number field cannot be empty";
    } else if (typeof options.size !== undefined) {
      if (isNaN(size)) {
        // If input NaN() returns true
        formIsValid = false;
        errors.size = "Enter an integer number";
      } else if (size < 5 || size > 20) {
        // If input is not in range
        formIsValid = false;
        errors.size = "Enter a number between 5 and 20";
      }
    }

    // Percentage
    if (!options.difficulty) {
      formIsValid = false;
      errors.difficulty = "The percentage field cannot be empty";
    } else if (typeof difficulty !== undefined) {
      if (isNaN(difficulty)) {
        // If the value of the select is not a number for some reason
        formIsValid = false;
        errors.difficulty = "Select a different percentage";
      }
    }

    // Lives
    if (!options.lives) {
      formIsValid = false;
      errors.lives = "The lives field cannot be empty";
    } else if (typeof lives !== undefined) {
      if (isNaN(lives)) {
        // If the value of the select is not a number for some reason
        formIsValid = false;
        errors.lives = "Select a different number of lives";
      }
    }

    // Save form errors to local state
    this.setState({ errors });
    return formIsValid;
  };

  protected handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    // 1. Intercept click
    e.preventDefault();
    // 2. Validate fields
    if (this.handleValidation()) {
      // Close the modal on a submit
      this.props.modalClose();
      // Get values
      let size: number;
      if (typeof this.state.options.size === "string") {
        size = Number(this.state.options.size);
      }
      const options: SizeDifficultyLives = { ...this.state.options };
      // Pass values to global state
      this.props.saveOptions(options);
      // Determine positioning of bombs
      this.props.initSquares(size);
    } else {
      setTimeout(() => {
        const errors: ErrorType = { ...this.state.errors };
        // TODO fix this
        if (errors.size) {
          alert(errors.size);
        } else if (errors.difficulty) {
          alert(errors.difficulty);
        } else if (errors.lives) {
          alert(errors.lives);
        }
      }, 200);
    }
  };

  protected handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // 1. Copy local field state
    const options = this.state.options;
    // 2. Get the changed value from the input
    options[
      (e.target as HTMLInputElement).name
    ] = (e.target as HTMLInputElement).value;
    // 3. Save fields to local state
    this.setState({ options });
  };

  protected handleChangeSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    // 1. Copy local field state
    const options = this.state.options;
    // 2. Get the changed value from the input
    options[
      (e.target as HTMLSelectElement).name
    ] = (e.target as HTMLSelectElement).value;
    // 3. Save fields to local state
    this.setState({ options });
  };

  protected submitButtonText = (): string => {
    const gameState = this.props.gameState;
    // If the player won or lost, ask if they want to Play Another Game. If from customize settings, display Play Sweeper
    return gameState.progress !== 0 ? "Play Again?" : "Play Sweeper";
  };

  render() {
    const data: CustomGameValues = this.props.data;
    const percentages: object = data.bombPercentage;
    const lives: object = data.numberOfLives;
    return (
      <div className="settings">
        <form key="optionsForm" onSubmit={this.handleSubmit}>
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="size" className="label">
                <strong>Squares along a side:</strong>
              </label>
              <input
                value={this.state.options.size}
                onChange={this.handleChange}
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
                value={this.state.options.difficulty}
                onChange={this.handleChangeSelect}
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
                value={this.state.options.lives}
                onChange={this.handleChangeSelect}
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
              {this.submitButtonText()}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Form;
