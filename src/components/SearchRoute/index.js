// Cache buster for ESLint
import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import MovieCard from '../MovieCard'
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

class SearchRoute extends Component {
  state = {
    searchInput: '',
    searchValue: '',
    status: apiStatusConstants.initial,
    movies: [],
    currentPage: 1,
    moviesPerPage: 12,
  }

  debounceTimer = null

  componentWillUnmount() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
  }

  onChangeSearch = e => {
    const value = e.target.value
    this.setState({searchInput: value})

    // Clear previous debounce timer
    if (this.debounceTimer) clearTimeout(this.debounceTimer)

    if (value.trim() === '') {
      this.setState({status: apiStatusConstants.initial, movies: []})
      return
    }

    // Fire search 300ms after user stops typing
    this.debounceTimer = setTimeout(() => {
      this.setState(
        {searchValue: value.trim(), currentPage: 1},
        this.fetchSearchMovies,
      )
    }, 300)
  }

  onClickSearch = () => {
    const {searchInput} = this.state
    if (searchInput.trim()) {
      this.setState(
        {searchValue: searchInput, currentPage: 1},
        this.fetchSearchMovies,
      )
    }
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.onClickSearch()
    }
  }

  fetchSearchMovies = async () => {
    const {searchValue} = this.state
    this.setState({status: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchValue}`
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
    const {status, movies, searchValue, currentPage, moviesPerPage} = this.state

    switch (status) {
      case apiStatusConstants.loading:
        return <LoaderView />
      case apiStatusConstants.failure:
        return <FailureView onRetry={this.fetchSearchMovies} />
      case apiStatusConstants.success: {
        if (movies.length === 0) {
          return (
            <div className="no-results">
              <img
                className="no-results-img"
                src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1666018427/movies-app/no-movies-img_rnqhqb.png"
                alt="no movies"
              />
              <p className="no-results-text">
                Your search for {searchValue} did not find any matches.
              </p>
            </div>
          )
        }
        const totalPages = Math.ceil(movies.length / moviesPerPage)
        const startIdx = (currentPage - 1) * moviesPerPage
        const currentMovies = movies.slice(startIdx, startIdx + moviesPerPage)
        return (
          <>
            <div className="search-grid">
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
              <div className="search-pagination">
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
        return (
          <div className="search-placeholder">
            <p>Search for your favourite movies!</p>
          </div>
        )
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="search-container">
        <nav className="search-header-nav">
          <Link to="/">
            <img
              className="search-header-logo"
              src="/cinevox-logo.png"
              alt="cinevox logo"
            />
          </Link>
          <div className="search-input-container">
            <input
              type="search"
              className="search-input-field"
              value={searchInput}
              onChange={this.onChangeSearch}
              onKeyDown={this.onKeyDown}
              placeholder="Search movies..."
            />
            <button
              type="button"
              className="search-icon-btn"
              testid="searchButton"
              onClick={this.onClickSearch}
            >
              <HiOutlineSearch className="search-icon" />
            </button>
          </div>
          <div className="search-header-right">
            <Link to="/account">
              <img
                className="search-profile-img"
                src="https://assets.ccbp.in/frontend/react-js/avatar-img.png"
                alt="profile"
              />
            </Link>
          </div>
        </nav>
        <div className="search-content">{this.renderContent()}</div>
        <div className="search-footer">
          <div className="search-footer-icons">
            <FaGoogle className="search-footer-icon" />
            <FaTwitter className="search-footer-icon" />
            <FaInstagram className="search-footer-icon" />
            <FaYoutube className="search-footer-icon" />
          </div>
          <p className="search-footer-contact">Contact Us</p>
        </div>
      </div>
    )
  }
}

export default withRouter(SearchRoute)
