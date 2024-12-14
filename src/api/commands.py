
import click
import datetime
from api.models import db, User, Vehicle, Schedule
from api.data_models import DATA_INSTRUCTORS, DATA_VEHICLES

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

##

    @app.cli.command("insert-instructors")
    def insert_instructors():
        print("Verificando si los instructores ya existen...")
        

        if User.query.filter_by(role="instructor").count() == 20:
            print("Los instructores ya existen en la base de datos. Saltando inserción.")
            return

        print("Creando instructores...")
        for instructor_data in DATA_INSTRUCTORS:
            instructor = User(
                user_id=instructor_data["user_id"],
                email=instructor_data["email"],
                role=instructor_data["role"],
                first_name=instructor_data["first_name"],
                last_name=instructor_data["last_name"],
                birthdate=instructor_data["birthdate"],
                phone_number=instructor_data["phone_number"],
            )
            instructor.set_password(instructor_data["password"])
            db.session.add(instructor)
        db.session.commit()
        print("Instructores creados con éxito.")


    @app.cli.command("insert-vehicles")
    def insert_vehicles():
        print("Verificando si los vehículos ya existen...")
    

        if Vehicle.query.count() == 20:
            print("Los vehículos ya existen en la base de datos. Saltando inserción.")
            return

        print("Creando vehículos...")
        for vehicle_data in DATA_VEHICLES:
            vehicle = Vehicle(
                brand=vehicle_data["brand"],
                vehicle_type=vehicle_data["vehicle_type"],
                plate_number=vehicle_data["plate_number"],
                model=vehicle_data["model"],
                instructor_id=vehicle_data["instructor_id"],
                lesson_price=vehicle_data["lesson_price"],
            )
            db.session.add(vehicle)
        db.session.commit()
        print("Vehículos creados con éxito.")



    @app.cli.command("insert-schedules")
    def insert_schedules():
        print("Verificando si las agendas ya existen...")


        if Schedule.query.count() > 0:
            print("Las agendas ya existen en la base de datos. Saltando generación.")
            return

        print("Generando las agendas...")
        start_date = datetime.date.today()
        end_date = start_date + datetime.timedelta(days=60) 
        instructors = User.query.filter_by(role="instructor").all()
        schedules = []

        for instructor in instructors:
            current_date = start_date
            while current_date <= end_date:
                if current_date.weekday() < 5:  # Lunes a Viernes
                    start_time = datetime.time(10, 0)
                    end_time = datetime.time(18, 0)
                    current_time = start_time
                    while current_time < end_time:
                        next_time = (datetime.datetime.combine(datetime.date(1, 1, 1), current_time) + 
                                    datetime.timedelta(hours=1)).time()
                        schedule = Schedule(
                            instructor_id=instructor.user_id,
                            date=current_date,
                            time_start=current_time,
                            time_end=next_time,
                            is_available=True,
                        )
                        schedules.append(schedule)
                        current_time = next_time
                current_date += datetime.timedelta(days=1)

        db.session.bulk_save_objects(schedules)
        db.session.commit()
        print(f"Generadas {len(schedules)} entradas de agenda para instructores.")

