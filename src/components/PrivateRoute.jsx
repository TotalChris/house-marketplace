import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {useAuthStatus} from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {

    const {loggedIn, checkingStatus} = useAuthStatus();

    if(checkingStatus){
        console.log(loggedIn, checkingStatus)
        return <Spinner></Spinner>
    }

    return (loggedIn ? <Outlet /> : <Navigate to='/sign-in' />);
};

export default PrivateRoute;