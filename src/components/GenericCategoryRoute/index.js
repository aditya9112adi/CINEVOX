// Cache buster for ESLint
import React, {Component} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import MovieSlider from '../MovieSlider'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import Cookies from 'js-cookie'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class GenericCategoryRoute extends Component {
  state = {
    apiMovies: [],
    status: apiStatusConstants.loading,
  }

  componentDidMount() {
    this.fetchMovies()
  }

  fetchMovies = async () => {
    this.setState({status: apiStatusConstants.loading})
    const {apiEndpoint} = this.props
    const jwtToken = Cookies.get('jwt_token')
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}
    try {
      const response = await fetch(apiEndpoint, options)
      if (response.ok) {
        const data = await response.json()
        const movies = data.results.map(m => ({
          id: m.id,
          posterPath: m.poster_path,
          backdropPath: m.backdrop_path,
          title: m.title,
          overview: m.overview,
        }))
        this.setState({apiMovies: movies, status: apiStatusConstants.success})
      } else {
        this.setState({status: apiStatusConstants.failure})
      }
    } catch {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  render() {
    const {title, sections, heroBg} = this.props
    const {apiMovies, status} = this.state

    const combined = apiMovies

    // Split into rows of ~20 for multiple sliders
    const chunk = (arr, size) => {
      const result = []
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
      }
      return result
    }

    const rows = chunk(combined, 20)

    const sectionTitles = sections || [
      'Popular on Netflix',
      'Trending Now',
      'New Releases',
      'Award Winners',
      'Top Picks for You',
      'Critically Acclaimed',
      'Most Watched',
      'Action & Adventure',
      'Drama',
      'Sci-Fi & Fantasy',
    ]

    return (
      <div className="generic-container">
        <Header />
        <div
          className="generic-hero"
          style={{
            backgroundImage: heroBg
              ? `url(${heroBg})`
              : combined[0]
              ? `url(${combined[0].posterPath})`
              : 'none',
          }}
        >
          <div className="generic-hero-overlay">
            <h1 className="generic-hero-title">{title}</h1>
          </div>
        </div>
        <div className="generic-content">
          {status === apiStatusConstants.loading && <LoaderView />}
          {status === apiStatusConstants.failure && (
            <FailureView onRetry={this.fetchMovies} />
          )}
          {status === apiStatusConstants.success &&
            rows.map((row, idx) => (
              <div className="generic-section" key={sectionTitles[idx] || `section-${idx}`}>
                <h2 className="generic-section-title">
                  {sectionTitles[idx] || `More ${title}`}
                </h2>
                <MovieSlider movies={row} />
              </div>
            ))}
        </div>
        <Footer />
      </div>
    )
  }
}

export default GenericCategoryRoute
