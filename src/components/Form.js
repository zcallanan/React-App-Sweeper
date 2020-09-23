import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
  static propTypes = {
    saveOptions: PropTypes.func.isRequired,
    initSquares: PropTypes.func.isRequired,
    percentages: PropTypes.object.isRequired,
    options: PropTypes.shape({
      size: PropTypes.number.isRequired,
      difficulty: PropTypes.number.isRequired
    })
  }

  // Local validation state
  state = {
    fields: {
      size: -1,
      difficulty: -1
    },
    errors: {}
  }

  componentDidUpdate() {
    // Set an initial local state. Only do this if size: {} is not set
    if (this.state.fields["size"] === -1) {
      const fields = {...this.state.fields};
      fields["size"] = this.props.options.size;
      fields["difficulty"] = this.props.options.difficulty;
      this.setState({ fields });
    }
  }

  // Field Validation
  handleValidation = () => {
    // Copy local state objects
    const fields = { ...this.state.fields };
    const errors = { ...this.state.errors };
    let formIsValid = true;

    // Size of board
    if (!fields["size"]) {
      formIsValid = false;
      errors["size"] = "Square number field cannot be empty";
    } else if(typeof fields["size"] !== "undefined"){
      if(isNaN(parseInt(fields["size"]))){
        // If input NaN() returns true
        formIsValid = false;
        errors["size"] = "Enter an integer number";
      }
      else if(fields["size"] < 5 || fields["size"] > 20){
        // If input is not in range
        formIsValid = false;
        errors["size"] = "Enter a number between 5 and 20";
      }
    }

    // Percentage
    if (!fields["difficulty"]) {
      formIsValid = false;
      errors["difficulty"] = "The percentage field cannot be empty";
    } else if(typeof fields["difficulty"] !== "undefined"){
      if(isNaN(parseInt(fields["difficulty"]))){
        // If the value of the select is not a number for some reason
        formIsValid = false;
        errors["difficulty"] = "Select a different percentage";
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
      // Get values
      const count = this.state.fields.size;
      const difficulty = this.state.fields.difficulty;
      // Pass values to global state
      this.props.saveOptions(count, difficulty);
      // Determine positioning of bombs
      this.props.initSquares(count);
    } else {
      setTimeout(() => {
        const errors = {...this.state.errors};
        // TODO fix this
        if (errors["size"]) {
          alert(errors["size"]);
        } else if (errors["difficulty"]) {
          alert(errors["difficulty"]);
        }
      }, 200);
    }
  }

  handleChange = e => {
    // 1. Copy local field state
    const fields = this.state.fields;
    // 2. Get the changed value from the input
    fields[e.target.name] = e.target.value;
    // 3. Save fields to local state
    this.setState({ fields });
  }

  render() {
    const percentages = this.props.percentages;
    return (
      <div className="form">
        <form key="optionsForm" onSubmit={this.handleSubmit}>
          <div className="form-fields">
            <div>
              <label htmlFor="size">Customize the size of your game board by entering a number between 5 and 20:</label>
              <input
                value={this.state.fields.size}
                onChange={this.handleChange}
                name="size"
                key="size"
                type="text"
                id="size"
              />
            </div>
            <div>
              <label htmlFor="difficulty">Select the percentage of mines hidden on the board:</label>
              <select
                value={this.state.fields.difficulty}
                onChange={this.handleChange}
                name="difficulty"
                key="difficulty"
                id="difficulty"
              >
                {Object.keys(percentages).map(key => <option key={key} value={key}>{percentages[key]}</option>)}
              </select>
            </div>
            <button type="submit">Play Sweeper</button>
          </div>
        </form>
      </div>
    )
  }
}

export default Form;
