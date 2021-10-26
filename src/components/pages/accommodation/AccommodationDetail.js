import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Globalstate } from '../../../GlobalState'
import Navbar from '../../main-navbar/Navbar'
import Loading from '../../loading/Loading'
import './AccommodationDetail.scss'

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AccommodationDetail(props) {
    const state = useContext(Globalstate)
    const [accoms] = state.accommodationAPI.accommodations
    const [accom, setAccom] = useState([])
    const param = useParams()

    useEffect(() => {
        if (param.id) {
            accoms.forEach(data => {
                if (data.id == param.id) {
                    setAccom(data)
                }
            })
        }
    }, [param.id, accoms])

    const { name, address, img, phone, price, url,
        hasBreakfast, hasFreeCancel, hasKitchen, hasNoPrepayment,
        is3stars, is4stars, is5stars, isHomestay } = accom

    return (
        <>
            <div className="accom-detail">
                <Navbar />
                {accom.length === 0 && <Loading />}
                <div className="container">
                    <div className="section">
                        <div className="top-info">
                            <div className="title flex">
                                <h2 className="title-title flex">
                                    <p>{name}</p>
                                    <div className="category">
                                        {is3stars === 1 && (
                                            <div className="cate 3star">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        )}
                                        {is4stars === 1 && (
                                            <div className="cate 4star">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        )}
                                        {is5stars === 1 && (
                                            <div className="cate 5star">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        )}
                                        {isHomestay === 1 && (
                                            <div className="cate homestay">
                                                <i className="fas fa-home" ></i>
                                            </div>
                                        )}
                                    </div>
                                </h2>

                                <div className="price flex">
                                    <i className="far fa-money-bill-alt"></i>
                                    {price === 0 && <p>FREE</p>}
                                    {price > 0 && <p>{numberWithCommas(price)} VND</p>}
                                </div>
                            </div>

                            <div className="below-title">
                                <div className="basic-info flex">
                                    <div className="address flex">
                                        <i className="fas fa-map-marker-alt"></i> {address}
                                    </div>

                                    <div className="url flex">
                                        <i className="fas fa-external-link-alt"></i>
                                        <a href={url} target='_blank' rel="noreferrer">
                                            {url && url.substr(0, 23)}
                                        </a>
                                    </div>
                                </div>

                                <div className="other-info flex">
                                    <div className="phone flex">
                                        <i className="fas fa-mobile-alt"></i>
                                        {phone}
                                    </div>

                                    <div className="feature flex">
                                        {hasBreakfast === 1 && (
                                            <div className="feat flex">
                                                <i className="fas fa-utensils"></i>
                                                Serve Breakfast
                                            </div>
                                        )}
                                        {hasFreeCancel === 1 && (
                                            <div className="feat flex">
                                                <i className="far fa-handshake"></i>
                                                Free Cancel
                                            </div>
                                        )}
                                        {hasKitchen === 1 && (
                                            <div className="feat flex">
                                                <i className="fas fa-bread-slice"></i>
                                                Kitchen
                                            </div>
                                        )}
                                        {hasNoPrepayment === 1 && (
                                            <div className="feat flex">
                                                <i className="fas fa-check-square"></i>
                                                No Prepayment
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="content">
                            <div className="image-content">
                                <img src={img} alt={img} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
