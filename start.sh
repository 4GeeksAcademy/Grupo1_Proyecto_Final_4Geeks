#!/bin/bash

flask insert-instructors
flask insert-vehicles
flask insert-schedules

flask run -p 3001 -h 0.0.0.0


