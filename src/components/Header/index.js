import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import './index.css'

class Header extends Component {
  state = {
    menuOpen: false,
  }

  onClickSearch = () => {
    const {history} = this.props
    history.push('/search')
  }

  toggleMenu = () => {
    this.setState(prev => ({menuOpen: !prev.menuOpen}))
  }

  render() {
    const {location} = this.props
    const {menuOpen} = this.state
    const pathname = location ? location.pathname : ''

    const navLinks = [
      {label: 'Home', to: '/'},
      {label: 'Shows', to: '/shows'},
      {label: 'Movies', to: '/movies-list'},
      {label: 'Games', to: '/games'},
      {label: 'New & Popular', to: '/popular'},
      {label: 'My List', to: '/my-list'},
      {label: 'Browse by Languages', to: '/browse-languages'},
    ]

    return (
      <nav className="header-nav">
        <div className="header-left">
          <Link to="/" className="header-brand">
            <img
              className="header-logo"
              src="/cinevox-logo.png"
              alt="cinevox logo"
            />
            <span className="header-brand-text">CINEVOX</span>
          </Link>
          {/* Desktop nav links */}
          <ul className="header-links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`header-link ${pathname === link.to ? 'active-link' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile hamburger */}
          <button
            type="button"
            className="header-hamburger"
            onClick={this.toggleMenu}
            aria-label="menu"
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
        <div className="header-right">
          <button
            type="button"
            className="header-search-btn"
            testid="searchButton"
            onClick={this.onClickSearch}
          >
            <HiOutlineSearch className="header-search-icon" />
          </button>
          <Link to="/account">
            <img
              className="header-profile-img"
              src="https://assets.ccbp.in/frontend/react-js/avatar-img.png"
              alt="profile"
            />
          </Link>
        </div>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <ul className="header-mobile-menu">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`mobile-menu-link ${pathname === link.to ? 'active-link' : ''}`}
                  onClick={() => this.setState({menuOpen: false})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    )
  }
}

export default withRouter(Header)
