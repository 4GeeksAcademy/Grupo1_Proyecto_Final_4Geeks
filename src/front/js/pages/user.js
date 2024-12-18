import React, { useContext, useState } from "react";
import rectangle from "../../img/rectangle.png";
import userImg from "../../img/1.jpg"
import "../../styles/user.css";
import { Context } from "../store/appContext";
export const User = () => {
    const { store } = useContext(Context);
    const id = store.user?.user_id
    const [formData, setFormData] = useState({
        fname: store.user?.first_name,
        lname: store.user?.last_name,
        fnac: store.user?.birthdate,
        tel: store.user?.phone_number,
        email: store.user?.email,
        pass: "",
    });
    const [esEditable, setEsEditable] = useState(false);
    const apiUrl = `${process.env.BACKEND_URL}/user`;

    const getData = () => {
        fetch(apiUrl + '/user/' + id)
            .then(resp => {
                if (resp.status == 404) {
                    createUser();
                }

                if (resp.ok) {
                    return resp.json();
                }
            })

            .then(data => {
                if (data) {
                    setFirstName(data.user);
                }
            })

            .catch(error => {
                // Error handling
                console.error(error);
            });
    }
    const putData = () => {
        fetch(apiUrl + '/user/' + id)
            .then(resp => {
                if (resp.status == 404) {
                    createUser();
                }

                if (resp.ok) {
                    return resp.json();
                }
            })

            .then(data => {
                if (data) {
                    setFirstName(data.user);
                }
            })

            .catch(error => {
                // Error handling
                console.error(error);
            });
    }

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function disableInput() {
        setEsEditable(!esEditable)
    }

    return (
        <div className="container-fluid">

            <div className="userContainer p-3 my-md-4 border mt-2 h-100 border-3 rounded">
                <h1 className="text-center">Ficha de usuario</h1>

                <div className="row m-3">
                    <div className="col-12 col-md-6 text-center text-md-start my-3">
                        <img src={userImg} className="img-thumbnail round border border-primary" alt="Imagen de usuario" />
                    </div>
                    {esEditable && (
                        <div className="col-12 col-md-6 text-center align-self-end my-md-3">
                            <button type="button" className="btn btn-secondary shadow-sm">
                                Editar imagen
                            </button>
                        </div>
                    )}
                </div>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm" value="Leti">Nombre:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                        value={formData.fname}
                        name="fname"
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Apellido:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                        value={formData.lname}
                        name="lname"
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Fecha de Nacimiento:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                        value={formData.fnac}
                        name="fnac"
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Teléfono:</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                        value={formData.tel}
                        name="tel"
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">email:</span>
                    <input type="email" className="form-control" id="exampleFormControlInput1"
                        value={formData.email}
                        name="email"
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Password:</span>
                    <input type="password" className="form-control" id="exampleInputPassword1"
                        value={formData.pass}
                        name="pass"
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="row justify-content-evenly my-md-5">
                    <button
                        id="edit/guardar"
                        type="button"
                        className={`btn col-4 border border-primary shadow-sm ${esEditable ? "btn-guardar-hover" : "btn-light"}`}
                        onClick={disableInput}
                    >
                        {esEditable ? "Guardar" : "Editar"}
                    </button>
                    <button
                        id="cancelar"
                        type="button"
                        className="btn btn-light col-4 border border-primary shadow-sm"
                        onClick={() => {
                            getData();
                        }}
                    >
                        Cancelar
                    </button>
                </div>

            </div>
            <div className="d-none d-sm-block d-md-block">
                <img src={rectangle} className="rectangle" />
            </div>
        </div >
    );
};