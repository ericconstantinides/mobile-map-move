import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './App.css'

ReactDOM.render(<App />, document.getElementById('root'))
/*
// I do what I want:
const venueList = document.querySelector('.venueList')
const gglMap = document.querySelector('.google-map')

let venueListOffset
let gglMapOffset
let isDown = false
let startY

venueList.addEventListener('mousedown', handleDragStart)
venueList.addEventListener('touchstart', handleDragStart)
venueList.addEventListener('touchend', handleDragEnd)
venueList.addEventListener('mouseleave', handleDragEnd)
venueList.addEventListener('mouseup', handleDragEnd)
venueList.addEventListener('touchmove', handleDragMove)
venueList.addEventListener('mousemove', handleDragMove)

function handleDragStart (e) {
  isDown = true
  venueListOffset = getTranslateY(venueList)
  gglMapOffset = getTranslateY(gglMap)
  // fix for touche devices:
  startY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY
}
function handleDragEnd () {
  isDown = false
}
function handleDragMove (e) {
  console.dir(venueList)
  if (!isDown) return
  // fix for touche devices:
  const y = e.targetTouches ? e.targetTouches[0].pageY : e.pageY
  const walk = y - startY
  const venueListWalk = walk + venueListOffset
  const gglWalk = (walk / 2) + gglMapOffset < 0 ? (walk / 2) + gglMapOffset : 0
  console.log({venueListWalk: Math.abs(venueListWalk), offsetHeight: venueList.offsetHeight})
  if (Math.abs(venueListWalk) < venueList.offsetHeight) {
    e.preventDefault()
    gglMap.style.transform = 'translateY(' + gglWalk + 'px)'
    venueList.style.transform = 'translateY(' + venueListWalk + 'px)'
  }
}
function getTranslateY (el) {
  const translateY = parseInt(window
    .getComputedStyle(el).transform
    .split('matrix(1, 0, 0, 1, 0, ').join('')
    .split(')').join(''), 10)
  if (translateY) return translateY
  return 0
}
*/
