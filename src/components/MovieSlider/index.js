import React from 'react'
import Slider from 'react-slick'
import MovieCard from '../MovieCard'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {slidesToShow: 3, slidesToScroll: 1},
    },
    {
      breakpoint: 768,
      settings: {slidesToShow: 2, slidesToScroll: 1},
    },
    {
      breakpoint: 480,
      settings: {slidesToShow: 1, slidesToScroll: 1},
    },
  ],
}

const MovieSlider = ({movies}) => (
  <div className="slider-container">
    <Slider {...settings}>
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          posterPath={movie.posterPath}
          title={movie.title}
        />
      ))}
    </Slider>
  </div>
)

export default MovieSlider
