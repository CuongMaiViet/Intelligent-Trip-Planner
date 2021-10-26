import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Loading.scss';

toast.configure()
export default function Loading(props) {
    const [timer, setTimer] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTimer(!timer)
        }, 1000 * 50)
        return () => clearTimeout(timeout)
    }, [timer])

    return (
        <div className='loading'>
            {/* {timer ? (
                <div className="timer">
                    {toast.error(`REQUEST TIME OUT !!! AUTOMATICALLY RELOAD IN FEW SEC`)}
                </div>
            ) : (
                <div className="position-fixed w-100 h-100 text-center loading">
                    <svg width="205" height='250' viewBox='0 0 40 50'>
                        <polygon strokeWidth='1' stroke='#fff' fill='none'
                            points='20,1 40,40 1,40'></polygon>
                        <text fill='#fff' x='5' y='47'>Loading</text>
                    </svg >
                </div >
            )} */}

            {/* <div className="ocean">
                <div className="bubble bubble--1"></div>
                <div className="bubble bubble--2"></div>
                <div className="bubble bubble--3"></div>
                <div className="bubble bubble--4"></div>
                <div className="bubble bubble--5"></div>
                <div className="bubble bubble--6"></div>
                <div className="bubble bubble--7"></div>
                <div className="bubble bubble--8"></div>
                <div className="bubble bubble--9"></div>
                <div className="bubble bubble--10"></div>
                <div className="bubble bubble--11"></div>
                <div className="bubble bubble--12"></div>
                <div id="octocat"></div>
            </div> */}

            <div className="loader">
                <span id='one'></span>
                <span id='two'></span>
                <span id='three'></span>
                <span id='four'></span>
                <span id='five'></span>
                <span id='six'></span>
                <span id='seven'></span>
                <span id='eight'></span>
                <span id='nine'></span>
                <span id='ten'></span>
                <span id='eleven'></span>
                <span id='twelve'></span>
                <span id='thirdteen'></span>
                <span id='fourteen'></span>
                <span id='fifteen'></span>
                <span id='sixteen'></span>
                <span id='seventeen'></span>
                <span id='eighteen'></span>
                <span id='nineteen'></span>
                <span id='twenty'></span>
                <div className="plane"></div>
            </div>
        </div>

    )
}
