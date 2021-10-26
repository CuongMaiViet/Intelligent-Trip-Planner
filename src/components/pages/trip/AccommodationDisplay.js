import React from 'react'
import { Link } from 'react-router-dom';
import './AccomDisplay.scss'
import marker0 from '../map/marker0.png'

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AccommodationDisplay({ accom }) {

    return (
        <>
            <div className='ac-displays-page'>
                <div className="img">
                    <Link to={`/accommodation/${accom.id}`} target='_blank' rel='noreferrer'>
                        <img className='accom-img' src={accom.img} alt={accom.img} />
                    </Link>

                    <img className='marker' src={marker0} alt={marker0} />

                    <div className="text-block flex">
                        <div className="text flex">
                            <h3 className="title">{accom.name}</h3>
                            {accom.is3stars === 1 && (
                                <div className="star 3star">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            )}
                            {accom.is4stars === 1 && (
                                <div className="star 4star">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            )}
                            {accom.is5stars === 1 && (
                                <div className="star 5star">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            )}
                            {accom.isHomestay === 1 && (
                                <div className="star homestay">
                                    <i className="fas fa-home" ></i>
                                </div>
                            )}
                        </div>
                        <div className="price flex">
                            <i className="far fa-money-bill-alt"></i>
                            {accom.price && numberWithCommas(accom.price)} VND/ per night
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
