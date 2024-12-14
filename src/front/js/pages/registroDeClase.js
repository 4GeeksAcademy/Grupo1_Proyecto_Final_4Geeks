import React from 'react'

export const RegistroDeClase = () => {
    return (

        <div className="container col-6 border rounded border-info p-2 mt-5">
            <div className="text-center">
                <h1>Agendar Clase</h1>
            </div>
            <div className="container">
                <form>
                    <div class="row mt-5">
                        <div class="col-md-6">
                            <label class="form-label">Tipo de Clase:</label>
                            <select class="form-select mb-3" aria-label="Tipo de Clase">
                                <option value="1">Auto</option>
                                <option value="2">Moto</option>
                                <option value="3">Camión</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Cantidad de Clases:</label>
                            <select class="form-select mb-3" aria-label="Cantidad de Clases">
                                <option selected>1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <label class="form-label">Docente:</label>
                            <select class="form-select mb-3" aria-label="Tipo de Clase">
                                <option value="1">Profe</option>
                                
                            </select>
                        </div>
                        <div className="col">
                            <label className="form-label">Precio:</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">$</span>
                        <span className="input-group-text">1.000,00</span>
                    </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Fecha:</label>
                            <input type="date" className="form-control mb-3" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Hora:</label>
                            <select className="form-select mb-3 col-3" aria-label="Tipo de Clase">
                                <option selected>Hora Disponible</option>
                                <option value="1">00</option>
                                <option value="2">01</option>
                                <option value="3">02</option>
                            </select>

                        </div>

                    </div>
                    <label className="form-label col-3">Precio Total:</label>
                    <div className="input-group mb-3 col-1">
                        <span className="input-group-text">$</span>
                        <span className="input-group-text">1.000,00</span>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-success textalign-center">Agendar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegistroDeClase