import React, {Component} from 'react'
import './index.css'

class VideoPlayer extends Component {
  state = {
    isPlaying: true,
    progress: 0,
    currentTime: 0,
    duration: 7200, // 2-hour mock duration in seconds
    volume: 80,
    isMuted: false,
    showControls: true,
    isFullscreen: false,
    showVolumeSlider: false,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    this.startPlayback()
    this.hideControlsTimer = setTimeout(this.hideControls, 3000)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    clearInterval(this.playInterval)
    clearTimeout(this.hideControlsTimer)
  }

  startPlayback = () => {
    this.playInterval = setInterval(() => {
      const {isPlaying, currentTime, duration} = this.state
      if (isPlaying && currentTime < duration) {
        const newTime = currentTime + 1
        this.setState({
          currentTime: newTime,
          progress: (newTime / duration) * 100,
        })
      }
    }, 1000)
  }

  handleKeyDown = e => {
    switch (e.key) {
      case 'Escape':
        this.props.onClose()
        break
      case ' ':
        e.preventDefault()
        this.togglePlay()
        break
      case 'ArrowRight':
        this.seekForward()
        break
      case 'ArrowLeft':
        this.seekBackward()
        break
      case 'ArrowUp':
        e.preventDefault()
        this.increaseVolume()
        break
      case 'ArrowDown':
        e.preventDefault()
        this.decreaseVolume()
        break
      case 'm':
      case 'M':
        this.toggleMute()
        break
      default:
        break
    }
  }

  togglePlay = () => {
    this.setState(prev => ({isPlaying: !prev.isPlaying}))
    this.resetControlsTimer()
  }

  seekForward = () => {
    this.setState(prev => {
      const newTime = Math.min(prev.currentTime + 10, prev.duration)
      return {currentTime: newTime, progress: (newTime / prev.duration) * 100}
    })
    this.resetControlsTimer()
  }

  seekBackward = () => {
    this.setState(prev => {
      const newTime = Math.max(prev.currentTime - 10, 0)
      return {currentTime: newTime, progress: (newTime / prev.duration) * 100}
    })
    this.resetControlsTimer()
  }

  increaseVolume = () => {
    this.setState(prev => ({
      volume: Math.min(prev.volume + 10, 100),
      isMuted: false,
    }))
  }

  decreaseVolume = () => {
    this.setState(prev => ({
      volume: Math.max(prev.volume - 10, 0),
    }))
  }

  toggleMute = () => {
    this.setState(prev => ({isMuted: !prev.isMuted}))
    this.resetControlsTimer()
  }

  onProgressClick = e => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = clickX / rect.width
    const {duration} = this.state
    const newTime = Math.floor(ratio * duration)
    this.setState({
      currentTime: newTime,
      progress: ratio * 100,
    })
    this.resetControlsTimer()
  }

  onVolumeChange = e => {
    this.setState({volume: Number(e.target.value), isMuted: false})
  }

  formatTime = seconds => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${m}:${String(s).padStart(2, '0')}`
  }

  showControlsNow = () => {
    this.setState({showControls: true})
    this.resetControlsTimer()
  }

  hideControls = () => {
    const {isPlaying} = this.state
    if (isPlaying) {
      this.setState({showControls: false})
    }
  }

  resetControlsTimer = () => {
    this.setState({showControls: true})
    clearTimeout(this.hideControlsTimer)
    this.hideControlsTimer = setTimeout(this.hideControls, 3000)
  }

  getVolumeIcon = () => {
    const {isMuted, volume} = this.state
    if (isMuted || volume === 0) return '🔇'
    if (volume < 40) return '🔈'
    if (volume < 70) return '🔉'
    return '🔊'
  }

  render() {
    const {title, backdropPath, onClose} = this.props
    const {
      isPlaying,
      progress,
      currentTime,
      duration,
      volume,
      isMuted,
      showControls,
      showVolumeSlider,
    } = this.state

    return (
      <div
        className="vp-overlay"
        onMouseMove={this.showControlsNow}
        onClick={e => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="vp-container">
          {/* Movie backdrop as "video" */}
          <div
            className="vp-screen"
            style={{backgroundImage: `url(${backdropPath})`}}
            onClick={this.togglePlay}
          >
            {/* Cinematic grain overlay */}
            <div className="vp-grain" />

            {/* Center play/pause flash */}
            {!isPlaying && (
              <div className="vp-paused-icon">
                <span>&#9646;&#9646;</span>
              </div>
            )}

            {/* Simulated scan lines for cinematic feel */}
            <div className="vp-scanlines" />
          </div>

          {/* Top bar */}
          <div className={`vp-topbar ${showControls ? 'vp-visible' : 'vp-hidden'}`}>
            <button className="vp-close-btn" type="button" onClick={onClose}>
              &#10005;
            </button>
            <h2 className="vp-title">{title}</h2>
            <div className="vp-top-right">
              <span className="vp-quality-badge">HD</span>
            </div>
          </div>

          {/* Bottom controls */}
          <div className={`vp-controls ${showControls ? 'vp-visible' : 'vp-hidden'}`}>
            {/* Progress bar */}
            <div
              className="vp-progress-bar"
              onClick={this.onProgressClick}
              role="slider"
              aria-label="Video progress"
              aria-valuenow={progress}
              tabIndex={0}
            >
              <div className="vp-progress-bg" />
              <div
                className="vp-progress-fill"
                style={{width: `${progress}%`}}
              />
              <div
                className="vp-progress-thumb"
                style={{left: `${progress}%`}}
              />
            </div>

            {/* Controls row */}
            <div className="vp-controls-row">
              <div className="vp-left-controls">
                {/* Rewind */}
                <button
                  className="vp-ctrl-btn"
                  type="button"
                  onClick={this.seekBackward}
                  title="Rewind 10s (←)"
                >
                  &#8634; 10
                </button>

                {/* Play/Pause */}
                <button
                  className="vp-play-btn"
                  type="button"
                  onClick={this.togglePlay}
                  title="Play/Pause (Space)"
                >
                  {isPlaying ? (
                    <span className="vp-pause-icon">&#9646;&nbsp;&#9646;</span>
                  ) : (
                    <span>&#9654;</span>
                  )}
                </button>

                {/* Forward */}
                <button
                  className="vp-ctrl-btn"
                  type="button"
                  onClick={this.seekForward}
                  title="Forward 10s (→)"
                >
                  10 &#8635;
                </button>

                {/* Volume */}
                <div
                  className="vp-volume-container"
                  onMouseEnter={() => this.setState({showVolumeSlider: true})}
                  onMouseLeave={() => this.setState({showVolumeSlider: false})}
                >
                  <button
                    className="vp-ctrl-btn vp-volume-btn"
                    type="button"
                    onClick={this.toggleMute}
                    title="Mute (M)"
                  >
                    {this.getVolumeIcon()}
                  </button>
                  <div className={`vp-volume-slider-wrap ${showVolumeSlider ? 'vp-volume-visible' : ''}`}>
                    <input
                      className="vp-volume-slider"
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={this.onVolumeChange}
                    />
                  </div>
                </div>

                {/* Time */}
                <span className="vp-time">
                  {this.formatTime(currentTime)} / {this.formatTime(duration)}
                </span>
              </div>

              <div className="vp-right-controls">
                <span className="vp-quality-label">1080p</span>
                <button
                  className="vp-ctrl-btn"
                  type="button"
                  title="Close player (Esc)"
                  onClick={onClose}
                >
                  &#x26F6;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default VideoPlayer
