import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import Login from "./pages/login";
import Register from "./pages/register";
import { User } from "./pages/user";
import RegistroDeClase from "./pages/registroDeClase";
import ClasesAlumno from "./pages/clasesAlumno";
import ClasesInstructor from "./pages/clasesInstructor";
import { Navbar } from "./component/navbar";

import { Footer } from "./component/footer";
import { MasInfo } from "./pages/masInfo";
import PrivateRoute from "./component/privateRoute";



const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="flex-grow-1">
                        <Routes>
                            <Route element={<Home />} path="/" />
                            <Route element={<Register />} path="/register" />

                            <Route element={<Login />} path="/login" />
                            <Route element={<h1>Not found!</h1>} path="*" />
                            <Route element={<PrivateRoute />}>
                            <Route element={<RegistroDeClase />} path="/registroDeClase" />
                            <Route element={<ClasesAlumno />} path="/clasesAlumno" />
                            <Route element={<ClasesInstructor />} path="/clasesInstructor" />
                            <Route element={<User />} path="/user" />
                            <Route element={<MasInfo />} path="/masInfo" />

                        </Routes>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
