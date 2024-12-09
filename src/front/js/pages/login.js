import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Formulario enviado");
    console.log(data);
  };

  return (
    <div className="Container col-lg-4 border rounded p-4 m-2">
      <div className="p-4 m-2">
        <h4>Inicia sesión</h4>
        <p>
          Si no tienes una cuenta, puedes crearla <a href="#">aquí</a>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
            <i className="fa-regular fa-envelope"></i> Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "El formato del correo electrónico no es válido",
                },
              })}
            />
            {errors.email && (
              <div className="text-danger">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
            <i className="fa-solid fa-lock"></i> Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <div className="text-danger">{errors.password.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-pill w-100"
          >
            Inicia sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
