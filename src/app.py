
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

# Configuración inicial de Flask
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración del entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

app.config["ENV"] = ENV
app.config["DEBUG"] = DEBUG

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL no está configurada en el archivo .env")

app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de JWT
jwt_secret_key = os.getenv("JWT_SECRET_KEY")
if not jwt_secret_key or jwt_secret_key == "clave_secreta":
    raise ValueError("JWT_SECRET_KEY no está configurada correctamente en el archivo .env")

app.config['JWT_SECRET_KEY'] = jwt_secret_key
jwt = JWTManager(app)

# Inicialización de la base de datos
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración adicional
setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix='/api')

# Generación del sitemap
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory("../public/", 'index.html')

# Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Cualquier otro endpoint
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Ejecución principal
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    with app.app_context():
        from api.commands import insert_instructors, insert_vehicles, insert_schedules
        print("Ejecutando comandos personalizados al iniciar la aplicación...")
        insert_instructors()
        insert_vehicles()
        insert_schedules()
        print("Comandos ejecutados con éxito.")
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG)
