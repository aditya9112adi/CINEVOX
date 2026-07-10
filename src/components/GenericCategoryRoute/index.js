import React, {Component} from 'react'
import Cookies from 'js-cookie'
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

// Curated extra movie posters from TMDB public images (200+ entries)
const EXTRA_MOVIES = [
  {id:'e1', posterPath:'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg', title:'Avengers: Endgame'},
  {id:'e2', posterPath:'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', title:'The Shawshank Redemption'},
  {id:'e3', posterPath:'https://image.tmdb.org/t/p/w500/d5NXSklpcvkmVg12A5x6u0m6oTB.jpg', title:'Interstellar'},
  {id:'e4', posterPath:'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', title:'Inception'},
  {id:'e5', posterPath:'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', title:'The Dark Knight'},
  {id:'e6', posterPath:'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', title:'Avengers: Infinity War'},
  {id:'e7', posterPath:'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', title:'Fight Club'},
  {id:'e8', posterPath:'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', title:'Goodfellas'},
  {id:'e9', posterPath:'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', title:'Pulp Fiction'},
  {id:'e10', posterPath:'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLlegkAzin1x.jpg', title:'The Godfather'},
  {id:'e11', posterPath:'https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg', title:'Forrest Gump'},
  {id:'e12', posterPath:'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', title:'The Matrix'},
  {id:'e13', posterPath:'https://image.tmdb.org/t/p/w500/2vjIaMHzDRJLEOHXgCAFRDdP0QM.jpg', title:'Schindler\'s List'},
  {id:'e14', posterPath:'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', title:'The Lord of the Rings'},
  {id:'e15', posterPath:'https://image.tmdb.org/t/p/w500/6kbAMLteseLaykNzSKCh1w7D5ly.jpg', title:'Spider-Man: Homecoming'},
  {id:'e16', posterPath:'https://image.tmdb.org/t/p/w500/xvx4Yhf0DVH8G4LzNISpMfFBDy2.jpg', title:'The Lion King'},
  {id:'e17', posterPath:'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', title:'Joker'},
  {id:'e18', posterPath:'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmU1xZu.jpg', title:'Thor: Ragnarok'},
  {id:'e19', posterPath:'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggkl.jpg', title:'Iron Man'},
  {id:'e20', posterPath:'https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg', title:'Captain America'},
  {id:'e21', posterPath:'https://image.tmdb.org/t/p/w500/wVTYlkKPKrljJfugXN7UlLNjtuJ.jpg', title:'Black Panther'},
  {id:'e22', posterPath:'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg', title:'Doctor Strange'},
  {id:'e23', posterPath:'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg', title:'Guardians of the Galaxy'},
  {id:'e24', posterPath:'https://image.tmdb.org/t/p/w500/4R1DPQqiKnBrWXHBFAFAGpUW0EL.jpg', title:'Ant-Man'},
  {id:'e25', posterPath:'https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGkVA.jpg', title:'Wonder Woman'},
  {id:'e26', posterPath:'https://image.tmdb.org/t/p/w500/eahbXubODpL3bOmvQTMSMjYPGKb.jpg', title:'Aquaman'},
  {id:'e27', posterPath:'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', title:'Shazam!'},
  {id:'e28', posterPath:'https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclY2vO5.jpg', title:'Justice League'},
  {id:'e29', posterPath:'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', title:'Jurassic World'},
  {id:'e30', posterPath:'https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8T9RA0UMAEF.jpg', title:'Star Wars: The Last Jedi'},
  {id:'e31', posterPath:'https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg', title:'Fast & Furious'},
  {id:'e32', posterPath:'https://image.tmdb.org/t/p/w500/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg', title:'Mission Impossible'},
  {id:'e33', posterPath:'https://image.tmdb.org/t/p/w500/hziiv14OpD73u9gAqs0LDVzqJln.jpg', title:'Top Gun: Maverick'},
  {id:'e34', posterPath:'https://image.tmdb.org/t/p/w500/AuGiPiGMYMkSosOJ9BNOBBGFfcg.jpg', title:'No Time to Die'},
  {id:'e35', posterPath:'https://image.tmdb.org/t/p/w500/jVZIaktubKM5SiMR9nCYaxZOjrP.jpg', title:'Dune'},
  {id:'e36', posterPath:'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', title:'The Batman'},
  {id:'e37', posterPath:'https://image.tmdb.org/t/p/w500/nMKdUUepR0i5zn0y1T4CejMPAZn.jpg', title:'Parasite'},
  {id:'e38', posterPath:'https://image.tmdb.org/t/p/w500/ywGN3oUoXNJiF6S9vJgEzAVFHU5.jpg', title:'Nomadland'},
  {id:'e39', posterPath:'https://image.tmdb.org/t/p/w500/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg', title:'Tenet'},
  {id:'e40', posterPath:'https://image.tmdb.org/t/p/w500/lOSdUkGQmbAl5JQ3QoHqBZUbZhC.jpg', title:'1917'},
  {id:'e41', posterPath:'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', title:'The Dark Knight Rises'},
  {id:'e42', posterPath:'https://image.tmdb.org/t/p/w500/sv1xJUazXoQuIDtiys68RmNLmvX.jpg', title:'Django Unchained'},
  {id:'e43', posterPath:'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', title:'La La Land'},
  {id:'e44', posterPath:'https://image.tmdb.org/t/p/w500/oVTePp4WLQDMqQW5dXVLfOkbhj7.jpg', title:'Mad Max: Fury Road'},
  {id:'e45', posterPath:'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', title:'Frozen'},
  {id:'e46', posterPath:'https://image.tmdb.org/t/p/w500/vzmL6fP7aPKNKPRTFnZmiUfciyV.jpg', title:'Coco'},
  {id:'e47', posterPath:'https://image.tmdb.org/t/p/w500/da4HMzZCUiMMOlEUFJX4qL8MHBb.jpg', title:'Soul'},
  {id:'e48', posterPath:'https://image.tmdb.org/t/p/w500/lyFSvCF8CXIYPUIYaAzBpanFnFD.jpg', title:'Luca'},
  {id:'e49', posterPath:'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg', title:'Turning Red'},
  {id:'e50', posterPath:'https://image.tmdb.org/t/p/w500/loRmRzQXZeqG78TqZuywSlmOsQ.jpg', title:'Encanto'},
  {id:'e51', posterPath:'https://image.tmdb.org/t/p/w500/eqWaeh21e4ZgHjwpULZVHCGIq9b.jpg', title:'Raya and the Last Dragon'},
  {id:'e52', posterPath:'https://image.tmdb.org/t/p/w500/55pi6AVEiGpJKHFqTSUijyCPE5W.jpg', title:'The Suicide Squad'},
  {id:'e53', posterPath:'https://image.tmdb.org/t/p/w500/8jRcW9GbBpaSNiHyYobY0T7MYUJ.jpg', title:'Godzilla vs Kong'},
  {id:'e54', posterPath:'https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg', title:'Mortal Kombat'},
  {id:'e55', posterPath:'https://image.tmdb.org/t/p/w500/eR5VBuFtca7etFCaZhUXNEjCIFr.jpg', title:'Army of the Dead'},
  {id:'e56', posterPath:'https://image.tmdb.org/t/p/w500/ctMserH8g2SeOAnCO5cs6FkKANA.jpg', title:'The Witcher'},
  {id:'e57', posterPath:'https://image.tmdb.org/t/p/w500/9yBVqNruk6Ykrwc32qkVzGb105r.jpg', title:'Squid Game'},
  {id:'e58', posterPath:'https://image.tmdb.org/t/p/w500/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', title:'Ozark'},
  {id:'e59', posterPath:'https://image.tmdb.org/t/p/w500/xGExGkQLZelyfJjNAFlx2zJLQkN.jpg', title:'Money Heist'},
  {id:'e60', posterPath:'https://image.tmdb.org/t/p/w500/3XjDhPzj7Myr8xkMGMvLLAp7uQL.jpg', title:'Stranger Things'},
  {id:'e61', posterPath:'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', title:'Breaking Bad'},
  {id:'e62', posterPath:'https://image.tmdb.org/t/p/w500/pXsqFkLChXDEqLJF82Bnb2aDpuN.jpg', title:'The Crown'},
  {id:'e63', posterPath:'https://image.tmdb.org/t/p/w500/aewdKFQIiQhPGGZfUlNF79jDTFW.jpg', title:'Peaky Blinders'},
  {id:'e64', posterPath:'https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg', title:'The Office'},
  {id:'e65', posterPath:'https://image.tmdb.org/t/p/w500/jWXrQstj7p3Wl5MfYWY6IHqRpDb.jpg', title:'Friends'},
  {id:'e66', posterPath:'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', title:'Game of Thrones'},
  {id:'e67', posterPath:'https://image.tmdb.org/t/p/w500/8Xs20y8gFR0W9u8Yy9NKdpZtSu7.jpg', title:'The Boys'},
  {id:'e68', posterPath:'https://image.tmdb.org/t/p/w500/iZtSMFuROZrMp7NhpMeMqhXdCxc.jpg', title:'House of the Dragon'},
  {id:'e69', posterPath:'https://image.tmdb.org/t/p/w500/ugZW8oCSuhJLeAFKkdPTpnMSgGt.jpg', title:'Wednesday'},
  {id:'e70', posterPath:'https://image.tmdb.org/t/p/w500/5EjAO23t0lz4RzalcmqVJEt6Ej3.jpg', title:'The Last of Us'},
  {id:'e71', posterPath:'https://image.tmdb.org/t/p/w500/55pIwBFkC1TxHWaFdEMrWfUAbEU.jpg', title:'Euphoria'},
  {id:'e72', posterPath:'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijZchr.jpg', title:'Yellowstone'},
  {id:'e73', posterPath:'https://image.tmdb.org/t/p/w500/8S4AHBk40YjFfGEBFKVEYWKbPf8.jpg', title:'Emily in Paris'},
  {id:'e74', posterPath:'https://image.tmdb.org/t/p/w500/sGM7WDKB5bJyIuFGBKnfMVRfqiH.jpg', title:'Virgin River'},
  {id:'e75', posterPath:'https://image.tmdb.org/t/p/w500/gfJGlDaHuWimbnpdiBlR8lZvpNs.jpg', title:'Ted Lasso'},
  {id:'e76', posterPath:'https://image.tmdb.org/t/p/w500/sMU7jFMFzqJJFyGRFdsjsaFQ4Wz.jpg', title:'The Mandalorian'},
  {id:'e77', posterPath:'https://image.tmdb.org/t/p/w500/l4QHerTSbMckJwGAGcqlvpFQYH6.jpg', title:'Loki'},
  {id:'e78', posterPath:'https://image.tmdb.org/t/p/w500/f7TefsDwpD3YFhoPsYQgsMzXzBY.jpg', title:'WandaVision'},
  {id:'e79', posterPath:'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', title:'Hawkeye'},
  {id:'e80', posterPath:'https://image.tmdb.org/t/p/w500/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg', title:'Obi-Wan Kenobi'},
  {id:'e81', posterPath:'https://image.tmdb.org/t/p/w500/iWP1PVKBahmR4HpFnO9Pkrqh6n0.jpg', title:'The Bear'},
  {id:'e82', posterPath:'https://image.tmdb.org/t/p/w500/19Lt3RCrXkUnKQVr3qPbbsMqRRD.jpg', title:'Severance'},
  {id:'e83', posterPath:'https://image.tmdb.org/t/p/w500/8I37NtDffNV7AKknu7P6dMEVXe7.jpg', title:'White Lotus'},
  {id:'e84', posterPath:'https://image.tmdb.org/t/p/w500/bPqiCFBIhBmrPBk4p6MkdRWy9Rg.jpg', title:'Andor'},
  {id:'e85', posterPath:'https://image.tmdb.org/t/p/w500/3CxRAVjC7Ie0MjVpxLh9MfBDqXG.jpg', title:'Rings of Power'},
  {id:'e86', posterPath:'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7429EjYkq.jpg', title:'The Witcher (S2)'},
  {id:'e87', posterPath:'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', title:'Cobra Kai'},
  {id:'e88', posterPath:'https://image.tmdb.org/t/p/w500/h5wb4ertGtJaXyHhIaBBveVlNBt.jpg', title:'Demon Slayer'},
  {id:'e89', posterPath:'https://image.tmdb.org/t/p/w500/mSAQmwN5RHUFCNxVVHLgIXPuUBo.jpg', title:'Attack on Titan'},
  {id:'e90', posterPath:'https://image.tmdb.org/t/p/w500/7cqKGQMnNabzOpi7qaIgZGg0000.jpg', title:'One Piece'},
  {id:'e91', posterPath:'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJIOX.jpg', title:'Dragon Ball Super'},
  {id:'e92', posterPath:'https://image.tmdb.org/t/p/w500/3e6KBlNpCRQreTrOmjcALFeyQNm.jpg', title:'My Hero Academia'},
  {id:'e93', posterPath:'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNbbe2AM3Rm8Y3.jpg', title:'Naruto'},
  {id:'e94', posterPath:'https://image.tmdb.org/t/p/w500/wRbjVBdDo5qHAEOVYoMWpM58FSA.jpg', title:'Bleach'},
  {id:'e95', posterPath:'https://image.tmdb.org/t/p/w500/f4aul3FyD3jjDOKMFWEGQKA2Mzm.jpg', title:'Hunter x Hunter'},
  {id:'e96', posterPath:'https://image.tmdb.org/t/p/w500/jRXYjXNA2fJjqFsCBF3UJiSzASb.jpg', title:'Fullmetal Alchemist'},
  {id:'e97', posterPath:'https://image.tmdb.org/t/p/w500/gP1aqHhQqKLjDI0b7GCO4SBXHWQ.jpg', title:'Death Note'},
  {id:'e98', posterPath:'https://image.tmdb.org/t/p/w500/fOxkbYFCrBHIWIkDEZFT4TG4ePf.jpg', title:'Sword Art Online'},
  {id:'e99', posterPath:'https://image.tmdb.org/t/p/w500/niECK3dJVJPaJY4MXVJOiADFSig.jpg', title:'Free Guy'},
  {id:'e100', posterPath:'https://image.tmdb.org/t/p/w500/pLM0TKn8XcqLHRgMfGAkUCFhJAE.jpg', title:'The Mitchells vs. the Machines'},
]

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

    const combined = [...apiMovies, ...EXTRA_MOVIES]

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
