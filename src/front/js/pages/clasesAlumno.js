import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function ClassList() {
    const [classesList, setClassesList] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchClassesList = async () => {
            try {
                const response = await fetch(
                    `${process.env.BACKEND_URL}/api/clasesAlumno`
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

    return (
        <div className="container mt-5">
            <h3>Listado de Clases</h3>
            {classesList.length === 0 ? (
                <p>No hay clases disponibles. <a onClick={navigate("/registroDeClase")}>Regístrate aquí</a>.</p>
            ) : (
                <ul className="list-group">
                    {classesList.map((cls, index) => (
                        <li key={index} className="list-group-item">
                            Instructor: {cls.instructor_name} | Fecha: {cls.date} | Horario: {cls.time_start} - {cls.time_end}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ClassList;
