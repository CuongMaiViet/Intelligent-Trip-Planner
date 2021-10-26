import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

function HaNoiPlaceAPI() {
    const [hanoiplaces, setHaNoiPlaces] = useState([])
    const [callback, setCallBack] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    const getHaNoiPlaces = async () => {
        let param = `?name=${search}`
        const res = await axios.get(`${API}/places${param}&${category}`)
        setHaNoiPlaces(res.data.data);
        // console.log(res)
    }

    useEffect(() => {
        getHaNoiPlaces()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, search, category])

    return {
        hanoiplaces: [hanoiplaces, setHaNoiPlaces],
        callback: [callback, setCallBack],
        search: [search, setSearch],
        category: [category, setCategory]
    }
}
export default HaNoiPlaceAPI