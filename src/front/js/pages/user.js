import React, { useContext } from "react";

import rectangle from "../../img/rectangle.png";
import userImg from "../../img/1.jpg"
import "../../styles/user.css";

export const User = () => {

    return (
        <div className="container-fluid">
            <div className="userContainer p-3 my-md-4 border border-primary border-3 rounded">
                <h1 className="text-center">Ficha de usuario</h1>
                <div className="row m-3">
                    <div className="col-12 col-md-6 text-center text-md-start my-3">
                        <img src={userImg} className="img-thumbnail round border border-primary" alt="Imagen de usuario" />
                    </div>
                    <div className="col-12 col-md-6 text-center align-self-end my-md-3">
                        <button type="button" className="btn btn-secondary shadow-sm">Editar imagen</button>
                    </div>
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Nombre:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Apellido:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Fecha de Nacimiento:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Teléfono:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">email:</span>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Password:</span>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="row justify-content-evenly my-md-5">
                    <button type="button" className="btn btn-light col-4 border border-primary shadow-sm">Editar Perfil</button>
                    <button type="button" className="btn btn-light col-4 border border-primary shadow-sm">Cancelar</button>
                </div>
            </div>
            <div className="d-none d-sm-block d-md-block">
                <img src={rectangle} className="rectangle" />
            </div>
        </div >
    );
};
