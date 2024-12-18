import React, { useContext, useState, useEffect } from "react";
import rectangle from "../../img/rectangle.png";
import userImg from "../../img/1.jpg";
import "../../styles/user.css";
import { Context } from "../store/appContext";

export const User = () => {
    const { store } = useContext(Context);
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

    const apiUrl = "https://automatic-dollop-gpj4656p5r5c9r9q-3001.app.github.dev/user";

    // Actualiza la URL del avatar dinámicamente
    useEffect(() => {
        const fname = formData.fname?.trim();
        const lname = formData.lname?.trim();
        const name = `${fname}+${lname}`;
        setAvatarUrl(`https://ui-avatars.com/api/?name=${name}&size=128&background=random`);
    }, [formData.fname, formData.lname]);

    const getData = () => {
        fetch(apiUrl, { // Ya no envías el id en la URL
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-ID": id, // Enviando el id en el header
            },
        })
            .then(resp => {
                if (resp.status === 404) {
                    createUser();
                }
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Error al obtener los datos del usuario");
            })
            .then(data => {
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
            .catch(error => console.error("Error:", error));
    };


    // Actualizar datos del usuario
    const putData = () => {
        fetch(apiUrl, { // Ya no envías el id en la URL
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "User-ID": id, // Enviando el id en el header
            },
            body: JSON.stringify({
                first_name: formData.fname,
                last_name: formData.lname,
                birthdate: formData.fnac,
                phone_number: formData.tel,
                email: formData.email,
            }),
        })
            .then(resp => {
                if (!resp.ok) throw new Error("Error al actualizar el usuario");
                return resp.json();
            })
            .then(data => {
                console.log("Usuario actualizado:", data);
                setEsEditable(false);
            })
            .catch(error => console.error("Error en la actualización:", error));
    };


    // Crear usuario (temporalmente solo muestra un mensaje)
    const createUser = () => {
        console.log("El usuario no existe. Creando usuario...");
    };

    // Maneja los cambios en los campos del formulario
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Alternar el modo de edición
    const disableInput = () => {
        setEsEditable(!esEditable);
    };

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
                            if (esEditable) putData();
                            disableInput();
                        }}
                    >
                        {esEditable ? "Guardar" : "Editar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-light col-4 border border-primary shadow-sm"
                        onClick={getData}
                    >
                        Cancelar
                    </button>
                </div>
            </div>

            <div className="d-none d-sm-block d-md-block">
                <img src={rectangle} className="rectangle" alt="background" />
            </div>
        </div>
    );
};
