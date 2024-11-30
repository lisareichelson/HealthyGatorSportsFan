web: gunicorn HealthyGatorSportsFanDjango.project.wsgi:application
worker: celery -A HealthyGatorSportsFanDjango.project.celery worker --loglevel=info
beat: celery -A HealthyGatorSportsFanDjango.project.celery beat --loglevel=info