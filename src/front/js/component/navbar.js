import React from "react";
import { Link } from "react-router-dom";





export const Navbar = () => {
	//const containerStyle = {
	//backgroundColor: "#153e81",}; style={containerStyle}



	return (

		//<div className="custom-container h-25 d-inline-block border border-primary" style="width: 120px; background-color: rgba(21,62,129,1)"></div>

		//<div className="custom-container h-25 d-inline-block" style="width: 120px; background-color: rgba(21,62,129,1)">

		//<div className="container h-25 d-inline-block " style="width: 120px; background-color: rgba(21,62,129,1)">
		<nav className=" navbar  body-tertiary fixed-top">

			<div className=" container-fluid ">

				<div className=" container-fluid d-flex justify-content-between ">
					<h1 className="navbar-brand  ml-4 ">RideUp</h1>

					<div className="d-flex justify-content-between mr-4">

						<h3 className="navbar-brand text-primary-emphasis d-flex align-items-center ms-auto"> Hola User </h3>

						<button className="navbar-toggler bg-light btn-outline-primary fa-regular fa-user me-2"></button>

						<button className="navbar-toggler bg-light btn-outline-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
							<span className="fa-solid fa-bars "></span>
						</button>
					</div>
				</div>

				<div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
					<div className="offcanvas-header">
						<h5 className="offcanvas-title" id="offcanvasNavbarLabel">RideUp</h5>
						<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div className="offcanvas-body">
						<ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
							<li className="nav-item">
								<a className="nav-link" href="#">Mis clases</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Agendar clase</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Mi usuario</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Cerrar sesión</a>
							</li>

						</ul>

					</div>
				</div>
			</div>

		</nav>



	);

};
