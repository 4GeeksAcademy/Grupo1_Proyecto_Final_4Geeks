import React from "react";
import "../../styles/register.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log("se mando el form");
    console.log(data);
  });

  const password = watch("password"); // Para comparación de contraseñas

  return (
    <div className="container">
      <div>RideUp</div>
      <div className="col-lg-4 border rounded p-4 m-2">
        <div>
          <h3>Registro</h3>
          <p>
            Si ya tienes una cuenta, puedes iniciar sesión <a href="#">Aquí</a>
          </p>
        </div>
        <form onSubmit={onSubmit}>
          {/* CORREO ELECTRONICO */}
          <div className="mb-3">
            <label htmlFor="userEmail" className="form-label">
              <i className="fa-regular fa-envelope"></i> Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="userEmail"
              aria-describedby="email"
              {...register("email", {
                required: "El correo es obligatorio",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              })}
            />
            {errors.email && errors.email.type === "required" && (
              <span>{errors.email.message}</span>
            )}
            {errors.email && errors.email.type === "minLength" && (
              <span>{errors.email.message}</span>
            )}
            {errors.email && errors.email.type === "maxLength" && (
              <span>{errors.email.message}</span>
            )}
          </div>

          {/* NOMBRE DE USUARIO */}
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              <i className="fa-solid fa-user"></i> Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="userName"
              aria-describedby="userName"
              {...register("userName", {
                required: "El nombre de usuario es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              })}
            />
            {errors.userName && <span>{errors.userName.message}</span>}
            {errors.userName && errors.userName.type === "minLength" && (
              <span>{errors.userName.message}</span>
            )}
            {errors.userName && errors.userName.type === "maxLength" && (
              <span>{errors.userName.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="userLastName" className="form-label">
              <i className="fa-solid fa-user"></i> Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="userLastName"
              aria-describedby="userLastName"
              {...register("userLastName", {
                required: "El apellido es obligatorio",
              })}
            />
            {errors.userLastName && <span>{errors.userLastName.message}</span>}
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              <i className="fa-solid fa-lock"></i> Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              <i className="fa-solid fa-lock"></i> Repite la contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="userPasswordConfirmation"
              {...register("confirmarPassword", {
                required: "La confirmación de la contraseña es obligatoria",
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
            <label htmlFor="exampleInputPassword1" className="form-label">
              <i className="fa-regular fa-calendar-days"></i> Ingresa tu
              nacimiento
            </label>
            <input
              type="date"
              className="form-control"
              id="userBirthDate"
              {...register("userCumpleanos", {
                required: "La fecha de nacimiento es obligatoria",
                validate: (value) => {
                  console.log(value);
                  const fechaNacimiento = new Date(value);
                  const fechaActual = new Date();
                  const edad =
                    fechaActual.getFullYear() - fechaNacimiento.getFullYear();

                  if(edad>=16){
                    return true
                  }else{
                    return "Debes ser mayor de 16 años para ingresar :("
                  }
                },
              })}
            />
            {errors.userCumpleanos && (
              <span>{errors.userCumpleanos.message}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary rounded-pill w-100">
            Registrate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
