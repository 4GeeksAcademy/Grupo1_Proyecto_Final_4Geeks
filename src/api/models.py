from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, time, timedelta, date
from sqlalchemy import func
from flask import Flask

import bcrypt
import uuid
import re


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.String(40), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20),default='student', nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=True)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    profile_image_url = db.Column(db.String(255), nullable=True) 
    birthdate = db.Column(db.Date, nullable=False) 
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    

    def set_password(self, password):
        """Método para establecer la contraseña encriptada."""
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    
    def check_password(self, password):
        """Método para verificar la contraseña."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    
    def serialize(self):
        """Método para serializar los datos del usuario."""
        return {
            "user_id": self.user_id,
            "email": self.email,
            "role": self.role,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "profile_image_url": self.profile_image_url, 
            "birthdate": self.birthdate.strftime("%Y-%m-%d"), 
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


    @staticmethod
    def validate_birthdate(birthdate):
        """Método para validar que la fecha de nacimiento"""
        today = date.today()
        age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
        return age >= 16


    @staticmethod
    def validate_email(email):
        """Valida el correo electrónico"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'
        pattern = re.compile(email_regex)
        return pattern.match(email) is not None


class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    vehicle_id = db.Column(db.String(40), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_type = db.Column(db.String(50), nullable=False)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    lesson_price = db.Column(db.Integer, nullable=False)
    instructor_id = db.Column(db.String(40), db.ForeignKey('users.user_id'), nullable=False)  

    instructor = db.relationship('User', backref=db.backref('vehicles', lazy=True))


    def serialize(self):
        return {
            "vehicle_id": self.vehicle_id,
            "vehicle_type": self.vehicle_type,
            "plate_number": self.plate_number,
            "brand": self.brand,
            "model": self.model,
            "instructor_id": self.instructor_id,
            "lesson_price": self.lesson_price
        }


class Schedule(db.Model):
    __tablename__ = 'schedules'
    schedule_id = db.Column(db.String(40), primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = db.Column(db.String(40), db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)  
    time_start = db.Column(db.Time, nullable=False)
    time_end = db.Column(db.Time, nullable=False)
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    instructor = db.relationship('User', backref=db.backref('schedules', lazy=True))

    def serialize(self):

        return {
            "schedule_id": self.schedule_id,
            "instructor_id": self.instructor_id,
            "date": self.date.strftime("%Y-%m-%d"),
            "time_start": self.time_start.strftime("%H:%M"),
            "time_end": self.time_end.strftime("%H:%M"),
            "is_available": self.is_available,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
        
    @staticmethod
    def validate_date(date_to_check):
        """Valida que la fecha esté entre lunes y viernes"""
        return date_to_check.weekday() < 5 

    @staticmethod
    def validate_time_range(time_start, time_end):
        """Valida que la hora sea entre las 10 y las 18"""

        valid_start_time = time(10, 0)  
        valid_end_time = time(18, 0)    


        if not (valid_start_time <= time_start <= valid_end_time):
            return False

        if not (valid_start_time <= time_end <= valid_end_time):
            return False


        if time_end != (datetime.combine(datetime.today(), time_start) + timedelta(hours=1)).time():
            return False

        return True


class Lesson(db.Model):
    __tablename__ = 'lessons'

    lesson_id = db.Column(db.String(40), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(40), db.ForeignKey('users.user_id'), nullable=False)
    instructor_id = db.Column(db.String(40), db.ForeignKey('users.user_id'), nullable=False)
    schedule_id = db.Column(db.String(40), db.ForeignKey('schedules.schedule_id'), nullable=False)
    status = db.Column(db.String(15), default='Pendiente', nullable=False)
    is_paid = db.Column(db.Boolean, default=False) 
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)


    student = db.relationship('User', foreign_keys=[student_id], backref=db.backref('lessons', lazy=True))
    instructor = db.relationship('User', foreign_keys=[instructor_id])
    schedule = db.relationship('Schedule', backref=db.backref('lessons', lazy=True))

    def serialize(self):
        return {
            "lesson_id": self.lesson_id,
            "student_id": self.student_id,
            "instructor_id": self.instructor_id,
            "schedule_id": self.schedule_id,
            "status": self.status,
            "is_paid": self.is_paid, 
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


    @staticmethod
    def validate_status(status):
        '''Método para validar el estado de la lección.'''
        valid_statuses: list[str] = ['Pendiente', 'Aprobada', 'Cancelada', 'Reprobada']
        return status in valid_statuses

    @staticmethod
    def validate_schedule_instructor(schedule_id, instructor_id):
        '''Método estático para validar que la clase esté asignada al instructor correcto.'''
        schedule = Schedule.query.get(schedule_id)
        if schedule and schedule.instructor_id != instructor_id:
            return False
        return True
    