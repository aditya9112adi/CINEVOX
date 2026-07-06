import React from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'

const MovieCard = ({id, posterPath, title, history}) => {
  const onClickMovie = () => {
    history.push(`/movies/${id}`)
  }

  return (
    <div testid="movieItem" className="movie-item" onClick={onClickMovie}>
      <img className="movie-poster" src={posterPath} alt={title} />
      <div className="movie-overlay">
        <p className="movie-overlay-title">{title}</p>
      </div>
    </div>
  )
}

export default withRouter(MovieCard)
