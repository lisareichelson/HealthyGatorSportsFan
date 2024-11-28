# project/celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

from app.tasks import setup_periodic_tasks

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

app = Celery('HealthyGatorSportsFan')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

@app.on_after_finalize.connect
def on_after_finalize(sender, **kwargs):
    setup_periodic_tasks(sender, **kwargs)
