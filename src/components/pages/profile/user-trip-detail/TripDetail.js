import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Globalstate } from '../../../../GlobalState'
import Loading from '../../../loading/Loading'
import Navbar from '../../../main-navbar/Navbar'
import tripimg from '../../../pages/trip/tripimg.png'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './TripDetail.scss'
import { Link } from 'react-router-dom'
import AccommodationDisplay from '../../trip/AccommodationDisplay'
import TripDisplay from '../../trip/TripDisplay'
import CuisineDisplay from '../../trip/CuisineDisplay'
import marker1 from '../../map/marker1.png'
import marker2 from '../../map/marker2.png'
import marker3 from '../../map/marker3.png'
import marker4 from '../../map/marker4.png'
import marker5 from '../../map/marker5.png'
import { DisplayMapFC } from '../../map/DisplayMapFC'
import axios from 'axios'

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

const API = 'https://capstone-tripplanner-back.herokuapp.com'

toast.configure()
export default function TripDetail(props) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [infoCallBack, setInfoCallBack] = state.userInfoAPI.callback
    const [usertrip] = state.userTripAPI.usertrip
    const [callback, setCallBack] = state.userTripAPI.callback
    const [tripByID, setTripByID] = useState([])
    const [dateDATA, setDateDATA] = useState([])
    const [placeDecrypt, setPlaceDecrypt] = useState([])
    const [lunch, setLunch] = useState([])
    const [dinner, setDinner] = useState([])
    const [accommodationDecrypt, setAccommodationDecrypt] = useState([])

    const [currentDay, setCurrentDay] = useState(1)
    const [placesPerDay] = useState(3)
    const [cuisinesPerDay] = useState(1)
    const [loading, setLoading] = useState(false)
    const param = useParams()
    const history = useHistory()

    const gDate = new Date(tripByID.startDate)
    const newSDate = new Date(tripByID.startDate).toLocaleDateString()
    const newEDate = new Date(tripByID.endDate).toLocaleDateString()
    const indexOfLastDayCuisine = currentDay * cuisinesPerDay
    const indexOfFirstDayCuisine = indexOfLastDayCuisine - cuisinesPerDay
    //day per page
    const indexOfLastDay = currentDay * placesPerDay;
    const indexOfFirstDay = indexOfLastDay - placesPerDay

    const getDateDATA = (dateLength) => {
        let tempDateDATA = []
        let a = gDate.valueOf()
        for (let i = 0; i < dateLength / 3; i++) {
            tempDateDATA.push(new Date(a).toDateString())
            a += 86400000
        }
        setDateDATA(tempDateDATA);
    }

    const decrypt = () => {
        let lunch = []
        let dinner = []
        tripByID.itineraries[0].cuisines.forEach(data => {
            if (data.category === 'lunch') lunch.push(data)
            if (data.category === 'dinner') dinner.push(data)
        })
        setPlaceDecrypt(tripByID.itineraries[0].places)
        setAccommodationDecrypt(tripByID.itineraries[0].accommodations[0])
        setLunch(lunch)
        setDinner(dinner)
        getDateDATA(tripByID.itineraries[0].places.length - 1)
    }

    const handleDeleteTrip = async () => {
        const confirm = window.confirm(`Do you really want to delete ${tripByID.title}?`)
        try {
            if (confirm === false) {
                return 0
            } else {
                setLoading(true)

                const deleteTrip = axios.delete(`${API}/trips/${param.id}`, {
                    headers: {
                        Authorization: token
                    }
                })

                await deleteTrip

                setInfoCallBack(!infoCallBack)
                setCallBack(!callback)
                toast.success(`Successfully delete ${tripByID.title}`)
                history.push('/profile')
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.response.data.msg)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (param.id) {
            usertrip.forEach(data => {
                if (data.id == param.id) setTripByID(data)
            })
        }

        if (tripByID && tripByID.itineraries) {
            decrypt()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [param.id, usertrip, tripByID])

    return (
        <>
            {tripByID && tripByID.length === 0 && <Loading />}
            {tripByID && placeDecrypt.length > 0 && accommodationDecrypt && lunch.length > 0 && dinner.length > 0 && (
                <div className="trip-detail-page">
                    {loading && <Loading />}
                    <div className="row">
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
                                                        {tripByID.title}
                                                    </div>
                                                    <div className="startdate-enddate flex">
                                                        <i className="far fa-calendar-check"></i>
                                                        {newSDate && newSDate.substr(0, 3)} - {newEDate && newEDate.substr(0, newEDate.length - 5)}
                                                    </div>
                                                </div>

                                                <div className="price flex">
                                                    <i className="far fa-money-bill-alt"></i>
                                                    {tripByID.itineraries && numberWithCommas(tripByID.itineraries[0].totalPrice)} VND
                                                </div>
                                            </div>

                                            <div className="notenote flex">
                                                <div className="note flex">
                                                    <i className="far fa-edit"></i>
                                                    {tripByID.notes}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="button flex">
                                            <Link to={'/profile'}>
                                                <button className="btn back flex">
                                                    <i className="fas fa-chevron-left"></i> profile
                                                </button>
                                            </Link>

                                            <button className="btn delete flex" onClick={handleDeleteTrip}>
                                                <i className="fas fa-trash-alt"></i> delete
                                            </button>
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
                            />
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
