import React, { useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../../loading/Loading';

const API = 'https://capstone-tripplanner-back.herokuapp.com'

toast.configure()
export default function PlaceTable({ place, callback, setCallBack, token, authAdmin }) {
    const [loading, setLoading] = useState(false)

    const handleDeletePlace = async () => {
        const confirm = window.confirm(`Do you really want to delete ${place.name}?`)
        try {
            if (confirm === false) {
                return 0
            } else {
                if (!authAdmin) return toast.warning("Admin resources access denied.")

                setLoading(!loading)

                const deletePlace = axios.delete(`${API}/places/${place.id}`, {
                    headers: {
                        Authorization: token
                    }
                })

                await deletePlace

                setCallBack(!callback)
                toast.success(`Successfully delete ${place.name}`)
                setLoading(loading)
            }
        } catch (error) {
            toast.error(error.response.data.msg)
            setLoading(loading)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <tbody key={place.id}>
                <tr>
                    <td>{place.id}</td>
                    <td>
                        <Link to={`/place/${place.id}`} target='_blank' rel="noreferrer">
                            {place.name}
                        </Link>
                    </td>
                    <td>{place.isAdventure}</td>
                    <td>{place.isHistorical}</td>
                    <td>{place.isMuseum}</td>
                    <td>{place.isNature}</td>
                    <td>{place.isPark}</td>
                    <td>{place.isReligious}</td>
                    <td>{place.isShopping}</td>
                    <td>{place.isUrban}</td>
                    <td>{place.lat}</td>
                    <td>{place.lng}</td>
                    {/* <td>{place.updatedAt.substring(0, 10)}</td> */}
                    <td className='delete-edit'>
                        <button className="delete" onClick={handleDeletePlace}>
                            <i className="fas fa-trash-alt"></i>
                        </button>

                        <Link to={`/editPlace/${place.id}`}>
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
