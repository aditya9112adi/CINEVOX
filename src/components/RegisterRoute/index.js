import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class RegisterRoute extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
    success: false,
  }

  onChangeUsername = e => this.setState({username: e.target.value})
  onChangePassword = e => this.setState({password: e.target.value})

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'
    const url = `${backendUrl}/api/register`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.setState({success: true, showError: false})
        setTimeout(() => this.props.history.replace('/login'), 1500)
      } else {
        this.setState({showError: true, errorMsg: data.error_msg || 'Registration failed'})
      }
    } catch {
      this.setState({showError: true, errorMsg: 'Server connection error. Is your backend running?'})
    }
  }

  render() {
    const {username, password, showError, errorMsg, success} = this.state

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
          <h1 className="login-title">Register</h1>
          {success && (
            <p style={{color: '#2ecc71', textAlign: 'center', marginBottom: '12px', fontWeight: 600}}>
              ✅ User registered successfully
            </p>
          )}
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <div className="input-group">
              <label className="input-label" htmlFor="reg-username">USERNAME</label>
              <input
                id="reg-username"
                className="input-field"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={this.onChangeUsername}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="reg-password">PASSWORD</label>
              <input
                id="reg-password"
                className="input-field"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={this.onChangePassword}
                required
              />
            </div>
            {showError && <p className="login-error">*{errorMsg}</p>}
            <button className="sign-in-btn" type="submit">
              Create Account
            </button>
            <p className="login-register-link">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default RegisterRoute
