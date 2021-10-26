import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API = 'https://capstone-tripplanner-back.herokuapp.com'

toast.configure()
export default function UserInfoAPI(token) {
    const [auth, setAuth] = useState(false)
    const [authAdmin, setAuthAdmin] = useState(false)
    const [info, setInfo] = useState([])
    const [callback, setCallBack] = useState(false)

    const getInfo = async () => {
        try {
            const res = await axios.get(`${API}/users/info`, {
                headers: {
                    Authorization: token
                }
            })
            setAuth(true)
            res.data.role === 1 ? setAuthAdmin(true) : setAuthAdmin(false)
            setInfo(res.data);
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }

    useEffect(() => {
        if (token) {
            getInfo()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, callback])

    return {
        auth: [auth, setAuth],
        authAdmin: [authAdmin, setAuthAdmin],
        info: [info, setInfo],
        callback: [callback, setCallBack]
    }
}
