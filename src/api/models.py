from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import Flask

import bcrypt
import uuid

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(20), unique=False, nullable=False)
    created_at = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.now)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)


    def __repr__(self):
        return f'<User {self.email} Role {self.role} Is Active {self.is_active}>'


    def serialize(self):
        return {
            "user_id": self.user_id,
            "password_hash": self.password_hash,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "is_active": self.is_active
        }


    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash)


class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(20), unique=False, nullable=False)
    last_name = db.Column(db.String(20), unique=False, nullable=True)
    birthday = db.Column(db.Date, unique=False, nullable=False)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)  
    email = db.Column(db.String(120), unique=True, nullable=False)

    user_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    user = db.relationship('User', backref=db.backref('students', lazy=True))


    def __repr__(self):
        return f'<Student {self.first_name} {self.last_name}>'


    def serialize(self):
        return {
            "student_id": self.student_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birthday": self.birthday.strftime("%Y-%m-%d"),
            "phone_number": self.phone_number,
            "email": self.email,
            "user_id": self.user_id
        }



class Instructor(db.Model):
    __tablename__ = 'instructors'
    instructor_id = db.Column(db.String(36), primary_key=True)
    first_name = db.Column(db.String(20), unique=False, nullable=False)
    last_name = db.Column(db.String(20), unique=False, nullable=True)
    phone_number = db.Column(db.String(15), unique=True, nullable=False) 
    email = db.Column(db.String(120), unique=True, nullable=False)
    instructor_type = db.Column(db.String(20), unique=False, nullable=False)

    user_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    user = db.relationship('User', backref=db.backref('instructor', lazy=True))


    def __repr__(self):
        return f'<Instructor {self.first_name} {self.last_name}>'


    def serialize(self):
        return {
            "instructor_id": self.instructor_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "email": self.email,
            "user_id": self.user_id,
            "instructor_type": self.instructor_type
        }


class Vehicles(db.Model):
    __tablename__ = 'vehicles'

    vehicle_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_type = db.Column(db.String(50), nullable=False)  
    plate_number = db.Column(db.String(20), nullable=False, unique=True)  
    brand = db.Column(db.String(50), nullable=True)  
    model = db.Column(db.String(50), nullable=True)  
    instructor_id = db.Column(db.String(36), db.ForeignKey('instructors.instructor_id'), nullable=False)

    instructor = db.relationship('Instructor', backref=db.backref('vehicle', uselist=False))


    def __repr__(self):
        return f'<Vehicle {self.plate_number} - {self.brand} {self.model}>'


    def serialize(self):
        return {
            "vehicle_id": self.vehicle_id,
            "vehicle_type": self.vehicle_type,
            "plate_number": self.plate_number,
            "brand": self.brand,
            "model": self.model,
            "instructor_id": self.instructor_id
        }



class LoginSessions(db.Model):
    __tablename__ = 'login_sessions'
    login_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    token = db.Column(db.String(500), nullable=False)
    is_valid = db.Column(db.Boolean(), unique=False, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user = db.relationship('User', backref=db.backref('login_sessions', lazy=True))


    def __repr__(self):
        return f'<LoginSession login_id={self.login_id}, user_id={self.user_id}, is_valid={self.is_valid}>'


    def serialize(self):
        return {
            "login_id": self.login_id,
            "user_id": self.user_id,
            "token": self.token,
            "is_valid": self.is_valid,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }



class Schedules(db.Model):
    __tablename__ = 'schedules'
    schedule_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = db.Column(db.String(36), db.ForeignKey('instructors.instructor_id'), nullable=False)
    day_of_week = db.Column(db.String(9), nullable=False)
    time_start = db.Column(db.Time, nullable=False)       
    time_end = db.Column(db.Time, nullable=False)        
    is_reserved = db.Column(db.Boolean, default=False, nullable=False) 


    instructor = db.relationship('Instructor', backref=db.backref('schedules', lazy=True))


    def __repr__(self):
        return f'<Schedule {self.day_of_week} {self.time_start}-{self.time_end} Reserved: {self.is_reserved}>'


    def serialize(self):
        return {
            "schedule_id": self.schedule_id,
            "instructor_id": self.instructor_id,
            "day_of_week": self.day_of_week,
            "time_start": self.time_start.strftime("%H:%M"),
            "time_end": self.time_end.strftime("%H:%M"),
            "is_reserved": self.is_reserved 
        }

## adcadb7b4941_ -- Ultima migracion funcional

