import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";

const PrivateRoute = () => {
    const { store } = useContext(Context);
    const isLoggedIn = store.user !== null; // Verifica si el usuario está logueado

    return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
