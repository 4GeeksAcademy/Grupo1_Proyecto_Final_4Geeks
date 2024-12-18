import React, { useContext, useState, useEffect } from "react";
import rectangle from "../../img/rectangle.png";
import userImg from "../../img/1.jpg";
import "../../styles/user.css";
import { Context } from "../store/appContext";

export const User = () => {
    const { store, actions } = useContext(Context);
    const id = store.user?.user_id;

    const [formData, setFormData] = useState({
        fname: store.user?.first_name || "",
        lname: store.user?.last_name || "",
        fnac: store.user?.birthdate || "",
        tel: store.user?.phone_number || "",
        email: store.user?.email || "",
        pass: "",
    });

    const [esEditable, setEsEditable] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");

    const apiUrl = `${process.env.BACKEND_URL}/users`;

    // Actualiza la URL del avatar dinámicamente
    useEffect(() => {
        const fname = formData.fname.trim();
        const lname = formData.lname.trim();
        const name = `${fname}+${lname}`;
        setAvatarUrl(`https://ui-avatars.com/api/?name=${name}&size=128&background=random`);
    }, [formData.fname, formData.lname]);

    // Actualiza los datos del usuario en el backend y en el store
    const saveData = () => {
        fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "User-ID": id, 
            },
            body: JSON.stringify({
                first_name: formData.fname,
                last_name: formData.lname,
                birthdate: formData.fnac,
                phone_number: formData.tel,
                email: formData.email,
            }),
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Error al guardar los cambios.");
                }
                return resp.json();
            })
            .then((data) => {
                if (data) {
                    // Actualiza el estado global del usuario
                    actions.setUser({
                        ...store.user,
                        first_name: formData.fname,
                        last_name: formData.lname,
                        birthdate: formData.fnac,
                        phone_number: formData.tel,
                        email: formData.email,
                    });

                    setEsEditable(false); // Desactiva el modo edición
                }
            })
            .catch((error) => console.error("Error al actualizar usuario:", error));
    };

    // Obtiene los datos del usuario desde el backend
    const getData = () => {
        fetch(apiUrl, {
            method: "GET",
            headers: {
                "User-ID": id, // Incluye el encabezado requerido
            },
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Error al obtener los datos del usuario.");
                }
                return resp.json();
            })
            .then((data) => {
                if (data) {
                    setFormData({
                        fname: data.first_name,
                        lname: data.last_name,
                        fnac: data.birthdate,
                        tel: data.phone_number,
                        email: data.email,
                        pass: "",
                    });
                }
            })
            .catch((error) => console.error("Error al obtener datos:", error));
    };

    // Maneja los cambios en los campos del formulario
    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    // Alterna el modo de edición
    function disableInput() {
        setEsEditable(!esEditable);
    }

    return (
        <div className="container-fluid">
            <div className="userContainer p-3 my-md-4 border mt-2 h-100 border-3 rounded">
                <h1 className="text-center">Ficha de usuario</h1>

                <div className="row m-3">
                    <div className="col-12 col-md-6 text-center text-md-start my-3">
                        <img
                            src={avatarUrl || userImg}
                            className="img-thumbnail round border border-primary"
                            alt="Imagen de usuario"
                        />
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
                    <span className="input-group-text">Nombre:</span>
                    <input
                        type="text"
                        className="form-control"
                        name="fname"
                        value={formData.fname}
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Apellido:</span>
                    <input
                        type="text"
                        className="form-control"
                        name="lname"
                        value={formData.lname}
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Fecha de Nacimiento:</span>
                    <input
                        type="text"
                        className="form-control"
                        name="fnac"
                        value={formData.fnac}
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Teléfono:</span>
                    <input
                        type="text"
                        className="form-control"
                        name="tel"
                        value={formData.tel}
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Email:</span>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        disabled={!esEditable}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="row justify-content-evenly my-md-5">
                    <button
                        type="button"
                        className={`btn col-4 border border-primary shadow-sm ${esEditable ? "btn-guardar-hover" : "btn-light"}`}
                        onClick={() => {
                            if (esEditable) saveData();
                            disableInput();
                        }}
                    >
                        {esEditable ? "Guardar" : "Editar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-light col-4 border border-primary shadow-sm"
                        onClick={() => getData()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>

            <div className="d-none d-sm-block d-md-block">
                <img src={rectangle} className="rectangle" />
            </div>
        </div>
    );
};
