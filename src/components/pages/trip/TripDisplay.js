import React from 'react'
import { Link } from 'react-router-dom';
import './TripDisplay.scss'

function TripDisplay({ place, marker }) {

    const { id, name, description, img, address } = place
    return (
        <div className='displays-page'>
            <div className="name-des">
                <div className="name">{name}</div>
                <div className="des">
                    <div className="address flex">
                        <i className="fas fa-map-marker-alt"></i>
                        {address}
                    </div>
                    <div className="description">
                        {description}
                    </div>
                </div>
            </div>
            <div className="img">
                <Link to={`/place/${id}`} target='_blank' rel='noreferrer'>
                    <img className='trip-img' src={img} alt={img} />
                </Link>

                <img className='marker' src={marker} alt={marker} />
            </div>
        </div>
    )
}
export default TripDisplay;