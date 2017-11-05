import React from 'react'

const VenueListItem = ({number}) => {
  return (
    <article className='venueList__item'>
      <div className='venueList__item-content'>
        <h2 className='venueList__item-title'>Random Entry {number}/14</h2>
        <p className='venueList__item-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu ornare velit, a porta dui.</p>
      </div>
    </article>
  )
}

export default VenueListItem
