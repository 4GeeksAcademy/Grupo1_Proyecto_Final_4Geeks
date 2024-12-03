"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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
        return jsonify({"MSG":"error al obtener usuarios", "error":str(e)}), 500
@api.route('/users/<string:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado "}), 404
        return jsonify(user.serialize()), 200
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
        instructor = User.query.filter_by(user_id=instructor_id, role='instructor').first()
        if not instructor:
            return jsonify({"error": "Instructor not found"}), 404
        return jsonify(instructor.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500