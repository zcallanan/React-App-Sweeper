import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface Props {
  notices: noticesType
}

interface State {
}

type noticeT = {
  key: string,
  message: string
}

class Notice extends React.Component<Props, State> {

  protected handleNotice = (): JSX.Element => {
    const { bombNotice, victoryNotice, defeatNotice} = this.props.notices;
    let notice: noticeT = {
      key: null,
      message: null
    };
    if (bombNotice) {
      // Notice content
      notice = {
        key: "bomb",
        message: "You struck a bomb and lost a life!"
      }
    } else if (victoryNotice) {
      notice = {
        key: "victory",
        message: "You revealed the final square!"
      }
    } else if (defeatNotice) {
      notice = {
        key: "defeat",
        message: "You ran out of lives!"
      }
    }
    if (notice.key !== null) {
      // If there's content to display, render it
      return (
        <CSSTransition classNames="notices" key={notice.key} timeout={{enter: 2500, exit: 2500}} >
          <span key={notice.key} className="notice">
            <strong>{notice.message}</strong>
          </span>
        </CSSTransition>
      )
    }
    return;
  }
  render() {
    return (
      <div className="notice-box">
        <TransitionGroup component="span" className="notices">
          {this.handleNotice()}
        </TransitionGroup>
      </div>
    )
  }

}

export default Notice;
