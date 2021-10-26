import React, { useContext, useEffect, useState } from "react";
import { Globalstate } from "../../../GlobalState";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Loading from "../../loading/Loading";
import './CreatePlace.scss'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

const initialState = {
    name: '',
    url: '',
    category: '',
    price: 0,
    description: '',
    img: '',
    img1: '',
    img2: '',
    lat: '',
    lng: '',
    isHistorical: '0',
    isAdventure: '0',
    isMuseum: '0',
    isNature: '0',
    isPark: '0',
    isReligious: '0',
    isShopping: '0',
    isUrban: '0',
    phone: '',
    address: '',
    openingHours: '',
    city_id: 1
}

toast.configure()
export function CreatePlace(props) {
    const state = useContext(Globalstate)
    const [token] = state.token
    const [authAdmin] = state.userInfoAPI.authAdmin
    const [place, setPlace] = useState(initialState)
    const [placeDATA] = state.haNoiPlaceAPI.hanoiplaces
    const [callback, setCallBack] = state.haNoiPlaceAPI.callback
    const [loading, setLoading] = useState(false)
    const [onEdit, setOnEdit] = useState(false)

    const history = useHistory()
    const param = useParams()

    const handleChange = e => {
        const { name, value } = e.target
        setPlace({ ...place, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!authAdmin) return toast.warning("Admin resources access denied.")

            setLoading(true)

            if (onEdit) {
                await axios.put(`${API}/places/${param.id}`, place, {
                    headers: {
                        Authorization: token
                    }
                })
            }
            else {
                await axios.post(`${API}/places`, [place], {
                    headers: {
                        Authorization: token
                    }
                })
            }
            setLoading(false)
            setPlace(initialState)
            setCallBack(!callback)
            history.push("/admin")
            toast.success(`Successfully ${onEdit ? 'update' : 'create'} ${place.name} !(^_^)!`)

        } catch (err) {
            toast.error(err.response.data.msg)
            setLoading(loading)
        }
    }

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            placeDATA.forEach(placeDATA => {
                if (placeDATA.id == param.id) {
                    setPlace(placeDATA)
                }
            })
        }
        else {
            setOnEdit(false)
            setPlace(initialState)
        }
    }, [param.id, placeDATA])

    return (
        <div className='create-place-page'>
            {loading && <Loading />}
            <form onSubmit={handleSubmit} >
                <fieldset>
                    <legend className="title">
                        {onEdit ? 'Update Place' : 'Create Place'}
                    </legend>

                    <div className="input input-text">
                        <div className="info-left-hand">
                            {/* place name */}
                            <div className="place name">
                                <label htmlFor="" className="name">Name</label>
                                <input type="text" name='name' id='name' required
                                    value={place.name} onChange={handleChange}
                                />
                            </div>

                            {/* place url */}
                            <div className="place url">
                                <label htmlFor="" className="url">URL</label>
                                <input type="text" name='url' id='url' required
                                    value={place.url} onChange={handleChange}
                                />
                            </div>

                            {/* place category */}
                            <div className="place category">
                                <label htmlFor="" className="category">Category</label>
                                <input type="text" name='category' id='category' required
                                    value={place.category} onChange={handleChange}
                                />
                            </div>

                            {/* place price */}
                            <div className="place price">
                                <label htmlFor="" className="price">Price</label>
                                <input type="number" name='price' id='price' required
                                    value={place.price} onChange={handleChange}
                                />
                            </div>

                            {/* place openingHours */}
                            <div className="place openingHours">
                                <label htmlFor="" className="openingHours">Opening Hours</label>
                                <input type="text" name='openingHours' id='openingHours' required
                                    value={place.openingHours} onChange={handleChange}
                                />
                            </div>

                            {/* place phone */}
                            <div className="place phone">
                                <label htmlFor="" className="phone">Phone</label>
                                <input type="text" name='phone' id='phone' required
                                    value={place.phone} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="info-right-hand">
                            {/* place latitude */}
                            <div className="place lat">
                                <label htmlFor="" className="lat">Latitude</label>
                                <input type="text" name='lat' id='lat' required
                                    value={place.lat} onChange={handleChange}
                                />
                            </div>

                            {/* place longitude */}
                            <div className="place lng">
                                <label htmlFor="" className="lng">Longitude</label>
                                <input type="text" name='lng' id='lng' required
                                    value={place.lng} onChange={handleChange}
                                />
                            </div>

                            {/* place img */}
                            <div className="place img">
                                <label htmlFor="" className="img">Image 1</label>
                                <input type="text" name='img' id='img' required
                                    value={place.img} onChange={handleChange}
                                />
                            </div>

                            {/* place img1 */}
                            <div className="place img1">
                                <label htmlFor="" className="img1">Image 2</label>
                                <input type="text" name='img1' id='img1' required
                                    value={place.img1} onChange={handleChange}
                                />
                            </div>

                            {/* place img2 */}
                            <div className="place img2">
                                <label htmlFor="" className="img2">Image 3</label>
                                <input type="text" name='img2' id='img2' required
                                    value={place.img2} onChange={handleChange}
                                />
                            </div>

                            {/* place address */}
                            <div className="place address">
                                <label htmlFor="" className="address">Address</label>
                                <input type="text" name='address' id='address' required
                                    value={place.address} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* place description */}
                    <div className="place description">
                        <label htmlFor="" className="description">Description</label>
                        <textarea rows={4} type="text" name='description' id='description' required
                            value={place.description} onChange={handleChange}
                        />
                    </div>

                    <div className="input input-select">
                        {/* is it historical */}
                        <div className="place Historical">
                            <label htmlFor="" className="Historical">
                                <i className="fas fa-synagogue"></i> Historical
                            </label>
                            <select name="isHistorical" id="isHistorical" required
                                value={place.isHistorical} onChange={handleChange}>

                                <option value='1' key='historicalYes'>Yes</option>
                                <option value='0' key='historicalNo'>No</option>

                            </select>
                        </div>

                        {/* is it adventure */}
                        <div className="place Adventure">
                            <label htmlFor="" className="Adventure">
                                <i className="fas fa-hiking"></i> Adventure
                            </label>
                            <select name="isAdventure" id="isAdventure" required
                                value={place.isAdventure} onChange={handleChange}>

                                <option value='1' key='adventureYes'>Yes</option>
                                <option value='0' key='adventureNo'>No</option>

                            </select>
                        </div>

                        {/* is it museum */}
                        <div className="place Museum">
                            <label htmlFor="" className="Museum">
                                <i className="fas fa-landmark"></i> Museum
                            </label>
                            <select name="isMuseum" id="isMuseum" required
                                value={place.isMuseum} onChange={handleChange}>

                                <option value='1' key='MuseumYes'>Yes</option>
                                <option value='0' key='MuseumNo'>No</option>
                            </select>
                        </div>

                        {/* is it nature */}
                        <div className="place Nature">
                            <label htmlFor="" className="Nature">
                                <i className="fas fa-tree"></i> Nature
                            </label>
                            <select name="isNature" id="isNature" required
                                value={place.isNature} onChange={handleChange}>

                                <option value='1' key='NatureYes'>Yes</option>
                                <option value='0' key='NatureNo'>No</option>
                            </select>
                        </div>

                        {/* is it park */}
                        <div className="place Park">
                            <label htmlFor="" className="Park">
                                <i className="fas fa-street-view"></i> Park
                            </label>
                            <select name="isPark" id="isPark" required
                                value={place.isPark} onChange={handleChange}>

                                <option value='1' key='ParkYes'>Yes</option>
                                <option value='0' key='ParkNo'>No</option>
                            </select>
                        </div>

                        {/* is it religious */}
                        <div className="place Religious">
                            <label htmlFor="" className="Religious">
                                <i className="fas fa-church"></i> Religious
                            </label>
                            <select name="isReligious" id="isReligious" required
                                value={place.isReligious} onChange={handleChange}>

                                <option value='1' key='ReligiousYes'>Yes</option>
                                <option value='0' key='ReligiousNo'>No</option>
                            </select>
                        </div>

                        {/* is it shopping */}
                        <div className="place Shopping">
                            <label htmlFor="" className="Shopping">
                                <i className="fas fa-store"></i> Shopping
                            </label>
                            <select name="isShopping" id="isShopping" required
                                value={place.isShopping} onChange={handleChange}>

                                <option value='1' key='ShoppingYes'>Yes</option>
                                <option value='0' key='ShoppingNo'>No</option>
                            </select>
                        </div>

                        {/* is it urban */}
                        <div className="place Urban">
                            <label htmlFor="" className="Urban">
                                <i className="fas fa-city"></i> Urban
                            </label>
                            <select name="isUrban" id="isUrban" required
                                value={place.isUrban} onChange={handleChange}>

                                <option value='1' key='UrbanYes'>Yes</option>
                                <option value='0' key='UrbanNo'>No</option>
                            </select>
                        </div>
                    </div>

                    <button className='submitForm' type="submit">submit</button>
                </fieldset>
            </form>
        </div>
    )
}
