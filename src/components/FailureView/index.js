import React from 'react'
import './index.css'

const FailureView = ({onRetry}) => (
  <div className="failure-container">
    <img
      className="failure-img"
      src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1666018427/movies-app/Background-Complete_euuqbf.png"
      alt="failure view"
    />
    <h1 className="failure-heading">Something went wrong. Please try again</h1>
    <button className="retry-btn" type="button" onClick={onRetry}>
      Try Again
    </button>
  </div>
)

export default FailureView
