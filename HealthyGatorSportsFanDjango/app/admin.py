from django.contrib import admin

# Register your models here.
from .models import User, UserData, NotificationData

admin.site.register(User)
admin.site.register(UserData)
admin.site.register(NotificationData)