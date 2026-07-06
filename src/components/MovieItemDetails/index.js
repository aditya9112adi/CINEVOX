import React, {Component} from 'react'
import Cookies from 'js-cookie'
import {format, parseISO} from 'date-fns'
import Header from '../Header'
import Footer from '../Footer'
import MovieSlider from '../MovieSlider'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieItemDetails extends Component {
  state = {
    status: apiStatusConstants.initial,
    movieData: null,
  }

  componentDidMount() {
    this.fetchMovieDetails()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    if (prevProps.match.params.id !== match.params.id) {
      this.fetchMovieDetails()
    }
  }

  fetchMovieDetails = async () => {
    this.setState({status: apiStatusConstants.loading})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const d = data.movie_details
        const movieData = {
          id: d.id,
          backdropPath: d.backdrop_path,
          posterPath: d.poster_path,
          title: d.title,
          overview: d.overview,
          adult: d.adult,
          budget: d.budget,
          genres: d.genres,
          releaseDate: d.release_date,
          runtime: d.runtime,
          similarMovies: d.similar_movies.map(m => ({
            id: m.id,
            backdropPath: m.backdrop_path,
            posterPath: m.poster_path,
            title: m.title,
            overview: m.overview,
          })),
          spokenLanguages: d.spoken_languages.map(l => ({
            id: l.id,
            englishName: l.english_name,
          })),
          voteAverage: d.vote_average,
          voteCount: d.vote_count,
        }
        this.setState({movieData, status: apiStatusConstants.success})
      } else {
        this.setState({status: apiStatusConstants.failure})
      }
    } catch {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  formatRuntime = runtime => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    return `${hours}h ${minutes}m`
  }

  formatDate = dateStr => {
    try {
      return format(parseISO(dateStr), 'do MMMM yyyy')
    } catch (err) {
      return dateStr
    }
  }

  renderMovieDetails = () => {
    const {movieData} = this.state
    const {
      backdropPath,
      title,
      overview,
      adult,
      runtime,
      releaseDate,
      genres,
      spokenLanguages,
      voteAverage,
      voteCount,
      budget,
      similarMovies,
    } = movieData

    const censorRating = adult ? 'A' : 'U/A'
    const runtimeStr = this.formatRuntime(runtime)
    const releaseDateStr = this.formatDate(releaseDate)
    const releaseYear = releaseDate ? releaseDate.split('-')[0] : ''

    return (
      <>
        <div
          className="details-hero"
          style={{backgroundImage: `url(${backdropPath})`}}
        >
          <div className="details-hero-overlay">
            <h1 className="details-title">{title}</h1>
            <div className="details-meta">
              <span className="details-runtime">{runtimeStr}</span>
              <span className="details-rating">{censorRating}</span>
              <span className="details-year">{releaseYear}</span>
            </div>
            <p className="details-overview">{overview}</p>
          </div>
        </div>
        <div className="details-info">
          <div className="details-columns">
            <div className="details-col">
              <h3 className="info-label">Genres</h3>
              <ul className="info-list">
                {genres.map(g => (
                  <li key={g.id} className="info-item">
                    {g.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="details-col">
              <h3 className="info-label">Audio Available</h3>
              <ul className="info-list">
                {spokenLanguages.map(l => (
                  <li key={l.id} className="info-item">
                    {l.englishName}
                  </li>
                ))}
              </ul>
            </div>
            <div className="details-col">
              <h3 className="info-label">Rating Count</h3>
              <p className="info-item">{voteCount}</p>
              <h3 className="info-label details-extra-label">Rating Average</h3>
              <p className="info-item">{voteAverage}</p>
            </div>
            <div className="details-col">
              <h3 className="info-label">Budget</h3>
              <p className="info-item">{budget}</p>
              <h3 className="info-label details-extra-label">Release Date</h3>
              <p className="info-item">{releaseDateStr}</p>
            </div>
          </div>
          {similarMovies.length > 0 && (
            <div className="similar-movies-section">
              <h2 className="similar-title">More Like This</h2>
              <MovieSlider movies={similarMovies} />
            </div>
          )}
        </div>
      </>
    )
  }

  render() {
    const {status} = this.state

    return (
      <div className="details-container">
        <Header />
        {status === apiStatusConstants.loading && <LoaderView />}
        {status === apiStatusConstants.failure && (
          <FailureView onRetry={this.fetchMovieDetails} />
        )}
        {status === apiStatusConstants.success && this.renderMovieDetails()}
        <Footer />
      </div>
    )
  }
}

export default MovieItemDetails
