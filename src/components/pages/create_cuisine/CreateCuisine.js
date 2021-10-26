import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Loading from "../../loading/Loading";
import { Globalstate } from '../../../GlobalState';
import { useHistory, useParams } from "react-router-dom";
import './CreateCuisine.scss'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

const initialState = {
    name: '',
    url: '',
    category: 'lunch',
    price: 0,
    img: '',
    lat: '',
    lng: '',
    isChinese: '0',
    isIndian: '0',
    isJapanese: '0',
    isKorean: '0',
    isThai: '0',
    isVietnamese: '0',
    isWestern: '0',
    phone: '',
    address: '',
    openingHours: '',
    city_id: 1
}

toast.configure()
export default function CreateCuisine(props) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [authAdmin] = state.userInfoAPI.authAdmin
    const [cuisineDATA] = state.cuisinesAPI.cuisines
    const [callback, setCallBack] = state.cuisinesAPI.callback
    const [cuisine, setCuisine] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [onEdit, setOnEdit] = useState(false)

    const history = useHistory()
    const param = useParams()

    const handleChange = e => {
        const { name, value } = e.target
        setCuisine({ ...cuisine, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!authAdmin) return toast.warning("Admin resources access denied.")
            setLoading(true)
            if (onEdit) {
                await axios.put(`${API}/cuisines/${param.id}`, cuisine, {
                    headers: {
                        Authorization: token
                    }
                })
            }
            else {
                await axios.post(`${API}/cuisines`, [cuisine], {
                    headers: {
                        Authorization: token
                    }
                })
            }
            setLoading(false)
            setCuisine(initialState)
            setCallBack(!callback)
            history.push("/admin")
            toast.success(`Successfully ${onEdit ? 'update' : 'create'} ${cuisine.name} !(^_^)!`)

        } catch (err) {
            toast.error(err.response.data.msg)
            setLoading(loading)
        }
    }

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            cuisineDATA.forEach(cuisineDATA => {
                if (cuisineDATA.id == param.id) {
                    setCuisine(cuisineDATA)
                }
            })
        }
        else {
            setOnEdit(false)
            setCuisine(initialState)
        }
    }, [param.id, cuisineDATA])


    return (
        <>
            <div className='create-cuisine-page'>
                {loading && <Loading />}
                <form onSubmit={handleSubmit} >
                    <fieldset>
                        <legend className="title">
                            {onEdit ? 'Update Cuisine' : 'Create Cuisine'}
                        </legend>

                        <div className="input input-text">
                            <div className="info-left-hand">
                                {/* cuisine name */}
                                <div className="cuisine name">
                                    <label htmlFor="" className="name">Name</label>
                                    <input type="text" name='name' id='name' required
                                        value={cuisine.name} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine url */}
                                <div className="cuisine url">
                                    <label htmlFor="" className="url">URL</label>
                                    <input type="text" name='url' id='url' required
                                        value={cuisine.url} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine category */}
                                <div className="cuisine category">
                                    <label htmlFor="" className="category">Category</label>
                                    {/* <input type="text" name='category' id='category' required
                                        value={cuisine.category} onChange={handleChange}
                                    /> */}
                                    <select name="category" id="category" required
                                        value={cuisine.category} onChange={handleChange}
                                    >
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                    </select>
                                </div>

                                {/* cuisine price */}
                                <div className="cuisine price">
                                    <label htmlFor="" className="price">Price</label>
                                    <input type="number" name='price' id='price' required
                                        value={cuisine.price} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine openingHours */}
                                <div className="cuisine openingHours">
                                    <label htmlFor="" className="openingHours">Opening Hours</label>
                                    <input type="text" name='openingHours' id='openingHours' required
                                        value={cuisine.openingHours} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="info-right-hand">
                                {/* cuisine latitude */}
                                <div className="cuisine lat">
                                    <label htmlFor="" className="lat">Latitude</label>
                                    <input type="text" name='lat' id='lat' required
                                        value={cuisine.lat} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine longitude */}
                                <div className="cuisine lng">
                                    <label htmlFor="" className="lng">Longitude</label>
                                    <input type="text" name='lng' id='lng' required
                                        value={cuisine.lng} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine img */}
                                <div className="cuisine img">
                                    <label htmlFor="" className="img">Image</label>
                                    <input type="text" name='img' id='img' required
                                        value={cuisine.img} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine address */}
                                <div className="cuisine address">
                                    <label htmlFor="" className="address">Address</label>
                                    <input type="text" name='address' id='address' required
                                        value={cuisine.address} onChange={handleChange}
                                    />
                                </div>

                                {/* cuisine phone */}
                                <div className="cuisine phone">
                                    <label htmlFor="" className="phone">Phone</label>
                                    <input type="text" name='phone' id='phone' required
                                        value={cuisine.phone} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input input-select">
                            {/* is it chinese */}
                            <div className="cuisine Chinese">
                                <label htmlFor="" className="Chinese">
                                    <i className="fas fa-synagogue"></i> Chinese
                                </label>
                                <select name="isChinese" id="isChinese" required
                                    value={cuisine.isChinese} onChange={handleChange}>

                                    <option value='1' key='ChineseYes'>Yes</option>
                                    <option value='0' key='ChineseNo'>No</option>

                                </select>
                            </div>

                            {/* is it Indian */}
                            <div className="cuisine Indian">
                                <label htmlFor="" className="Indian">
                                    <i className="fas fa-hiking"></i> Indian
                                </label>
                                <select name="isIndian" id="isIndian" required
                                    value={cuisine.isIndian} onChange={handleChange}>

                                    <option value='1' key='IndianYes'>Yes</option>
                                    <option value='0' key='IndianNo'>No</option>
                                </select>
                            </div>

                            {/* is it Japanese */}
                            <div className="cuisine Japanese">
                                <label htmlFor="" className="Japanese">
                                    <i className="fas fa-landmark"></i> Japanese
                                </label>
                                <select name="isJapanese" id="isJapanese" required
                                    value={cuisine.isJapanese} onChange={handleChange}>

                                    <option value='1' key='JapanYes'>Yes</option>
                                    <option value='0' key='JapanNo'>No</option>
                                </select>
                            </div>

                            {/* is it Korean */}
                            <div className="cuisine Korean">
                                <label htmlFor="" className="Korean">
                                    <i className="fas fa-tree"></i> Korean
                                </label>
                                <select name="isKorean" id="isKorean" required
                                    value={cuisine.isKorean} onChange={handleChange}>

                                    <option value='1' key='KoreanYes'>Yes</option>
                                    <option value='0' key='KoreanNo'>No</option>
                                </select>
                            </div>

                            {/* is it Thailand */}
                            <div className="cuisine Thailand">
                                <label htmlFor="" className="Thailand">
                                    <i className="fas fa-street-view"></i> Thailand
                                </label>
                                <select name="isThai" id="isThai" required
                                    value={cuisine.isThai} onChange={handleChange}>

                                    <option value='1' key='ThaiYes'>Yes</option>
                                    <option value='0' key='ThaiNo'>No</option>
                                </select>
                            </div>

                            {/* is it Vietnamese */}
                            <div className="cuisine Vietnamese">
                                <label htmlFor="" className="Vietnamese">
                                    <i className="fas fa-church"></i> Vietnamese
                                </label>
                                <select name="isVietnamese" id="isVietnamese" required
                                    value={cuisine.isVietnamese} onChange={handleChange}>

                                    <option value='1' key='VietnameseYes'>Yes</option>
                                    <option value='0' key='VietnameseNo'>No</option>
                                </select>
                            </div>

                            {/* is it Western */}
                            <div className="cuisine Western">
                                <label htmlFor="" className="Western">
                                    <i className="fas fa-store"></i> Western
                                </label>
                                <select name="isWestern" id="isWestern" required
                                    value={cuisine.isWestern} onChange={handleChange}>

                                    <option value='1' key='WesternYes'>Yes</option>
                                    <option value='0' key='WesternNo'>No</option>
                                </select>
                            </div>
                        </div>

                        <button className='submitForm' type="submit">submit</button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}
