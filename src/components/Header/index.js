import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import './index.css'

class Header extends Component {
  onClickSearch = () => {
    const {history} = this.props
    history.push('/search')
  }

  render() {
    const {location} = this.props
    const pathname = location ? location.pathname : ''

    return (
      <nav className="header-nav">
        <Link to="/">
          <img
            className="header-logo"
            src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1666018279/movies-app/Group_7399_qziixb.png"
            alt="website logo"
          />
        </Link>
        <ul className="header-links">
          <li>
            <Link
              to="/"
              className={`header-link ${pathname === '/' ? 'active-link' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/popular"
              className={`header-link ${
                pathname === '/popular' ? 'active-link' : ''
              }`}
            >
              Popular
            </Link>
          </li>
        </ul>
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
      </nav>
    )
  }
}

export default withRouter(Header)
