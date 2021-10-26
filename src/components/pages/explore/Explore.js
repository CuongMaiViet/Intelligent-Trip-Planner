import React, { useContext, useState, useEffect, useRef } from "react";
import { Globalstate } from "../../../GlobalState";
import Loading from "../../loading/Loading";
import Navbar from '../../main-navbar/Navbar'
import { useContainerPosition, usePositioner, useResizeObserver, MasonryScroller } from "masonic";
import { Link, useParams } from 'react-router-dom'
// import useWindowScroll from '@react-hook/window-scroll'
import { useWindowSize } from "@react-hook/window-size"
import './Explore.scss'
import icon from './icon.png'
import Search from "../../feature/search/Search";

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
const AccomCard = ({ data: { id, name, img, price, is3stars, is4stars, is5stars, isHomestay } }) => (
    <div className="card" key={id}>
        <img className='likebutton' src={icon} alt="likebutton" />
        <Link to={`/accommodation/${id}`} target='_blank' rel='noreferrer'>
            <img className="img" alt={img} src={img} />
        </Link>
        <span className='name' children={name} />
        <span className="category">
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
        </span>
        <span className='price' children={`${numberWithCommas(price)} VND`} />
    </div>
);
const CuisineCard = ({ data: { id, name, img, category } }) => (
    <div className="card" key={id}>
        <img className='likebutton' src={icon} alt="likebutton" />

        <img className="img" alt={img} src={img} />

        <span children={name} />
        <span children={category} />
    </div>
);
const PlaceCard = ({ data: { id, name, img, category } }) => (
    <div className="card" key={id}>
        <img className='likebutton' src={icon} alt="likebutton" />
        <Link to={`/place/${id}`} target='_blank' rel='noreferrer'>
            <img className="img" alt={img} src={img} />
        </Link>
        <span children={name} />
        <span children={category} />
    </div>
);

export default function Explore(props) {
    const state = useContext(Globalstate)
    const [accoms] = state.accommodationAPI.accommodations
    const [cuisines] = state.cuisinesAPI.cuisines
    const [places] = state.haNoiPlaceAPI.hanoiplaces

    const { page } = useParams()
    const containerRef = useRef(null)
    const [items, setItems] = useState([]);
    const [windowWidth, windowHeight] = useWindowSize();
    const { offset, width } = useContainerPosition(containerRef, [
        windowWidth,
        windowHeight
    ]);

    const positioner = usePositioner(
        { width, columnWidth: 300, columnGutter: 20 }, [items]
    );

    const resizeObserver = useResizeObserver(positioner);

    useEffect(() => {
        if (page === 'accommodation') setItems(shuffleArray(accoms))
        if (page === 'cuisine') setItems(shuffleArray(cuisines))
        if (page === 'place') setItems(shuffleArray(places))
    }, [accoms, cuisines, places, page])

    return (
        <>
            <Navbar />
            <main className="container">
                {items.length === 0 && <Loading />}
                <div className="masonic">
                    {page === 'accommodation' &&
                        <header>
                            <h1>Accommodations in Hanoi</h1>
                        </header>
                    }
                    {page === 'place' &&
                        <header>
                            <h1>Attractions in Hanoi</h1>
                        </header>
                    }
                    {page === 'cuisine' &&
                        <header>
                            <h1>Cuisines in Hanoi</h1>

                        </header>
                    }
                    <Search page={page} />
                    {/* LAYOUT */}
                    {page === 'place' &&
                        <MasonryScroller
                            positioner={positioner}
                            resizeObserver={resizeObserver}
                            containerRef={containerRef}
                            items={items}
                            height={windowHeight}
                            offset={offset}
                            overscanBy={5}
                            render={PlaceCard}
                        />
                    }
                    {page === 'accommodation' &&
                        <MasonryScroller
                            positioner={positioner}
                            resizeObserver={resizeObserver}
                            containerRef={containerRef}
                            items={items}
                            height={windowHeight}
                            offset={offset}
                            overscanBy={5}
                            render={AccomCard}
                        />
                    }
                    {page === 'cuisine' &&
                        <MasonryScroller
                            positioner={positioner}
                            resizeObserver={resizeObserver}
                            containerRef={containerRef}
                            items={items}
                            height={windowHeight}
                            offset={offset}
                            overscanBy={5}
                            render={CuisineCard}
                        />
                    }
                </div>
            </main>
        </>
    )
}