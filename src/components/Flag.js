import React from 'react';
import PropTypes from 'prop-types';

const Flag = props => (
  <div>
    <form onSubmit={props.onFlagClick}>
      <button>Flag Square</button>
    </form>
  </div>
)

Flag.propTypes = {
  onFlagClick: PropTypes.func.isRequired
}

export default Flag;
