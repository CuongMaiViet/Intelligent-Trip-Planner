import axios from 'axios';
import React, { useContext, useState } from 'react'
import Loading from '../../loading/Loading';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './LoginRegister.scss'
import Navbar from '../../main-navbar/Navbar';
import { Globalstate } from '../../../GlobalState';
import NotFound from '../NotFound'
import { Link } from "react-router-dom";
import image from './login-pic.svg'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

toast.configure()
export default function Login(props) {
    const state = useContext(Globalstate)
    const [token, setToken] = state.token
    const [auth] = state.userInfoAPI.auth

    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const onChangeValue = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const adminOrUser = async (token) => {
        //redirect
        const resp = await axios.get(`${API}/users/info`, {
            headers: { Authorization: token }
        })
        return resp.data.role === 1 ? window.location.replace('/admin') : window.location.replace('/profile')
    }

    const loginSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${API}/users/login`, { ...user })
            const expiry = new Date()

            localStorage.setItem('login', JSON.stringify({
                isLogin: true,
                token: res.data.accessToken,
                expiry: expiry.getTime() + 25200000
            }))
            setToken(res.data.accessToken)
            console.log(token);
            adminOrUser(res.data.accessToken)
            setLoading(false)

        } catch (error) {
            toast.error(error.response.data.msg)
            setLoading(false)
        }
    }

    return (
        <>
            {auth ? (
                <NotFound />
            ) : (
                <>
                    <Navbar />
                    <div className='login-register-page'>
                        {loading && <Loading />}
                        <form onSubmit={loginSubmit}>
                            <img src={image} alt="" />
                            <fieldset className='flex' >
                                <legend>Login</legend>
                                <div className="email flex">
                                    <i className="fas fa-user-check"></i>
                                    <input id='em' type="email" name='email' placeholder='Email'
                                        value={user.email} onChange={onChangeValue} autoComplete='on'
                                        required />
                                </div>
                                <div className="password flex">
                                    <i className="fas fa-lock"></i>
                                    <input id='pw' type="password" name='password' placeholder='Password'
                                        value={user.password} onChange={onChangeValue} autoComplete='on'
                                        required />
                                </div>
                                <div className="button">
                                    <button type='submit'>Sign in</button>
                                </div>
                                <div className="register-redirect flex">
                                    Not registered?
                                    <Link to={'/register'} className="nav-link">
                                        Create an account!
                                    </Link>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}
