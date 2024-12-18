"""This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vehicle, Schedule, Lesson
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import timedelta, datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies, unset_jwt_cookies
import traceback
from sqlalchemy import func



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={r"/api/*": {"origins": "*"}})

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


# ### Crear Usuarios
# @api.route("/create_user", methods=["POST"])
# def create_students():
#     data = request.get_json()

#     if not data or not all(key in data for key in ('email', 'password', 'first_name', 'last_name', 'phone_number')):
#         return jsonify({"message": "Faltan datos requeridos."}), 400

#     if not User.validate_email(data['email']):
#         return jsonify({"message": "El email no es válido."}), 400

#     try:
#         user_id = data.get('user_id', None)
#         user = User(
#             user_id=user_id,
#             email=data['email'],
#             password=data['password'],
#             first_name=data['first_name'],
#             last_name=data['last_name'],
#             phone_number=data['phone_number'],
#             birthdate=data['birthdate'],
#         )
#         user.set_password(data['password'])

#         db.session.add(user)
#         db.session.commit()

#         return jsonify({"message": f"Usuario {data['email']} creado exitosamente."}), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": "Hubo un error al crear el usuario.", "error": str(e)}), 500




# Codigo con el rol por defecto en student 
### Crear Usuarios
@api.route("/create_user", methods=["POST"])
def create_students():
    data = request.get_json()

    if not data or not all(key in data for key in ('email', 'password', 'first_name', 'last_name', 'phone_number')):
        return jsonify({"message": "Faltan datos requeridos."}), 400

    if not User.validate_email(data['email']):
        return jsonify({"message": "El email no es válido."}), 400

    role = data.get('role', 'student')  
    valid_roles = ['student', 'instructor']
    if role not in valid_roles:
        return jsonify({"message": f"El campo 'role' debe ser uno de {valid_roles}"}), 400

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
            role=role 
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": f"Usuario {data['email']} creado exitosamente con rol '{role}'."}), 201

    except Exception as e:
        db.session.rollback()
        print("Error al crear el usuario:")
        print(traceback.format_exc())  # Imprime el error completo en la terminal
        return jsonify({
        "message": "Hubo un error al crear el usuario.",
        "error": str(e)  # Dejar el error también en la respuesta
    }), 500


### Obtener Usuarios
@api.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        users_serialized = [user.serialize() for user in users]
        return jsonify(users_serialized), 200
    except Exception as e:
        return jsonify({"MSG": "Error al obtener usuarios", "error": str(e)}), 500






@api.route('/users', methods=['PUT'])
def update_user():
    try:
        user_id_from_header = request.headers.get('User-ID')
        if not user_id_from_header:
            return jsonify({"error": "ID de usuario no encontrado en el header"}), 401

        data = request.json
        print(f"Datos recibidos: {data}")  
        user = User.query.get(user_id_from_header)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        email = data.get('email', user.email)
        first_name = data.get('first_name', user.first_name)
        last_name = data.get('last_name', user.last_name)
        phone_number = data.get('phone_number', user.phone_number)
        profile_image_url = data.get('profile_image_url', user.profile_image_url)


        birthdate_str = data.get('birthdate', user.birthdate)
        try:
            birthdate = datetime.strptime(birthdate_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Fecha de nacimiento no válida"}), 400

        if email and not User.validate_email(email):
            return jsonify({"error": "Email no válido"}), 400
        if birthdate and not User.validate_birthdate(birthdate):
            return jsonify({"error": "Fecha de nacimiento no válida"}), 400

        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.phone_number = phone_number
        user.profile_image_url = profile_image_url
        user.birthdate = birthdate
        user.updated_at = func.now()  

        db.session.commit()

        print(f"Usuario actualizado: {user.serialize()}")  
        return jsonify(user.serialize()), 200

    except Exception as e:
        print("Error al actualizar el usuario:", e)
        return jsonify({"error": "Error interno del servidor"}), 500




@api.route('/lessons/available', methods=['GET'])
def get_instructors_by_vehicle():
    try:

        vehicle_type = request.args.get('vehicle_type', None)


        if vehicle_type:
            instructors = (
                User.query
                .filter(
                    User.role == 'instructor',
                    User.is_active == True,
                    User.vehicles.any(vehicle_type=vehicle_type)  
                )
                .all()
            )
        else:
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
                "lesson_price": instructor.vehicles[0].lesson_price,
                "schedules": available_schedules
            }
            instructors_serialized.append(instructor_data)

        return jsonify(instructors_serialized), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/reservations', methods=['POST'])
def create_lesson():
    try:
        data = request.json

        student_id = data.get('student_id')
        instructor_id = data.get('instructor_id')
        schedule_id = data.get('schedule_id')
        status = data.get('status')
        is_paid = data.get('is_paid')

        if not student_id or not instructor_id or not schedule_id or not status:
            return jsonify({"error": "Datos incompletos"}), 400

        student = User.query.get(student_id)
        instructor = User.query.get(instructor_id)
        schedule = Schedule.query.get(schedule_id)

        if not student or not instructor or not schedule:
            return jsonify({"error": "IDs no válidos"}), 400

        if not Lesson.validate_status(status):
            return jsonify({"error": "Estado de lección no válido"}), 400

        if not Lesson.validate_schedule_instructor(schedule_id, instructor_id):
            return jsonify({"error": "El instructor no está asignado a este horario"}), 400


        if status == 'Pendiente':
            schedule.is_available = False
        else:
            schedule.is_available = True

        new_lesson = Lesson(
            student_id=student_id,
            instructor_id=instructor_id,
            schedule_id=schedule_id,
            status=status,
            is_paid=is_paid
        )

        db.session.add(new_lesson)
        db.session.commit()

        return jsonify(new_lesson.serialize()), 201

    except Exception as e:
        print("Error al crear la lección:", e)
        return jsonify({"error": "Error interno del servidor"}), 500


@api.route('/lessons/student', methods=['GET'])
def get_student_lessons():
    student_id = request.headers.get('Student-ID')

    if not student_id:
        return jsonify({"message": "El id es necesario"}), 400

    lessons = Lesson.query.filter_by(student_id=student_id).all()

    if not lessons:
        return jsonify({"message": "No hay lecciones"}), 404

    result = []
    for lesson in lessons:
        schedule = Schedule.query.get(lesson.schedule_id)
        instructor = User.query.get(lesson.instructor_id)
        vehicle = Vehicle.query.filter_by(instructor_id=instructor.user_id).first()

        lesson_data = {
            "lesson_id": lesson.lesson_id,
            "status": lesson.status,
            "is_paid": lesson.is_paid,
            "date": schedule.date.strftime("%Y-%m-%d") if schedule else None,
            "time_start": schedule.time_start.strftime("%H:%M") if schedule else None,
            "time_end": schedule.time_end.strftime("%H:%M") if schedule else None,
            "instructor_first_name": instructor.first_name if instructor else None,
            "instructor_last_name": instructor.last_name if instructor else None,
            "instructor_phone": instructor.phone_number if instructor else None,
            "vehicle_type": vehicle.vehicle_type if vehicle else None,
        }
        result.append(lesson_data)

    return jsonify(result), 200




@api.route('/lessons/instructor', methods=['GET'])
def get_instructor_lessons():
    instructor_id = request.headers.get('Instructor-ID')

    if not instructor_id:
        return jsonify({"message": "El id del instructor es necesario"}), 400

    lessons = Lesson.query.filter_by(instructor_id=instructor_id).all()

    if not lessons:
        return jsonify({"message": "No hay lecciones"}), 404

    result = []
    for lesson in lessons:
        schedule = Schedule.query.get(lesson.schedule_id)
        student = User.query.get(lesson.student_id)

        # Obtener el vehículo asociado al instructor de la lección
        vehicle = Vehicle.query.filter_by(instructor_id=instructor_id).first()

        lesson_data = {
            "lesson_id": lesson.lesson_id,
            "status": lesson.status,
            "is_paid": lesson.is_paid,
            "schedule": {
                "date": schedule.date.strftime("%Y-%m-%d") if schedule else None,
                "time_start": schedule.time_start.strftime("%H:%M") if schedule else None,
                "time_end": schedule.time_end.strftime("%H:%M") if schedule else None,
            },
            "student": {
                "first_name": student.first_name if student else None,
                "last_name": student.last_name if student else None,
                "phone_number": student.phone_number if student else None,
                "profile_image_url": student.profile_image_url if student else None,
            },
            "vehicle": {
                "type": vehicle.vehicle_type if vehicle else None,  
            }
        }
        result.append(lesson_data)

    return jsonify(result), 200



@api.route('/lesson/cancel', methods=['PUT'])
def cancel_lesson():
    try:
        lesson_id_from_header = request.headers.get('Lesson-ID')
        if not lesson_id_from_header:
            return jsonify({"error": "ID de clase no encontrado en el header"}), 401

        data = request.json
        lesson_id = data.get('lesson_id')
        if not lesson_id:
            return jsonify({"error": "ID de clase no proporcionado"}), 400

        lesson = Lesson.query.get(lesson_id)
        if not lesson or lesson.lesson_id != lesson_id_from_header:
            return jsonify({"error": "Clase no encontrada o ID de clase no coincide"}), 404

        lesson.status = 'Cancelada'
        lesson.updated_at = func.now() 

        schedule = Schedule.query.get(lesson.schedule_id)

        schedule.is_available = True

        db.session.commit()

        return jsonify(lesson.serialize()), 200

    except Exception as e:
        print("Error al cancelar la clase:", e)
        return jsonify({"error": "Error interno del servidor"}), 500




















"""


## Agendas Disponibles
@api.route('/schedules/available', methods=['GET'])
def get_available_schedules():
    try:
        available_schedules = Schedule.query.filter_by(is_available=True).all()
        serialized_schedules = [schedule.serialize() for schedule in available_schedules]
        return jsonify(serialized_schedules), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500









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