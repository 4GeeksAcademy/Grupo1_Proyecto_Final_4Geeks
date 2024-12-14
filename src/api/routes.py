"""This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vehicle, Schedule, Lesson
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import timedelta, datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies, unset_jwt_cookies

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

### Login Endpoints

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Faltan credenciales"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"message": "Credenciales incorrectas"}), 401

        if not user.is_active:
            return jsonify({"message": "El usuario está inactivo"}), 403

        access_token = create_access_token(identity=user.user_id)

        response = jsonify({
            "message": "Inicio de sesión exitoso",
            "access_token": access_token,
            "user": user.serialize()
        })

        set_access_cookies(response, access_token)

        return response, 200

    except Exception as e:
        print(f"Error en el login: {str(e)}")
        return jsonify({"message": "Error interno del servidor"}), 500


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify({
            "message": "Acceso permitido",
        }), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404
        

@api.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Sesión cerrada exitosamente"})
    unset_jwt_cookies(response)
    return response, 200


### Crear Usuarios
@api.route("/create_user", methods=["POST"])
def create_students():
    data = request.get_json()

    if not data or not all(key in data for key in ('email', 'password', 'first_name', 'last_name', 'phone_number')):
        return jsonify({"message": "Faltan datos requeridos."}), 400

    if not User.validate_email(data['email']):
        return jsonify({"message": "El email no es válido."}), 400

    try:
        user_id = data.get('user_id', None)
        user = User(
            user_id=user_id,
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data['phone_number'],
            birthdate=data['birthdate'],
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": f"Usuario {data['email']} creado exitosamente."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Hubo un error al crear el usuario.", "error": str(e)}), 500


### Obtener Usuarios
@api.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        users_serialized = [user.serialize() for user in users]
        return jsonify(users_serialized), 200
    except Exception as e:
        return jsonify({"MSG": "Error al obtener usuarios", "error": str(e)}), 500




@api.route('/instructors', methods=['GET'])
def get_all_instructors():
    try:
        instructors = User.query.filter_by(role='instructor').all()
        instructors_serialized = [instructor.serialize() for instructor in instructors]
        return jsonify(instructors_serialized), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/instructors/info', methods=['GET'])
def get_all_instructors_info():
 
    try:
        instructors = (
            User.query
            .filter(User.role == 'instructor', User.is_active == True)
            .all()
        )

        instructors_serialized = []
        for instructor in instructors:

            available_schedules = [
                schedule.serialize() for schedule in instructor.schedules if schedule.is_available
            ]

            instructor_data = {
                "instructor_id": instructor.user_id,
                "first_name": instructor.first_name,
                "last_name": instructor.last_name,
                "phone_number": instructor.phone_number,
                "vehicle_type": instructor.vehicles[0].vehicle_type,   
                "plate_number": instructor.vehicles[0].plate_number,
                "brand": instructor.vehicles[0].brand,
                "model": instructor.vehicles[0].model,
                "lesson_price": instructor.vehicles[0].lesson_price,
                "schedules":available_schedules
                
            }
            instructors_serialized.append(instructor_data)

        return jsonify(instructors_serialized), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



## Agendas Disponibles
@api.route('/schedules/available', methods=['GET'])
def get_available_schedules():
    try:
        available_schedules = Schedule.query.filter_by(is_available=True).all()
        serialized_schedules = [schedule.serialize() for schedule in available_schedules]
        return jsonify(serialized_schedules), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500








"""

@api.route('/users/<string:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado "}), 404
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/instructors/<string:instructor_id>', methods=['GET'])
def get_instructor_by_id(instructor_id):
    try:
        instructor = User.query.filter_by(user_id=instructor_id, role='instructor').first()
        if not instructor:
            return jsonify({"error": "Instructor not found"}), 404
        return jsonify(instructor.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/instructors/<string:instructor_id>/lessons/pending', methods=['GET'])
def get_pending_lessons_by_instructor(instructor_id):
    try:
        pending_lessons = Lesson.query.filter_by(instructor_id=instructor_id, status="Pendiente").all()

        if not pending_lessons:
            return jsonify({"message": "No hay lecciones pendientes para este instructor"}), 404

        lessons_data = [lesson.serialize() for lesson in pending_lessons]
        return jsonify(lessons_data), 200
    except Exception as e:
        return jsonify({"error": "Ha ocurrido un error al obtener las lecciones pendientes", "details": str(e)}), 500



@api.route('/instructors/vehicle/<string:vehicle_id>', methods=['GET'])
def get_instructors_by_vehicle(vehicle_id):
    try:
        instructors = User.query.join(Vehicle).filter(Vehicle.vehicle_id == vehicle_id, User.role == 'instructor').all()
        if not instructors:
            return jsonify([]), 200
        instructors_serialized = [instructor.serialize() for instructor in instructors]
        return jsonify(instructors_serialized), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener instructores", "error": str(e)}), 500


@api.route('/schedules/instructor/<string:instructor_id>/date/<string:date>', methods=['GET'])
def get_available_schedules_by_instructor_and_date(instructor_id, date):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"message": "Formato de fecha incorrecto (YYYY-MM-DD)"}), 400
    try:
        schedules = Schedule.query.filter_by(instructor_id=instructor_id, date=date_obj, is_available=True).all()
        if not schedules:
            return jsonify([]), 200
        serialized_schedules = [schedule.serialize() for schedule in schedules]
        return jsonify(serialized_schedules), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener horarios", "error": str(e)}), 500
    


"""