import axios from 'axios'
import { useEffect, useState } from 'react'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

export default function CuisinesAPI(props) {
    const [cuisines, setCuisines] = useState([])
    const [callback, setCallback] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    const getCuisines = async () => {
        let param = `?name=${search}`
        const res = await axios.get(`${API}/cuisines${param}&${category}`)
        setCuisines(res.data.data);
    }

    useEffect(() => {
        getCuisines()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, search, category])
    return {
        cuisines: [cuisines, setCuisines],
        callback: [callback, setCallback],
        search: [search, setSearch],
        category: [category, setCategory]
    }
}
