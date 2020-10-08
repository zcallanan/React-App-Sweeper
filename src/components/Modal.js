import React from 'react';
import ReactModal from 'react-modal';
import Form from './Form';

ReactModal.setAppElement('#main')

/* Modal has
  - Move form into modal.
  - Modal accessible by:
    1. Click on Custom Settings
      a. Form present
      b. Button says "Play Sweeper"
    2. Defeat or Victory
      a. Form present
      b. Button says "Try Again?"
  TODO: Add Custom Settings button to App that calls up modal
*/

class Modal extends React.Component {
  render() {
    return (
      <Form
        toggleModal={this.props.toggleModal}
        options={this.props.options}
        saveOptions={this.props.saveOptions}
        initSquares={this.props.initSquares}
        setBombs={this.props.setBombs}
        percentages={this.props.percentages}
        lives={this.props.lives}
      />
    )
  }
}

export default Modal;
