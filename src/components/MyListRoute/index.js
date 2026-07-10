import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const MyListRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="My List"
    apiEndpoint="https://api.themoviedb.org/3/movie/top_rated"
    sections={[
      'Saved for Later',
      'Continue Watching',
      'Watch Again',
      'Favourites',
      'Recently Added',
      'Recommended for You',
    ]}
  />
)

export default MyListRoute
