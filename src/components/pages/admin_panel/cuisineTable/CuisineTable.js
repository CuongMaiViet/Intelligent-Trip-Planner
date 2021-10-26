import React, { useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../../loading/Loading';

const API = 'https://capstone-tripplanner-back.herokuapp.com'

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

toast.configure()
export function CuisineTable({ cuisine, token, authAdmin, callback, setCallBack }) {
    const [loading, setLoading] = useState(false)

    const handleDeleteCuisine = async () => {
        const confirm = window.confirm(`Do you really want to delete ${cuisine.name}?`)
        try {
            if (confirm === false) {
                return 0
            } else {
                if (!authAdmin) return toast.warning("Admin resources access denied.")
                setLoading(!loading)
                const deleteCuisine = axios.delete(`${API}/cuisines/${cuisine.id}`, {
                    headers: {
                        Authorization: token
                    }
                })
                await deleteCuisine
                setCallBack(!callback)
                toast.success(`Successfully delete ${cuisine.name}`)
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
            <tbody key={cuisine.id}>
                <tr>
                    <td>{cuisine.id}</td>
                    <td>{cuisine.name}</td>
                    <td>{cuisine.address}</td>
                    <td>{cuisine.category}</td>
                    <td>
                        {cuisine.isChinese === 1 && <p>Chinese</p>}
                        {cuisine.isIndian === 1 && <p>Indian</p>}
                        {cuisine.isJapanese === 1 && <p>Japanese</p>}
                        {cuisine.isKorean === 1 && <p>Korean</p>}
                        {cuisine.isThai === 1 && <p>Thailand</p>}
                        {cuisine.isVietnamese === 1 && <p>Vietnamese</p>}
                        {cuisine.isWestern === 1 && <p>Western</p>}
                    </td>
                    <td>{cuisine.openingHours}</td>
                    <td>{numberWithCommas(cuisine.price)}</td>
                    <td>{cuisine.phone}</td>
                    {/* <td>{cuisine.updatedAt.substring(0, 10)}</td> */}
                    <td className='delete-edit'>
                        <button className="delete" onClick={handleDeleteCuisine}>
                            <i className="fas fa-trash-alt"></i>
                        </button>

                        <Link to={`/editCuisine/${cuisine.id}`}>
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
