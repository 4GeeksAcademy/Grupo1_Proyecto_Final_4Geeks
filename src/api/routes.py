"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vehicle, Schedule, Lesson
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        users_serialized = [user.serialize() for user in users]
        return jsonify(users_serialized), 200
    except Exception as e:
        return jsonify({"MSG": "Error al obtener usuarios", "error": str(e)}), 500


@api.route('/users', methods=['GET'])
@jwt_required()
def get_user_by_token():
    try:
        user_email = get_jwt_identity()
        if not user_email:
            return jsonify({"error": "No se pudo autenticar al usuario"}), 401

        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/token', methods=['POST'])
def create_token():
    try:
        data = request.get_json()
        if not data or "email" not in data:
            return jsonify({"error": "El email es obligatorio"}), 400

        user = User.query.filter_by(email=data["email"]).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        token = create_access_token(identity=user.email)

        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
