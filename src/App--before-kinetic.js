import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import VenueListItem from './VenueListItem'
import GoogleMap from './GoogleMap'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDown: false,
      venueListOffset: 0,
      gglMapOffset: 0,
      startY: 0
    }
  }
  handleDragStart = (e) => {
    this.setState({
      isDown: true,
      venueListOffset: this.getTranslateY(this.refs.venueList),
      gglMapOffset: this.getTranslateY(this.refs.gglMap),
      startY: e.targetTouches ? e.targetTouches[0].pageY : e.pageY
    })
  }
  handleDragEnd = (e) => {
    this.setState({isDown: false})
  }
  handleDragMove = (e) => {
    if (!this.state.isDown) return
    // fix for touche devices:
    const y = e.targetTouches ? e.targetTouches[0].pageY : e.pageY
    const walk = y - this.state.startY
    const venueListWalk = walk + this.state.venueListOffset
    const gglWalk = (walk / 2) + this.state.gglMapOffset < 0 ? (walk / 2) + this.state.gglMapOffset : 0
    if (Math.abs(venueListWalk) < this.refs.venueList.offsetHeight) {
      e.preventDefault()
      this.refs.gglMap.style.transform = 'translateY(' + gglWalk + 'px)'
      this.refs.venueList.style.transform = 'translateY(' + venueListWalk + 'px)'
    }
  }
  getTranslateY = (myRef) => {
    const translateY = parseInt(window
      .getComputedStyle(ReactDOM.findDOMNode(myRef)).transform
      .split('matrix(1, 0, 0, 1, 0, ').join('')
      .split(')').join(''), 10)
    if (translateY) return translateY
    return 0
  }

  render () {
    return (
      <div className='container'>
        <div className='google-map' ref='gglMap'>
          <iframe src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12704.575550670781!2d-121.80501235000003!3d37.24429345000001!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1509685457561' frameBorder='0' style={{border: 0}} />
        </div>
        <div className='venueList'
          ref='venueList'
          onMouseDown={this.handleDragStart}
          onTouchStart={this.handleDragStart}
          onTouchEnd={this.handleDragEnd}
          onMouseLeave={this.handleDragEnd}
          onMouseUp={this.handleDragEnd}
          onTouchMove={this.handleDragMove}
          onMouseMove={this.handleDragMove}
        >
          <VenueListItem />
          <VenueListItem />
          <VenueListItem />
          <VenueListItem />
          <VenueListItem />
          <VenueListItem />
          <VenueListItem />
        </div>
      </div>
    )
  }
}

export default App
