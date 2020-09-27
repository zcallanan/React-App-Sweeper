import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Stats extends React.Component {
  static propTypes = {
    stats: PropTypes.shape({
      currentLives: PropTypes.number.isRequired,
      bombs: PropTypes.number.isRequired
    })
  }

  state = {
    localStats: {
      size: -1,
      bombs: -1,
      totalToReveal: -1,
      previousBombs: -1
    }
  }

  componentDidUpdate() {
    const stats = this.props.stats;
    const bombs = stats.bombs;
    const localStats = {...this.state.localStats};
    const options = this.props.options;
    const totalToReveal = (options.size ** 2) - bombs;
    if (bombs > 0 && options.size > 0 && localStats.totalToReveal < 0) {
      localStats.totalToReveal = (options.size ** 2) - bombs;
      this.setState({localStats});
    } else if (bombs > 0 && options.size > 0 && localStats.totalToReveal !== totalToReveal && bombs !== localStats.previousBombs && options.size === localStats.size && bombs !== localStats.bombs ) {
      console.log(totalToReveal, bombs, localStats.bombs, options.size, localStats.size, localStats.previousBombs)
      localStats.totalToReveal = (options.size ** 2) - bombs;
      this.setState({localStats});
    }
    if ((localStats.size < 0 || localStats.size !== options.size ) && options.size > 0) {
      // Save local size
      localStats.size = options.size;
      this.setState({localStats});
    }
    if ((localStats.bombs < 0 || localStats.bombs !== bombs) && bombs > 0) {
      // Set local bombs
      localStats.previousBombs = localStats.bombs;
      localStats.bombs = bombs;
      this.setState({localStats});
    }
  }

  /* Display:
    [X] - Lives
    [X] - Bomb Count
    [X] - Revealed Squares (clicked: true, not bomb): Clicked Squares out of Size** - Bomb Count
    [ ] - Flagged Squares
    [ ] - ? Unknown Squares
  */
  renderLives = () => {
    const stats = this.props.stats;
    const currentLives = stats.currentLives;
    let life = "Lives";
    if (currentLives === 1) {
      life = "Life";
    }
    // Avoid display of stats before currentLives is set
    if (currentLives >= 0) {
      return (
        <li key="lifeCount">
          <span>
            <TransitionGroup component="span" className="lives">
              <CSSTransition classNames="lives" key={currentLives} timeout={{enter: 1500, exit: 1500}} >
                <span>{currentLives}</span>
              </CSSTransition>
            </TransitionGroup>
            {life}
          </span>
        </li>
      )
    }
  }

  renderBombCount = () => {
    const stats = this.props.stats;
    const bombs = stats.bombs;
    if (bombs >= 0) {
      return (
        <li key="bombs">
          <span>
            <TransitionGroup component="span" className="bombs">
              <CSSTransition classNames="bombs" key={bombs} timeout={{enter: 1500, exit: 1500}} >
                <span>{bombs}</span>
              </CSSTransition>
            </TransitionGroup>
            Bombs
          </span>
        </li>
      )
    }
  }

  renderRevealed = () => {
    const stats = this.props.stats;
    const revealed = stats.revealed;
    const localStats = {...this.state.localStats}
    const totalToReveal = localStats.totalToReveal;

    if (revealed >= 0 && totalToReveal >= 0) {
      return (
        <li key="revealed">
          <span>
            <TransitionGroup component="span" className="revealed">
              <CSSTransition classNames="revealed" key={revealed} timeout={{enter: 1500, exit: 1500}} >
                <span>{revealed}</span>
              </CSSTransition>
            </TransitionGroup>
            out of
            <TransitionGroup component="span" className="total-to-reveal">
              <CSSTransition classNames="total-to-reveal" key={totalToReveal} timeout={{enter: 15000, exit: 15000}} >
                <span>{totalToReveal}</span>
              </CSSTransition>
            </TransitionGroup>
          </span>
        </li>
      )
    }
  }

  render() {
    return (
      <div>
        <h2>Stats</h2>
        <ul>
          {this.renderLives()}
          {this.renderBombCount()}
          {this.renderRevealed()}
        </ul>
      </div>
    )
  }
}

export default Stats;
