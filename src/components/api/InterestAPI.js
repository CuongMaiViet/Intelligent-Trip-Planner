import axios from 'axios'
import { useEffect, useState } from 'react'

const API = 'https://capstone-tripplanner-back.herokuapp.com'

export default function InterestAPI(props) {
    const [interests, setInterests] = useState([])
    const [callback, setCallBack] = useState(false)

    const getInterests = async () => {
        const res = await axios.get(`${API}/interests`)
        setInterests(res.data);
    }

    useEffect(() => {
        getInterests()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback])

    return {
        interests: [interests, setInterests],
        callback: [callback, setCallBack]
    }
}
