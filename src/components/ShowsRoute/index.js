import React from 'react'
import GenericCategoryRoute from '../GenericCategoryRoute'

const ShowsRoute = props => (
  <GenericCategoryRoute
    {...props}
    title="Shows"
    apiEndpoint="https://api.themoviedb.org/3/tv/popular"
    sections={[
      'Netflix Originals',
      'Drama Series',
      'Crime & Thriller',
      'Reality TV',
      'Comedy Series',
      'Sci-Fi & Fantasy Shows',
      'Anime',
      'Documentary Series',
      'Limited Series',
      'Talk Shows',
    ]}
  />
)

export default ShowsRoute
