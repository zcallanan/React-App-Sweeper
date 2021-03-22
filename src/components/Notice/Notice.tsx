import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { NoticesProps, KeyMessage } from "../../types";

const Notice = ({ notices }: NoticesProps): JSX.Element => {
  const handleNotice = (): JSX.Element => {
    const { bombNotice, victoryNotice, defeatNotice } = notices;
    let notice: KeyMessage = {
      key: null,
      message: null,
    };
    let output: JSX.Element;
    if (bombNotice) {
      // Notice content
      notice = {
        key: "bomb",
        message: "You struck a bomb and lost a life!",
      };
    } else if (victoryNotice) {
      notice = {
        key: "victory",
        message: "You revealed the final square!",
      };
    } else if (defeatNotice) {
      notice = {
        key: "defeat",
        message: "You ran out of lives!",
      };
    }
    if (notice.key !== null) {
      // If there's content to display, render it
      output = (
        <CSSTransition
          classNames="notices"
          key={notice.key}
          timeout={{ enter: 2500, exit: 2500 }}
        >
          <span key={notice.key} className="notice">
            <strong>{notice.message}</strong>
          </span>
        </CSSTransition>
      );
    }
    return output;
  };

  return (
    <div className="notice-box">
      <TransitionGroup component="span" className="notices">
        {handleNotice()}
      </TransitionGroup>
    </div>
  );
};

export default Notice;
