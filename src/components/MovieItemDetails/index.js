import React, {Component} from 'react'
import {format, parseISO} from 'date-fns'
import Header from '../Header'
import Footer from '../Footer'
import MovieSlider from '../MovieSlider'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import VideoPlayer from '../VideoPlayer'
import {fetchFromTMDB, getTmdbImageUrl} from '../../utils/tmdb'
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
    showPlayer: false,
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
    try {
      let d
      let similarData
      try {
        d = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}`)
        similarData = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar`)
      } catch {
        d = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}`)
        similarData = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar`)
      }

      const movieData = {
        id: d.id,
        backdropPath: getTmdbImageUrl(d.backdrop_path, 'original'),
        posterPath: getTmdbImageUrl(d.poster_path),
        title: d.title || d.name,
        overview: d.overview,
        adult: d.adult || false,
        budget: d.budget || 0,
        genres: d.genres || [],
        releaseDate: d.release_date || d.first_air_date || '',
        runtime: d.runtime || (d.episode_run_time && d.episode_run_time.length > 0 ? d.episode_run_time[0] : 0),
        similarMovies: similarData.results
          .filter(m => m.poster_path)
          .map(m => ({
            id: m.id,
            backdropPath: getTmdbImageUrl(m.backdrop_path, 'original'),
            posterPath: getTmdbImageUrl(m.poster_path),
            title: m.title || m.name,
            overview: m.overview,
          })),
        spokenLanguages: (d.spoken_languages || []).map(l => ({
          id: l.iso_639_1,
          englishName: l.english_name,
        })),
        voteAverage: d.vote_average,
        voteCount: d.vote_count,
      }
      this.setState({movieData, status: apiStatusConstants.success})
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

    const {showPlayer} = this.state

    return (
      <>
        {showPlayer && (
          <VideoPlayer
            title={title}
            backdropPath={backdropPath}
            onClose={() => this.setState({showPlayer: false})}
          />
        )}
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
            <div className="details-play-row">
              <button
                className="details-play-btn"
                type="button"
                onClick={() => this.setState({showPlayer: true})}
              >
                &#9654; Play
              </button>
              <button className="details-more-btn" type="button">
                More Info
              </button>
            </div>
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
