import React, { useContext, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Loading from '../../loading/Loading';
import { Globalstate } from '../../../GlobalState';
import { useHistory, useParams } from 'react-router-dom';
import './CreateAccommodation.scss'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

const initialState = {
    name: '',
    url: '',
    img: '',
    district: '',
    hasBreakfast: '0',
    hasFreeCancel: '0',
    hasKitchen: '0',
    hasNoPrepayment: '0',
    is3stars: '0',
    is4stars: '0',
    is5stars: '0',
    isHomestay: '0',
    price: 0,
    score: '',
    lat: '',
    lng: '',
    address: '',
    phone: '',
    city_id: 1
}

toast.configure()
export default function CreateAccommodation(props) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [authAdmin] = state.userInfoAPI.authAdmin
    const [accom, setAccom] = useState(initialState)
    const [accomDATA] = state.accommodationAPI.accommodations
    const [callback, setCallBack] = state.accommodationAPI.callback
    const [loading, setLoading] = useState(false)
    const [onEdit, setOnEdit] = useState(false)

    const history = useHistory()
    const param = useParams()

    const handleChange = e => {
        const { name, value } = e.target
        setAccom({ ...accom, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!authAdmin) return toast.warning("Admin resources access denied.")

            setLoading(true)

            if (onEdit) {
                await axios.put(`${API}/accommodations/${param.id}`, { ...accom }, {
                    headers: {
                        Authorization: token
                    }
                })
            }
            else await axios.post(`${API}/accommodations`, [accom], {
                headers: {
                    Authorization: token
                }
            })
            setLoading(false)
            setAccom(initialState)
            setCallBack(!callback)
            history.push("/admin")
            toast.success(`Successfully ${onEdit ? 'update' : 'create'} ${accom.name} !(^_^)!`)

        } catch (err) {
            toast.error(err.reponse.data.msg)
            setLoading(loading)
        }
    }

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            accomDATA.forEach(data => {
                if (data.id == param.id) {
                    setAccom(data)
                }
            })
        } else {
            setOnEdit(false)
            setAccom(initialState)
        }
    }, [param.id, accomDATA])

    return (
        <div className='create-accom-page'>
            {loading && <Loading />}

            <form onSubmit={handleSubmit} >
                <fieldset>
                    <legend className="title">
                        {onEdit ? 'Update Accommodation' : 'Create Accommodation'}
                    </legend>

                    <div className="input input-text">
                        <div className="info-left-hand">
                            {/* accom name */}
                            <div className="accom name">
                                <label htmlFor="" className="name">Name</label>
                                <input type="text" name='name' id='name' required
                                    value={accom.name} onChange={handleChange}
                                />
                            </div>
                            {/* accom url */}
                            <div className="accom url">
                                <label htmlFor="" className="url">url</label>
                                <input type="text" name='url' id='url' required
                                    value={accom.url} onChange={handleChange}
                                />
                            </div>
                            {/* accom img */}
                            <div className="accom img">
                                <label htmlFor="" className="img">img</label>
                                <input type="text" name='img' id='img' required
                                    value={accom.img} onChange={handleChange}
                                />
                            </div>
                            {/* accom district */}
                            <div className="accom district">
                                <label htmlFor="" className="district">district</label>
                                <input type="text" name='district' id='district' required
                                    value={accom.district} onChange={handleChange}
                                />
                            </div>
                            {/* accom price */}
                            <div className="accom price">
                                <label htmlFor="" className="price">Price</label>
                                <input type="number" name='price' id='price' required
                                    value={accom.price} onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="info-right-hand">
                            {/* accom score */}
                            <div className="accom score">
                                <label htmlFor="" className="score">score</label>
                                <input type="text" name='score' id='score' required
                                    value={accom.score} onChange={handleChange}
                                />
                            </div>
                            {/* accom lat */}
                            <div className="accom lat">
                                <label htmlFor="" className="lat">lat</label>
                                <input type="text" name='lat' id='lat' required
                                    value={accom.lat} onChange={handleChange}
                                />
                            </div>
                            {/* accom lng */}
                            <div className="accom lng">
                                <label htmlFor="" className="lng">lng</label>
                                <input type="text" name='lng' id='lng' required
                                    value={accom.lng} onChange={handleChange}
                                />
                            </div>
                            {/* accom address */}
                            <div className="accom address">
                                <label htmlFor="" className="address">address</label>
                                <input type="text" name='address' id='address' required
                                    value={accom.address} onChange={handleChange}
                                />
                            </div>
                            {/* accom phone */}
                            <div className="accom phone">
                                <label htmlFor="" className="phone">phone</label>
                                <input type="text" name='phone' id='phone' required
                                    value={accom.phone} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input input-select">
                        {/* is it 3star */}
                        <div className="accom 3star">
                            <label htmlFor="" className="3star">
                                3star
                            </label>
                            <select name="is3stars" id="is3stars" required
                                value={accom.is3stars} onChange={handleChange}>
                                <option value='1' key='is3starsYes'>Yes</option>
                                <option value='0' key='is3starsNo'>No</option>
                            </select>
                        </div>
                        {/* is it 4star */}
                        <div className="accom 4star">
                            <label htmlFor="" className="4star">
                                4star
                            </label>
                            <select name="is4stars" id="is4stars" required
                                value={accom.is4stars} onChange={handleChange}>
                                <option value='1' key='is4starsYes'>Yes</option>
                                <option value='0' key='is4starsNo'>No</option>
                            </select>
                        </div>
                        {/* is it 5star */}
                        <div className="accom 5star">
                            <label htmlFor="" className="5star">
                                5star
                            </label>
                            <select name="is5stars" id="is5stars" required
                                value={accom.is5stars} onChange={handleChange}>
                                <option value='1' key='is5starsYes'>Yes</option>
                                <option value='0' key='is5starsNo'>No</option>
                            </select>
                        </div>
                        {/* is it homestay */}
                        <div className="accom homestay">
                            <label htmlFor="" className="homestay">
                                homestay
                            </label>
                            <select name="isHomestay" id="isHomestay" required
                                value={accom.isHomestay} onChange={handleChange}>
                                <option value='1' key='isHomestayYes'>Yes</option>
                                <option value='0' key='isHomestayNo'>No</option>
                            </select>
                        </div>
                        {/* is it breakfast */}
                        <div className="accom breakfast">
                            <label htmlFor="" className="breakfast">
                                breakfast
                            </label>
                            <select name="hasBreakfast" id="hasBreakfast" required
                                value={accom.hasBreakfast} onChange={handleChange}>
                                <option value='1' key='hasBreakfastYes'>Yes</option>
                                <option value='0' key='hasBreakfastNo'>No</option>
                            </select>
                        </div>
                        {/* is it freecancel */}
                        <div className="accom freecancel">
                            <label htmlFor="" className="freecancel">
                                freecancel
                            </label>
                            <select name="hasFreeCancel" id="hasFreeCancel" required
                                value={accom.hasFreeCancel} onChange={handleChange}>
                                <option value='1' key='hasFreeCancelYes'>Yes</option>
                                <option value='0' key='hasFreeCancelNo'>No</option>
                            </select>
                        </div>
                        {/* is it kitchen */}
                        <div className="accom kitchen">
                            <label htmlFor="" className="kitchen">
                                kitchen
                            </label>
                            <select name="hasKitchen" id="hasKitchen" required
                                value={accom.hasKitchen} onChange={handleChange}>
                                <option value='1' key='hasKitchenYes'>Yes</option>
                                <option value='0' key='hasKitchenNo'>No</option>
                            </select>
                        </div>
                        {/* is it no-repayment */}
                        <div className="accom no-repayment">
                            <label htmlFor="" className="no-repayment">
                                no-repayment
                            </label>
                            <select name="hasNoPrepayment" id="hasNoPrepayment" required
                                value={accom.hasNoPrepayment} onChange={handleChange}>
                                <option value='1' key='hasNoPrepaymentYes'>Yes</option>
                                <option value='0' key='hasNoPrepaymentNo'>No</option>
                            </select>
                        </div>
                    </div>

                    <button className='submitForm' type="submit">submit</button>
                </fieldset>
            </form>
        </div>
    )
}
