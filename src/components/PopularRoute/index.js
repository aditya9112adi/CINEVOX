import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import MovieCard from '../MovieCard'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class PopularRoute extends Component {
  state = {
    status: apiStatusConstants.initial,
    movies: [],
    currentPage: 1,
    moviesPerPage: 12,
  }

  componentDidMount() {
    this.fetchPopularMovies()
  }

  fetchPopularMovies = async () => {
    this.setState({status: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const movies = data.results.map(movie => ({
          id: movie.id,
          backdropPath: movie.backdrop_path,
          posterPath: movie.poster_path,
          title: movie.title,
          overview: movie.overview,
        }))
        this.setState({movies, status: apiStatusConstants.success})
      } else {
        this.setState({status: apiStatusConstants.failure})
      }
    } catch {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  onClickPrev = () => {
    this.setState(prev => ({currentPage: prev.currentPage - 1}))
  }

  onClickNext = () => {
    const {currentPage, movies, moviesPerPage} = this.state
    const totalPages = Math.ceil(movies.length / moviesPerPage)
    if (currentPage < totalPages) {
      this.setState(prev => ({currentPage: prev.currentPage + 1}))
    }
  }

  renderContent = () => {
    const {status, movies, currentPage, moviesPerPage} = this.state

    switch (status) {
      case apiStatusConstants.loading:
        return <LoaderView />
      case apiStatusConstants.failure:
        return <FailureView onRetry={this.fetchPopularMovies} />
      case apiStatusConstants.success: {
        const totalPages = Math.ceil(movies.length / moviesPerPage)
        const startIdx = (currentPage - 1) * moviesPerPage
        const currentMovies = movies.slice(startIdx, startIdx + moviesPerPage)
        return (
          <>
            <div className="popular-grid">
              {currentMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  posterPath={movie.posterPath}
                  title={movie.title}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="page-btn"
                  onClick={this.onClickPrev}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="page-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="page-btn"
                  onClick={this.onClickNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )
      }
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-container">
        <Header />
        <div className="popular-content">
          <h1 className="popular-title">Popular Movies</h1>
          {this.renderContent()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default PopularRoute
