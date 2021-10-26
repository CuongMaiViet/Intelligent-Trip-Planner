import React, { useState } from 'react'
import PlaceTable from './PlaceTable';
import Loading from '../../../loading/Loading';
import { Link } from "react-router-dom";
import Search from '../../../feature/search/Search';

export default function Place({ places, callback, setCallBack, token, authAdmin }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [placesPerPage, setPlacesPerPage] = useState(12)

    // paginate place
    const indexOfLastPlace = currentPage * placesPerPage;
    const indexOfFirstPlace = indexOfLastPlace - placesPerPage;

    const totalPage = Math.ceil(places.length / placesPerPage)
    const nextPage = () => {
        if (currentPage !== totalPage) {
            setCurrentPage(currentPage + 1)
        }
    };

    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1)
        }
    };

    return (
        <>
            <div className="bd place">
                {places.length === 0 && <Loading />}
                <header className="title">
                    <i className="fas fa-landmark"></i> Place
                </header>

                <div className="small-nav">
                    <div className="left active">
                        <i className="fas fa-bars"></i> Module fields
                    </div>

                    <div className="right">
                        <Link to={'/createPlace'}>
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
                                onChange={(e) => setPlacesPerPage(e.target.value)}
                                placeholder={placesPerPage} /> entries
                        </div>
                        <Search page={'place'} />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>name</th>
                                <th>adventure</th>
                                <th>historical</th>
                                <th>museum</th>
                                <th>nature</th>
                                <th>park</th>
                                <th>religious</th>
                                <th>shopping</th>
                                <th>urban</th>
                                <th>latitude</th>
                                <th>longitude</th>
                                {/* <th>update</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        {
                            places.slice(indexOfFirstPlace, indexOfLastPlace).map(p => {
                                return <PlaceTable token={token} authAdmin={authAdmin} key={p.id} place={p} callback={callback} setCallBack={setCallBack} />
                            })
                        }
                    </table>
                </div>

                <div className="bottom">
                    <div className="showing">
                        Showing {indexOfFirstPlace} to {indexOfLastPlace} of {places.length} entries
                    </div>

                    <div className="button">
                        <button className="left" onClick={() => prevPage()}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        <button className="right" onClick={() => nextPage()}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}
