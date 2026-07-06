import React, {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginRoute extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    const {username, password} = this.state
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    Cookies.set('username', username, {expires: 30})
    Cookies.set('password', password, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showError: true})
  }

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    return (
      <div className="login-bg">
        <img
          className="login-logo"
          src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1666018279/movies-app/Group_7399_qziixb.png"
          alt="login website logo"
        />
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
            {showError && <p className="login-error">*{errorMsg}</p>}
            <button className="sign-in-btn" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
