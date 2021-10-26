import React, { useContext, useEffect, useState } from 'react'
import { Globalstate } from '../../../GlobalState'
import GetTrip from './GetTrip'
import Navbar from '../../main-navbar/Navbar'
import './CreateTrip.scss'
import Loading from '../../loading/Loading'
import Slider from '@material-ui/core/Slider';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    startDate: '',
    endDate: ''
}

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const maxprice = (value) => {
    return `${numberWithCommas(value * 10000)}VND`;
}
// const minprice = (value) => {
//     return `${numberWithCommas(value * 10000)}VND`;
// }

toast.configure()
export default function CreateTrip(props) {
    const state = useContext(Globalstate)
    //trip API
    const [callback, setCallBack] = state.tripAPI.callback
    const [placeLimit, setPlaceLimit] = state.tripAPI.placeLimit
    const [placeParam, setPlaceParam] = state.tripAPI.placeParam
    const [cuisineLimit, setCuisineLimit] = state.tripAPI.cuisineLimit
    const [priceRange, setPriceRange] = state.tripAPI.priceRange
    const [accomCate, setAccomCate] = state.tripAPI.accomCate
    const [cuisineParam, setCuisineParam] = state.tripAPI.cuisineParam
    //interest API
    const [interest] = state.interestAPI.interests
    //user API
    const [info] = state.userInfoAPI.info
    const [auth] = state.userInfoAPI.auth
    //modal
    const [modal, setModal] = useState(initialState)
    //others
    const [changePage, setChangePage] = useState(false)
    const [toggle, setToggole] = useState(false)

    //calculate date
    var currentDateTo_ISO_String = new Date()
    var i = currentDateTo_ISO_String.valueOf() + 86400000
    currentDateTo_ISO_String = new Date(i)
    const calculateDateLength = () => {
        var startDate = new Date(modal.startDate)
        var endDate = new Date(modal.endDate)
        var different_in_time = endDate - startDate// number of days in second
        var different_in_days = different_in_time / (1000 * 3600 * 24) + 1 //number of days in day
        var placeLimit = different_in_days * 3 // three places per day

        setPlaceLimit(placeLimit)
        setCuisineLimit(different_in_days) //because 2 meals per day
        return 0
    }

    //save select param to session storage
    const saveSessionStorage = () => {
        //condition to book a trip
        if (placeParam.length < 3) return toast.warning("Please choose at least 3 interests.")
        if (modal.startDate === '') return toast.warning('Please choose date to go.')
        if (modal.endDate === '') return toast.warning('Please choose date to go back.')
        if (accomCate === '') return toast.warning('Please choose accommodation to stay.')
        if (cuisineParam.length < 1) return toast.warning("Please choose at least 1 cuisine.")

        const params = {
            startDate: modal.startDate,
            endDate: modal.endDate,
            placeParam: placeParam,
            placeLimit: placeLimit,
            cuisineLimit: cuisineLimit,
            priceRange: priceRange,
            accomCate: accomCate,
            cuisineParam: cuisineParam
        }
        window.sessionStorage.setItem('item', JSON.stringify(params))
        setCallBack(!callback)
        setChangePage(true)
    }

    //handle onChange value
    const onChangeValue = e => {
        if (e.target.checked === true) {
            setPlaceParam([...placeParam, e.target.value])
        }
        else {
            const selectedValue = placeParam.filter(a => {
                if (a === e.target.value) return false;
                return true;
            })
            setPlaceParam([...selectedValue])
        }
    }
    const onChangeCuisineValue = e => {
        if (e.target.checked === true) {
            setCuisineParam([...cuisineParam, e.target.value])
        }
        else {
            const selectedValue = cuisineParam.filter(a => {
                if (a === e.target.value) return false;
                return true;
            })
            setCuisineParam([...selectedValue])
        }
    }
    const handleChange = e => {
        const { name, value } = e.target
        setModal({ ...modal, [name]: value })
    }
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    //use effect
    useEffect(() => {
        //function
        calculateDateLength()

        //if login and user already chose the interests then execute func
        if (info.interests && info.interests.length > 0) {
            setToggole(true)
            let tempInterests = []
            for (let i = 0; i < info.interests.length; i++) {
                tempInterests.push(info.interests[i].name)
                setPlaceParam(tempInterests);
            }
        }

        //sessionStorage
        if (window.sessionStorage.getItem('item')) {
            setChangePage(true)
            setCallBack(!callback)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal.startDate, modal.endDate, accomCate, info.interests])

    return (
        <div className='trip-page'>
            {changePage ? (
                <div className="get-trip">
                    <GetTrip placeLimit={placeLimit}
                        startDate={modal.startDate}
                        endDate={modal.endDate}
                    />
                </div>
            ) : (
                <>
                    <Navbar />
                    <div className="create-trip">
                        {interest.length === 0 && <Loading />}
                        {info.interests && info.interests.length === 0 && <Loading />}
                        {!auth && (
                            <div className={toggle ? "section interest active" : "section interest"}>
                                {interest.map(p => (
                                    <div className="interest-checkbox" key={p.id}>
                                        <label className="image-interest" htmlFor={p.id}>
                                            <img src={p.img} alt={p.img} />
                                            <div className='toggle' htmlFor={p.id}>
                                                <p className="name">
                                                    {p.name && p.name.substr(2)}
                                                </p>
                                                <input type="checkbox" name={p.name} id={p.id}
                                                    value={p.name}
                                                    onChange={onChangeValue} />
                                                <div className="slider"></div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                                <button className='next-to-date' onClick={() => {
                                    if (placeParam.length < 3) return toast.warning("Please choose at least 3 interests.")
                                    setToggole(true)
                                }}>
                                    <i className="fas fa-long-arrow-alt-right"></i>
                                </button>
                            </div>
                        )}
                        <div className={toggle ? "section other active" : "section other"}>
                            <div className="checkin-checkout">
                                <label className='other-title' htmlFor="">
                                    <i className="fas fa-check-square"></i>
                                    Dates
                                </label>
                                <div className="start-end-date">
                                    <div className="start-date">
                                        <input type="date" name="startDate" id="startDate"
                                            value={modal.startDate} onChange={handleChange}
                                            min={currentDateTo_ISO_String.toISOString().split('T')[0]}
                                            required />
                                    </div>
                                    <div className="end-date">
                                        <input type="date" name="endDate" id="endDate"
                                            value={modal.endDate} onChange={handleChange}
                                            disabled={!modal.startDate}
                                            min={modal.startDate}
                                            required />
                                    </div>
                                </div>
                            </div>
                            <div className="accom-selector">
                                <label className='other-title' htmlFor="">
                                    <i className="fas fa-store-alt"></i>
                                    Accommodation
                                </label>
                                <div className="acommodation">
                                    <div className="accom-category">
                                        <select name="accomCate" id="accomCate"
                                            value={accomCate} required
                                            onChange={e => setAccomCate(e.target.value)}>
                                            <option value=''>Accommodation Types</option>
                                            <option value="is3stars">
                                                3 Stars
                                            </option>
                                            <option value="is4stars">
                                                4 Stars
                                            </option>
                                            <option value="is5stars">
                                                5 Stars
                                            </option>
                                            <option value="isHomestay">Homestay</option>
                                        </select>
                                    </div>
                                    <div className="slider">
                                        {accomCate !== '' && (
                                            <>
                                                <Slider
                                                    value={priceRange}
                                                    onChange={handlePriceChange}
                                                    valueLabelDisplay="auto"
                                                />
                                                <div className="slider-price-range">
                                                    {/* <div className="min">
                                                <p>MIN:</p> {minprice(priceRange[0] * 5)}
                                            </div> */}
                                                    <div className="max">
                                                        <p>Price:</p> {maxprice(priceRange * 10)}
                                                    </div>
                                                    <div className="min">
                                                        *Note: price per night
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* {accomCate === 'is3stars' && (
                                            <div className="slider-price-range">
                                                <div className="min">
                                                    <p>MIN:</p> {minprice(priceRange[0] * 10)}
                                                </div>
                                                <div className="max">
                                                    <p>MAX:</p> {maxprice(priceRange[1] * 10)}
                                                </div>
                                            </div>
                                        )}
                                        {accomCate === 'is4stars' && (
                                            <div className="slider-price-range">
                                                <div className="min">
                                                    <p>MIN:</p> {minprice(priceRange[0] * 20)}
                                                </div>
                                                <div className="max">
                                                    <p>MAX:</p> {maxprice(priceRange[1] * 20)}
                                                </div>
                                            </div>
                                        )}
                                        {accomCate === 'is5stars' && (
                                            <div className="slider-price-range">
                                                <div className="min">
                                                    <p>MIN:</p> {minprice(priceRange[0] * 50)}
                                                </div>
                                                <div className="max">
                                                    <p>MAX:</p> {maxprice(priceRange[1] * 50)}
                                                </div>
                                            </div>
                                        )}
                                        {accomCate === 'isHomestay' && (
                                            <div className="slider-price-range">
                                                <div className="min">
                                                    <p>MIN:</p> {minprice(priceRange[0])}
                                                </div>
                                                <div className="max">
                                                    <p>MAX:</p> {maxprice(priceRange[1] * 20)}
                                                </div>
                                            </div>
                                        )} */}

                                    </div>
                                </div>
                            </div>
                            <div className="cuisines">
                                <label className='other-title' htmlFor="">
                                    <i className="fas fa-utensils"></i>
                                    Cuisine Preferences
                                </label>
                                <div className="cuisine">
                                    <div className="togg left">
                                        <label className='toggle' htmlFor="isChinese">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBkPSJNNDczLjY1NSw4OC4yNzVIMzguMzQ1QzE3LjE2Nyw4OC4yNzUsMCwxMDUuNDQyLDAsMTI2LjYyVjM4NS4zOA0KCWMwLDIxLjE3NywxNy4xNjcsMzguMzQ1LDM4LjM0NSwzOC4zNDVoNDM1LjMxYzIxLjE3NywwLDM4LjM0NS0xNy4xNjcsMzguMzQ1LTM4LjM0NVYxMjYuNjINCglDNTEyLDEwNS40NDIsNDk0LjgzMyw4OC4yNzUsNDczLjY1NSw4OC4yNzV6Ii8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTg1LjAwNywxNDAuNzMxbDguNDE2LDI1LjIzNGwyNi42LDAuMjA2YzMuNDQ0LDAuMDI2LDQuODcyLDQuNDIyLDIuMTAxLDYuNDY3bC0yMS4zOTgsMTUuODAxDQoJCWw4LjAyMywyNS4zNjJjMS4wMzgsMy4yODQtMi43LDUuOTk5LTUuNTAyLDMuOTk3bC0yMS42NC0xNS40NjlsLTIxLjY0LDE1LjQ2OGMtMi44MDIsMi4wMDMtNi41NC0wLjcxNC01LjUwMi0zLjk5N2w4LjAyMy0yNS4zNjINCgkJbC0yMS4zOTgtMTUuOGMtMi43NzEtMi4wNDYtMS4zNDMtNi40NDEsMi4xMDEtNi40NjdsMjYuNi0wLjIwNmw4LjQxNi0yNS4yMzRDNzkuMjk3LDEzNy40NjQsODMuOTE4LDEzNy40NjQsODUuMDA3LDE0MC43MzF6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGQ9Ik0xODEuNTk5LDE0Ni45NDlsNi4wMzUsOC4yMjhsOS43MzktMy4wNDZjMS4yNjEtMC4zOTQsMi4yOTgsMS4wNDQsMS41MjYsMi4xMTVsLTUuOTYyLDguMjgxDQoJCWw1LjkwNiw4LjMyMWMwLjc2NSwxLjA3Ny0wLjI4MiwyLjUwOC0xLjU0LDIuMTA1bC05LjcxOS0zLjExMWwtNi4wODksOC4xODljLTAuNzg4LDEuMDYtMi40NzMsMC41MDYtMi40NzgtMC44MTRsLTAuMDQ1LTEwLjIwNQ0KCQlsLTkuNjctMy4yNjFjLTEuMjUyLTAuNDIzLTEuMjQ2LTIuMTk1LDAuMDA5LTIuNjA5bDkuNjktMy4xOTZsMC4xMTQtMTAuMjA0QzE3OS4xMjksMTQ2LjQyNSwxODAuODE4LDE0NS44ODQsMTgxLjU5OSwxNDYuOTQ5eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMTQ0Ljg1NywxMjIuNDE5bDEwLjE0NCwxLjEwMmw0LjMyOC05LjI0MWMwLjU2MS0xLjE5NiwyLjMyMi0wLjk5MSwyLjU5MSwwLjMwMmwyLjA4Niw5Ljk4OA0KCQlsMTAuMTI2LDEuMjZjMS4zMTEsMC4xNjMsMS42NiwxLjkwMSwwLjUxMywyLjU1OGwtOC44NTUsNS4wN2wxLjkzMSwxMC4wMmMwLjI1LDEuMjk4LTEuMjk1LDIuMTY2LTIuMjc0LDEuMjc5bC03LjU1OS02Ljg1NQ0KCQlsLTguOTMyLDQuOTMyYy0xLjE1NiwwLjYzOS0yLjQ2MS0wLjU2My0xLjkxOS0xLjc2OGw0LjE4My05LjMwOGwtNy40NTItNi45NzJDMTQyLjgwNSwxMjMuODg4LDE0My41NDQsMTIyLjI3NywxNDQuODU3LDEyMi40MTl6Ig0KCQkvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMTYwLjg5NSwyMjEuMzEzbC02LjAzNCw4LjIzbC05LjczOS0zLjA0NmMtMS4yNjEtMC4zOTQtMi4yOTgsMS4wNDMtMS41MjYsMi4xMTVsNS45NjIsOC4yODENCgkJbC01LjkwNiw4LjMyMWMtMC43NjUsMS4wNzcsMC4yODIsMi41MDgsMS41NCwyLjEwNWw5LjcxOC0zLjExMWw2LjA4OSw4LjE4OWMwLjc4OCwxLjA2LDIuNDczLDAuNTA2LDIuNDc4LTAuODE0bDAuMDQ1LTEwLjIwNQ0KCQlsOS42Ny0zLjI2MWMxLjI1Mi0wLjQyMywxLjI0Ni0yLjE5NS0wLjAwOS0yLjYwOWwtOS42OS0zLjE5NmwtMC4xMTQtMTAuMjA0QzE2My4zNjMsMjIwLjc4OSwxNjEuNjc2LDIyMC4yNDcsMTYwLjg5NSwyMjEuMzEzeiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMTk3LjYzNSwxOTguMjYxbC0xMC4xNDUsMS4xMDJsLTQuMzI4LTkuMjQxYy0wLjU2MS0xLjE5Ni0yLjMyMS0wLjk5MS0yLjU5MSwwLjMwMmwtMi4wODcsOS45ODgNCgkJbC0xMC4xMjYsMS4yNmMtMS4zMTEsMC4xNjMtMS42NiwxLjkwMS0wLjUxMywyLjU1OGw4Ljg1NSw1LjA3bC0xLjkzMSwxMC4wMmMtMC4yNSwxLjI5OCwxLjI5NSwyLjE2NiwyLjI3NCwxLjI3OWw3LjU1OS02Ljg1NQ0KCQlsOC45MzIsNC45MzJjMS4xNTYsMC42MzksMi40NjEtMC41NjMsMS45MTktMS43NjhsLTQuMTgzLTkuMzA4bDcuNDUyLTYuOTcyQzE5OS42ODksMTk5LjczLDE5OC45NSwxOTguMTE5LDE5Ny42MzUsMTk4LjI2MXoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" alt="alter" />
                                                Chinese
                                            </p>
                                            <input type="checkbox" name='isChinese' id='isChinese'
                                                value='isChinese' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>

                                        <label className='toggle' htmlFor="isIndian">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGQUI0NDY7IiBkPSJNNDczLjY1NSw4OC4yNzZIMzguMzQ1QzE3LjE2Nyw4OC4yNzYsMCwxMDUuNDQzLDAsMTI2LjYyMXY3My40NzFoNTEydi03My40NzENCglDNTEyLDEwNS40NDMsNDk0LjgzMyw4OC4yNzYsNDczLjY1NSw4OC4yNzZ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojNzNBRjAwOyIgZD0iTTAsMzg1LjM3OWMwLDIxLjE3NywxNy4xNjcsMzguMzQ1LDM4LjM0NSwzOC4zNDVoNDM1LjMxYzIxLjE3NywwLDM4LjM0NS0xNy4xNjcsMzguMzQ1LTM4LjM0NQ0KCXYtNzMuNDcxSDBWMzg1LjM3OXoiLz4NCjxyZWN0IHk9IjIwMC4wOSIgc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIHdpZHRoPSI1MTIiIGhlaWdodD0iMTExLjgxIi8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDE0NzlCOyIgZD0iTTI1NiwzMDMuNDQ4Yy0yNi4xNjQsMC00Ny40NDgtMjEuMjg0LTQ3LjQ0OC00Ny40NDhzMjEuMjg0LTQ3LjQ0OCw0Ny40NDgtNDcuNDQ4DQoJCXM0Ny40NDgsMjEuMjg0LDQ3LjQ0OCw0Ny40NDhTMjgyLjE2NCwzMDMuNDQ4LDI1NiwzMDMuNDQ4eiBNMjU2LDIxNy4zNzljLTIxLjI5OCwwLTM4LjYyMSwxNy4zMjMtMzguNjIxLDM4LjYyMQ0KCQlzMTcuMzIzLDM4LjYyMSwzOC42MjEsMzguNjIxczM4LjYyMS0xNy4zMjMsMzguNjIxLTM4LjYyMVMyNzcuMjk4LDIxNy4zNzksMjU2LDIxNy4zNzl6Ii8+DQoJPGNpcmNsZSBzdHlsZT0iZmlsbDojNDE0NzlCOyIgY3g9IjI1NiIgY3k9IjI1NiIgcj0iNS4zNzkiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgcG9pbnRzPSIyNTYsMjU2LjgwNyAyNDIuMzMsMjU4LjE4NyAyMTIuOTY2LDI1Ni44MDcgMjEyLjk2NiwyNTUuMTkzIDI0Mi4zMywyNTMuODEzIDI1NiwyNTUuMTkzIAkNCgkJIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzQxNDc5QjsiIHBvaW50cz0iMjU2LDI1Ni44MDcgMjY5LjY3LDI1OC4xODcgMjk5LjAzNCwyNTYuODA3IDI5OS4wMzQsMjU1LjE5MyAyNjkuNjcsMjUzLjgxMyAyNTYsMjU1LjE5MyAJDQoJCSIvPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBwb2ludHM9IjI1NS4xOTMsMjU2IDI1My44MTMsMjQyLjMzIDI1NS4xOTMsMjEyLjk2NiAyNTYuODA3LDIxMi45NjYgMjU4LjE4NywyNDIuMzMgMjU2LjgwNywyNTYgCQ0KCQkiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgcG9pbnRzPSIyNTUuMTkzLDI1NiAyNTMuODEzLDI2OS42NyAyNTUuMTkzLDI5OS4wMzQgMjU2LjgwNywyOTkuMDM0IDI1OC4xODcsMjY5LjY3IDI1Ni44MDcsMjU2IAkNCgkJIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzQxNDc5QjsiIHBvaW50cz0iMjU1LjQzLDI1Ni41NyAyNDQuNzg4LDI0Ny44ODEgMjI1LDIyNi4xNDEgMjI2LjE0MSwyMjUgMjQ3Ljg4MSwyNDQuNzg4IDI1Ni41NywyNTUuNDMgCSIvPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBwb2ludHM9IjI1NS40MywyNTYuNTcgMjY0LjExOSwyNjcuMjEyIDI4NS44NTksMjg3IDI4NywyODUuODU5IDI2Ny4yMTIsMjY0LjExOSAyNTYuNTcsMjU1LjQzIAkiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgcG9pbnRzPSIyNTUuNDMsMjU1LjQzIDI2NC4xMTksMjQ0Ljc4OCAyODUuODU5LDIyNSAyODcsMjI2LjE0MSAyNjcuMjEyLDI0Ny44ODEgMjU2LjU3LDI1Ni41NyAJIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzQxNDc5QjsiIHBvaW50cz0iMjU1LjQzLDI1NS40MyAyNDQuNzg4LDI2NC4xMTkgMjI1LDI4NS44NTkgMjI2LjE0MSwyODcgMjQ3Ljg4MSwyNjcuMjEyIDI1Ni41NywyNTYuNTcgCSIvPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBwb2ludHM9IjI1Ni4zMDksMjU2Ljc0NiAyNDQuMjA3LDI2My4yNTIgMjE2LjU1MSwyNzMuMjE0IDIxNS45MzMsMjcxLjcyMyAyNDIuNTM0LDI1OS4yMTEgDQoJCTI1NS42OTEsMjU1LjI1NCAJIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzQxNDc5QjsiIHBvaW50cz0iMjU2LjMwOSwyNTYuNzQ2IDI2OS40NjYsMjUyLjc4OSAyOTYuMDY3LDI0MC4yNzcgMjk1LjQ0OSwyMzguNzg2IDI2Ny43OTMsMjQ4Ljc0OCANCgkJMjU1LjY5MSwyNTUuMjU0IAkiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgcG9pbnRzPSIyNTUuMjU0LDI1Ni4zMDkgMjQ4Ljc0OCwyNDQuMjA3IDIzOC43ODYsMjE2LjU1MSAyNDAuMjc3LDIxNS45MzMgMjUyLjc4OSwyNDIuNTM0IA0KCQkyNTYuNzQ2LDI1NS42OTEgCSIvPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBwb2ludHM9IjI1NS4yNTQsMjU2LjMwOSAyNTkuMjExLDI2OS40NjYgMjcxLjcyMywyOTYuMDY3IDI3My4yMTQsMjk1LjQ0OSAyNjMuMjUyLDI2Ny43OTMgDQoJCTI1Ni43NDYsMjU1LjY5MSAJIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzQxNDc5QjsiIHBvaW50cz0iMjU1LjY5MSwyNTYuNzQ2IDI0Mi41MzQsMjUyLjc4OSAyMTUuOTMzLDI0MC4yNzcgMjE2LjU1MSwyMzguNzg2IDI0NC4yMDcsMjQ4Ljc0OCANCgkJMjU2LjMwOSwyNTUuMjU0IAkiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgcG9pbnRzPSIyNTUuNjkxLDI1Ni43NDYgMjY3Ljc5MywyNjMuMjUyIDI5NS40NDksMjczLjIxNCAyOTYuMDY3LDI3MS43MjMgMjY5LjQ2NiwyNTkuMjExIA0KCQkyNTYuMzA5LDI1NS4yNTQgCSIvPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBwb2ludHM9IjI1NS4yNTQsMjU1LjY5MSAyNTkuMjExLDI0Mi41MzQgMjcxLjcyMywyMTUuOTMzIDI3My4yMTQsMjE2LjU1MSAyNjMuMjUyLDI0NC4yMDcgDQoJCTI1Ni43NDYsMjU2LjMwOSAJIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzQxNDc5QjsiIHBvaW50cz0iMjU1LjI1NCwyNTUuNjkxIDI0OC43NDgsMjY3Ljc5MyAyMzguNzg2LDI5NS40NDkgMjQwLjI3NywyOTYuMDY3IDI1Mi43ODksMjY5LjQ2NiANCgkJMjU2Ljc0NiwyNTYuMzA5IAkiLz4NCjwvZz4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjcuMjU2Ii8+DQo8Y2lyY2xlIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBjeD0iMjU2IiBjeT0iMjU2IiByPSI0LjM1MSIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" alt="alter" />
                                                Indian
                                            </p>
                                            <input type="checkbox" name='isIndian' id='isIndian'
                                                value='isIndian' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>

                                        <label className='toggle' htmlFor="isJapanese">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNNDczLjY1NSw4OC4yNzVIMzguMzQ1QzE3LjE2Nyw4OC4yNzUsMCwxMDUuNDQyLDAsMTI2LjYyVjM4NS4zOA0KCWMwLDIxLjE3NywxNy4xNjcsMzguMzQ1LDM4LjM0NSwzOC4zNDVoNDM1LjMxYzIxLjE3NywwLDM4LjM0NS0xNy4xNjcsMzguMzQ1LTM4LjM0NVYxMjYuNjINCglDNTEyLDEwNS40NDIsNDk0LjgzMyw4OC4yNzUsNDczLjY1NSw4OC4yNzV6Ii8+DQo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBjeD0iMjU2IiBjeT0iMjU1Ljk5OSIgcj0iOTcuMSIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" alt="alter" />
                                                Japanese
                                            </p>
                                            <input type="checkbox" name='isJapanese' id='isJapanese'
                                                value='isJapanese' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>

                                        <label className='toggle' htmlFor="isKorean">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNNDczLjY1NSw4OC4yNzVIMzguMzQ1QzE3LjE2Nyw4OC4yNzUsMCwxMDUuNDQyLDAsMTI2LjYyVjM4NS4zOA0KCWMwLDIxLjE3NywxNy4xNjcsMzguMzQ1LDM4LjM0NSwzOC4zNDVoNDM1LjMxYzIxLjE3NywwLDM4LjM0NS0xNy4xNjcsMzguMzQ1LTM4LjM0NVYxMjYuNjINCglDNTEyLDEwNS40NDIsNDk0LjgzMyw4OC4yNzUsNDczLjY1NSw4OC4yNzV6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTMwNS4wMDksMTgyLjUzMWMtNDAuNTYzLTI3LjA0Mi05NS4zNS0xNS45ODYtMTIyLjM3NCwyNC41MDYNCgljLTEzLjU1NSwyMC4yMTEtOC4wNDUsNDcuNjc0LDEyLjIzNSw2MS4xOTVjMjAuMjY1LDEzLjUyMSw0Ny42NCw4LjAzLDYxLjE2MS0xMi4yNTJjMTMuNTIxLTIwLjI4MSw0MC45MTQtMjUuNzA0LDYxLjE3OC0xMi4yNTQNCgljMjAuMjk4LDEzLjUyMSwyNS43NTcsNDAuOTg0LDEyLjIxNyw2MS4xOTVDMzU2LjQ2OCwyNjQuMzYyLDM0NS41MzcsMjA5LjU3NCwzMDUuMDA5LDE4Mi41MzEiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBkPSJNMTgyLjYzNCwyMDcuMDM4Yy0xMy41NTUsMjAuMjExLTguMDQ1LDQ3LjY3NCwxMi4yMzUsNjEuMTk1YzIwLjI2NSwxMy41MjEsNDcuNjQsOC4wMyw2MS4xNjEtMTIuMjUyDQoJYzEzLjUyMS0yMC4yODEsNDAuOTE0LTI1LjcwNCw2MS4xNzgtMTIuMjU0YzIwLjI5OCwxMy41MjEsMjUuNzU3LDQwLjk4NCwxMi4yMTcsNjEuMTk1DQoJYy0yNy4wMDYsNDAuNjMyLTgxLjc3NSw1MS41NDktMTIyLjMzOCwyNC41MDdDMTY2LjU2MSwzMDIuMzksMTU1LjU5MywyNDcuNjAyLDE4Mi42MzQsMjA3LjAzOCIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzQ2NDY1NTsiIGQ9Ik0zNDkuOTIsMTQ5LjE4OWwxNi4wMzUsMjQuMTAyYzEuMzQ3LDIuMDI1LDAuODAyLDQuNzU5LTEuMjE5LDYuMTEybC00LjA2NiwyLjcyMw0KCQljLTIuMDI5LDEuMzU4LTQuNzc1LDAuODEyLTYuMTI5LTEuMjJsLTE2LjA1NS0yNC4wOTZjLTEuMzUxLTIuMDI3LTAuODAzLTQuNzY2LDEuMjIzLTYuMTE5bDQuMDg2LTIuNzI4DQoJCUMzNDUuODI1LDE0Ni42MDgsMzQ4LjU2OCwxNDcuMTU4LDM0OS45MiwxNDkuMTg5eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM0NjQ2NTU7IiBkPSJNMzc0LjY2LDE4Ni4zNWwxNi4wODcsMjQuMDg3YzEuMzU4LDIuMDM0LDAuODA0LDQuNzg2LTEuMjM3LDYuMTM0bC00LjA4NCwyLjY5OQ0KCQljLTIuMDI2LDEuMzQtNC43NTQsMC43ODktNi4xMDMtMS4yM2wtMTYuMDc4LTI0LjA2MmMtMS4zNTQtMi4wMjYtMC44MS00Ljc2NywxLjIxNy02LjEyMmw0LjA3NS0yLjcyNA0KCQlDMzcwLjU2MywxODMuNzc3LDM3My4zMDUsMTg0LjMyMiwzNzQuNjYsMTg2LjM1eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM0NjQ2NTU7IiBkPSJNMzY3LjA4OSwxMzcuNzMxbDQwLjgyOSw2MS4yNzNjMS4zNTIsMi4wMjgsMC44MDMsNC43NjgtMS4yMjUsNi4xMmwtNC4xMDIsMi43MzQNCgkJYy0yLjAyOCwxLjM1Mi00Ljc2OSwwLjgwNC02LjEyMS0xLjIyNGwtNDAuODQzLTYxLjI2OWMtMS4zNTMtMi4wMjktMC44MDMtNC43NzEsMS4yMjctNi4xMjNsNC4xMTUtMi43MzkNCgkJQzM2Mi45OTgsMTM1LjE1NiwzNjUuNzM3LDEzNS43MDMsMzY3LjA4OSwxMzcuNzMxeiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM0NjQ2NTU7IiBkPSJNMzg0LjIxMSwxMjYuMjkxbDE2LjA3LDI0LjE0OWMxLjM1NCwyLjAzNCwwLjc5OCw0Ljc4LTEuMjQxLDYuMTI3bC00LjA4NywyLjcNCgkJYy0yLjAyOCwxLjM0LTQuNzU3LDAuNzg5LTYuMTA1LTEuMjM0bC0xNi4wODItMjQuMTE3Yy0xLjM1My0yLjAyOC0wLjgwNC00Ljc2OSwxLjIyNC02LjEyMmw0LjA5OS0yLjczMg0KCQlDMzgwLjExNywxMjMuNzEsMzgyLjg1OSwxMjQuMjU5LDM4NC4yMTEsMTI2LjI5MXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTQwOC45NjcsMTYzLjUzMWwxNi4wNDUsMjQuMDk5YzEuMzUsMi4wMjYsMC44MDMsNC43NjItMS4yMiw2LjExNWwtNC4wNzUsMi43MjQNCgkJYy0yLjAyOSwxLjM1Ni00Ljc3NSwwLjgwOS02LjEyNy0xLjIyM2wtMTYuMDQ1LTI0LjA5OWMtMS4zNDktMi4wMjYtMC44MDMtNC43NjIsMS4yMi02LjExNWw0LjA3NS0yLjcyNA0KCQlDNDA0Ljg3LDE2MC45NTEsNDA3LjYxNCwxNjEuNDk3LDQwOC45NjcsMTYzLjUzMXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTEzMi43MjEsMjkzLjk4Mmw0MC44MjQsNjEuMjA3YzEuMzUyLDIuMDI3LDAuODA2LDQuNzY3LTEuMjIyLDYuMTJsLTQuMDg4LDIuNzMNCgkJYy0yLjAyOCwxLjM1NC00Ljc2OSwwLjgwNy02LjEyMy0xLjIyMmwtNDAuODI0LTYxLjIwN2MtMS4zNTMtMi4wMjctMC44MDYtNC43NjcsMS4yMjItNi4xMmw0LjA4OS0yLjczDQoJCUMxMjguNjI2LDI5MS40MDYsMTMxLjM2OCwyOTEuOTUzLDEzMi43MjEsMjkzLjk4MnoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTExNS41ODIsMzA1LjQzbDE2LjAyOCwyNC4wNDFjMS4zNTEsMi4wMjYsMC44MDYsNC43NjEtMS4yMTcsNi4xMTZsLTQuMDY2LDIuNzIyDQoJCWMtMi4wMjcsMS4zNTctNC43NzEsMC44MTItNi4xMjYtMS4yMTdsLTE2LjA0Ny0yNC4wMzVjLTEuMzU0LTIuMDI3LTAuODA4LTQuNzY4LDEuMjItNi4xMjJsNC4wODYtMi43MjgNCgkJQzExMS40ODcsMzAyLjg1NCwxMTQuMjI5LDMwMy40MDEsMTE1LjU4MiwzMDUuNDN6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzQ2NDY1NTsiIGQ9Ik0xNDAuMzUxLDM0Mi42MDRsMTYuMDQ2LDI0LjEwMmMxLjM1LDIuMDI2LDAuODAzLDQuNzYzLTEuMjIyLDYuMTE1bC00LjA3OCwyLjcyNw0KCQljLTIuMDI5LDEuMzU2LTQuNzcyLDAuODA5LTYuMTI2LTEuMjIybC0xNi4wNTYtMjQuMDk3Yy0xLjM1MS0yLjAyNy0wLjgwNC00Ljc2NiwxLjIyMi02LjExOGw0LjA4OC0yLjczDQoJCUMxMzYuMjU1LDM0MC4wMjQsMTM4Ljk5OCwzNDAuNTczLDE0MC4zNTEsMzQyLjYwNHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTk4LjQ0MiwzMTYuODc1bDQwLjc5OCw2MS4yMWMxLjM1MSwyLjAyNiwwLjgwNCw0Ljc2NC0xLjIxOSw2LjExOGwtNC4wNzcsMi43MjYNCgkJYy0yLjAyOCwxLjM1Ni00Ljc3MSwwLjgwOS02LjEyNS0xLjIybC00MC44MjItNjEuMjAyYy0xLjM1My0yLjAyOC0wLjgwNC00Ljc2OSwxLjIyNC02LjEyMmw0LjEwMi0yLjczNA0KCQlDOTQuMzQ5LDMxNC4yOTksOTcuMDksMzE0Ljg0Nyw5OC40NDIsMzE2Ljg3NXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTEyMS4yOTQsMjEwLjQ0MWw0MC44MTgtNjEuMjU3YzEuMzUzLTIuMDMsNC4wOTUtMi41NzgsNi4xMjQtMS4yMjRsNC4wODcsMi43MjkNCgkJYzIuMDI3LDEuMzUzLDIuNTczLDQuMDkzLDEuMjIyLDYuMTJsLTQwLjgzNCw2MS4yMjNjLTEuMzUsMi4wMjMtNC4wODEsMi41NzMtNi4xMDgsMS4yMzFsLTQuMDcxLTIuNjk1DQoJCUMxMjAuNDk0LDIxNS4yMiwxMTkuOTQsMjEyLjQ3MywxMjEuMjk0LDIxMC40NDF6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzQ2NDY1NTsiIGQ9Ik0xMDQuMTQ3LDE5OS4wMDhsNDAuODI1LTYxLjI2OWMxLjM1My0yLjAzLDQuMDk3LTIuNTc4LDYuMTI2LTEuMjIybDQuMDc3LDIuNzI2DQoJCWMyLjAyNCwxLjM1MywyLjU3LDQuMDksMS4yMiw2LjExNmwtNDAuODE0LDYxLjI3MmMtMS4zNTMsMi4wMy00LjA5NSwyLjU3OS02LjEyNCwxLjIyNGwtNC4wODgtMi43MjkNCgkJQzEwMy4zNDMsMjAzLjc3NCwxMDIuNzk2LDIwMS4wMzUsMTA0LjE0NywxOTkuMDA4eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM0NjQ2NTU7IiBkPSJNODYuOTksMTg3LjYyNGw0MC44MjktNjEuMzNjMS4zNTMtMi4wMzEsNC4wOTgtMi41OCw2LjEyNy0xLjIyNGw0LjA3NywyLjcyNg0KCQljMi4wMjMsMS4zNTMsMi41Nyw0LjA4NywxLjIyMiw2LjExNGwtNDAuODA0LDYxLjMzOWMtMS4zNTEsMi4wMy00LjA5NCwyLjU4MS02LjEyMywxLjIyOGwtNC4xLTIuNzM0DQoJCUM4Ni4xODksMTkyLjM5MSw4NS42NDEsMTg5LjY1Miw4Ni45OSwxODcuNjI0eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM0NjQ2NTU7IiBkPSJNMzM4LjQ5MywzNTUuMTg4bDE2LjA0Ny0yNC4wMzVjMS4zNTUtMi4wMjksNC4wOTktMi41NzQsNi4xMjYtMS4yMTdsNC4wNjYsMi43MjINCgkJYzIuMDIzLDEuMzU0LDIuNTY3LDQuMDksMS4yMTYsNi4xMTZsLTE2LjAyOCwyNC4wNGMtMS4zNTMsMi4wMjktNC4wOTUsMi41NzctNi4xMjMsMS4yMjNsLTQuMDg2LTIuNzI4DQoJCUMzMzcuNjg1LDM1OS45NTYsMzM3LjEzOSwzNTcuMjE2LDMzOC40OTMsMzU1LjE4OHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTM2My4yNDMsMzE4LjE0MWwxNi4wNzMtMjQuMTU0YzEuMzUxLTIuMDMsNC4wOTQtMi41OCw2LjEyMy0xLjIyN2w0LjA5NiwyLjczDQoJCWMyLjAyOSwxLjM1MywyLjU3Nyw0LjA5NiwxLjIyMyw2LjEyNGwtMTYuMTA3LDI0LjExNmMtMS4zNTEsMi4wMjItNC4wODIsMi41NzEtNi4xMDksMS4yMjdsLTQuMDYyLTIuNjkyDQoJCUMzNjIuNDQ1LDMyMi45MTUsMzYxLjg5MSwzMjAuMTcyLDM2My4yNDMsMzE4LjE0MXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTM1NS42MjYsMzY2LjY5OGwxNi4wNTctMjQuMDk4YzEuMzUyLTIuMDI5LDQuMDkzLTIuNTc4LDYuMTIyLTEuMjI1bDQuMTA0LDIuNzM3DQoJCWMyLjAyNywxLjM1MiwyLjU3NSw0LjA5LDEuMjI1LDYuMTE5bC0xNi4wNDcsMjQuMWMtMS4zNTEsMi4wMjktNC4wOSwyLjU3OS02LjEyLDEuMjI4bC00LjExNS0yLjczOQ0KCQlDMzU0LjgyNCwzNzEuNDY5LDM1NC4yNzQsMzY4LjcyNywzNTUuNjI2LDM2Ni42OTh6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzQ2NDY1NTsiIGQ9Ik0zODAuNDAzLDMyOS40NjNsMTYuMDY2LTI0LjA0MmMxLjM1NC0yLjAyNSw0LjA5Mi0yLjU3MSw2LjExOS0xLjIybDQuMTAyLDIuNzM0DQoJCWMyLjAzLDEuMzUzLDIuNTc3LDQuMDk2LDEuMjIxLDYuMTI1bC0xNi4wNjYsMjQuMDQzYy0xLjM1MywyLjAyNS00LjA5MiwyLjU3MS02LjExOCwxLjIybC00LjEwMy0yLjczNA0KCQlDMzc5LjU5NCwzMzQuMjM1LDM3OS4wNDcsMzMxLjQ5MiwzODAuNDAzLDMyOS40NjN6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzQ2NDY1NTsiIGQ9Ik0zNzIuNzcxLDM3OC4wODFsMTYuMDc1LTI0LjA1NmMxLjM1LTIuMDE5LDQuMDc3LTIuNTY5LDYuMTAzLTEuMjNsNC4wODYsMi43DQoJCWMyLjA0LDEuMzQ4LDIuNTk1LDQuMDk3LDEuMjM5LDYuMTMxbC0xNi4wNjMsMjQuMDg4Yy0xLjM1MiwyLjAyOC00LjA5MywyLjU3NS02LjEyMSwxLjIyNGwtNC4wOTgtMi43MzINCgkJQzM3MS45NjIsMzgyLjg1MiwzNzEuNDE1LDM4MC4xMDksMzcyLjc3MSwzNzguMDgxeiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM0NjQ2NTU7IiBkPSJNMzk3LjU1NCwzNDAuOTY5bDE2LjAzNS0yNC4wODVjMS4zNTMtMi4wMzEsNC4wOTgtMi41OCw2LjEyNy0xLjIyM2w0LjA3MiwyLjcyMg0KCQljMi4wMjUsMS4zNTQsMi41Nyw0LjA5MywxLjIxOCw2LjExOWwtMTYuMDQ5LDI0LjA1M2MtMS4zNDksMi4wMjQtNC4wODMsMi41NzMtNi4xMSwxLjIyOWwtNC4wNi0yLjY5DQoJCUMzOTYuNzU0LDM0NS43NDUsMzk2LjIwMSwzNDMsMzk3LjU1NCwzNDAuOTY5eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" alt="alter" />
                                                Korean
                                            </p>
                                            <input type="checkbox" name='isKorean' id='isKorean'
                                                value='isKorean' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>
                                    </div>

                                    <div className="togg right">
                                        <label className='toggle' htmlFor="isThai">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNNDczLjcsODguM0gzOC4zQzE3LjEsODguMywwLDEwNS41LDAsMTI2LjZ2MjU4LjhjMCwyMS4yLDE3LjIsMzguMywzOC4zLDM4LjNoNDM1LjMNCgljMjEuMiwwLDM4LjMtMTcuMiwzOC4zLTM4LjNWMTI2LjZDNTEyLDEwNS40LDQ5NC44LDg4LjMsNDczLjcsODguM3oiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBkPSJNMCwzODUuNGMwLDIxLjIsMTcuMiwzOC4zLDM4LjMsMzguM2g0MzUuM2MyMS4yLDAsMzguMy0xNy4yLDM4LjMtMzguM3YtMTQuNkgwVjM4NS40eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBkPSJNNDczLjcsODguM0gzOC4zQzE3LjEsODguMywwLDEwNS41LDAsMTI2LjZ2MTQuNmg1MTJ2LTE0LjZDNTEyLDEwNS40LDQ5NC44LDg4LjMsNDczLjcsODguM3oiLz4NCjwvZz4NCjxyZWN0IHk9IjE5NC4yIiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSIxMjMuNiIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" alt="alter" />
                                                Thailand
                                            </p>
                                            <input type="checkbox" name='isThai' id='isThai'
                                                value='isThai' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>

                                        <label className='toggle' htmlFor="isVietnamese">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMS45IDUxMS45IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTEuOSA1MTEuOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6I0ZGNEI1NTsiIGQ9Ik00NzMuNyw4OC4yNUgzOC4zYy0yMS4xLDAtMzguMywxNy4xLTM4LjMsMzguM3YyNTguOGMwLDIxLjIsMTcuMiwzOC4zLDM4LjMsMzguM2g0MzUuMw0KCWMyMS4yLDAsMzguMy0xNy4yLDM4LjMtMzguM3YtMjU4LjhDNTEyLDEwNS4zNSw0OTQuOCw4OC4yNSw0NzMuNyw4OC4yNXoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMjYwLjEsMTU1Ljk1bDIzLjYsNzAuOGw3NC42LDAuNmM0LjIsMCw1LjksNS40LDIuNSw3LjhsLTYwLDQ0LjNsMjIuNSw3MS4xYzEuMyw0LTMuMyw3LjMtNi43LDQuOA0KCWwtNjAuNi00My4zbC02MC43LDQzLjRjLTMuNCwyLjQtNy45LTAuOS02LjctNC44bDIyLjUtNzEuMWwtNjAtNDQuM2MtMy40LTIuNS0xLjYtNy44LDIuNS03LjhsNzQuNi0wLjZsMjMuNi03MC44DQoJQzI1My4yLDE1MS45NSwyNTguOCwxNTEuOTUsMjYwLjEsMTU1Ljk1eiIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" alt="alter" />
                                                Vietnamese
                                            </p>
                                            <input type="checkbox" name='isVietnamese' id='isVietnamese'
                                                value='isVietnamese' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>

                                        <label className='toggle' htmlFor="isWestern">
                                            <p className="name">
                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBkPSJNNDczLjY1NSw4OC4yNzVIMzguMzQ1QzE3LjE2Nyw4OC4yNzUsMCwxMDUuNDQyLDAsMTI2LjYyVjM4NS4zOA0KCWMwLDIxLjE3NywxNy4xNjcsMzguMzQ1LDM4LjM0NSwzOC4zNDVoNDM1LjMxYzIxLjE3NywwLDM4LjM0NS0xNy4xNjcsMzguMzQ1LTM4LjM0NVYxMjYuNjINCglDNTEyLDEwNS40NDIsNDk0LjgzMyw4OC4yNzUsNDczLjY1NSw4OC4yNzV6Ii8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTI1OS41OSwxMjYuNjg0bDMuNTQsMTAuNjEzbDExLjE4NywwLjA4N2MxLjQ0OSwwLjAxMSwyLjA0OSwxLjg1OSwwLjg4NCwyLjcybC05LDYuNjQ2DQoJCWwzLjM3NCwxMC42NjZjMC40MzcsMS4zOC0xLjEzNSwyLjUyNC0yLjMxNCwxLjY4MWwtOS4xMDEtNi41MDZsLTkuMTAxLDYuNTA2Yy0xLjE3OCwwLjg0Mi0yLjc1MS0wLjMtMi4zMTQtMS42ODFsMy4zNzQtMTAuNjY2DQoJCWwtOS02LjY0NmMtMS4xNjUtMC44NjEtMC41NjUtMi43MDksMC44ODQtMi43MmwxMS4xODctMC4wODdsMy41NC0xMC42MTNDMjU3LjE4NywxMjUuMzEsMjU5LjEzMiwxMjUuMzEsMjU5LjU5LDEyNi42ODR6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGQ9Ik0yNTkuNTksMzU0LjU0N2wzLjU0LDEwLjYxM2wxMS4xODcsMC4wODdjMS40NDksMC4wMTEsMi4wNDksMS44NTksMC44ODQsMi43MmwtOSw2LjY0Ng0KCQlsMy4zNzQsMTAuNjY2YzAuNDM3LDEuMzgtMS4xMzUsMi41MjQtMi4zMTQsMS42ODFsLTkuMTAxLTYuNTA2bC05LjEwMSw2LjUwNmMtMS4xNzgsMC44NDItMi43NTEtMC4zLTIuMzE0LTEuNjgxbDMuMzc0LTEwLjY2Ng0KCQlsLTktNi42NDZjLTEuMTY1LTAuODYxLTAuNTY1LTIuNzA5LDAuODg0LTIuNzJsMTEuMTg3LTAuMDg3bDMuNTQtMTAuNjEzQzI1Ny4xODcsMzUzLjE3MiwyNTkuMTMyLDM1My4xNzIsMjU5LjU5LDM1NC41NDd6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGQ9Ik0zNzMuNTIxLDI0MC42MTVsMy41NCwxMC42MTNsMTEuMTg3LDAuMDg3YzEuNDQ5LDAuMDExLDIuMDQ5LDEuODU5LDAuODg0LDIuNzJsLTksNi42NDYNCgkJbDMuMzc0LDEwLjY2NmMwLjQzNywxLjM4LTEuMTM1LDIuNTI0LTIuMzE0LDEuNjgxbC05LjEwMS02LjUwNmwtOS4xMDEsNi41MDZjLTEuMTc4LDAuODQyLTIuNzUxLTAuMy0yLjMxNC0xLjY4MWwzLjM3NC0xMC42NjYNCgkJbC05LTYuNjQ2Yy0xLjE2NS0wLjg2MS0wLjU2NS0yLjcwOSwwLjg4NC0yLjcybDExLjE4Ny0wLjA4N2wzLjU0LTEwLjYxM0MzNzEuMTE4LDIzOS4yNDIsMzczLjA2MywyMzkuMjQyLDM3My41MjEsMjQwLjYxNXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTE0NS42NTgsMjQwLjYxNWwzLjU0LDEwLjYxM2wxMS4xODcsMC4wODdjMS40NDksMC4wMTEsMi4wNDksMS44NTksMC44ODQsMi43MmwtOSw2LjY0Ng0KCQlsMy4zNzQsMTAuNjY2YzAuNDM3LDEuMzgtMS4xMzUsMi41MjQtMi4zMTQsMS42ODFsLTkuMTAxLTYuNTA2bC05LjEwMSw2LjUwNmMtMS4xNzgsMC44NDItMi43NTEtMC4zLTIuMzE0LTEuNjgxbDMuMzc0LTEwLjY2Ng0KCQlsLTktNi42NDZjLTEuMTY1LTAuODYxLTAuNTY1LTIuNzA5LDAuODg0LTIuNzJsMTEuMTg3LTAuMDg3bDMuNTQtMTAuNjEzQzE0My4yNTYsMjM5LjI0MiwxNDUuMjAxLDIzOS4yNDIsMTQ1LjY1OCwyNDAuNjE1eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMTYyLjc2MiwxODEuMTE5bDMuNTQsMTAuNjEzbDExLjE4NywwLjA4N2MxLjQ0OSwwLjAxMSwyLjA0OSwxLjg1OSwwLjg4NCwyLjcybC05LDYuNjQ2DQoJCWwzLjM3NCwxMC42NjZjMC40MzcsMS4zOC0xLjEzNSwyLjUyNC0yLjMxNCwxLjY4MWwtOS4xMDEtNi41MDZsLTkuMTAxLDYuNTA2Yy0xLjE3OCwwLjg0Mi0yLjc1MS0wLjMtMi4zMTQtMS42ODFsMy4zNzQtMTAuNjY2DQoJCWwtOS02LjY0NmMtMS4xNjUtMC44NjEtMC41NjUtMi43MDksMC44ODQtMi43MmwxMS4xODctMC4wODdsMy41NC0xMC42MTNDMTYwLjM2LDE3OS43NDUsMTYyLjMwMywxNzkuNzQ1LDE2Mi43NjIsMTgxLjExOXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTM2MC4wOTYsMjk1LjA1bDMuNTQsMTAuNjEzbDExLjE4NywwLjA4N2MxLjQ0OSwwLjAxMSwyLjA0OSwxLjg1OSwwLjg4NCwyLjcybC05LDYuNjQ2DQoJCWwzLjM3NCwxMC42NjZjMC40MzcsMS4zODItMS4xMzUsMi41MjQtMi4zMTQsMS42ODFsLTkuMTAxLTYuNTA2bC05LjEwMSw2LjUwNmMtMS4xNzgsMC44NDItMi43NTEtMC4zLTIuMzE0LTEuNjgxbDMuMzc0LTEwLjY2Ng0KCQlsLTktNi42NDZjLTEuMTY1LTAuODYxLTAuNTY1LTIuNzA5LDAuODg0LTIuNzJsMTEuMTg3LTAuMDg3bDMuNTQtMTAuNjEzQzM1Ny42OTQsMjkzLjY3NywzNTkuNjM4LDI5My42NzcsMzYwLjA5NiwyOTUuMDV6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGQ9Ik0zMTguMzk1LDEzOS40MTdsMy41NCwxMC42MTNsMTEuMTg3LDAuMDg3YzEuNDQ5LDAuMDExLDIuMDQ5LDEuODU5LDAuODg0LDIuNzJsLTksNi42NDYNCgkJbDMuMzc0LDEwLjY2NmMwLjQzNywxLjM4LTEuMTM1LDIuNTI0LTIuMzE0LDEuNjgxbC05LjEwMS02LjUwNmwtOS4xMDIsNi41MDZjLTEuMTc4LDAuODQyLTIuNzUxLTAuMy0yLjMxNC0xLjY4MWwzLjM3NC0xMC42NjYNCgkJbC05LTYuNjQ2Yy0xLjE2NS0wLjg2MS0wLjU2NS0yLjcwOSwwLjg4NC0yLjcybDExLjE4Ny0wLjA4N2wzLjU0LTEwLjYxM0MzMTUuOTkyLDEzOC4wNDQsMzE3LjkzNSwxMzguMDQ0LDMxOC4zOTUsMTM5LjQxN3oiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTIwNC40NjMsMzM2Ljc1M2wzLjU0LDEwLjYxM2wxMS4xODcsMC4wODdjMS40NDksMC4wMTEsMi4wNDksMS44NTksMC44ODQsMi43MmwtOSw2LjY0Ng0KCQlsMy4zNzQsMTAuNjY2YzAuNDM3LDEuMzgtMS4xMzUsMi41MjQtMi4zMTQsMS42ODFsLTkuMTAxLTYuNTA2bC05LjEwMSw2LjUwNmMtMS4xNzgsMC44NDItMi43NTEtMC4zLTIuMzE0LTEuNjgxbDMuMzc0LTEwLjY2Ng0KCQlsLTktNi42NDZjLTEuMTY1LTAuODYxLTAuNTY1LTIuNzA5LDAuODg0LTIuNzJsMTEuMTg3LTAuMDg2bDMuNTQtMTAuNjEzQzIwMi4wNjEsMzM1LjM3OCwyMDQuMDA2LDMzNS4zNzgsMjA0LjQ2MywzMzYuNzUzeiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMzU3LjIzNiwxODEuMTE5bC0zLjU0LDEwLjYxM2wtMTEuMTg3LDAuMDg3Yy0xLjQ0OSwwLjAxMS0yLjA0OSwxLjg1OS0wLjg4NCwyLjcybDksNi42NDYNCgkJbC0zLjM3NCwxMC42NjZjLTAuNDM3LDEuMzgsMS4xMzUsMi41MjQsMi4zMTQsMS42ODFsOS4xMDEtNi41MDZsOS4xMDEsNi41MDZjMS4xNzgsMC44NDIsMi43NTEtMC4zLDIuMzE0LTEuNjgxbC0zLjM3NC0xMC42NjYNCgkJbDktNi42NDZjMS4xNjUtMC44NjEsMC41NjUtMi43MDktMC44ODQtMi43MmwtMTEuMTg3LTAuMDg3bC0zLjU0LTEwLjYxM0MzNTkuNjM4LDE3OS43NDUsMzU3LjY5NCwxNzkuNzQ1LDM1Ny4yMzYsMTgxLjExOXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTE1OS45MDIsMjk1LjA1bC0zLjU0LDEwLjYxM2wtMTEuMTg3LDAuMDg3Yy0xLjQ0OSwwLjAxMS0yLjA0OSwxLjg1OS0wLjg4NCwyLjcybDksNi42NDYNCgkJbC0zLjM3NCwxMC42NjZjLTAuNDM3LDEuMzgyLDEuMTM1LDIuNTI0LDIuMzE0LDEuNjgxbDkuMTAxLTYuNTA2bDkuMTAxLDYuNTA2YzEuMTc4LDAuODQyLDIuNzUxLTAuMywyLjMxNC0xLjY4MWwtMy4zNzQtMTAuNjY2DQoJCWw5LTYuNjQ2YzEuMTY1LTAuODYxLDAuNTY1LTIuNzA5LTAuODg0LTIuNzJsLTExLjE4Ny0wLjA4N2wtMy41NC0xMC42MTNDMTYyLjMwMywyOTMuNjc3LDE2MC4zNiwyOTMuNjc3LDE1OS45MDIsMjk1LjA1eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMjAxLjYwMywxMzkuNDE3bC0zLjU0LDEwLjYxM2wtMTEuMTg3LDAuMDg3Yy0xLjQ0OSwwLjAxMS0yLjA0OSwxLjg1OS0wLjg4NCwyLjcybDksNi42NDYNCgkJbC0zLjM3NCwxMC42NjZjLTAuNDM3LDEuMzgsMS4xMzUsMi41MjQsMi4zMTQsMS42ODFsOS4xMDEtNi41MDZsOS4xMDEsNi41MDZjMS4xNzgsMC44NDIsMi43NTEtMC4zLDIuMzE0LTEuNjgxbC0zLjM3NC0xMC42NjYNCgkJbDktNi42NDZjMS4xNjUtMC44NjEsMC41NjUtMi43MDktMC44ODQtMi43MmwtMTEuMTg3LTAuMDg3bC0zLjU0LTEwLjYxM0MyMDQuMDA0LDEzOC4wNDQsMjAyLjA2MSwxMzguMDQ0LDIwMS42MDMsMTM5LjQxN3oiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTMxNS41MzQsMzM2Ljc1M2wtMy41NCwxMC42MTNsLTExLjE4NywwLjA4N2MtMS40NDksMC4wMTEtMi4wNDksMS44NTktMC44ODQsMi43Mmw5LDYuNjQ2DQoJCWwtMy4zNzQsMTAuNjY2Yy0wLjQzNywxLjM4LDEuMTM1LDIuNTI0LDIuMzE0LDEuNjgxbDkuMTAxLTYuNTA2bDkuMTAxLDYuNTA2YzEuMTc4LDAuODQyLDIuNzUxLTAuMywyLjMxNC0xLjY4MWwtMy4zNzQtMTAuNjY2DQoJCWw5LTYuNjQ2YzEuMTY1LTAuODYxLDAuNTY1LTIuNzA5LTAuODg0LTIuNzJsLTExLjE4Ny0wLjA4NmwtMy41NC0xMC42MTNDMzE3LjkzNSwzMzUuMzc4LDMxNS45OTIsMzM1LjM3OCwzMTUuNTM0LDMzNi43NTN6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==" alt="alter" />
                                                Western
                                            </p>
                                            <input type="checkbox" name='isWestern' id='isWestern'
                                                value='isWestern' onChange={onChangeCuisineValue} />
                                            <div className="slider"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="button-back-ok">
                                {!auth && <button className='back-to-interest' onClick={() => setToggole(false)}>back</button>}
                                <button type='submit' onClick={saveSessionStorage}>submit</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div >
    )
}
