from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, time, timedelta
from sqlalchemy import func
from flask import Flask

import bcrypt
import uuid
import re



db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=True)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
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

        return {
            "user_id": self.user_id,
            "email": self.email,
            "role": self.role,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    vehicle_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_type = db.Column(db.String(50), nullable=False)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    brand = db.Column(db.String(50), nullable=True)
    model = db.Column(db.String(50), nullable=True)
    instructor_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)  

    instructor = db.relationship('User', backref=db.backref('vehicles', lazy=True))


    def serialize(self):
        return {
            "vehicle_id": self.vehicle_id,
            "vehicle_type": self.vehicle_type,
            "plate_number": self.plate_number,
            "brand": self.brand,
            "model": self.model,
            "instructor_id": self.instructor_id
        }


class Schedule(db.Model):
    __tablename__ = 'schedules'
    schedule_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
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
            "is_reserved": self.is_reserved,
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

        # Valida que la diferencia entre time_start y time_end es una hora
        if time_end != (datetime.combine(datetime.today(), time_start) + timedelta(hours=1)).time():
            return False

        return True