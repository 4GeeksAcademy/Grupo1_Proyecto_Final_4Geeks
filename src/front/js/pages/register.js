import React, { useState } from "react";
import "../../styles/register.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast"; // Importar toast y Toaster

const BACKEND_URL = process.env.BACKEND_URL;

const Register = () => {
  const [alert, setAlert] = useState(null); // Estado para la alerta
  const navigate = useNavigate(); // Hook para redirigir

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = handleSubmit((data) => {
    const { confirmarPassword, ...dataToSend } = data;

    fetch(`${BACKEND_URL}/api/create_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Respuesta del servidor:", responseData);
        setAlert("Usuario creado con éxito!"); // Mostrar alerta de éxito
        toast.success("Bienvenido!"); // Notificación de éxito

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        setAlert("Error al registrar el usuario. Intenta de nuevo.");
      });
  });

  return (
    <div className="container">
      <div className="col-lg-4 border rounded p-4 m-4">
        <h3>Registro</h3>
        <p>
          Si ya tienes una cuenta, inicia sesión{" "}
          <NavLink to="/login" className="text-primary">
            aquí!
          </NavLink>
        </p>

        {/* ALERTA */}
        {alert && (
          <div
            className={`alert ${
              alert.includes("éxito") ? "alert-success" : "alert-danger"
            } alert-dismissible fade show`}
            role="alert"
          >
            {alert}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={onSubmit}>
          {/* CORREO ELECTRONICO */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <i className="fa-regular fa-envelope"></i> Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              {...register("email", {
                required: "El correo es obligatorio",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
              })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          {/* NOMBRE */}
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              <i className="fa-solid fa-user"></i> Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              {...register("first_name", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
            />
            {errors.first_name && <span>{errors.first_name.message}</span>}
          </div>

          {/* APELLIDO */}
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              <i className="fa-solid fa-user"></i> Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              {...register("last_name", { required: "El apellido es obligatorio" })}
            />
            {errors.last_name && <span>{errors.last_name.message}</span>}
          </div>

          {/* CELULAR */}
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">
              <i className="fa-solid fa-phone"></i> Celular
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone_number"
              {...register("phone_number", {
                required: "El celular es obligatorio",
                pattern: { value: /^[0-9]+$/, message: "Ingresa solo números" },
              })}
            />
            {errors.phone_number && <span>{errors.phone_number.message}</span>}
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <i className="fa-solid fa-lock"></i> Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="mb-3">
            <label htmlFor="confirmarPassword" className="form-label">
              <i className="fa-solid fa-lock"></i> Confirmar contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmarPassword"
              {...register("confirmarPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmarPassword && (
              <span>{errors.confirmarPassword.message}</span>
            )}
          </div>

          {/* FECHA DE NACIMIENTO */}
          <div className="mb-3">
            <label htmlFor="birthdate" className="form-label">
              <i className="fa-regular fa-calendar-days"></i> Fecha de nacimiento
            </label>
            <input
              type="date"
              className="form-control"
              id="birthdate"
              {...register("birthdate", {
                required: "La fecha de nacimiento es obligatoria",
                validate: (value) => {
                  const fechaNacimiento = new Date(value);
                  const edad =
                    new Date().getFullYear() - fechaNacimiento.getFullYear();
                  return edad >= 16 || "Debes ser mayor de 16 años";
                },
              })}
            />
            {errors.birthdate && <span>{errors.birthdate.message}</span>}
          </div>

          {/* BOTÓN DE REGISTRO */}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
