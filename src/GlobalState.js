import React, { createContext, useEffect, useState } from 'react'
import HaNoiPlaceAPI from "./components/api/HaNoiPlaceAPI";
import AccommodationAPI from './components/api/AccommodationAPI';
import TripAPI from './components/api/TripAPI';
import UserInfoAPI from './components/api/UserInfoAPI';
import axios from 'axios';
import CuisinesAPI from './components/api/CuisinesAPI';
import InterestAPI from './components/api/InterestAPI';
import UserTripAPI from './components/api/UserTripAPI';

export const Globalstate = createContext()

const API = 'https://capstone-tripplanner-back.herokuapp.com'

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(false)

    // const refreshToken = async () => {
    //     const res = await fetch(`${API}/users/refresh_token`, {
    //         credentials: 'include'
    //     })
    //     const data = await res.json()
    //     console.log(data);
    // }

    // useEffect(() => {
    //     const isLogin = localStorage.getItem('isLogin')
    //     if (isLogin) {
    //         refreshToken()
    //     }
    // }, [])

    useEffect(() => {
        const login = JSON.parse(localStorage.getItem('login'))
        if (login) {
            const now = new Date()
            if (now.getTime() > login.expiry) {
                const logout = async () => {
                    await axios.get(`${API}/users/logout`)
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.replace('/login')
                    alert('Your session has expired. Please login again.')
                }
                logout()
            }
            else setToken(login.token)
        }
    }, [token])

    const state = {
        token: [token, setToken],
        haNoiPlaceAPI: HaNoiPlaceAPI(),
        accommodationAPI: AccommodationAPI(),
        tripAPI: TripAPI(),
        cuisinesAPI: CuisinesAPI(),
        userInfoAPI: UserInfoAPI(token),
        interestAPI: InterestAPI(),
        userTripAPI: UserTripAPI(token)
    }

    return (
        <Globalstate.Provider value={state}>
            {children}
        </Globalstate.Provider>
    )
}
