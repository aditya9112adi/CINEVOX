import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import MovieSlider from '../MovieSlider'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import VideoPlayer from '../VideoPlayer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class HomeRoute extends Component {
  state = {
    trendingStatus: apiStatusConstants.initial,
    trendingMovies: [],
    topRatedStatus: apiStatusConstants.initial,
    topRatedMovies: [],
    originalsStatus: apiStatusConstants.initial,
    originalsMovies: [],
    heroBg: '',
    heroTitle: '',
    heroOverview: '',
    showPlayer: false,
  }

  componentDidMount() {
    this.fetchTrendingMovies()
    this.fetchTopRatedMovies()
    this.fetchOriginals()
  }

  getJwtToken = () => Cookies.get('jwt_token')

  fetchTrendingMovies = async () => {
    this.setState({trendingStatus: apiStatusConstants.loading, errorMsg: ''})
    const jwtToken = this.getJwtToken()
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        this.setState({
          trendingMovies: movies,
          trendingStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({trendingStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({trendingStatus: apiStatusConstants.failure})
    }
  }

  fetchTopRatedMovies = async () => {
    this.setState({topRatedStatus: apiStatusConstants.loading})
    const jwtToken = this.getJwtToken()
    const url = 'https://apis.ccbp.in/movies-app/top-rated-movies'
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
        this.setState({
          topRatedMovies: movies,
          topRatedStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({topRatedStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({topRatedStatus: apiStatusConstants.failure})
    }
  }

  fetchOriginals = async () => {
    this.setState({originalsStatus: apiStatusConstants.loading})
    const jwtToken = this.getJwtToken()
    const url = 'https://apis.ccbp.in/movies-app/originals'
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
        const randomIndex = Math.floor(Math.random() * movies.length)
        const heroMovie = movies[randomIndex]
        this.setState({
          originalsMovies: movies,
          originalsStatus: apiStatusConstants.success,
          heroBg: heroMovie ? heroMovie.backdropPath : '',
          heroTitle: heroMovie ? heroMovie.title : '',
          heroOverview: heroMovie ? heroMovie.overview : '',
        })
      } else {
        this.setState({originalsStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({originalsStatus: apiStatusConstants.failure})
    }
  }

  renderSection = (status, movies, title, onRetry) => {
    switch (status) {
      case apiStatusConstants.loading:
        return <LoaderView />
      case apiStatusConstants.success:
        return (
          <div className="home-section">
            <h2 className="section-title">{title}</h2>
            <MovieSlider movies={movies} />
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>
            <p>API Error: {this.state.errorMsg || 'Failed to load data.'}</p>
            <FailureView onRetry={onRetry} />
          </div>
        )
      default:
        return null
    }
  }

  renderHero = () => {
    const {originalsStatus, heroBg, heroTitle, heroOverview} = this.state

    if (originalsStatus === apiStatusConstants.loading) {
      return (
        <div className="hero-container hero-placeholder">
          <LoaderView />
        </div>
      )
    }
    if (originalsStatus === apiStatusConstants.failure) {
      return (
        <div className="hero-container hero-placeholder">
          <FailureView onRetry={this.fetchOriginals} />
        </div>
      )
    }
    if (originalsStatus === apiStatusConstants.success) {
      return (
        <div
          className="hero-container"
          style={{backgroundImage: `url(${heroBg})`}}
        >
          <div className="hero-overlay">
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-overview">{heroOverview}</p>
            <div className="hero-buttons">
              <button
                className="play-btn"
                type="button"
                onClick={() => this.setState({showPlayer: true})}
              >
                &#9654; Play
              </button>
              <button className="more-info-btn" type="button">
                More Info
              </button>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  render() {
    const {
      trendingStatus,
      trendingMovies,
      topRatedStatus,
      topRatedMovies,
      originalsStatus,
      originalsMovies,
      showPlayer,
      heroBg,
      heroTitle,
    } = this.state

    return (
      <div className="home-container">
        {showPlayer && (
          <VideoPlayer
            title={heroTitle}
            backdropPath={heroBg}
            onClose={() => this.setState({showPlayer: false})}
          />
        )}
        <Header />
        {this.renderHero()}
        <div className="home-content">
          {this.renderSection(
            trendingStatus,
            trendingMovies,
            'Trending Now',
            this.fetchTrendingMovies,
          )}
          {this.renderSection(
            topRatedStatus,
            topRatedMovies,
            'Top Rated',
            this.fetchTopRatedMovies,
          )}
          {this.renderSection(
            originalsStatus,
            originalsMovies,
            'Originals',
            this.fetchOriginals,
          )}
        </div>
        <Footer />
      </div>
    )
  }
}

export default HomeRoute
