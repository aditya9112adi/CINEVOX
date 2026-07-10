import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const MyListRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="My List"
    apiEndpoint="https://apis.ccbp.in/movies-app/originals"
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
