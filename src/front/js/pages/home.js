import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, NavLink } from "react-router-dom";
import misionURL from "../../img/mision.png";
import visionURL from "../../img/vision.png";
import valoresURL from "../../img/valores.png";
import motoURL from "../../img/moto.png";
import autoURL from "../../img/auto.png";
import camionURL from "../../img/camion.png";
import bottomWave from "../../img/b-wave.jpg";
import uno from "../../img/01.jpg"
import dos from "../../img/02.jpg"
import tres from "../../img/03.jpg"
import cuatro from "../../img/04.jpg"
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container">
			<div className="jumbotron inter w-100">
				<div className="col-12 col-md-8">
					<h1>Impulsando con éxito el camino hacia la excelencia en el manejo desde 2014</h1>
				</div>
				<div className="col-12 col-md-10 d-flex justify-content-end m-5">
					<h2>Tu confianza al volante empieza en RoadUp!</h2>
				</div>
				<div className="col-12 col-md-11 d-flex justify-content-end ">
					<button type="button" className="btn btn-light btn-lg text-primary  shadow">
						<NavLink to="/register" className="text-primary">Comienza ahora!</NavLink>
					</button>
				</div>
			</div>
			<div className="wave d-none d-sm-block d-md-block">
				<img src={bottomWave} className="wave" />
			</div>
			<div className="empresa container-fluid row justify-content-between mt-3">
				<div className="card col-12 col-md-3">
					<div className="card-body">
						<div className="d-flex justify-content-between m-4 mt-2">
							<h5 className="card-title align-self-center jakarta">Misión</h5>
							<img src={misionURL} className="empresaImg" />
						</div>
						<p className="card-text text-secondary my-3">Formar conductores responsables y seguros,promoviendo la educación vial
							y el respeto por las normas de tránsito,
							con un enfoque en la excelencia y la tecnología moderna.</p>
					</div>
				</div>
				<div className="card col-12 col-md-3">
					<div className="card-body">
						<div className="d-flex justify-content-between m-4 mt-2">
							<h5 className="card-title align-self-center jakarta" >Visión</h5>
							<img src={visionURL} className="empresaImg" />
						</div>
						<p className="card-text text-secondary my-3">
							Responsabilidad: Compromiso con la seguridad y el aprendizaje de nuestro alumnos.
							Excelencia: Garantizar un aprendizaje de calidad.
							Inclusión: Brindar oportunidad de aprendizaje para todas las personas.
						</p>
					</div>
				</div>
				<div className="card col-12 col-md-3">
					<div className="card-body jakarta">
						<div className="d-flex justify-content-between m-4 mt-2">
							<h5 className="card-title align-self-center">Valores</h5>
							<img src={valoresURL} className="empresaImg" />
						</div>
						<p className="card-text text-secondary my-3">
							Liderar la transformación digital en la educación vial,
							integrando tecnología y pedagogía para formar conductores
							altamente capacitados y concientes de su impacto en la
							seguridad vial.
						</p>
					</div>
				</div>
			</div>
			<div className="ruta my-4 ">
				<div className="col-12 col-md-9 ">
					<h1 className="text-center">
						Te ofrecemos un sistema ordenado, sin complicaciones y a tu ritmo.
					</h1>
				</div>
				<div className="col-12 mt-5 d-flex flex-column">
					<h3 id="textoSecundario" className="text-md-end pt-4 mt-auto">
						Anímate a manejar, queremos ayudarte!
					</h3>
				</div>
			</div>
			<div className="pasos text-center justify-content-between jakarta row my-3">
				<h2 className="pasosTitle m-3">Conduce en 4 pasos</h2>
				<div className="col-12 col-md-5 m-3">
					<div className="text-center">
						<div className="d-flex justify-content-center mb-2">
							<img src={uno} className="number" />
							<h4 className="align-self-center ms-2">Inscríbete para tus clases</h4>
						</div>

						<p>Inscríbete para iniciar tus clases de manejo en Montevideo,
							Puedes coordinar el horario para que pasemos a retirar la documentación
							y coordinar luego las horas de clase.
						</p>

						<button type="button" className="btn btn-light btn-lg text-primary  shadow">
							<NavLink to="/register" className="text-primary">Comienza ahora!</NavLink>
						</button>

					</div>
				</div>
				<div className="col-12 col-md-5 m-3">
					<div className="d-flex justify-content-center mb-2">
						<img src={dos} className="number" />
						<h4 className="align-self-center ms-3">Comienza a conducir</h4>
					</div>
					<p>
						Desde las primeras clases de conducción prácticas
						en nuestra academia de choferes.
						Se busca que el alumno comience a conducir para
						adquirir las habilidades prácticas y conocimientos necesarios.
						Todo con el fin de conducir en el tránsito de
						Montevideo de manera autónoma y segura.
					</p>
				</div>
				<div className="col-12 col-md-5 m-3">
					<div className="d-flex justify-content-center mb-2">
						<img src={tres} className="number" />
						<h4 className="align-self-center ms-3">Coordina tus horarios</h4>
					</div>
					<p>Coordina con nuestra academia de choferes los
						horarios que se adapten mejor a tus necesidades y
						tiempos disponibles buscando adaptarnos para tu mayor comodidad.
					</p>
				</div>
				<div className="col-12 col-md-5 m-3">
					<div className="d-flex justify-content-center mb-2">
						<img src={cuatro} className="number" />
						<h4 className="align-self-center ms-3">Obtén tu libreta de conducir</h4>
					</div>
					<p>
						Se brindarán los materiales, conocimientos y habilidades
						para salvar el examen práctico y teórico. Obtendrás tu
						libreta de conducir como en cualquier academia. Pero con
						nosotros también te endocarás en manejar considerando la
						seguridad vial.
					</p>
				</div>
			</div>
			<div className="categorias row justify-content-around p-3">
				<h2 className="mt-3 mb-4">Define que libreta obtener</h2>
				<div className="card col-12 col-md-3">
					<img src={motoURL} className="card-img-top" alt="moto" />
					<div className="card-body">
						<h5 className="card-title cat">Categoría G2</h5>
						<p className="card-text">Ciclomotores de hasta 50cc. de cilindrada sin cambios.</p>
						<div className="text-end">
							<a href="#" className="btn text-light" role="button" data-bs-toggle="button">Más info {`->`}</a>
						</div>
					</div>
				</div>
				<div className="card col-12 col-md-3">
					<img src={autoURL} className="card-img-top" alt="auto" />
					<div className="card-body">
						<h5 className="card-title cat">Categoría A</h5>
						<p className="card-text">Vehículos hasta 9 pasajeros, incluido el conductor;
							camionetas y vehículos con remolque, con un peso máximo total de hasta 4.000 kg.</p>
						<div className="text-end">
							<a href="#" className="btn text-light" role="button" data-bs-toggle="button">Más info {`->`}</a>
						</div>
					</div>
				</div>
				<div className="card col-12 col-md-3">
					<img src={camionURL} className="card-img-top" alt="camión" />
					<div className="card-body">
						<h5 className="card-title cat">Categoría B</h5>
						<p className="card-text">
							Vehículos de hasta 18 pasajeros y camiones cuyo peso total
							(tara más carga) no exceda llos 7.0000 kg. pudiendo llevar
							remolque que no sobrepase los 1.500 kg.
						</p>
						<div className="text-end">
							<a href="#" className="btn text-light" role="button" data-bs-toggle="button">Más info {`->`}</a>
						</div>
					</div>
				</div>
			</div>
			<div className="wave d-none d-sm-block d-md-block">
				<img src={bottomWave} className="wave" />
			</div>
		</div >
	);
};
