import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const user = store.user;
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };
    const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&size=64`
    : null;

return (
    <nav className="navbar body-tertiary">
        <div className="container-fluid">
            <div className="container-fluid d-flex justify-content-between my-0 py-0">
                <h1 className="navbar-brand ml-4">
                    <NavLink to="/" className="navbar-brand ml-4">RoadUp</NavLink>
                </h1>
                <div className="d-flex justify-content-between mr-4">
                    {
                        !user &&
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item">
                                <NavLink to="/login">Inicia Sesión</NavLink>
                            </li>
                            <li className="list-group-item">
                                <NavLink to="/register">Registro</NavLink>
                            </li>
                        </ul>
                    }

                    {
                        user &&
                        <>
                            <h3 className="navbar-brand d-flex align-items-center ms-auto">
                                Hola {user.first_name}
                            </h3>
                            {/* Avatar */}
                            <img 
                                src={avatarUrl} 
                                alt="Avatar" 
                                className="rounded-circle me-2" 
                                style={{ width: "40px", height: "40px" }} 
                            />
                            <button
                                id="menu_bars"
                                className="navbar-toggler bg-light btn-outline-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasNavbar"
                                aria-controls="offcanvasNavbar"
                                aria-label="Toggle navigation"
                            >
                                <span className="fa-solid fa-bars "></span>
                            </button>
                        </>
                    }
                </div>
            </div>

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">RoadUp</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 w-100">
                        <li className="nav-item">
                            <NavLink to={user?.user_role === "instructor" ? "/clasesinstructor" : "/clasesAlumno"} className="nav-link">Mis clases</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/user" className="nav-link">Mi usuario</NavLink>
                        </li>
                        <li className="nav-item" onClick={handleLogout}>
                            <div className="nav-link" style={{ cursor: "pointer" }}>Cerrar sesión</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
);
};