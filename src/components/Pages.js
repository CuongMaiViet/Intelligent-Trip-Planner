import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AccommodationDetail from './pages/accommodation/AccommodationDetail'
import AdminPanel from './pages/admin_panel/AdminPanel'
import CreateAccommodation from './pages/create_accommodation/CreateAccommodation'
import CreateCuisine from './pages/create_cuisine/CreateCuisine'
import { CreatePlace } from './pages/create_place/CreatePlace'
import Explore from './pages/explore/Explore'
import PlaceDetail from './pages/place/PlaceDetail'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Register from './pages/register/Register'
import RegisterInterest from './pages/register/RegisterInterest'
import CreateTrip from './pages/trip/CreateTrip'
import WelcomePage from './pages/welcome-page/Welcome-page'
import TripDetail from './pages/profile/user-trip-detail/TripDetail'


function Pages() {

    return (
        <Switch>
            <Route path='/' exact component={WelcomePage} />
            {/* Explore */}
            <Route path='/explore/:page' exact component={Explore} />
            {/* place */}
            <Route path='/place/:id' exact component={PlaceDetail} />
            {/* create-edit place */}
            <Route path='/createPlace' exact component={CreatePlace} />
            <Route path='/editPlace/:id' exact component={CreatePlace} />
            {/* create-edit accommodation */}
            <Route path='/accommodation/:id' exact component={AccommodationDetail} />
            <Route path='/createAccommodation' exact component={CreateAccommodation} />
            <Route path='/editAccommodation/:id' exact component={CreateAccommodation} />
            {/* create-edit cuisine */}
            <Route path='/createCuisine' exact component={CreateCuisine} />
            <Route path='/editCuisine/:id' exact component={CreateCuisine} />
            {/* register register-interest */}
            <Route path='/register' exact component={Register} />
            <Route path='/rInterest' exact component={RegisterInterest} />
            {/* login */}
            <Route path='/login' exact component={Login} />
            {/* info */}
            <Route path='/profile' exact component={Profile} />
            <Route path='/admin' exact component={AdminPanel} />
            {/* trip */}
            <Route path='/itinerary' exact component={CreateTrip} />
            <Route path='/trip/:id' exact component={TripDetail} />
            {/* <Route path='/map' exact component={DisplayMapFC} /> */}
        </Switch>
    )
}
export default Pages