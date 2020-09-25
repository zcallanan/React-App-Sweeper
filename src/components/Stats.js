import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Stats extends React.Component {
  static propTypes = {

  }
  /* Display:
    Lives
    Bomb Count
    Revealed Squares (clicked: true, not bomb): Clicked Squares out of Size** - Bomb Count
    Flagged Squares
    ? Unknown Squares
  */
  render() {
    return (
      <div>
        <h2>Stats</h2>


      </div>

    )
  }

}

export default Stats;
