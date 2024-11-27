web: gunicorn HealthyGatorSportsFanDjango.project.wsgi:application
worker: celery -A HealthyGatorSportsFanDjango worker --loglevel=info
beat: celery -A HealthyGatorSportsFanDjango beat --loglevel=info