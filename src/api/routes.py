"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vehicle, Schedule, Lesson
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies, unset_jwt_cookies

api = Blueprint('api', __name__)

api.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
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
            "user": user.serialize()
        }), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404


@api.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Sesión cerrada exitosamente"})
    unset_jwt_cookies(response)  
    return response, 200


###


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


@api.route('/instructors/<string:instructor_id>', methods=['GET'])
def get_instructor_by_id(instructor_id):
    try:
        instructor = User.query.filter_by(id=instructor_id, role='instructor').first()
        if not instructor:
            return jsonify({"error": "Instructor no encontrado"}), 404
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

@api.route('/schedules/available', methods=['GET'])
def get_available_schedules():
    try:
        available_schedules = Schedule.query.filter_by(is_available=True).all()
        serialized_schedules = [schedule.serialize() for schedule in available_schedules]
        return jsonify(serialized_schedules), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
