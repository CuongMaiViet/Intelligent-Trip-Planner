import React, { useContext, useEffect, useState } from 'react'
import { Globalstate } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import './Profile.scss'
// import image from './user.jpg'
import logo1 from '../../main-navbar/logo1.png'
import axios from 'axios'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../loading/Loading'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

//add comma to number
const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
const getToday = (date) => {
    return `${getDate(date)}, ${getMonth(date)} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function Profile(props) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [info] = state.userInfoAPI.info
    const [auth, setAuth] = state.userInfoAPI.auth
    const [authAdmin, setAuthAdmin] = state.userInfoAPI.authAdmin
    const [callback, setCallBack] = state.userInfoAPI.callback
    const [interestDATA] = state.interestAPI.interests

    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const [date, setDate] = useState(new Date())
    const [toggle, setToggle] = useState(false)

    const logout = async () => {
        setLoading(true)
        await axios.get(`${API}/users/logout`)
        localStorage.clear()
        sessionStorage.clear()
        setAuth(false)
        setAuthAdmin(false)
        window.location.replace('/login')
        setLoading(false)

        console.log(auth);
        console.log(authAdmin);
    }

    const tick = () => {
        setDate(new Date())
    }

    const comparer = (otherArray) => {
        return (current) => {
            if (otherArray) {
                return otherArray.filter((other) => {
                    return other.id === current.id
                }).length === 0;
            }
        }
    }

    const handleInterest = async (e) => {
        try {
            if (!auth) return toast.warning("Please register.")
            if (!token) return toast.warning("No token provided.")

            if (e.target.checked === true) {
                await axios.post(`${API}/users/interests`, {
                    interests: e.target.value
                }, {
                    headers: { Authorization: token }
                })
            } else {
                await axios.post(`${API}/users/interests/destroyer`, {
                    interests: e.target.value
                }, {
                    headers: { Authorization: token }
                })
            }

        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }

    const deleteInterest = async (e) => {
        const confirm = window.confirm(`Do you really want to delete ${e.target.name}?`)
        try {
            if (confirm === false) {
                return 0
            } else {
                setLoading(true)
                await axios.post(`${API}/users/interests/destroyer`, {
                    interests: e.target.value
                }, {
                    headers: { Authorization: token }
                })
                setCallBack(!callback)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }

    const updateInterest = () => {
        setLoading(true)
        setCallBack(!callback)
        setUpdate(false)
        setLoading(false)
    }

    useEffect(() => {
        var timerID = setInterval(() => tick(), 1000)
        return function cleanup() {
            clearInterval(timerID)
        }


    }, [])

    const { firstName, lastName, interests, trips, email } = info

    return (
        <>
            {info && info.length === 0 && <Loading />}
            {loading && <Loading />}
            <div className="user-profile-page">
                <a className='feedback' href='https://survey.survicate.com/7a30c0ded71f22ad/?p=anonymous' target='_blank' rel="noreferrer">
                    feedback
                </a>
                <div className={toggle ? "left-side-bar active" : "left-side-bar"}>
                    <div className="section controller">
                        <div className="user-name flex">
                            <button className="close-side-bar" disabled={!toggle} onClick={() => setToggle(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                            <div className="img">
                                <img src='http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png'
                                    alt='alter' />
                            </div>
                            <div className="name flex">
                                <p>{lastName}</p>
                                <p>{firstName}</p>
                            </div>
                            <div className="email">
                                {email}
                            </div>
                        </div>
                        <div className="number-of flex">
                            <div className="trips flex">
                                {info && trips && <p>{trips.length}</p>}
                                <h5>itineraries</h5>
                            </div>
                            <div className="interests flex">
                                {info && interests && <p>{interests.length}</p>}
                                <h5>interests</h5>
                            </div>
                        </div>
                        <div className="button flex">
                            <div className="button-btn flex">
                                <Link to={'/'}>
                                    <i className="fas fa-home"></i>
                                    home
                                </Link>
                            </div>
                            <div className="button-btn flex">
                                <Link to={'/explore/place'}>
                                    <i className="fas fa-atlas"></i>
                                    explore
                                </Link>
                            </div>
                            <div className="button-btn flex">
                                <Link to={'/itinerary'} >
                                    <i className="far fa-paper-plane"></i>
                                    book
                                </Link>
                            </div>
                            {/* <div className="button-btn flex">
                                <Link to={'/update'}>
                                    <i className="far fa-edit"></i>
                                    update
                                </Link>
                            </div> */}
                            <div className="button-btn flex">
                                <Link to={'/login'} onClick={logout}>
                                    <i className="fas fa-power-off"></i>
                                    logout
                                </Link>
                            </div>
                        </div>
                        <div className="logo flex">
                            <img src={logo1} alt={logo1} />
                        </div>
                    </div>

                    {/* <div className="section basic-info">
                        <div className="toggle flex">
                            <i className="fas fa-arrow-left"></i>
                            close
                        </div>
                        <div className="image flex">
                            <img src='https://res.cloudinary.com/rmit-vietnam/image/upload/v1630870362/Member_portrait/photo_2021-05-19_14-15-05_trcmck.jpg'
                                alt='alter' />
                        </div>
                        <div className="info flex">
                            <div className="name flex">
                                <p>{lastName}</p>
                                <p>{firstName}</p>
                            </div>
                            <div className="favourite">
                                {info && interests && interests.length > 0 &&
                                    interests.map(p =>
                                        <p className='flex' key={p.id}>
                                            <i className="fas fa-heart"></i>
                                            {p.name.substr(2)}
                                        </p>
                                    )
                                }
                            </div>
                            <div className="description flex">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum egestas varius libero, sollicitudin mattis ante mollis eu. Proin varius maximus est, id pellentesque lectus consequat vel. Praesent sodales mauris nec congue suscipit. Pellentesque accumsan eu eros eget fermentum. Curabitur laoreet venenatis molestie. Sed eu sem eget est tempus elementum.
                            </div>

                        </div>
                        <div className="other-photo flex">
                            <img src="https://res.cloudinary.com/rmit-vietnam/image/upload/v1630869765/Member_portrait/MicrosoftTeams-image_1_ef66e2.jpg" alt='alternative' />
                            <img src="https://res.cloudinary.com/rmit-vietnam/image/upload/v1630869766/Member_portrait/photo_2021-05-19_00-21-42_wchcnv_wfb9jk.jpg" alt='alternative' />
                            <img src="https://res.cloudinary.com/rmit-vietnam/image/upload/v1630869766/Member_portrait/MicrosoftTeams-image_2_lhuea8.jpg" alt='alternative' />
                            <img src="https://res.cloudinary.com/rmit-vietnam/image/upload/v1630870362/Member_portrait/photo_2021-05-19_14-15-05_trcmck.jpg" alt='alternative' />
                        </div>
                    </div> */}
                </div>

                <div className="right-main-field">
                    <div className="date flex">
                        <button className="toggle-side-bar" disabled={toggle} onClick={() => setToggle(true)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <p>
                            {getToday(date)}
                        </p>
                        {date.toLocaleTimeString()}
                    </div>
                    <div className="interest-showcase showcase">
                        <div className="top flex">
                            <h2>Interests</h2>

                            <button className="update-interests flex" onClick={() => setUpdate(true)}>
                                <i className="fas fa-plus"></i>
                                new
                            </button>
                        </div>

                        <div className="body flex">
                            {interests && interests.length > 0 && interests.map(p => (
                                <div className="interest-card" key={p.id}>
                                    <img src={p.img} alt={p.img} />
                                    <p className="interest-name">
                                        {p.name.substr(2)}
                                    </p>
                                    <button value={p.id} name={p.name.substr(2)} className="delete-interest" onClick={deleteInterest}></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="trip-showcase showcase">
                        <div className="top">
                            <h2>Trips</h2>
                        </div>
                        <div className="body">
                            {trips && trips.length > 0 && trips.map(p => (
                                <div className="trip-card" key={p.id}>
                                    <Link to={`/trip/${p.id}`} target='_blank' rel='noreferrer'>
                                        <img src={p.itineraries[0].accommodations[0].img} alt={p.itineraries[0].accommodations[0].img} />
                                    </Link>
                                    <div className="trip-info flex">
                                        <h2 className="trip-title">
                                            {p.title}
                                        </h2>
                                        <div className="budget flex">
                                            <i className="far fa-money-bill-alt"></i>
                                            {numberWithCommas(p.itineraries[0].totalPrice)} VND
                                        </div>
                                        <div className="start-end flex">
                                            <p className='flex'>
                                                <i className="fas fa-plane-departure"></i>
                                                {getToday(new Date(p.startDate))}
                                            </p>
                                            <p className='flex'>
                                                <i className="fas fa-plane-arrival"></i>
                                                {getToday(new Date(p.endDate))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={update ? "display-interest active" : "display-interest"}>
                    <div className="interest">
                        {interestDATA && interestDATA.length > 0 && interestDATA.filter(comparer(interests))
                            .map(p => (
                                <div className="interest-checkbox" key={p.id}>
                                    <label className="image-interest" htmlFor={p.id}>
                                        <img src={p.img} alt={p.img} />
                                        <div className='toggle' htmlFor={p.id}>
                                            <p className="name">
                                                {p.name && p.name.substr(2)}
                                            </p>
                                            <input type="checkbox" name={p.name} id={p.id}
                                                value={p.id} disabled={!auth}
                                                onChange={handleInterest} />
                                            <div className="slider"></div>
                                        </div>
                                    </label>
                                </div>
                            ))}

                        <button className='finish-pick' onClick={updateInterest}>X</button>
                    </div>
                </div>
            </div>
        </>
    )
}
