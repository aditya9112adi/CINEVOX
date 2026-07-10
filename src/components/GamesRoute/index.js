import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const GamesRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="Games"
    apiEndpoint="https://api.themoviedb.org/3/movie/now_playing"
    sections={[
      'Netflix Games',
      'Action Games',
      'Puzzle & Strategy',
      'Sports Games',
      'Adventure Games',
      'Multiplayer',
      'Casual Games',
      'RPG',
      'Card & Board Games',
      'Racing Games',
    ]}
  />
)

export default GamesRoute
