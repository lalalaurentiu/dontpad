web: daphne dontpad.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker channels --settings=dontpad.settings -v2