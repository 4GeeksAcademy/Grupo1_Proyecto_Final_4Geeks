import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";

export const RegistroDeClase = () => {
    const [tipoClase, setTipoClase] = useState('');
    const [cantidadClases, setCantidadClases] = useState(1);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [isValid, setIsValid] = useState(false);

    const precios = {
        moto: 500,
        auto: 1000,
        camion: 1500,
    };

    const handleTipoClaseChange = (e) => {
        setTipoClase(e.target.value);
    };

    const handleCantidadClasesChange = (e) => {
        const cantidad = parseInt(e.target.value);
        setCantidadClases(cantidad);
        calcularPrecioTotal(tipoClase, cantidad);
    };

    const handleFechaChange = (e) => {
        setFecha(e.target.value);
    };

    const handleHoraChange = (e) => {
        setHora(e.target.value);
    };

    const calcularPrecioTotal = (tipoClase, cantidadClases) => {
        if (!tipoClase) return;
        const precio = precios[tipoClase.toLowerCase()];
        const total = precio * cantidadClases;
        setPrecioTotal(total);
    };

    const validateForm = () => {
        if (tipoClase && cantidadClases && fecha && hora) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    // Recalcular precio total cuando cambie el tipo de clase
    React.useEffect(() => {
        calcularPrecioTotal(tipoClase, cantidadClases);
    }, [tipoClase, cantidadClases]);

    return (
        <div className="container col-6 border rounded p-2 my-5">
            <div className="text-center">
                <h1>Agendar Clase</h1>
            </div>
            <div className="container">
                <form onChange={validateForm}>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <label className="form-label">Tipo de Clase:</label>
                            <select
                                className="form-select mb-3"
                                value={tipoClase}
                                onChange={handleTipoClaseChange}
                                aria-label="Tipo de Clase"
                            >
                                <option value="">Seleccione un tipo de clase</option>
                                <option value="auto">Auto</option>
                                <option value="moto">Moto</option>
                                <option value="camion">Camión</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Cantidad de Clases:</label>
                            <select
                                className="form-select mb-3"
                                value={cantidadClases}
                                onChange={handleCantidadClasesChange}
                                aria-label="Cantidad de Clases"
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label">Docente:</label>
                            <select className="form-select mb-3" aria-label="Docente">
                                <option value="1">Profe</option>
                            </select>
                        </div>
                        <div className="col">
                            <label className="form-label">Precio:</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text">$</span>
                                <span className="input-group-text">
                                    {precios[tipoClase] ? precios[tipoClase] : '0'},00
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Fecha:</label>
                            <input
                                type="date"
                                className="form-control mb-3"
                                value={fecha}
                                onChange={handleFechaChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Hora:</label>
                            <select
                                className="form-select mb-3"
                                value={hora}
                                onChange={handleHoraChange}
                            >
                                <option value="">Hora Disponible</option>
                                <option value="1">00</option>
                                <option value="2">01</option>
                                <option value="3">02</option>
                            </select>
                        </div>
                    </div>
                    <label className="form-label col-3">Precio Total:</label>
                    <div className="input-group mb-3 col-1">
                        <span className="input-group-text">$</span>
                        <span className="input-group-text">{precioTotal},00</span>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-success textalign-center"
                            disabled={!isValid}
                        >
                            <NavLink to="/clasesAlumno" className="text-primary">
                                Agendar
                            </NavLink>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistroDeClase;
