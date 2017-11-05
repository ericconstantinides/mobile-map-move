import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import VenueListItem from './VenueListItem'
import GoogleMap from './GoogleMap'

const LOWEST_Y = 200
const DRAG_INTERVAL = 25  // how often it's checking the drag position
const TIME_CONSTANT = 325 // how often it's autoscrolling
const INERTIA_SPEED = 0.5 // how fast (or slow) to have the scrolling

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDown: false,
      venueListOffset: 0,
      gglMapOffset: 0,
      startY: 0,
      // new for inertia:
      timestamp: '',
      ticker: 0,
      frame: 0,
      velocity: 0,
      amplitude: 0,
      target: 0
    }
  }
  handleDragStart = e => {
    // if (e.targetTouches) {
    //   e.preventDefault()
    // }
    clearInterval(this.state.ticker)
    const timestamp = Date.now()
    const venueListOffset = this.getTranslateY(this.refs.venueList)
    const gglMapOffset = this.getTranslateY(this.refs.gglMap)
    const ticker = setInterval(this.trackDrag, DRAG_INTERVAL)
    const frame = this.state.venueListOffset
    this.setState({
      isDown: true,
      venueListOffset,
      gglMapOffset,
      startY: e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
      timestamp,
      ticker,
      frame,
      velocity: 0,
      amplitude: 0
    })
  }
  handleDragEnd = e => {
    this.setState({ isDown: false })

    clearInterval(this.state.ticker)
    if (this.state.velocity > 10 || this.state.velocity < -10) {
      const amplitude = 0.8 * this.state.velocity
      const target =
        Math.round(this.getTranslateY(this.refs.venueList) + amplitude)
      const timestamp = Date.now()
      window.requestAnimationFrame(this.autoScroll)
      this.setState((state, props) => {
        return {
          target,
          timestamp,
          amplitude
        }
      })
      
    }
  }
  // this is where we actually move the items
  handleDragMove = e => {
    if (!this.state.isDown) return
    // fix for touche devices:
    const y = e.targetTouches ? e.targetTouches[0].pageY : e.pageY
    const dragDistance = y - this.state.startY
    const venueListGoToY = dragDistance + this.state.venueListOffset
    const gglWalk = dragDistance / 2 + this.state.gglMapOffset < 0
      ? dragDistance / 2 + this.state.gglMapOffset
      : 0
    // make sure we're within our scrolling bounds:
    this.scrollMove(venueListGoToY)
    // e.stopPropagation()
    // this is extremely important:
    e.preventDefault()
  }
  scrollMove = goToY => {
    const venueListHeight = this.refs.venueList.offsetHeight
    // console.log({goToY, venueListHeight})
    const transY = goToY <= -venueListHeight
    ? -venueListHeight
    : goToY >= -LOWEST_Y
    ? -LOWEST_Y
    : goToY
    const dragDistance = transY - this.state.venueListOffset
    const gglTransY = dragDistance / 2 + this.state.gglMapOffset < 0
    ? dragDistance / 2 + this.state.gglMapOffset
    : 0
    // e.preventDefault()
    this.refs.gglMap.style.transform = 'translateY(' + gglTransY + 'px)'
    this.refs.venueList.style.transform = 'translateY(' + transY + 'px)'
  }
  getTranslateY = myRef => {
    const translateY = parseInt(
      window
        .getComputedStyle(ReactDOM.findDOMNode(myRef))
        .transform.split('matrix(1, 0, 0, 1, 0, ')
        .join('')
        .split(')')
        .join(''),
    )
    if (translateY) return translateY
    return 0
  }

  // tracks the dragging for enabling inertia
  trackDrag = () => {
    const now = Date.now()
    const elapsed = now - this.state.timestamp
    const frame = this.getTranslateY(this.refs.venueList)
    const delta = frame - this.state.frame
    const v = 1000 * delta / (1 + elapsed)
    const velocity = INERTIA_SPEED * v + 0.2 * this.state.velocity
    this.setState((state, props) => {
      return {
        timestamp: now,
        frame,
        velocity
      }
    })
  }

  // activates after letting go of list and still in movment
  autoScroll = () => {
    // console.log({'this.state.amplitude': this.state.amplitude})
    if (this.state.amplitude) {
      const elapsed = Date.now() - this.state.timestamp
      const delta = -this.state.amplitude * Math.exp(-elapsed / TIME_CONSTANT)
      // console.log('target + delta:', (this.state.target + delta))
      if (delta > 0.5 || delta < -0.5) {
        this.scrollMove(this.state.target + delta)
        window.requestAnimationFrame(this.autoScroll)
      } else {
        this.scrollMove(this.state.target)
      }
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='google-map' ref='gglMap'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12704.575550670781!2d-121.80501235000003!3d37.24429345000001!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1509685457561'
            frameBorder='0'
            style={{ border: 0 }}
          />
        </div>
        <div
          className='venueList'
          ref='venueList'
          onMouseDown={this.handleDragStart}
          onTouchStart={this.handleDragStart}
          onTouchEnd={this.handleDragEnd}
          onMouseLeave={this.handleDragEnd}
          onMouseUp={this.handleDragEnd}
          onTouchMove={this.handleDragMove}
          onMouseMove={this.handleDragMove}
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
