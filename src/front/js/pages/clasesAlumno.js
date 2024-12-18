import React, { useEffect, useState, useContext } from 'react'; // Importa useContext
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function ClasesAlumno() {
    const { store } = useContext(Context);
    const [classesList, setClassesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassesList = async () => {
            try {
                const response = await fetch(
                    `${process.env.BACKEND_URL}/api/lessons/student`,
                    {
                        headers: {
                            "Student-ID": store.user?.user_id,
                        },
                    }
                );
                if (!response.ok) throw new Error('Error fetching classes');
                const data = await response.json();
                setClassesList(data);
            } catch (error) {
                console.error('Error fetching classes list:', error.message);
            }
        };

        fetchClassesList();
    }, [store.user]);

    const handleCancelLesson = async (lessonId) => {
        try {
            const response = await fetch(
                `${process.env.BACKEND_URL}/api/lesson/cancel`,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Lesson-ID": lessonId,
                    },
                    body: JSON.stringify({ lesson_id: lessonId }),
                }
            );
            if (!response.ok) throw new Error('Error canceling lesson');
            const data = await response.json();
            console.log('Lesson canceled:', data);


            setClassesList((prevClasses) =>
                prevClasses.map((cls) =>
                    cls.lesson_id === lessonId ? { ...cls, status: 'Cancelada' } : cls
                )
            );
        } catch (error) {
            console.error('Error canceling lesson:', error.message);
        }
    };

    return (
        <div className="container mt-5 vh-100">
            <h3 fs-4>Listado de Clases</h3><hr></hr>
            {classesList.length === 0 ? (
                <p className='fs-3'>
                    No hay clases disponibles.{" "}
                    <span
                        className="text-primary fs-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/registroDeClase")}
                    >
                        Reserva aquí
                    </span>
                    .
                </p>
            ) : (
                <div className="row mb-4">
                    {classesList.map((cls, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Instructor: {cls.instructor_first_name} {cls.instructor_last_name}
                                    </h5>
                                    <p className="card-text">
                                        <strong>Fecha:</strong> {cls.date}
                                        <br />
                                        <strong>Horario:</strong> {cls.time_start} - {cls.time_end}
                                        <br />
                                        <strong>Vehículo:</strong> {cls.vehicle_type || "No especificado"}
                                        <br />
                                        <strong>Estado:</strong> {cls.status}
                                        <br />
                                        <strong>Pago:</strong> {cls.is_paid ? "Sí" : "No"}
                                    </p>
                                    {cls.status !== 'Cancelada' && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleCancelLesson(cls.lesson_id)}
                                        >
                                            Cancelar clase
                                        </button>
                                    )}
                                    {cls.status === 'Cancelada' && (
                                        <span className="badge bg-secondary">Clase Cancelada</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                <h5 className='my-5 p-3'>El profesor se pondrá en contacto 1 hora antes para coordinar un punto de encuentro</h5>
                </div>
            )}
            
        </div>
    );
}

export default ClasesAlumno;
