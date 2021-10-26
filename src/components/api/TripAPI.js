import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

function TripAPI() {
    const [trips, setTrip] = useState([])
    const [callback, setCallBack] = useState(false)
    const [placeParam, setPlaceParam] = useState([])
    const [placeLimit, setPlaceLimit] = useState(0)
    const [cuisineLimit, setCuisineLimit] = useState(0)
    const [priceRange, setPriceRange] = useState(30)
    const [accomCate, setAccomCate] = useState('')
    const [cuisineParam, setCuisineParam] = useState([])

    const getTrip = async () => {
        if (placeLimit !== 0 && placeParam.length > 0 &&
            cuisineLimit !== 0 && cuisineParam.length > 0 &&
            accomCate !== '') {

            let placesArray = '?'
            let cuisinesArray = ''

            for (let i = 0; i < placeParam.length; i++) placesArray += `places=${placeParam[i]}&`
            for (let j = 0; j < cuisineParam.length; j++) cuisinesArray += `cuisines=${cuisineParam[j]}&`

            const res = await axios.get(`${API}/itineraries${placesArray}placeLimit=${placeLimit}&accommodations=${accomCate}&accommodationPrice=${priceRange * 100000}&accommodationLimit=10&${cuisinesArray}cuisineLimit=${cuisineLimit}`)

            // console.log(`${API}/itineraries${placesArray}placeLimit=${placeLimit}
            // &accommodations=${accomCate}&accommodationPrice=${priceRange * 100000}&accommodationLimit=10
            // &${cuisinesArray}cuisineLimit=${cuisineLimit}`);
            setTrip(res.data.data);
        }
    }

    useEffect(() => {
        getTrip()

        if (window.sessionStorage.getItem('item')) {
            const items = JSON.parse(window.sessionStorage.getItem('item'))
            setPlaceParam(items.placeParam)
            setPlaceLimit(items.placeLimit)
            setCuisineLimit(items.cuisineLimit)
            setPriceRange(items.priceRange)
            setAccomCate(items.accomCate)
            setCuisineParam(items.cuisineParam)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, placeLimit, cuisineLimit])

    return {
        trips: [trips, setTrip],
        callback: [callback, setCallBack],
        placeLimit: [placeLimit, setPlaceLimit],
        placeParam: [placeParam, setPlaceParam],
        cuisineLimit: [cuisineLimit, setCuisineLimit],
        priceRange: [priceRange, setPriceRange],
        accomCate: [accomCate, setAccomCate],
        cuisineParam: [cuisineParam, setCuisineParam]
    }
}

export default TripAPI