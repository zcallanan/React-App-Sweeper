import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import statsInit from "./stats-init";
import statsReducer from "./stats-reducer";
import { StatsProps } from "../../types";

const Stats = ({ gameStats, options, totalToReveal }: StatsProps): JSX.Element => {
  // Manage state
  const [statsState, statsDispatch] = React.useReducer(statsReducer, statsInit);

  React.useEffect(() => {
    // From State
    const sizeState: number = statsState.size;
    const bombsState: number = statsState.bombs;
    const totalToRevealState: number = statsState.totalToReveal;
    // From Props
    const sizeProps: number = options.size;
    const bombsProps: number = gameStats.bombs;

    const currentTotalToReveal: number = sizeProps ** 2 - bombsProps;

    if (bombsProps > 0 && sizeProps > 0 && totalToRevealState < 0) {
      // Save initial values to state
      statsDispatch({
        type: "STATS_INIT_VALUES",
        payload: {
          bombs: bombsProps,
          size: sizeProps,
          totalToReveal: currentTotalToReveal,
        },
      });
    } else if (
      // TotatToReveal changed, save it
      bombsProps > 0
      && sizeProps > 0
      && totalToRevealState > 0
      && totalToRevealState !== currentTotalToReveal
      && sizeProps === sizeState
      && bombsProps !== bombsState
    ) {
      statsDispatch({
        type: "STATS_SET_TOTALTOREVEAL",
        payload: {
          totalToReveal: currentTotalToReveal,
        },
      });
    }
    if ((sizeState < 0 || sizeState !== sizeProps) && sizeProps > 0) {
      // Size changed, save it
      statsDispatch({
        type: "STATS_SET_SIZE",
        payload: {
          size: sizeProps,
        },
      });
    }
    if ((bombsState < 0 || bombsState !== bombsProps) && bombsProps > 0) {
      // Bombs changed, save it
      statsDispatch({
        type: "STATS_SET_BOMBS",
        payload: {
          bombs: bombsProps,
        },
      });
    }
    totalToReveal(totalToRevealState);
  }, [
    gameStats,
    options,
    totalToReveal,
    statsState.bombs,
    statsState.size,
    statsState.totalToReveal,
  ]);

  const renderLives = (): React.ReactNode => {
    const { currentLives }: { currentLives: number } = gameStats;
    const life: string = currentLives === 1 ? "Life:" : "Lives";
    const output: number | string = currentLives >= 0 ? currentLives : "";
    const livesJSX: React.ReactNode = (
      <tr key="lifeCount">
        <td>{life}</td>
        <td>
          <TransitionGroup component="span" className="lives">
            <CSSTransition
              classNames="lives"
              key={output}
              timeout={{ enter: 3000, exit: 3000 }}
            >
              <span>{output}</span>
            </CSSTransition>
          </TransitionGroup>
        </td>
      </tr>
    );
    // Avoid display of stats before currentLives is set
    return livesJSX;
  };

  const renderBombCount = (): React.ReactNode => {
    const { bombs }: { bombs: number } = gameStats;
    const output: number | string = bombs >= 0 ? bombs : "";
    const bombCountJSX: React.ReactNode = (
      <tr key="bombs">
        <td>Hidden Bombs:</td>
        <td>
          <TransitionGroup component="span" className="bombs">
            <CSSTransition
              classNames="bombs"
              key={output}
              timeout={{ enter: 1500, exit: 1500 }}
            >
              <span>{output}</span>
            </CSSTransition>
          </TransitionGroup>
        </td>
      </tr>
    );
    return bombCountJSX;
  };

  const renderRevealed = (): React.ReactNode => {
    const { revealed }: { revealed: number } = gameStats;
    const totalToRevealState = statsState.totalToReveal;
    const output: number | string = revealed >= 0 && totalToRevealState >= 0
      ? revealed
      : "";
    const revealedJSX: React.ReactNode = (
      <tr key="revealed">
        <td>Squares Revealed: </td>
        <td>
          <TransitionGroup component="span" className="revealed">
            <CSSTransition
              classNames="revealed"
              key={output}
              timeout={{ enter: 1500, exit: 1500 }}
            >
              <span>{output}</span>
            </CSSTransition>
          </TransitionGroup>
        </td>
        <td>/</td>
        <td>
          <TransitionGroup component="span" className="total-to-reveal">
            <CSSTransition
              classNames="total-to-reveal"
              key={totalToRevealState}
              timeout={{ enter: 1500, exit: 1500 }}
            >
              <span>{totalToRevealState}</span>
            </CSSTransition>
          </TransitionGroup>
        </td>
      </tr>
    );
    return revealedJSX;
  };

  const renderFlagCount = (): React.ReactNode => {
    const { flags }: { flags: number } = gameStats;
    const flagText: string = flags === 1 ? "Bomb Flagged" : "Bombs Flagged:";
    const output: number | string = flags >= 0 ? flags : "";
    const flagCountJSX = (
      <tr key="flags">
        <td>{flagText}</td>
        <td>
          <TransitionGroup component="span" className="flags">
            <CSSTransition
              classNames="flags"
              key={output}
              timeout={{ enter: 1500, exit: 1500 }}
            >
              <span>{output}</span>
            </CSSTransition>
          </TransitionGroup>
        </td>
      </tr>
    );
    return flagCountJSX;
  };

  const renderQuestionsCount = (): React.ReactNode => {
    const { questions }: { questions: number } = gameStats;
    const output = questions >= 0 ? questions : "";
    const questionsJSX = (
      <tr key="questions">
        <td>Marked Unknown:</td>
        <td>
          <TransitionGroup component="span" className="questions">
            <CSSTransition
              classNames="questions"
              key={output}
              timeout={{ enter: 1500, exit: 1500 }}
            >
              <span>{output}</span>
            </CSSTransition>
          </TransitionGroup>
        </td>
      </tr>
    );
    return questionsJSX;
  };

  return (
    <div className="stats-wrapper">
      <h3 className="stats-title">Stats</h3>
      <table>
        <tbody>
          {renderLives()}
          {renderBombCount()}
          {renderRevealed()}
          {renderFlagCount()}
          {renderQuestionsCount()}
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
