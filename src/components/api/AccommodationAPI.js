import axios from 'axios'
import { useEffect, useState } from 'react'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

export default function AccommodationAPI(props) {
    const [accommodations, setAccommodations] = useState([])
    const [callback, setCallBack] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    const getAccommodations = async () => {
        let param = `?name=${search}`
        const res = await axios.get(`${API}/accommodations${param}&${category}`)
        setAccommodations(res.data.data);
    }

    useEffect(() => {
        getAccommodations()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, callback, category])

    return {
        accommodations: [accommodations, setAccommodations],
        callback: [callback, setCallBack],
        search: [search, setSearch],
        category: [category, setCategory]
    }
}
