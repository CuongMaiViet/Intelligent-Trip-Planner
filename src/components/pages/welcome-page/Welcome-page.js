import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import './Welcome-page.scss'
// import video from "./video-compress-v1.mp4";
import image from './welcome-img.webp'
import { Globalstate } from '../../../GlobalState';
import axios from 'axios';

const API = 'https://capstone-tripplanner-back.herokuapp.com'

function WelcomePage() {
    const state = useContext(Globalstate)
    const [auth, setAuth] = state.userInfoAPI.auth
    const [authAdmin, setAuthAdmin] = state.userInfoAPI.authAdmin

    const logout = async () => {
        await axios.get(`${API}/users/logout`)
        localStorage.clear()
        sessionStorage.clear()
        setAuth(false)
        setAuthAdmin(false)

        window.location.replace('/login')
    }


    React.useEffect(() => {
        const hamburger = document.querySelector(".hamburger");
        const welcome = document.querySelector(".welcome-page");

        hamburger.addEventListener("click", toggleMenu);

        function toggleMenu() {
            hamburger.classList.toggle("active")
            welcome.classList.toggle("active")
        }
    })
    return (
        <div>
            <section className="welcome-page">
                <header>
                    <h2 className="logo">WeekendGetAway</h2>
                    {/* <img src={img} alt="" /> */}
                    <div className="hamburger">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </header>

                <img src='https://images.unsplash.com/photo-1520413643527-772b1475d1fe?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80' alt="alter" />
                {/* <video src={video} muted loop autoPlay></video> */}

                <div className="overlay"></div>

                <div className="text">
                    <h2>Weekend</h2>
                    <h3>Getaway</h3>
                    <p>
                        Don't let your weekends slip, <br />
                        Let WeekendGetaway plan your trip.
                    </p>

                    <Link className="explore flex" to={'/explore/place'}>
                        explore
                    </Link>

                </div>

                <ul className="social-media">
                    <li>
                        <i className="fab fa-facebook-f"></i>
                    </li>

                    <li>
                        <i className="fab fa-instagram"></i>
                    </li>

                    <li>
                        <i className="fab fa-twitter"></i>
                    </li>

                    <li>
                        <i className="fab fa-youtube"></i>
                    </li>
                </ul>
            </section>

            <div className="menu">
                <ul className="menu-menu">
                    <li className="menu-item">
                        <Link to={'/itinerary'} className="menu-link">

                            Book
                        </Link>
                    </li>
                    {auth ? (
                        <>
                            {authAdmin ? (
                                <>
                                    <li className="menu-item">
                                        <Link to={'/admin'} className="menu-link">

                                            Admin Panel
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="menu-item">
                                        <Link to={'/profile'} className="menu-link">

                                            Profile
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="menu-item">
                                <Link to={'/login'} className="menu-link" onClick={logout}>

                                    Logout
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="menu-item">
                                <Link to={'/login'} className="menu-link">

                                    Login
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/register'} className="menu-link">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}

                </ul >
            </div >

        </div >
    )
}
export default WelcomePage;