"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import index, CreateUserView, poll_cfbd_view, BasicInfoView, GoalCollectionView, CreateUserDataView, NotificationList, NotificationDetail, BulkDeleteNotifications, UserLoginView

# Used to define API endpoints that our mobile app will interact with, rather than returning HTML pages for a web app

# Best practice is one route per page, but multipe routes can be implemented as the app gets more complex

urlpatterns = [
    # API endpoints for testing
    #path('api/weights/', WeightView.as_view(), name='weight'),  # endpoint for test with Postman (no fetch on front-end yet)
    path('admin/', admin.site.urls), # Django Admin page (http://127.0.0.1:8000/admin)
    path('', index, name = "index"), # to see database contents for testing (http://127.0.0.1:8000/), see templates -> index.html

    # API endpoints for app
    path('api/users/', CreateUserView.as_view(), name='user-create'), # endpoint for user creation screen
    path('api/users/<int:user_id>/recordData/', CreateUserDataView.as_view(), name='user-record-data'), # no longer used
    path('api/users/<int:user_id>/basicinfo/', BasicInfoView.as_view(), name='user-basicinfo'), # no longer used
    path('api/users/<int:user_id>/goals/', GoalCollectionView.as_view(), name='user-goals'), # no longer used
    path('api/login/', UserLoginView.as_view(), name='user-login'),
    path('notifications/<int:user_id>/', NotificationList.as_view(), name='notification-list'),
    path('notificationdata/add/', NotificationDetail.as_view(), name='notification-create'),
    path('notifications/<int:notification_id>/delete/', NotificationDetail.as_view(), name='notification-delete'),
    path('notifications/deleteAll/<int:user_id>/', BulkDeleteNotifications.as_view(), name='notifications-delete'),
    path('poll-cfbd/', poll_cfbd_view, name='poll_cfbd'),

]
