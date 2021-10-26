import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Globalstate } from '../../../GlobalState'
import Loading from '../../loading/Loading'
import NavBar from '../../main-navbar/Navbar'
import './PlaceDetail.scss'

export default function PlaceDetail(props) {
    const state = useContext(Globalstate)
    const [places] = state.haNoiPlaceAPI.hanoiplaces
    const [place, setPlace] = useState([])
    const param = useParams()

    useEffect(() => {
        //get data from id
        if (param.id) {
            places.forEach(data => {
                if (data.id == param.id) {
                    setPlace(data)
                }
            })
        }
    }, [param.id, places])

    const { img, img1, img2, name, category, description, price, url, address, openingHours, phone,
        isAdventure, isHistorical, isMuseum, isNature, isPark, isReligious, isShopping, isUrban } = place

    return (
        <div className='detail-place'>
            {place.length === 0 && <Loading />}

            <NavBar />
            <div className="container">
                <div className="section">
                    <header className="top-info">
                        <h2 className="title">{name}</h2>

                        <div className="below-title flex">
                            <div className="basic-info flex">
                                <div className="city">
                                    <i className="fas fa-map-marker-alt"></i> Hanoi
                                </div>

                                <div className="category">
                                    <i className="fas fa-home"></i> {category}
                                </div>
                            </div>

                            <div className="btn flex">
                                <button className="share">
                                    <i className="far fa-share-square"></i> Share
                                </button>
                                <button className="save">
                                    <i className="far fa-heart"></i> Save
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="section">
                    <div className="content flex">
                        <div className="about-content">
                            <div className="hashtag">
                                {isAdventure === 1 && <p>#Adventure</p>}
                                {isHistorical === 1 && <p>#Historical</p>}
                                {isMuseum === 1 && <p>#Museum</p>}
                                {isNature === 1 && <p>#Nature</p>}
                                {isPark === 1 && <p>#Park</p>}
                                {isReligious === 1 && <p>#Religious</p>}
                                {isShopping === 1 && <p>#Shopping</p>}
                                {isUrban === 1 && <p>#Urban</p>}
                            </div>

                            <div className="description">
                                <h3>about</h3>
                                <p>{description}</p>
                            </div>

                            <div className="others flex">
                                <div className="other address">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <p>{address}</p>
                                </div>
                                <div className="other phone">
                                    <i className="fas fa-mobile-alt"></i>
                                    <p>{phone}</p>
                                </div>
                                <div className="other openingHours">
                                    <i className="far fa-clock"></i>
                                    <p>{openingHours}</p>
                                </div>
                                <div className="other price">
                                    <i className="far fa-money-bill-alt"></i>
                                    {price === 0 ? <p>FREE</p> : <p>{price} VND</p>}
                                </div>
                                <div className="other url">
                                    <i className="fas fa-external-link-alt"></i>
                                    <a href={url} target='_blank' rel="noreferrer">
                                        {url && url.substr(0, 28)}
                                    </a>
                                </div>
                            </div>

                        </div>

                        <div className="image-content flex">
                            <div className="big-img">
                                <img src={img} alt={img} />
                            </div>

                            <div className="small-img">
                                <div className="small-img-top">
                                    <img src={img1} alt={img1} />
                                </div>
                                <div className="small-img-bottom">
                                    <img src={img2} alt={img2} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
