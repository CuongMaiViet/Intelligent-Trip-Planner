import { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const API = 'https://capstone-tripplanner-back.herokuapp.com'

toast.configure()
export default function UserTripAPI(token) {
    const [usertrip, setUserTrip] = useState([])
    const [callback, setCallBack] = useState(false)

    const getUserTrip = async () => {
        try {
            const res = await axios.get(`${API}/trips`, {
                headers: {
                    Authorization: token
                }
            })
            setUserTrip(res.data.data)

        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }

    useEffect(() => {
        if (token) {
            getUserTrip()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, callback])

    return {
        usertrip: [usertrip, setUserTrip],
        callback: [callback, setCallBack]
    }
}
