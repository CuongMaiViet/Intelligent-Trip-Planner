import React, { useState } from 'react'
import Loading from '../../../loading/Loading';
import { Link } from "react-router-dom";
import AccommodationTable from './AccommodationTable';
import Search from '../../../feature/search/Search';


export default function Accommodation({ accommodations, callback, setCallBack, token, authAdmin }) {
    const [accomPerPage, setAccomPerPage] = useState(12)
    const [currentAccomPage, setCurrentAccomPage] = useState(1)

    //paginate accom
    const indexOfLastAccom = currentAccomPage * accomPerPage;
    const indexOfFirstAccom = indexOfLastAccom - accomPerPage;
    const totalAccomPage = Math.ceil(accommodations.length / accomPerPage)
    const nextAccomPage = () => {
        if (currentAccomPage !== totalAccomPage) {
            setCurrentAccomPage(currentAccomPage + 1)
        }
    };
    const prevAccomPage = () => {
        if (currentAccomPage !== 1) {
            setCurrentAccomPage(currentAccomPage - 1)
        }
    };

    return (
        <>
            <div className="bd accommodate">
                {accommodations.length === 0 && <Loading />}
                <header className="title">
                    <i className="fas fa-bed"></i> Accommodation
                </header>

                <div className="small-nav">
                    <div className="left active">
                        <i className="fas fa-bars"></i> Module fields
                    </div>

                    <div className="right">
                        <Link to={'/createAccommodation'}>
                            <button>
                                <i className="fas fa-folder-plus"></i>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="table">
                    <div className="table-entry">
                        <div>
                            Show <input type="number" max='12' min='1'
                                onChange={(e) => setAccomPerPage(e.target.value)}
                                placeholder={accomPerPage} /> entries
                        </div>

                        <Search page={'accommodation'} />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>name</th>
                                <th>district</th>
                                <th>score</th>
                                <th>price</th>
                                <th>city</th>
                                <th>3star</th>
                                <th>4star</th>
                                <th>5star</th>
                                <th>homestay</th>
                                <th>latitude</th>
                                <th>longitude</th>
                                {/* <th>update</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        {
                            accommodations.slice(indexOfFirstAccom, indexOfLastAccom).map(p => {
                                return <AccommodationTable token={token} authAdmin={authAdmin} key={p.id} accom={p} callback={callback} setCallBack={setCallBack} />
                            })
                        }
                    </table>
                </div>

                <div className="bottom">
                    <div className="showing">
                        Showing {indexOfFirstAccom} to {indexOfLastAccom} of {accommodations.length} entries
                    </div>

                    <div className="button">
                        <button className="left" onClick={() => prevAccomPage()}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        <button className="right" onClick={() => nextAccomPage()}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}
