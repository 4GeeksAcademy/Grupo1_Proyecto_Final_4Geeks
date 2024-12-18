import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Footer = () => {
  // Estados para manejar los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    comen: "",
  });

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple: Verificar campos obligatorios
    if (!formData.nombre || !formData.email) {
      toast.error("Por favor completa los campos obligatorios (Nombre y Email).");
      return;
    }

    // Simulación de envío de datos
    console.log("Formulario enviado:", formData);

    // Notificación de éxito
    toast.success("Consulta enviada con éxito! :D");

    // Limpiar los campos del formulario
    setFormData({
      nombre: "",
      telefono: "",
      email: "",
      comen: "",
    });
  };

  return (
    <div className="container-fluid mt-2">
      <footer className="footer row py-4 px-4">
        {/* Primera Columna */}
        <div className="col-12 col-md-4 text-center text-md-start mb-3">
          <div className="titulo">
            RoadUp Academia de manejo
          </div>

          <div className="parrafo p-3">
            <p>
              Impulsando tu camino hacia la excelencia en el manejo.<br></br>
              Aprende, practica y avanza con confianza.
            </p>
          </div>

          <div className="location p-1">
            <i className="fa-solid fa-location-dot"></i> Francia 242
          </div>

          <div className="sobre p-1">
            <i className="fa-solid fa-envelope"></i> consultas@roadup.com.uy
          </div>

          <div className="phone p-1">
            <i className="fa-solid fa-phone"></i> 598 202-4792
          </div>
        </div>

        {/* Segunda Columna */}
        <div className="col-12 col-md-4 text-center mb-3">
          <Toaster position="top-center" reverseOrder={false} />
          <div className="titulo mb-3">
            <h5>Pregúntanos</h5>
          </div>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <input
                className="form-control form-control-sm mb-2"
                id="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <input
                className="form-control form-control-sm mb-2"
                id="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />
              <input
                className="form-control form-control-sm mb-2"
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                className="form-control form-control-sm mb-2"
                id="comen"
                rows="3"
                placeholder="Comentarios"
                value={formData.comen}
                onChange={handleChange}
              ></textarea>
              <button
                className="boton btn btn-primary btn-sm justify-content-center w-50"
                type="submit"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>

        {/* Tercera Columna */}
        <div className="col-12 col-md-4 d-flex flex-column justify-content-between align-items-end text-md-end mb-3">
          <div className="titulo mb-3">
            <h5>Compañía</h5>
          </div>

          <div className="texto d-flex flex-column align-items-end">
            <p>About Us</p>
            <p>Careers</p>
            <p>FAQs</p>
            <p>Contact Us</p>
          </div>

          <div className="social-icons d-flex">
            <i className="fa-brands fa-square-instagram mx-2"></i>
            <i className="fa-brands fa-square-twitter mx-2"></i>
            <i className="fa-brands fa-facebook mx-2"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
