import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Stats extends React.Component {
  static propTypes = {
    currentLives: PropTypes.number.isRequired
  }

  /* Display:
    [X] - Lives
    [ ] - Bomb Count
    [ ] - Revealed Squares (clicked: true, not bomb): Clicked Squares out of Size** - Bomb Count
    [ ] - Flagged Squares
    [ ] - ? Unknown Squares
  */
  renderLives = currentLives => {
    // Avoid display of stats before currentLives is set
    let life = "Life";
    if (currentLives > 1) {
      life = "Lives";
    }
    if (currentLives >= 0) {
      return (
        <li key="this">
          <span>
            <TransitionGroup component="span" className="lives">
              <CSSTransition classNames="lives" in="true" key={currentLives} timeout={{enter: 1500, exit: 1500}} >
                <span>{currentLives}  </span>
              </CSSTransition>
            </TransitionGroup>
            {life}
          </span>
        </li>
      )
    }
  }

  render() {
    const currentLives = this.props.currentLives;
    return (
      <div>
        <h2>Stats</h2>
          <ul>
            {this.renderLives(currentLives)}
          </ul>





      </div>

    )
  }

}

export default Stats;
