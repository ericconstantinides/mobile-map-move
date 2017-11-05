import React, { Component } from 'react'

class GoogleMap extends Component {
  render () {
    return (
      <div className='google-map' ref='gglMap'>
        <iframe src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12704.575550670781!2d-121.80501235000003!3d37.24429345000001!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1509685457561' frameBorder='0' style={{border: 0}} />
      </div>
    )
  }
}

export default GoogleMap
