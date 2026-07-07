import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import ProtectedRoute from './components/ProtectedRoute'
import LoginRoute from './components/LoginRoute'
import RegisterRoute from './components/RegisterRoute'
import HomeRoute from './components/HomeRoute'
import PopularRoute from './components/PopularRoute'
import MovieItemDetails from './components/MovieItemDetails'
import SearchRoute from './components/SearchRoute'
import AccountRoute from './components/AccountRoute'
import NotFoundRoute from './components/NotFoundRoute'
import './App.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/login"
        render={props => {
          const jwtToken = Cookies.get('jwt_token')
          if (jwtToken !== undefined) {
            return <Redirect to="/" />
          }
          return <LoginRoute {...props} />
        }}
      />
      <Route
        exact
        path="/register"
        render={props => {
          const jwtToken = Cookies.get('jwt_token')
          if (jwtToken !== undefined) {
            return <Redirect to="/" />
          }
          return <RegisterRoute {...props} />
        }}
      />
      <ProtectedRoute exact path="/" component={HomeRoute} />
      <ProtectedRoute exact path="/popular" component={PopularRoute} />
      <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
      <ProtectedRoute exact path="/search" component={SearchRoute} />
      <ProtectedRoute exact path="/account" component={AccountRoute} />
      <Route path="/not-found" component={NotFoundRoute} />
      <Redirect to="/not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
