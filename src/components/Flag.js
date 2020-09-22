import React from 'react';

class Flag extends React.Component {
  render() {
    return (
      <div>
        <form onSubmit={this.props.onFlagClick}>
          <button>Flag Square</button>
        </form>
      </div>
    )
  }
}

export default Flag;
