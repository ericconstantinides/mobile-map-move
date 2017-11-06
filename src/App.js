import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import VenueListItem from './VenueListItem'

const LOWEST_Y = 200
const DRAG_TIMEFRAME = 25 // how often it's rechecking the drag position
const TIME_CONSTANT = 325 // how often it's autoscrolling
const MOMENTUM_SPEED = 0.55 // how fast (or slow) to have the momentum
const MOMENTUM_FRICTION = 0.8 // how loose or tight the momentum should be

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dragItemPressed: false,
      dragItemY: 0,
      linkedDragItemY: 0,
      cursorY: 0,
      // new for inertia:
      timestamp: '',
      intervalId: '',
      frame: 0, // how many pixels were dragged during the timeframe
      velocity: 0, // how fast the last frame was dragged through
      momentumDistance: 0, // how many pixels to travel based on velocity
      momentumTargetY: 0 // the y pos that momentum will take the dragItem
    }
  }
  handleDragStart = e => {
    if (e.targetTouches) {
      // this is extremely important for iOS (but gives a warnign in chrome):
      e.preventDefault()
    }
    clearInterval(this.state.intervalId)
    const dragItemY = this.getYPosition(this.refs.dragItem)
    const linkedDragItemY = this.getYPosition(this.refs.linkedDragItem)
    // start trackDragging every DRAG_TIMEFRAME ms:
    const intervalId = setInterval(this.trackDragging, DRAG_TIMEFRAME)
    this.setState({
      dragItemPressed: true,
      dragItemY,
      linkedDragItemY,
      cursorY: e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
      timestamp: Date.now(),
      intervalId,
      frame: 0,
      velocity: 0,
      momentumDistance: 0
    })
  }
  handleDragEnd = e => {
    this.setState({ dragItemPressed: false })

    clearInterval(this.state.intervalId)
    if (this.state.velocity > 10 || this.state.velocity < -10) {
      const momentumDistance = MOMENTUM_FRICTION * this.state.velocity
      const momentumTargetY = Math.round(
        this.getYPosition(this.refs.dragItem) + momentumDistance
      )
      const timestamp = Date.now()
      window.requestAnimationFrame(this.calculateMomentum)
      this.setState((state, props) => {
        return {
          timestamp,
          momentumTargetY,
          momentumDistance
        }
      })
    }
  }
  // this is where we actually move the items
  handleDragging = e => {
    if (!this.state.dragItemPressed) return
    const pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY
    const dragDistance = pageY - this.state.cursorY
    const dragItemGoToY = dragDistance + this.state.dragItemY
    this.moveItems(dragItemGoToY)
  }
  moveItems = goToYUnbounded => {
    const { dragItem, linkedDragItem } = this.refs
    const { dragItemY, linkedDragItemY } = this.state
    const dragItemHeight = dragItem.offsetHeight
    // make sure we're within our scrolling bounds:
    const goToY = goToYUnbounded <= -dragItemHeight
      ? -dragItemHeight
      : goToYUnbounded >= -LOWEST_Y ? -LOWEST_Y : goToYUnbounded
    const dragDistance = goToY - dragItemY
    const linkedDragItemGoToY = dragDistance / 2 + linkedDragItemY < 0
      ? dragDistance / 2 + linkedDragItemY
      : 0
    linkedDragItem.style.transform = 'translateY(' + linkedDragItemGoToY + 'px)'
    dragItem.style.transform = 'translateY(' + goToY + 'px)'
  }
  getYPosition = myRef => {
    const translateY = parseInt(
      window
        .getComputedStyle(ReactDOM.findDOMNode(myRef))
        .transform.split('matrix(1, 0, 0, 1, 0, ')
        .join('')
        .split(')')
        .join(''),
      10
    )
    if (translateY) return translateY
    return 0
  }

  // tracks the dragging for enabling inertia
  trackDragging = () => {
    const now = Date.now()
    const elapsed = now - this.state.timestamp
    const frame = this.getYPosition(this.refs.dragItem)
    const delta = frame - this.state.frame
    console.log(elapsed)
    const v = 1000 * delta / (1 + elapsed)
    const velocity = MOMENTUM_SPEED * v + 0.2 * this.state.velocity
    this.setState((state, props) => {
      return {
        timestamp: now,
        frame,
        velocity
      }
    })
  }

  // activates after letting go of list and still in movment
  calculateMomentum = () => {
    if (this.state.momentumDistance) {
      const elapsed = Date.now() - this.state.timestamp
      const delta =
        -this.state.momentumDistance * Math.exp(-elapsed / TIME_CONSTANT)
      if (delta > 0.5 || delta < -0.5) {
        // this is where all the momentum is:
        this.moveItems(this.state.momentumTargetY + delta)
        window.requestAnimationFrame(this.calculateMomentum)
      } else {
        // this is the last of the momentum:
        this.moveItems(this.state.momentumTargetY)
        clearInterval(this.state.intervalId)
      }
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='google-map' ref='linkedDragItem'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12704.575550670781!2d-121.80501235000003!3d37.24429345000001!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1509685457561'
            title='Google Map'
            frameBorder='0'
            style={{ border: 0 }}
          />
        </div>
        <div
          className='venueList'
          ref='dragItem'
          onMouseDown={this.handleDragStart}
          onTouchStart={this.handleDragStart}
          onTouchEnd={this.handleDragEnd}
          onMouseLeave={this.handleDragEnd}
          onMouseUp={this.handleDragEnd}
          onTouchMove={this.handleDragging}
          onMouseMove={this.handleDragging}
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
