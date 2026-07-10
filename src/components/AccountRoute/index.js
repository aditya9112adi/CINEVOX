import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class AccountRoute extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    Cookies.remove('username')
    history.replace('/login')
  }

  render() {
    const username = Cookies.get('username') || ''

    return (
      <div className="account-container">
        <Header />
        <div className="account-content">
          <h1 className="account-title">Account</h1>
          <hr className="account-top-divider" />
          <div className="account-section">
            <div className="account-row">
              <p className="account-label">Member ship</p>
              <div className="account-details">
                <p className="account-email">{username}</p>
                <p className="account-plan-badge">Premium &nbsp;&#183;&nbsp; Ultra HD</p>
              </div>
            </div>
          </div>
          <hr className="account-divider" />
          <div className="account-section">
            <div className="account-row">
              <p className="account-label">Plan details</p>
              <div className="account-plan-row">
                <p className="account-plan-text">Premium</p>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={this.onClickLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <hr className="account-divider" />
          <div className="account-user-summary">
            <p className="account-username-text">Username: {username}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default AccountRoute
