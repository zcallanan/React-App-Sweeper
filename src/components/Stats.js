import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Stats extends React.Component {
  static propTypes = {
    stats: PropTypes.shape({
      currentLives: PropTypes.number.isRequired,
      bombs: PropTypes.number.isRequired,
      flags: PropTypes.number.isRequired,
      questions: PropTypes.number.isRequired
    }),
    options: PropTypes.object.isRequired,
    revealTarget: PropTypes.func.isRequired
  }

  state = {
    localStats: {
      size: -1,
      bombs: -1,
      totalToReveal: -1
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
      if (localStats.totalToReveal > 0) {
        this.setState({localStats});
      }
    } else if (bombs > 0 && options.size > 0 && localStats.totalToReveal !== totalToReveal && options.size === localStats.size && bombs !== localStats.bombs ) {
      localStats.totalToReveal = (options.size ** 2) - bombs;
      if (localStats.totalToReveal > 0) {
        this.setState({localStats});
      }
    }
    if ((localStats.size < 0 || localStats.size !== options.size ) && options.size > 0) {
      // Save local size
      localStats.size = options.size;
      if (localStats.size > 0) {
        this.setState({localStats});
      }
    }
    if ((localStats.bombs < 0 || localStats.bombs !== bombs) && bombs > 0) {
      // Set local bombs
      localStats.bombs = bombs;
      if (localStats.bombs > 0) {
        this.setState({localStats});
      }
    }
    this.props.revealTarget(localStats.totalToReveal);
  }

  renderLives = () => {
    const stats = this.props.stats;
    const currentLives = stats.currentLives;
    let life = "Lives:";
    if (currentLives === 1) {
      life = "Life:";
    }
    // Avoid display of stats before currentLives is set
    if (currentLives >= 0) {
      return (
        <tr key="lifeCount">
          <td>{life}</td>
          <td>
            <TransitionGroup component="span" className="lives">
              <CSSTransition classNames="lives" key={currentLives} timeout={{enter: 3000, exit: 3000}} >
                <span>{currentLives}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      )
    }
  }

  renderBombCount = () => {
    const stats = this.props.stats;
    const bombs = stats.bombs;
    if (bombs >= 0) {
      return (
        <tr key="bombs">
          <td>Hidden Bombs:</td>
          <td>
            <TransitionGroup component="span" className="bombs">
              <CSSTransition classNames="bombs" key={bombs} timeout={{enter: 1500, exit: 1500}} >
                <span>{bombs}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
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
        <tr key="revealed">
          <td>Squares Revealed: </td>
          <td >
            <TransitionGroup component="span" className="revealed">
              <CSSTransition classNames="revealed" key={revealed} timeout={{enter: 1500, exit: 1500}} >
                <span>{revealed}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
          <td>/</td>
          <td>
            <TransitionGroup component="span" className="total-to-reveal">
                <CSSTransition classNames="total-to-reveal" key={totalToReveal} timeout={{enter: 15000, exit: 15000}} >
                  <span>{totalToReveal}</span>
                </CSSTransition>
              </TransitionGroup>
          </td>
        </tr>
      )
    }
  }

  renderFlagCount = () => {
    const stats = this.props.stats;
    const flags = stats.flags;
    let flagText = "Bombs Flagged:";
    if (flags === 1) {
      flagText = "Bomb Flagged:";
    }
    if (flags >= 0) {
      return (
        <tr key="flags">
          <td>{flagText}</td>
          <td>
            <TransitionGroup component="span" className="flags">
              <CSSTransition classNames="flags" key={flags} timeout={{enter: 1500, exit: 1500}} >
                <span>{flags}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      )
    }
  }

  renderQuestionsCount = () => {
    const stats = this.props.stats;
    const questions = stats.questions;
    if (questions >= 0) {
      return (
        <tr key="questions">
          <td>Marked Unknown:</td>
          <td>
            <TransitionGroup component="span" className="questions">
              <CSSTransition classNames="questions" key={questions} timeout={{enter: 1500, exit: 1500}} >
                <span>{questions}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      )
    }
  }

  render() {
    return (
      <div className="stats-wrapper">
        <h3 className="stats-title">Stats</h3>
        <table>
          <tbody>
            {this.renderLives()}
            {this.renderBombCount()}
            {this.renderRevealed()}
            {this.renderFlagCount()}
            {this.renderQuestionsCount()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Stats;
