import React, { useState } from 'react'
import Loading from '../../../loading/Loading'
import axios from "axios";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API = 'https://capstone-tripplanner-back.herokuapp.com'

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

toast.configure()
export default function AccommodationTable({ accom, callback, setCallBack, token, authAdmin }) {
    const [loading, setLoading] = useState(false)

    const handleDeleteAccom = async () => {
        const confirm = window.confirm(`Do you really want to delete ${accom.name}?`)
        try {
            if (confirm === false) {
                return 0
            } else {
                if (!authAdmin) return toast.warning("Admin resources access denied.")
                setLoading(!loading)
                const deleteAccom = axios.delete(`${API}/accommodations/${accom.id}`, {
                    headers: {
                        Authorization: token
                    }
                })

                await deleteAccom

                setCallBack(!callback)
                toast.success(`Successfully delete ${accom.name}`)
                setLoading(loading)
            }
        } catch (error) {
            toast.error(error.response.data.msg)
            setLoading(loading)
        }
    }
    // console.log(accom);
    return (
        <>
            {loading && <Loading />}
            <tbody key={accom.id}>
                <tr>
                    <td>{accom.id}</td>
                    <td>
                        <Link to={`/accommodation/${accom.id}`} target='_blank' rel="noreferrer">
                            {accom.name}
                        </Link>
                    </td>
                    <td>{accom.district}</td>
                    <td>{accom.score}</td>
                    <td>{numberWithCommas(accom.price)}</td>
                    <td>{accom.city?.name}</td>
                    <td>{accom.is3stars}</td>
                    <td>{accom.is4stars}</td>
                    <td>{accom.is5stars}</td>
                    <td>{accom.isHomestay}</td>
                    <td>{accom.lat}</td>
                    <td>{accom.lng}</td>
                    {/* <td>{accom.updatedAt.substr(0, 10)}</td> */}
                    <td className='delete-edit'>
                        <button className="delete" onClick={handleDeleteAccom}>
                            <i className="fas fa-trash-alt"></i>
                        </button>

                        <Link to={`/editAccommodation/${accom.id}`}>
                            <button className="edit">
                                <i className="fas fa-edit"></i>
                            </button>
                        </Link>
                    </td>
                </tr>
            </tbody>
        </>
    )
}
