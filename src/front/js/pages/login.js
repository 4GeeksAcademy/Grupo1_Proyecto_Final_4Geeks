import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Ajusta la ruta según tu estructura de archivos

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Datos de inicio de sesión enviados:", data);

    // Usamos la acción login del flux:
    const success = await actions.login(data.email, data.password);
    if (success) {
      console.log("Inicio de sesión exitoso");
      navigate("/clasesAlumno");
    } else {
      console.error("Error al iniciar sesión");
    }
  };

  return (
    <div className="container">
      <div className="col-lg-4 border rounded p-4 m-4">
        <h3>Iniciar sesión</h3>
        <p>
          Si no tienes una cuenta, puedes registrarte <NavLink to="/register">aquí!</NavLink>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* CORREO ELECTRONICO */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              {...register("email", {
                required: "El correo es obligatorio",
              })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
