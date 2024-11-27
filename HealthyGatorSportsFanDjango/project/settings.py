"""
Django settings for project project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""
# For accessing environment variables
import os

# For accessing environment variables from your .env file
from dotenv import load_dotenv
# Load environment variables from the .env file
load_dotenv()

# Package to handle Heroku database configuration
import dj_database_url

from pathlib import Path

from celery.schedules import crontab, schedule

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Use the PORT environment variable set by Heroku.
# Gunicorn (see Procfile) uses the dynamic port assigned by Heroku, or defaults to 8000 if PORT is not set.
# Running 'python manage.py runserver 0.0.0.0:8000' explicitly sets the port for local testing,
# while 'python manage.py runserver' defaults to the fallback port (8000).
PORT = os.getenv('PORT', '8000')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['healthygatorsportsfan-84ee3c84673f.herokuapp.com','127.0.0.1', 'localhost', '192.168.68.124', '192.168.4.168', 'b862-184-185-222-16.ngrok-free.app', 'sawfish-premium-unlikely.ngrok-free.app', 'strongly-inviting-stinkbug.ngrok-free.app', 'normal-elegant-corgi.ngrok-free.app']


# Application definition
# for pushing to heroku
#INSTALLED_APPS = [
#    'django.contrib.admin',
#    'django.contrib.auth',
#    'django.contrib.contenttypes',
#    'django.contrib.sessions',
#    'django.contrib.messages',
#    'django.contrib.staticfiles',
#    'HealthyGatorSportsFanDjango.app',
#    'rest_framework',
#    'corsheaders',
#]

# for running locally
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app',
    'rest_framework',
    'drf_yasg',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True 

# for pushing to heroku
#ROOT_URLCONF = 'HealthyGatorSportsFanDjango.project.urls'
# for running locally
ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# for pushing to Heroku
#WSGI_APPLICATION = 'HealthyGatorSportsFanDjango.project.wsgi.application'


# Database (for running locally)
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
    }
}

# Database (for pushing to heroku)
# Configure the database connection using DATABASE_URL environment variable
# Set a connection max age to reuse database connections (improves performance)
# Enforce SSL for secure database connections on Heroku
#DATABASES = {
#    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
#}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Directory where Django's collectstatic command gathers all static files (CSS, JS, images)
# Heroku requires this for serving static files in production.
# All static assets are collected into one location before deployment.
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # HealthyGatorSportsFanDjango/staticfiles

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CSRF_TRUSTED_ORIGINS = [
    'https://b862-184-185-222-16.ngrok-free.app',
    'https://normal-elegant-corgi.ngrok-free.app',
    'https://sawfish-premium-unlikely.ngrok-free.app',
    'https://strongly-inviting-stinkbug.ngrok-free.app',
    'https://healthygatorsportsfan-84ee3c84673f.herokuapp.com'
]


# for pushing to Heroku
CELERY_BROKER_URL = os.environ.get("REDIS_URL")
CELERY_RESULT_BACKEND = os.environ.get("REDIS_URL")
# for running locally
#CELERY_BROKER_URL = 'redis://localhost:6379/0'
#CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

CELERY_BEAT_SCHEDULE = {
    'poll-cfbd-every-10-seconds': {
        'task': 'app.tasks.poll_cfbd_task',
        'schedule': schedule(10.0),  # 10 seconds
    },
}
