import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBomb } from '@fortawesome/free-solid-svg-icons'

class Header extends React.Component {
  render() {
    return (
      <header>
        <span>
          <FontAwesomeIcon className="header-icon" icon={ faBomb } />
          <span className="header-title">
            <span className="sw">
              S
            </span>
            <span className="eeper">
              weeper
            </span>
          </span>
        </span>
      </header>
    )
  }
}

export default Header;
