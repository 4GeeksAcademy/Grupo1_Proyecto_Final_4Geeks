import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function ClassList() {
    const [classesList, setClassesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassesList = async () => {
            try {
                const response = await fetch(
                    `${process.env.BACKEND_URL}/api/lessons/student`,
                    {
                        headers: {
                            "Student-ID": "99dd07d3-cfe1-49da-beb0-2c92e6a9ef43",
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
    }, []);

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

            // Actualiza la lista de clases localmente
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
        <div className="container mt-5">
            <h3>Listado de Clases</h3>
            {classesList.length === 0 ? (
                <p>No hay clases disponibles. <a onClick={navigate("/registroDeClase")}>Regístrate aquí</a>.</p>
            ) : (
                <div className="row">
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
                </div>
            )}
        </div>
    );
}

export default ClassList;
