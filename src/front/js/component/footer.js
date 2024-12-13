import React, { Component } from "react";

export const Footer = () => (
	<div className="principal container-fluid">
		<footer className="footer d-flex flex-wrap justify-content-between">

			<div className="footer-izq mb-3 text-center text-md-start">

				<div className="titulo">
					RoadUp Academia de manejo
				</div>

				<div className="parrafo">
					<p>Impulsando tu camino hacia la excelencia en el manejo.</p>
					<p>Aprende, practica y avanza con confianza.</p>
				</div>

				<div className="location p-1">
					<i className="fa-solid fa-location-dot"></i> Francia 24
				</div>

				<div className="sobre p-1">
					<i className="fa-solid fa-envelope"></i> consultas@roadup.com.uy
				</div>

				<div className="phone p-1">
					<i className="fa-solid fa-phone"></i> 598 202-4792
				</div>

			</div>

			<div className="footer-centro mb-3 text-center">
				<div className="titulo">
					Pregúntanos
				</div>
				<form className=" row g-3">
					<div className=" col-12 ">
						<input className="form-control form-control-sm mb-2" id="nombre" placeholder="Nombre" required />
						<input className="form-control form-control-sm mb-2" type="text" id="telefono" placeholder="Teléfono" />
						<input className="form-control form-control-sm mb-2" type="email" placeholder="Email" required />
						<textarea className="form-control form-control-sm mb-2" id="comen" rows="3" placeholder="Comentarios"></textarea>
						<button className="boton btn btn-primary d-flex justify-content-end" type="submit">Enviar</button>
					</div>
				</form>

				
			</div>

			<div className="footer-der mb-3 text-center text-md-end">
				<div className="titulo">
					Compañía
				</div>

				<div className="texto">
					<p>About Us</p>
					<p>Careers</p>
					<p>FAQs</p>
					<p>Contact Us</p>
				</div>
				<div className="social-icons">
					<i className="fa-brands fa-square-instagram mx-2"></i>
					<i className="fa-brands fa-square-twitter mx-2"></i>
					<i className="fa-brands fa-facebook mx-2"></i>
				</div>
			</div>

		</footer>
	</div>
);



