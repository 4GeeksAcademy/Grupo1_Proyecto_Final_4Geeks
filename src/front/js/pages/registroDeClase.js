import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";


function RegistroDeClase() {
    const [vehicleType, setVehicleType] = useState('');
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [scheduleDates, setScheduleDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [lessonPrice, setLessonPrice] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const { store } = useContext(Context)
    const navigate = useNavigate()

    const handleVehicleChange = async (e) => {
        const selectedType = e.target.value;
        setVehicleType(selectedType);

        if (!selectedType) return;

        try {
            const response = await fetch(
                `${process.env.BACKEND_URL}/api/lessons/available?vehicle_type=${selectedType}`
            );
            if (!response.ok) throw new Error('Error fetching instructors');
            const data = await response.json();
            setInstructors(data);
            setLessonPrice(data[0]?.lesson_price || '');
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const handleInstructorChange = (e) => {
        const instructorId = e.target.value;
        setSelectedInstructor(instructorId);

        const instructor = instructors.find((inst) => inst.instructor_id === instructorId);
        if (instructor) {
            const uniqueDates = Array.from(new Set(instructor.schedules.map((s) => s.date)));
            setScheduleDates(uniqueDates);
        }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        const instructor = instructors.find((inst) => inst.instructor_id === selectedInstructor);
        if (instructor) {
            const filteredSchedules = instructor.schedules.filter((s) => s.date === date);
            setSchedules(filteredSchedules);
        }
    };

    const handleSubmit = async (e) => {


        const reservationData = {
            student_id: store.user?.user_id,
            instructor_id: selectedInstructor,
            schedule_id: selectedSchedule,
            status: 'Pendiente',
            is_paid: isPaid,
            is_available: false
        };

        try {
            const response = await fetch(
                `${process.env.BACKEND_URL}/api/reservations`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reservationData),
                }
            );
            if (!response.ok) throw new Error('Error al realizar la reserva');
            
            toast.success("Clase registrada con éxito"); // Notificación de éxito

            resetForm();
            navigate("/clasesAlumno")
        } catch (error) {
            toast.error("Ups, hubo un error :("); // Notificación de error
            console.error('Error:', error.message);
           
        }
    };

    const resetForm = () => {
        setVehicleType('');
        setInstructors([]);
        setSelectedInstructor('');
        setScheduleDates([]);
        setSelectedDate('');
        setSchedules([]);
        setSelectedSchedule('');
        setLessonPrice('');
        setIsPaid(false);
    };

    return (
        <div className="container mt-5">
            <Toaster /> 
            <h2>Reserva de Clase</h2>
            <form >
                <div className="mb-3">
                    <label htmlFor="vehicle-type" className="form-label">
                        Selecciona el tipo de vehículo:
                    </label>
                    <select
                        id="vehicle-type"
                        className="form-select"
                        value={vehicleType}
                        onChange={handleVehicleChange}
                        required
                    >
                        <option value="">Seleccione un vehículo</option>
                        <option value="Auto">Auto</option>
                        <option value="Moto">Moto</option>
                        <option value="Camion">Camion</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="instructor" className="form-label">
                        Selecciona un instructor:
                    </label>
                    <select
                        id="instructor"
                        className="form-select"
                        value={selectedInstructor}
                        onChange={handleInstructorChange}
                        required
                    >
                        <option value="">Seleccione un instructor</option>
                        {instructors.map((inst) => (
                            <option key={inst.instructor_id} value={inst.instructor_id}>
                                {`${inst.first_name} ${inst.last_name}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="schedule-date" className="form-label">
                        Selecciona un día:
                    </label>
                    <select
                        id="schedule-date"
                        className="form-select"
                        value={selectedDate}
                        onChange={handleDateChange}
                        required
                    >
                        <option value="">Seleccione un día</option>
                        {scheduleDates.map((date, index) => (
                            <option key={index} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="schedule" className="form-label">
                        Selecciona un horario:
                    </label>
                    <select
                        id="schedule"
                        className="form-select"
                        value={selectedSchedule}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un horario</option>
                        {schedules.map((s) => (
                            <option key={s.schedule_id} value={s.schedule_id}>
                                {`${s.time_start} - ${s.time_end}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        id="is-paid"
                        className="form-check-input"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                    />
                    <label htmlFor="is-paid" className="form-check-label">
                        Pagado
                    </label>
                    <p className="text-muted">Costo de la lección: {lessonPrice}</p>
                </div>

                <button type="button" onClick={handleSubmit} className="btn btn-primary">
                    Reservar
                </button>
            </form>
        </div>
    );
}

export default RegistroDeClase;
