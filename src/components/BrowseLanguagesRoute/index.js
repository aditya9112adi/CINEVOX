import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const BrowseLanguagesRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="Browse by Languages"
    apiEndpoint="https://api.themoviedb.org/3/discover/movie?with_original_language=hi"
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
