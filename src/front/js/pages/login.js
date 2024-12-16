import React from "react";
import { useForm } from "react-hook-form";

const BACKEND_URL = process.env.BACKEND_URL;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Datos de inicio de sesión enviados:", data);

    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error en el inicio de sesión");
      }
      console.log("Inicio de sesión exitoso:", result);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="container">
      <div className="col-lg-4 border rounded p-4 m-4">
        <h3>Iniciar sesión</h3>
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
            <NavLink to="/clasesAlumno" className="text-primary">Ingresar</NavLink>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
