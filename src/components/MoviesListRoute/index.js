import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const MoviesListRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="Movies"
    apiEndpoint="https://api.themoviedb.org/3/movie/popular"
    sections={[
      'Top Rated Movies',
      'Action & Adventure',
      'Drama',
      'Comedy',
      'Thriller & Horror',
      'Sci-Fi & Fantasy',
      'Romance',
      'Animation',
      'Award Winners',
      'International Films',
    ]}
  />
)

export default MoviesListRoute
