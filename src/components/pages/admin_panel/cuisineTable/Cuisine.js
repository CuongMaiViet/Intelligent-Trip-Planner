import React, { useState } from 'react'
import Loading from '../../../loading/Loading';
import { Link } from "react-router-dom";
import { CuisineTable } from './CuisineTable';
import Search from '../../../feature/search/Search';

export default function Cuisine({ cuisines, token, authAdmin, callback, setCallBack }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [cuisinePerPage, setCuisinePerPage] = useState(12)

    // paginate cuisine
    const indexOfLastCuisine = currentPage * cuisinePerPage;
    const indexOfFirstCuisine = indexOfLastCuisine - cuisinePerPage;

    const totalPage = Math.ceil(cuisines.length / cuisinePerPage)
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
            <div className="bd cuisine">
                {cuisines.length === 0 && <Loading />}
                <header className="title">
                    <i className="fas fa-landmark"></i> Cuisine
                </header>

                <div className="small-nav">
                    <div className="left active">
                        <i className="fas fa-bars"></i> Module fields
                    </div>

                    <div className="right">
                        <Link to={'/createCuisine'}>
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
                                onChange={(e) => setCuisinePerPage(e.target.value)}
                                placeholder={cuisinePerPage} /> entries
                        </div>
                        <Search page={'cuisine'} />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>name</th>
                                <th>address</th>
                                <th>category</th>
                                <th>region</th>
                                <th>open</th>
                                <th>price</th>
                                <th>phone</th>
                                {/* <th>update</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        {
                            cuisines.slice(indexOfFirstCuisine, indexOfLastCuisine).map(p => {
                                return <CuisineTable token={token} authAdmin={authAdmin} key={p.id} cuisine={p} callback={callback} setCallBack={setCallBack} />
                            })
                        }
                    </table>
                </div>

                <div className="bottom">
                    <div className="showing">
                        Showing {indexOfFirstCuisine} to {indexOfLastCuisine} of {cuisines.length} entries
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
