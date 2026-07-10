import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const BrowseLanguagesRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="Browse by Languages"
    apiEndpoint="https://apis.ccbp.in/movies-app/trending-movies"
    sections={[
      'Hindi',
      'English',
      'Tamil',
      'Telugu',
      'Malayalam',
      'Kannada',
      'Bengali',
      'Marathi',
      'Korean',
      'Spanish',
    ]}
  />
)

export default BrowseLanguagesRoute
