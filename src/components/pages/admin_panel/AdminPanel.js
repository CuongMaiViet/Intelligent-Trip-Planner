import React, { useContext, useState } from "react";
import { Globalstate } from "../../../GlobalState";
import Navbar from '../../main-navbar/Navbar'
import './AdminPanel.scss'
import Place from "./placeTable/Place";
import Accommodation from "./accommodationTable/Accommodation";
import axios from 'axios';
import Cuisine from "./cuisineTable/Cuisine";
import Loading from "../../loading/Loading";

const API = 'https://capstone-tripplanner-back.herokuapp.com'

export default function AdminPanel(props) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [authAdmin, setAuthAdmin] = state.userInfoAPI.authAdmin
    const [auth, setAuth] = state.userInfoAPI.auth
    const [info] = state.userInfoAPI.info
    const [hanoiPlaces] = state.haNoiPlaceAPI.hanoiplaces
    const [callback, setCallBack] = state.haNoiPlaceAPI.callback
    const [accommodations] = state.accommodationAPI.accommodations
    const [accomCallBack, setAccomCallBack] = state.accommodationAPI.callback
    const [cuisines] = state.cuisinesAPI.cuisines
    const [cuisineCallBack, setCuisineCallBack] = state.cuisinesAPI.callback
    const [tag, setTag] = useState('place')

    const logout = async () => {
        await axios.get(`${API}/users/logout`)
        localStorage.clear()
        sessionStorage.clear()
        setAuth(false)
        setAuthAdmin(false)
        window.location.replace('/login')
        console.log(auth);
    }

    return (

        <div className='admin-panel'>
            {!authAdmin && <Loading />}
            <div className="row">
                <div className="col-4">
                    <div className="admin-control">
                        <div className="a-c-header">
                            <i className="fas fa-user-tie"></i>
                            <div className="a-c-name">
                                {info.firstName} {info.lastName}
                                <div className="a-c-status">
                                    {authAdmin ? (
                                        <>
                                            <div className="dot"></div> Online
                                        </>
                                    ) : (
                                        <>
                                            <div className="dot" style={{ backgroundColor: "grey" }}></div> Offline
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>

                        <div className="a-c-select-field">
                            <div className="a-c administration">
                                <div className="tag">
                                    <i className="fas fa-user-shield"></i> administration
                                </div>
                                <div className="content">
                                    <div className="ct dashboard">
                                        <i className="fas fa-home"></i> dashboard
                                    </div>

                                    <div className="ct permission">
                                        <i className="fas fa-users"></i> Users, Roles, Permissions
                                    </div>
                                </div>
                            </div>

                            <div className="a-c page">
                                <div className="tag">
                                    <i className="fas fa-newspaper"></i> page
                                </div>

                                <div className="content">
                                    <div className="ct place" onClick={() => setTag('place')}>
                                        <i className="fas fa-landmark"></i> Place
                                    </div>

                                    <div className="ct accommodation" onClick={() => setTag('accommodation')}>
                                        <i className="fas fa-bed"></i> Accommodation
                                    </div>

                                    <div className="ct cuisine" onClick={() => setTag('cuisine')}>
                                        <i className="fas fa-utensils"></i> Cuisine
                                    </div>
                                </div>
                            </div>

                            <div className="a-c advanced">
                                <div className="tag">
                                    <i className="fas fa-cogs"></i> advanced
                                </div>

                                <div className="content">
                                    <div className="ct term">
                                        <i className="fas fa-file-signature"></i> term of service
                                    </div>

                                    <div className="ct logout" onClick={logout}>
                                        <i className="fas fa-sign-out-alt"></i> logout
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-8">
                    <div className="navbar">
                        <Navbar />
                    </div>

                    <div className="body">
                        {tag === 'place' && <Place token={token} authAdmin={authAdmin} places={hanoiPlaces} callback={callback} setCallBack={setCallBack} />}
                        {tag === 'accommodation' && <Accommodation token={token} authAdmin={authAdmin} accommodations={accommodations} callback={accomCallBack} setCallBack={setAccomCallBack} />}
                        {tag === 'cuisine' && <Cuisine token={token} authAdmin={authAdmin} cuisines={cuisines} callback={cuisineCallBack} setCallBack={setCuisineCallBack} />}
                    </div>
                </div>
            </div>

        </div>
    )
}
