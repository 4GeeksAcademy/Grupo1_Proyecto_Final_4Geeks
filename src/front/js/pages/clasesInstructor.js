import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function ClasesInstructor() {
    const { store } = useContext(Context);
    const [classesList, setClassesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassesList = async () => {
            try {
                const response = await fetch(
                    `${process.env.BACKEND_URL}/api/lessons/instructor`,
                    {
                        headers: {
                            "Instructor-ID": store.user?.user_id, // Corregido para enviar el ID del instructor
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

            // Actualiza la lista localmente
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
            <h3 className="fs-4">Listado de Clases</h3>
            <hr />
            {classesList.length === 0 ? (
                <p className='fs-3'>No tienes clases disponibles para dictar.</p>
            ) : (
                <div className="row mb-4">
                    {classesList.map((cls, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Alumno: {cls.student?.first_name} {cls.student?.last_name}
                                    </h5>
                                    <p className="card-text">
                                        <strong>Teléfono:</strong> {cls.student?.phone_number || "No especificado"}
                                        <br />
                                        <strong>Fecha:</strong> {cls.schedule?.date}
                                        <br />
                                        <strong>Horario:</strong> {cls.schedule?.time_start} - {cls.schedule?.time_end}
                                        <br />
                                        <strong>Vehículo:</strong> {cls.vehicle?.type || "No especificado"}
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
                    <h5 className='mb-5 text-center'>
                        Deberás contactarte con el alumno 1 hora antes para coordinar un punto de encuentro.
                    </h5>
                </div>
            )}
        </div>
    );
}

export default ClasesInstructor;
