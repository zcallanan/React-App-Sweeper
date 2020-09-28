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
              Sw
            </span>
            <span className="ee">
              ee
            </span>
            <span className="per">
              per
            </span>
          </span>
        </span>
      </header>
    )
  }
}

export default Header;
