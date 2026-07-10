import React, {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'

class LoginRoute extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    Cookies.set('username', this.state.username, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'
    const url = `${backendUrl}/api/login`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } catch {
      this.onSubmitFailure('Server connection error. Is your backend running?')
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state

    return (
      <div className="login-bg">
        <div className="login-brand">
          <img
            className="login-logo"
            src="/cinevox-logo.png"
            alt="cinevox logo"
          />
          <span className="login-brand-text">CINEVOX</span>
        </div>
        <div className="login-card">
          <h1 className="login-title">Sign In</h1>
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                id="username"
                className="input-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            {showSubmitError && <p className="login-error">*{errorMsg}</p>}
            <button className="sign-in-btn" type="submit">
              Sign In
            </button>
            <p className="login-register-link">
              New to CineVox?{' '}
              <Link to="/register">Register now</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
