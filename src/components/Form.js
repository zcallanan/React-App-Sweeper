import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
  sizeRef = React.createRef();
  difficultyRef = React.createRef();

  static propTypes = { saveOptions: PropTypes.func };

  handleClick = e => {
    // 1. Intercept click
    e.preventDefault();
    // 2. Get value
    const count = this.sizeRef.current.value;
    const difficulty = this.difficultyRef.current.value
    // 3. Save value
    this.props.saveOptions(count, difficulty);
    // 4. Determine positioning of bombs
    this.props.initSquares(count);
  }

  render() {
    const percentages = this.props.percentages;
    return (
      <div className="form">
        <form onSubmit={this.handleClick}>
          <div className="form-fields">
            <div>
              <label htmlFor="size">Enter the number of squares to add to the game board:</label>
              <input
                type="text"
                id="size"
                ref={this.sizeRef}
                required
                defaultValue="10"
              />
            </div>
            <div>
              <label htmlFor="difficulty">Select the percentage of mines hidden on the board:</label>
              <select
                name="difficulty"
                id="difficulty"
                ref={this.difficultyRef}
                defaultValue="1"
              >
                {Object.keys(percentages).map(key => <option key={key} value={key}>{percentages[key]}</option>)}
              </select>
            </div>
            <button type="submit">Create Board</button>
          </div>
        </form>
      </div>
    )
  }
}

export default Form;
