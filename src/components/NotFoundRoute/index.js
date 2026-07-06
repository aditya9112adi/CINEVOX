import React from 'react'
import {Link} from 'react-router-dom'
import './index.css'

const NotFoundRoute = () => (
  <div className="not-found-container">
    <img
      className="not-found-img"
      src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1666018427/movies-app/not-found-img_vpijze.png"
      alt="not found"
    />
    <h1 className="not-found-title">Lost Your Way?</h1>
    <p className="not-found-text">
      Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home
      page.
    </p>
    <Link to="/">
      <button className="go-home-btn" type="button">
        Movies Home
      </button>
    </Link>
  </div>
)

export default NotFoundRoute
