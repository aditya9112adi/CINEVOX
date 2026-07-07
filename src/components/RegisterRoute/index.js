import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class RegisterRoute extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
    successMsg: '',
    showSuccess: false,
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = message => {
    this.setState({
      successMsg: message,
      showSuccess: true,
      showError: false,
      username: '',
      password: '',
    })
    setTimeout(() => {
      const {history} = this.props
      history.replace('/login')
    }, 2000)
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showError: true, showSuccess: false})
  }

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'http://localhost:5000/api/register'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.onSubmitSuccess(data.message)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } catch (error) {
      this.onSubmitFailure('Server Connection Error. Is your backend running?')
    }
  }

  render() {
    const {username, password, showError, errorMsg, showSuccess, successMsg} = this.state

    return (
      <div className="login-bg">
        <img
          className="login-logo"
          src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1666018279/movies-app/Group_7399_qziixb.png"
          alt="login website logo"
        />
        <div className="login-card">
          <h1 className="login-title">Register</h1>
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
            {showError && <p className="login-error">*{errorMsg}</p>}
            {showSuccess && <p className="register-success">*{successMsg} Redirecting...</p>}
            <button className="sign-in-btn" type="submit">
              Register
            </button>
            <p className="login-register-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default RegisterRoute
