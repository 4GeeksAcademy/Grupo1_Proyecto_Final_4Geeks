import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const { store, actions } = useContext(Context);
  const user = store.user
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Datos de inicio de sesión enviados:", data);

    const result = await actions.login(data.email, data.password);

    if (result.success) {
      toast.success("Inicio de sesión exitoso");
      console.log("Inicio de sesión exitoso");

      // Usa el usuario retornado directamente
      // navigate(result.user?.role === "instructor" ? "/clasesAlumno" : "/clasesinstructor");
      navigate("/clasesAlumno");
    } else {
      toast.error("Ups, error al iniciar sesión. Verifica tus credenciales.");
      console.error("Error al iniciar sesión");
    }
  };




  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="col-lg-4 border rounded p-4 shadow">
        <h3 className="text-center">Iniciar sesión</h3>
        <p className="text-center">
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
              autoComplete="new-password"
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
