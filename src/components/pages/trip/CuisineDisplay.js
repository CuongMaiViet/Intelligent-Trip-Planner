import React from 'react'
import './CuisineDisplay.scss'

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CuisineDisplay({ cuisine, marker }) {

    const { img, name, price, address, phone,
        isChinese, isIndian, isJapanese, isKorean, isThai, isVietnamese, isWestern } = cuisine

    return (
        <>
            <div className="cuisine-display-page">
                <div className="img">
                    <img className='cuisine-img' src={img} alt={img} />
                    <img className='marker' src={marker} alt={marker} />
                </div>

                <div className="basic-info">
                    <div className="name">{name}</div>
                    <div className="others flex">
                        <div className="oth address flex">
                            <i className="fas fa-map-marker-alt"></i>
                            {address}
                        </div>
                        <div className="oth phone flex">
                            <i className="fas fa-mobile-alt"></i>
                            {phone}
                        </div>
                        <div className="oth price flex">
                            <i className="far fa-money-bill-alt"></i>
                            {numberWithCommas(price)} VND
                        </div>
                        <div className="oth cate flex">
                            <i className="fas fa-utensils"></i>
                            {isChinese === 1 && <p>Chinese</p>}
                            {isIndian === 1 && <p>Indian</p>}
                            {isJapanese === 1 && <p>Japanese</p>}
                            {isKorean === 1 && <p>Korean</p>}
                            {isThai === 1 && <p>Thailand</p>}
                            {isVietnamese === 1 && <p>Vietnamese</p>}
                            {isWestern === 1 && <p>Western</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
