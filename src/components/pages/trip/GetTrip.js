import React, { useContext, useEffect, useState } from 'react'
import { Globalstate } from '../../../GlobalState'
import Loading from '../../loading/Loading'
import Navbar from '../../main-navbar/Navbar';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './GetTrip.scss'
import TripDisplay from './TripDisplay';
import CuisineDisplay from './CuisineDisplay'
import axios from 'axios';
import AccommodationDisplay from './AccommodationDisplay';
import tripimg from './tripimg.png'
import { DisplayMapFC } from '../map/DisplayMapFC';
import marker1 from '../map/marker1.png'
import marker2 from '../map/marker2.png'
import marker3 from '../map/marker3.png'
import marker4 from '../map/marker4.png'
import marker5 from '../map/marker5.png'

const API = "https://capstone-tripplanner-back.herokuapp.com"

//add comma to number
const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//get full day, month
const getDate = date => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    if (date.getDay() === 0) {
        return 'Sunday'
    }
    let day = days[date.getDay() - 1]
    return day;
}
const getMonth = date => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month = months[date.getMonth()];
    return month;
}
const getDay = (date) => {
    return `${getDate(date)}, ${getMonth(date)} ${date.getDate()}, ${date.getFullYear()}`;
}

toast.configure()
export default function GetTrip({ placeLimit, startDate, endDate }) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [tripTitleNote, setTripTitleNote] = useState({
        title: 'Trip to Hanoi',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [toggle, setToggle] = useState(false)
    //get date from api
    const [trip] = state.tripAPI.trips
    const [placeDATA] = state.haNoiPlaceAPI.hanoiplaces
    const [accommodationDATA] = state.accommodationAPI.accommodations
    const [cuisinesDATA] = state.cuisinesAPI.cuisines
    const [info] = state.userInfoAPI.info
    const [auth] = state.userInfoAPI.auth
    const [callback, setCallBack] = state.userInfoAPI.callback
    //fetch data
    const [placeDecrypt, setPlaceDecrypt] = useState([])
    const [lunch, setLunch] = useState([])
    const [dinner, setDinner] = useState([])
    const [accommodationDecrypt, setAccommodationDecrypt] = useState([])
    //calculate date
    const [currentDay, setCurrentDay] = useState(1)
    const [placesPerDay] = useState(3)
    const [cuisinesPerDay] = useState(1)
    const [sDate, setSDate] = useState(startDate)
    const [eDate, setEDate] = useState(endDate)
    const [dateDATA, setDateDATA] = useState([])

    //cuisine
    const indexOfLastDayCuisine = currentDay * cuisinesPerDay
    const indexOfFirstDayCuisine = indexOfLastDayCuisine - cuisinesPerDay
    //day per page
    const indexOfLastDay = currentDay * placesPerDay;
    const indexOfFirstDay = indexOfLastDay - placesPerDay
    // const totalDay = Math.ceil(placeDecrypt.length / placesPerDay)
    const gDate = new Date(sDate)
    const newSDate = new Date(sDate).toLocaleDateString()
    const newEDate = new Date(eDate).toLocaleDateString()

    //toggle map
    const showmap = () => {
        const right = document.querySelector('.right')
        const btnshowmap = document.querySelector('.showmap')
        btnshowmap && btnshowmap.addEventListener('click', () => {
            right.style.transform = `translateX(0)`
            right.style.zIndex = `1000`
            setToggle(true)
        })
    }
    const closemap = () => {
        const right = document.querySelector('.right')
        const btnclosemap = document.querySelector('.closemap')
        btnclosemap && btnclosemap.addEventListener('click', () => {
            right.style.transform = `translateX(100%)`
            right.style.zIndex = `-1`
            setToggle(false)
        })
    }
    const decrypt = () => {
        try {
            if (trip.length !== 0) {
                if (accommodationDATA && placeDATA) {
                    const tempDATA = [];
                    // const tempCuisine = [];
                    const lunch = []
                    const dinner = []
                    accommodationDATA.forEach(data => {
                        if (data.unique_point === trip.accommodations[0]) {
                            setAccommodationDecrypt(data)
                        }
                    })
                    cuisinesDATA.forEach(data => {
                        for (let i = 0; i < cuisinesDATA.length; i++) {
                            if (data.unique_point === trip.cuisines[i]) {
                                // tempCuisine.push(data)
                                if (data.category === 'lunch') lunch.push(data)
                                if (data.category === 'dinner') dinner.push(data)
                            }
                        }
                    })
                    placeDATA.forEach(data => {
                        for (let i = 0; i < placeLimit; i++) {
                            if (data.unique_point === trip.places[i]) {
                                tempDATA.push(data)
                            }
                        }
                    })
                    setPlaceDecrypt(tempDATA)
                    setLunch(lunch)
                    setDinner(dinner)
                    // setCuisinesDecrypt(tempCuisine)
                }
            }
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }
    const handleChange = e => {
        const { name, value } = e.target
        setTripTitleNote({ ...tripTitleNote, [name]: value })
    }
    const getDateDATA = (dateLength) => {
        let tempDateDATA = []
        let a = gDate.valueOf()
        for (let i = 0; i < dateLength / 3; i++) {
            tempDateDATA.push(new Date(a).toDateString())
            a += 86400000
        }
        setDateDATA(tempDateDATA);
    }
    const windowReload = () => {
        window.location.reload()
        window.sessionStorage.clear()
    }
    const handleAddTrip = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.post(`${API}/trips`, {
                title: tripTitleNote.title,
                user_id: info.id,
                startDate: new Date(sDate).toISOString(),
                endDate: new Date(eDate).toISOString(),
                accommodations: trip.accommodations,
                cuisines: trip.cuisines,
                places: trip.places,
                totalPrice: trip.totalPrice,
                notes: tripTitleNote.notes
            }, {
                headers: {
                    Authorization: token
                }
            })

            setCallBack(!callback)
            toast.success(`Successfully add ${tripTitleNote.title} to user ${info.firstName} ${info.lastName}`)
            setLoading(false)

        } catch (error) {
            toast.error(error.response.data.msg)
            setLoading(false)
        }
    }

    useEffect(() => {
        //function
        decrypt()
        getDateDATA(placeLimit)

        //sessionStorage
        if (window.sessionStorage.getItem('item')) {
            const items = JSON.parse(window.sessionStorage.getItem('item'))
            setSDate(items.startDate)
            setEDate(items.endDate)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trip])

    return (
        <>
            {placeDecrypt.length === 0 && <Loading />}
            {placeDecrypt && placeDecrypt.length > 0 && (
                <div className="main-places-display">
                    {loading && <Loading />}
                    <div className="row">
                        <div className="toggle-map">
                            {toggle ? <button className='closemap flex' onClick={closemap}><i className="far fa-times-circle"></i></button>
                                : <button className='showmap flex' onClick={showmap}><i className="fas fa-globe-americas"></i></button>}
                        </div>

                        <div className="column left">
                            <div className="top">
                                <div className="navbar">
                                    <Navbar />
                                </div>
                                <div className="img-text">
                                    <img src={tripimg} alt={tripimg} />
                                </div>
                            </div>

                            <div className="side-bar flex">
                                <i className="far fa-calendar-alt"></i>
                                {dateDATA.map((date, index) => <div className='nav-side-item flex' key={index} onClick={() => setCurrentDay(index + 1)}>
                                    <p>{date && date.substr(4, 3)}</p>
                                    <p>{date && new Date(date).getDate()}</p>
                                </div>)}
                            </div>

                            <div className="body">
                                <div className="content">
                                    <div className="about flex">
                                        <div className="trip-basic-info">
                                            <div className="basic-info flex">
                                                <div className="name-price flex">
                                                    <div className="name">
                                                        <input type="text" placeholder='Your trip name'
                                                            name='title' required autoComplete='on'
                                                            value={tripTitleNote.title} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="startdate-enddate flex">
                                                        <i className="far fa-calendar-check"></i>
                                                        {newSDate && newSDate.substr(0, newSDate.length - 5)} - {newEDate && newEDate.substr(0, newEDate.length - 5)}
                                                    </div>
                                                </div>

                                                <div className="price flex">
                                                    <i className="far fa-money-bill-alt"></i>
                                                    {numberWithCommas(trip.totalPrice)} VND
                                                </div>
                                            </div>

                                            <div className="notenote flex">
                                                <div className="note flex">
                                                    <i className="far fa-edit"></i>
                                                    <input type="text" name='notes'
                                                        placeholder='Write or paste something here: how to get around, tips and tricks'
                                                        onChange={handleChange}
                                                        value={tripTitleNote.notes}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="button flex">
                                            <button className="btn back" onClick={windowReload}>
                                                <i className="fas fa-trash-alt"></i> clear
                                            </button>

                                            {auth ? (
                                                <button className="btn save" onClick={handleAddTrip}>
                                                    <i className="fas fa-save"></i> save
                                                </button>
                                            ) : (
                                                <button className="btn save" onClick={() => toast.warn('Please Login or Register to save your trip.')}>
                                                    <i className="fas fa-save"></i> save
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="accommodation">
                                        <AccommodationDisplay key={accommodationDecrypt.id}
                                            accom={accommodationDecrypt} />
                                    </div>

                                    <div className="itinerary">
                                        <div className="title-section flex">
                                            <h2 className="title">Itinerary</h2>
                                            <h3 className="date">
                                                {dateDATA && dateDATA.length > 0 && getDay(new Date(dateDATA.filter((f, i) => i === currentDay - 1)))}
                                            </h3>
                                        </div>

                                        <div className="placescuisines">
                                            <div className="nav-time">
                                                <div className="tree">
                                                    <div className="dot">
                                                        <i className="fas fa-sun"></i>
                                                        <div className="dot-tag">
                                                            morning
                                                        </div>
                                                    </div>
                                                    <div className="dot">
                                                        <i className="fas fa-utensils"></i>
                                                        <div className="dot-tag">
                                                            lunch
                                                        </div>
                                                    </div>
                                                    <div className="dot">
                                                        <i className="fas fa-cloud-sun"></i>
                                                        <div className="dot-tag">
                                                            afternoon
                                                        </div>
                                                    </div>
                                                    <div className="dot">
                                                        <i className="fas fa-cloud"></i>

                                                        <div className="dot-tag">
                                                            dinner
                                                        </div>
                                                    </div>
                                                    <div className="dot">
                                                        <i className="fas fa-moon"></i>
                                                        <div className="dot-tag">
                                                            evening
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pc-display">
                                                <TripDisplay marker={marker1} key={placeDecrypt[indexOfFirstDay].id} place={placeDecrypt[indexOfFirstDay]} />
                                            </div>
                                            <div className="pc-display">
                                                <CuisineDisplay marker={marker2} key={lunch[indexOfFirstDayCuisine].id} cuisine={lunch[indexOfFirstDayCuisine]} />
                                            </div>
                                            <div className="pc-display">
                                                <TripDisplay marker={marker3} key={placeDecrypt[indexOfFirstDay + 1].id} place={placeDecrypt[indexOfFirstDay + 1]} />
                                            </div>
                                            <div className="pc-display">
                                                <CuisineDisplay marker={marker4} key={dinner[indexOfFirstDayCuisine].id} cuisine={dinner[indexOfFirstDayCuisine]} />
                                            </div>
                                            <div className="pc-display">
                                                <TripDisplay marker={marker5} key={placeDecrypt[indexOfFirstDay + 2].id} place={placeDecrypt[indexOfFirstDay + 2]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column right">
                            <DisplayMapFC centerLAT={accommodationDecrypt.lat} centerLNG={accommodationDecrypt.lng}
                                coodirnate1={placeDecrypt[indexOfFirstDay].lat + ',' + placeDecrypt[indexOfFirstDay].lng}
                                coodirnate2={lunch[indexOfFirstDayCuisine].lat + ',' + lunch[indexOfFirstDayCuisine].lng}
                                coodirnate3={placeDecrypt[indexOfFirstDay + 1].lat + ',' + placeDecrypt[indexOfFirstDay + 1].lng}
                                coodirnate4={dinner[indexOfFirstDayCuisine].lat + ',' + dinner[indexOfFirstDayCuisine].lng}
                                coodirnate5={placeDecrypt[indexOfFirstDay + 2].lat + ',' + placeDecrypt[indexOfFirstDay + 2].lng}
                            // accomImg={accommodationDecrypt.img} coodImg1={placeDecrypt[indexOfFirstDay].img}
                            // coodImg2={lunch[indexOfFirstDayCuisine].img} coodImg3={placeDecrypt[indexOfFirstDay + 1].img}
                            // coodImg4={dinner[indexOfFirstDayCuisine].img} coodImg5={placeDecrypt[indexOfFirstDay + 2].img}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

