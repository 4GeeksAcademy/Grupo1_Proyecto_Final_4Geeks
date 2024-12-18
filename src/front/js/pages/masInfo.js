import React, { useContext, useState } from "react";
import rectangle from "../../img/rectangle.png";
import "../../styles/user.css";
import { Link, NavLink } from "react-router-dom";

export const MasInfo = () => {


    return (
        <div className="container-fluid">

            <div className="userContainer p-3 my-md-4 border border-primary border-3 rounded">
                <h2 className="text-center text-primary mt-3">Información sobre categorías</h2>

                <div class="card mt-3 rounded-1">
                    <div class="card-header text-center">
                        CATEGORÍA G2
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Edad: 18
                        </p>
                        <p class="card-text">
                            Antiguedad: no
                        </p>
                        <p class="card-text">
                            Médico: 1
                        </p>
                        <p class="card-text">
                            Teórico: 1
                        </p>
                        <p class="card-text">
                            Práctico: 5
                        </p>
                        <p class="card-text">
                            Descripción: Motocicletas y ciclomotores de hasta 200 c.c. de cilindrada. El examen práctico será tomado con motocicletas con cambios no automáticos.

                        </p>
                    </div>
                </div>
                <div class="card mt-3 rounded-1">
                    <div class="card-header text-center">
                        CATEGORÍA B
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Edad: 18
                        </p>
                        <p class="card-text">
                            Antiguedad: no
                        </p>
                        <p class="card-text">
                            Médico:2
                        </p>
                        <p class="card-text">
                            Teórico: 1
                        </p>
                        <p class="card-text">
                            Práctico: 1
                        </p>
                        <p class="card-text">
                            Vehículos hasta 9 pasajeros, incluido el conductor;
                            camionetas y vehículos con remolque, con un peso máximo total de hasta 4.000 kg
                        </p>
                    </div>
                </div>
                <div class="card mt-3 rounded-1">
                    <div class="card-header text-center">
                        CATEGORÍA B
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Edad: 18
                        </p>
                        <p class="card-text">
                            Antiguedad: no
                        </p>
                        <p class="card-text">
                            Médico:2
                        </p>
                        <p class="card-text">
                            Teórico: 1-2
                        </p>
                        <p class="card-text">
                            Práctico: 2
                        </p>
                        <p class="card-text">
                            Descripción: Vehículos de hasta 18 pasajeros y camiones cuyo peso total
                            (tara más carga) no exceda los 7.000 kg ,
                            pudiendo llevar remolque que no sobrepase los 1.500 kg.
                            El examen práctico será tomado con vehículos que excedan los límites de la Categoría A
                        </p>
                    </div>
                </div>
                <div class="card mt-3 rounded-1">
                    <h7 class="card-title text-dark mx-3 mt-2">Su licencia para conducir puede ser limitada por alguna de las siguientes razones:</h7>
                    <div class="card-body">
                        <p class="card-text ms-4">
                            - Necesidad de lentes de corrección para conducir.
                        </p>
                        <p class="card-text ms-4">
                            - Posibilidad de conducir solo en horario diurno.
                        </p>
                        <p class="card-text ms-4">
                            - Adaptaciones mecánicas especiales del vehículo de acuerdo a sus limitaciones físicas.
                        </p>
                        <p class="card-text ms-4">
                            - Otras causas sicofísicas.
                        </p>
                    </div>
                </div>
                <div class="card mt-3 rounded-1">
                    <h7 class="card-title text-dark mx-3 mt-2">
                        Su licencia puede ser negada por las siguientes razones:
                    </h7>
                    <div class="card-body">
                        <p class="card-text ms-4">
                            1. Si usted es una persona menor de 18 años.
                        </p>
                        <p class="card-text ms-4">
                            2. Si usted tiene la licencia suspendida.
                        </p>
                        <p class="card-text ms-4">
                            3. Si usted es un alcoholista habitual o un adicto a drogas.
                        </p>
                        <p class="card-text ms-4">
                            4. Si usted está mental o físicamente incapacitado para conducir con seguridad.
                        </p>
                        <p class="card-text ms-4">
                            5. Si usted no aprueba el examen.
                        </p>
                        <p class="card-text ms-4">
                            6. Si usted es una persona que podría resultar peligrosa para la seguridad pública.
                        </p>
                        <p class="card-text ms-4">
                            7. Si usted posee antecedentes penales (solo en el caso de licencias profesionales).
                        </p>
                    </div>

                </div>
                <div className="row justify-content-center my-md-5">
                    <button id="edit/guardar" type="button" className="btn btn-light col-4 border border-primary shadow-sm">
                        <NavLink to="/register" className="text-primary">Comienza ahora!</NavLink>
                    </button>
                </div>
            </div >
            <div className="d-none d-sm-block d-md-block">
                <img src={rectangle} className="rectangle" />
            </div>
        </div >
    );
};