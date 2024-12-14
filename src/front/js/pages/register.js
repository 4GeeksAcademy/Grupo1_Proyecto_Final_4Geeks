import React from "react";
import "../../styles/register.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
const BACKEND_URL = process.env.BACKEND_URL;

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
    fetch(`${BACKEND_URL}/api/create_user`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({...data, role:"instructor"})
    })
  });


/*fetch('https://example.com/api', {
  method: 'POST', // Método HTTP
  headers: {
    'Content-Type': 'application/json' // Tipo de contenido que estás enviando
  },
  body: JSON.stringify({ // Datos que se enviarán
    key1: 'valor1',
    key2: 'valor2'
  })
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parsear la respuesta como JSON
  })
  .then(data => {
    console.log('Respuesta del servidor:', data); // Manejo de los datos de la respuesta
  })
  .catch(error => {
    console.error('Error:', error); // Manejo de errores
  });
 */



  /*   "email": "tester@email.com", 
    "password": "123456", 
    "first_name": "Tester", 
    "last_name": "Prueba", 
    "phone_number": "098333333",
    "birthdate": "2000-12-25",
    "role": "instructor" */


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
            <label htmlFor="first_name" className="form-label">
              <i className="fa-solid fa-user"></i> Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              aria-describedby="first_name"
              {...register("first_name", {
                required: "El nombre de usuario es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              })}
            />
            {errors.first_name && <span>{errors.first_name.message}</span>}
            {errors.first_name && errors.first_name.type === "minLength" && (
              <span>{errors.first_name.message}</span>
            )}
            {errors.first_name && errors.first_name.type === "maxLength" && (
              <span>{errors.first_name.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              <i className="fa-solid fa-user"></i> Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              aria-describedby="last_name"
              {...register("last_name", {
                required: "El apellido es obligatorio",
              })}
            />
            {errors.last_name && <span>{errors.last_name.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">
              <i className="fa-solid fa-user"></i> Celular
            </label>
            <input
              type="number"
              className="form-control"
              id="phone_number"
              aria-describedby="phone_number"
              {...register("phone_number", {
                required: "El celular es obligatorio",
              })}
            />
            {errors.phone_number && <span>{errors.phone_number.message}</span>}
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
              // {...register("confirmarPassword", {
              //   required: "La confirmación de la contraseña es obligatoria",
              //   validate: (value) =>
              //     value === password || "Las contraseñas no coinciden",
              // })}
            />
            {/* {errors.confirmarPassword && (
              <span>{errors.confirmarPassword.message}</span>
            )} */}
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
              {...register("birthdate", {
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
            {errors.birthdate && (
              <span>{errors.birthdate.message}</span>
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
