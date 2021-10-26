import axios from 'axios';
import React, { useContext, useState } from 'react'
import Loading from '../../loading/Loading';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../login/LoginRegister.scss'
import Navbar from '../../main-navbar/Navbar';
import { Globalstate } from '../../../GlobalState';
import NotFound from '../NotFound'
import { Link } from "react-router-dom";
import image from './register-img1.png'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

toast.configure()
export default function Register(props) {
    const state = useContext(Globalstate)
    const [token, setToken] = state.token
    const [auth] = state.userInfoAPI.auth
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const onChangeValue = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }
    const registerSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${API}/users/register`, { ...user })
            const expiry = new Date()

            localStorage.setItem('login', JSON.stringify({
                isLogin: true,
                token: res.data.accessToken,
                expiry: expiry.getTime() + 25200000
            }))
            setToken(res.data.accessToken)
            window.location.replace('/rInterest')
            setLoading(false)
            console.log(token);
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
                        <form onSubmit={registerSubmit}>
                            <img src={image} alt={image} style={{ width: '30%', marginBottom: '15px' }} />
                            <fieldset className='flex' autoComplete='on' >
                                <legend>Register</legend>
                                <div className="firstName flex">
                                    <i className="fas fa-user-edit"></i>
                                    <input type="text" name='firstName' placeholder='First Name'
                                        value={user.firstName} onChange={onChangeValue}
                                        required />
                                </div>
                                <div className="lastName flex">
                                    <i className="fas fa-user-edit"></i>
                                    <input type="text" name='lastName' placeholder='Last Name'
                                        value={user.lastName} onChange={onChangeValue}
                                        required />
                                </div>
                                <div className="email flex">
                                    <i className="fas fa-user-check"></i>
                                    <input type="email" name='email' placeholder='Email'
                                        value={user.email} onChange={onChangeValue}
                                        required />
                                </div>
                                <div className="password flex">
                                    <i className="fas fa-lock"></i>
                                    <input type="password" name='password' placeholder='Password'
                                        value={user.password} onChange={onChangeValue}
                                        required />
                                </div>
                                <div className="button">
                                    <button type='submit'>Register</button>
                                </div>

                                <div className="login-redirect flex">
                                    Have an account?
                                    <Link to={'/login'} className="nav-link">
                                        Login!
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
