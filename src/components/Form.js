import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
  static propTypes = {
    saveOptions: PropTypes.func.isRequired,
    initSquares: PropTypes.func.isRequired,
    percentages: PropTypes.object.isRequired,
    lives: PropTypes.object.isRequired,
    options: PropTypes.shape({
      size: PropTypes.number.isRequired,
      difficulty: PropTypes.number.isRequired
    }),
    gameState: PropTypes.object.isRequired
  }

  // Local validation state
  state = {
    options: {
      size: -1,
      difficulty: -1,
      lives: -1
    },
    errors: {}
  }

  componentDidMount() {
    // Set an initial local state. Only do this if size: {} is not set
    if (this.state.options.size === -1) {
      const options = {...this.state.options};
      options.size = this.props.options.size;
      options.difficulty = this.props.options.difficulty;
      options.lives = this.props.options.lives;
      this.setState({ options });
    }
  }

  // Field Validation
  handleValidation = () => {
    // Copy local state objects
    const options = { ...this.state.options };
    const errors = { ...this.state.errors };
    let formIsValid = true;

    // Size of board
    if (!options.size) {
      formIsValid = false;
      errors.size = "Square number field cannot be empty";
    } else if(typeof options.size !== "undefined"){
      if(isNaN(parseInt(options["size"]))){
        // If input NaN() returns true
        formIsValid = false;
        errors.size = "Enter an integer number";
      }
      else if(options.size < 5 || options.size > 20){
        // If input is not in range
        formIsValid = false;
        errors.size = "Enter a number between 5 and 20";
      }
    }

    // Percentage
    if (!options.difficulty) {
      formIsValid = false;
      errors.difficulty = "The percentage field cannot be empty";
    } else if(typeof options.difficulty !== "undefined"){
      if(isNaN(parseInt(options["difficulty"]))){
        // If the value of the select is not a number for some reason
        formIsValid = false;
        errors.difficulty = "Select a different percentage";
      }
    }

    // Lives
    if (!options.lives) {
      formIsValid = false;
      errors.lives = "The lives field cannot be empty";
    } else if(typeof options.lives !== "undefined"){
      if(isNaN(parseInt(options.lives))){
        // If the value of the select is not a number for some reason
        formIsValid = false;
        errors.lives = "Select a different number of lives";
      }
    }

    // Save form errors to local state
    this.setState({ errors });
    return formIsValid;
  }

  handleSubmit = e => {
    // 1. Intercept click
    e.preventDefault();
    // 2. Validate fields
    if (this.handleValidation()){
      // Close the modal on a submit
        this.props.toggleModal();
      // Get values
      const size = this.state.options.size;
      const options = this.state.options;
      // Pass values to global state
      this.props.saveOptions(options);
      // Determine positioning of bombs
      this.props.initSquares(size);
    } else {
      setTimeout(() => {
        const errors = {...this.state.errors};
        // TODO fix this
        if (errors.size) {
          alert(errors.size);
        } else if (errors.difficulty) {
          alert(errors.difficulty);
        } else if (errors.lives){
          alert(errors.lives);
        }
      }, 200);
    }
  }

  handleChange = e => {
    // 1. Copy local field state
    const options = this.state.options;
    // 2. Get the changed value from the input
    options[e.target.name] = e.target.value;
    // 3. Save fields to local state
    this.setState({ options });
  }

  submitButtonText = () => {
    const gameState = this.props.gameState;
    // If the player won or lost, ask if they want to Play Another Game. If from customize settings, display Play Sweeper
    return gameState.progress !== 0 ? "Play Another Game?" : "Play Sweeper";
  }

  render() {
    const percentages = this.props.percentages;
    const lives = this.props.lives;
    return (
      <div className="settings">
        <h2>Custom Settings</h2>
        <form key="optionsForm" onSubmit={this.handleSubmit}>
          <div className="form-fields">
            <div>
              <label htmlFor="size">Squares along a side:</label>
              <input
                value={this.state.options.size}
                onChange={this.handleChange}
                name="size"
                key="size"
                type="text"
                id="size"
              />
            </div>
            <div>
              <label htmlFor="difficulty">Percentage of bombs:</label>
              <select
                value={this.state.options.difficulty}
                onChange={this.handleChange}
                name="difficulty"
                key="difficulty"
                id="difficulty"
              >
                {Object.keys(percentages).map(key => <option key={key} value={key}>{percentages[key]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lives">Number of Lives:</label>
              <select
                value={this.state.options.lives}
                onChange={this.handleChange}
                name="lives"
                key="lives"
                id="lives"
              >
                {Object.keys(lives).map(key => <option key={key} value={key}>{lives[key]}</option>)}
              </select>
            </div>
            <button type="submit">{this.submitButtonText()}</button>
          </div>
        </form>
      </div>
    )
  }
}

export default Form;
