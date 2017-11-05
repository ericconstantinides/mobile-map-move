import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import VenueListItem from './VenueListItem'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      view: '',
      indicator: '',
      reference: '',
      velocity: 0,
      frame: '',
      timestamp: '',
      ticker: 0,
      amplitude: 0,
      target: '',
      max: '',
      offset: 0,
      min: 0,
      pressed: false,
      timeConstant: 325,
      relative: ''
    }
  }

  ypos = e => {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientY
    }
    // mouse event
    return e.clientY
  }

  scroll = y => {
    const { max, min, view, indicator, relative } = this.state
    const offset = y > max ? max : y < min ? min : y
    view.style['transform'] = 'translateY(' + -offset + 'px)'
    indicator.style['transform'] = 'translateY(' + offset * relative + 'px)'
    this.setState({ offset })
  }

  track = () => {
    const now = Date.now()
    const elapsed = now - this.state.timestamp
    const delta = this.state.offset - this.state.frame

    this.setState((state, props) => {
      const v = 1000 * delta / (1 + elapsed)
      const velocity = 0.8 * v + 0.2 * this.state.velocity
      return {
        timestamp: now,
        frame: this.state.offset,
        velocity
      }
    })
  }

  autoScroll = () => {
    let elapsed
    let delta

    if (this.state.amplitude) {
      elapsed = Date.now() - this.state.timestamp
      delta =
        -this.state.amplitude * Math.exp(-elapsed / this.state.timeConstant)
      if (delta > 0.5 || delta < -0.5) {
        this.scroll(this.state.target + delta)
        window.requestAnimationFrame(this.autoScroll)
      } else {
        this.scroll(this.state.target)
      }
    }
  }

  tap = e => {
    const reference = this.ypos(e)
    const timestamp = Date.now()
    clearInterval(this.state.ticker)
    const ticker = setInterval(this.trackDrag, 100)
    const frame = this.state.offset
    this.setState((state, props) => {
      return {
        pressed: true,
        reference,
        velocity: 0,
        amplitude: 0,
        frame,
        timestamp,
        ticker
      }
    })
  }

  drag = e => {
    let y
    let delta
    if (this.state.pressed) {
      y = this.ypos(e)
      delta = this.state.reference - y
      if (delta > 2 || delta < -2) {
        this.setState({ reference: y })
        this.scroll(this.state.offset + delta)
      }
    }
  }

  release = e => {
    this.setState({ pressed: false })

    clearInterval(this.state.ticker)
    if (this.state.velocity > 10 || this.state.velocity < -10) {
      const amplitude = 0.8 * this.state.velocity
      const target = Math.round(this.state.offset + amplitude)
      const timestamp = Date.now()
      window.requestAnimationFrame(this.autoScroll)
      this.setState({ target, timestamp, amplitude })
    }
  }

  componentDidMount () {
    const view = ReactDOM.findDOMNode(this.refs.venueList)
    const indicator = ReactDOM.findDOMNode(this.refs.indicator)
    console.dir(parseInt(window.getComputedStyle(view).height, 10))
    const max =
      parseInt(window.getComputedStyle(view).height, 10) - window.innerHeight
    const relative = (window.innerHeight - 30) / max
    console.log({ 'window.innerHeight': window.innerHeight, max, relative })

    this.setState({
      max,
      relative,
      view,
      indicator
    })
  }

  render () {
    return (
      <div className='container'>
        <div ref='indicator' />
        <div className='google-map' ref='gglMap'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12704.575550670781!2d-121.80501235000003!3d37.24429345000001!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1509685457561'
            frameBorder='0'
            style={{ border: 0 }}
            title='Google Map'
          />
        </div>
        <div
          className='venueList'
          ref='venueList'
          onTouchStart={this.tap}
          onTouchMove={this.drag}
          onTouchEnd={this.release}
          onMouseDown={this.tap}
          onMouseMove={this.drag}
          onMouseUp={this.release}
          onMouseLeave={this.release}
        >
          <VenueListItem number={1} />
          <VenueListItem number={2} />
          <VenueListItem number={3} />
          <VenueListItem number={4} />
          <VenueListItem number={5} />
          <VenueListItem number={6} />
          <VenueListItem number={7} />
          <VenueListItem number={8} />
          <VenueListItem number={9} />
          <VenueListItem number={10} />
          <VenueListItem number={11} />
          <VenueListItem number={12} />
          <VenueListItem number={13} />
          <VenueListItem number={14} />
        </div>
      </div>
    )
  }
}

export default App
